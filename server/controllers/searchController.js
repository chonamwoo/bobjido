const axios = require('axios');
const Restaurant = require('../models/Restaurant');

// 일반 사용자용 맛집 검색 (네이버 API + 스마트 필터링)
const searchRestaurants = async (req, res) => {
  try {
    const { query, category } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: '검색어를 입력해주세요' });
    }
    
    const results = [];
    
    // 1. 먼저 DB에서 검색
    const dbRestaurants = await Restaurant.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { tags: { $in: [query] } }
      ]
    }).limit(10);
    
    dbRestaurants.forEach(restaurant => {
      results.push({
        _id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address,
        category: restaurant.category,
        coordinates: restaurant.coordinates,
        priceRange: restaurant.priceRange,
        averageRating: restaurant.averageRating,
        reviewCount: restaurant.reviewCount,
        images: restaurant.images,
        source: 'database',
        verified: restaurant.isVerified
      });
    });
    
    // 2. 네이버 API 검색 (설정된 경우)
    if (process.env.NAVER_SEARCH_CLIENT_ID && process.env.NAVER_SEARCH_CLIENT_SECRET) {
      try {
        // 카테고리별 검색어 최적화
        const categoryKeywords = {
          '멕시칸': ['멕시코', '타코', '부리토', '나초'],
          '이탈리안': ['이탈리아', '파스타', '피자', '리조또'],
          '중식': ['중국', '중화', '짜장', '짬뽕', '마라'],
          '일식': ['일본', '스시', '라멘', '돈카츠', '우동', '초밥'],
          '태국': ['태국', '팟타이', '똠양꿍'],
          '베트남': ['베트남', '쌀국수', '포', '반미'],
          '한식': ['한식', '한정식', '김치', '불고기', '비빔밥'],
          '카페': ['카페', '커피', '디저트', '브런치'],
          '양식': ['스테이크', '파스타', '햄버거', '피자']
        };
        
        let searchQuery = query;
        
        // 카테고리가 지정된 경우
        if (category && categoryKeywords[category]) {
          searchQuery = query + ' ' + categoryKeywords[category][0];
        } else {
          // 특정 카테고리 키워드가 검색어에 있으면 최적화
          for (const [key, values] of Object.entries(categoryKeywords)) {
            if (query.includes(key) || values.some(v => query.includes(v))) {
              searchQuery = query + ' 음식점';
              break;
            }
          }
        }
        
        if (searchQuery === query) {
          searchQuery = query + ' 맛집';
        }
        
        const naverResponse = await axios.get('https://openapi.naver.com/v1/search/local.json', {
          params: {
            query: searchQuery,
            display: 20,
            start: 1,
            sort: 'random'
          },
          headers: {
            'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.NAVER_SEARCH_CLIENT_SECRET
          }
        });
        
        // 스마트 필터링
        for (const item of naverResponse.data.items) {
          const cleanName = item.title.replace(/<[^>]*>/g, '').trim();
          const address = item.roadAddress || item.address;
          const fullCategory = item.category;
          
          // 필터링 로직
          let shouldInclude = true;
          
          // 멕시칸 필터링
          if (query.includes('멕시칸') || query.includes('멕시코') || category === '멕시칸') {
            if (cleanName.includes('멕시카나') && (fullCategory.includes('치킨') || fullCategory.includes('통닭'))) {
              shouldInclude = false;
            }
            if (!fullCategory.includes('멕시코') && !fullCategory.includes('남미') && 
                !cleanName.toLowerCase().includes('taco') && !cleanName.toLowerCase().includes('타코') &&
                !cleanName.includes('부리토') && !cleanName.includes('나초')) {
              shouldInclude = false;
            }
          }
          
          // 이탈리안 필터링
          if (query.includes('이탈리안') || query.includes('이탈리아') || category === '이탈리안') {
            if (!fullCategory.includes('이탈리아') && !fullCategory.includes('양식') && 
                !fullCategory.includes('파스타') && !fullCategory.includes('피자')) {
              shouldInclude = false;
            }
          }
          
          // 중복 체크
          const exists = results.some(r => 
            r.name === cleanName && r.address === address
          );
          
          if (!exists && shouldInclude) {
            // 카테고리 매핑
            let mappedCategory = '기타';
            const categoryText = fullCategory.split('>').pop().trim();
            
            if (categoryText.includes('한식') || categoryText.includes('한정식')) mappedCategory = '한식';
            else if (categoryText.includes('중식') || categoryText.includes('중국')) mappedCategory = '중식';
            else if (categoryText.includes('일식') || categoryText.includes('일본') || categoryText.includes('초밥')) mappedCategory = '일식';
            else if (categoryText.includes('양식') || categoryText.includes('이탈리아')) mappedCategory = '양식';
            else if (fullCategory.includes('멕시코') || fullCategory.includes('남미')) mappedCategory = '양식';
            else if (categoryText.includes('카페') || categoryText.includes('커피')) mappedCategory = '카페';
            else if (categoryText.includes('술집') || categoryText.includes('주점')) mappedCategory = '주점';
            else if (categoryText.includes('분식')) mappedCategory = '패스트푸드';
            else if (fullCategory.includes('아시아') || fullCategory.includes('태국') || fullCategory.includes('베트남')) mappedCategory = '동남아';
            
            results.push({
              name: cleanName,
              address: address,
              category: mappedCategory,
              coordinates: {
                lat: parseFloat(item.mapy) / 10000000,
                lng: parseFloat(item.mapx) / 10000000
              },
              priceRange: '보통',
              phone: item.telephone,
              images: [{ url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop' }],
              source: 'naver',
              naverCategory: fullCategory,
              verified: false
            });
          }
        }
      } catch (naverError) {
        console.error('Naver API error:', naverError.message);
      }
    }
    
    res.json({
      restaurants: results,
      total: results.length,
      query: query,
      category: category
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: '검색 중 오류가 발생했습니다' });
  }
};

module.exports = {
  searchRestaurants
};