const Restaurant = require('../models/Restaurant');
const axios = require('axios');
const cheerio = require('cheerio');

// 네이버 공유 링크에서 장소 정보 파싱
const parseNaverShareLink = async (req, res) => {
  try {
    const { shareLink } = req.body;
    
    // 네이버 단축 URL을 실제 URL로 변환
    const response = await axios.get(shareLink, {
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // HTML 파싱
    const $ = cheerio.load(response.data);
    const places = [];
    
    // 네이버 MY플레이스 페이지 구조에서 장소 정보 추출
    $('.place_list_item').each((index, element) => {
      const place = {
        name: $(element).find('.place_name').text().trim(),
        address: $(element).find('.place_address').text().trim(),
        category: $(element).find('.place_category').text().trim(),
        id: $(element).data('id')
      };
      
      if (place.name) {
        places.push(place);
      }
    });
    
    // 대안: JSON-LD 구조화된 데이터에서 추출
    $('script[type="application/ld+json"]').each((index, element) => {
      try {
        const jsonData = JSON.parse($(element).html());
        if (jsonData['@type'] === 'Restaurant' || jsonData['@type'] === 'LocalBusiness') {
          places.push({
            name: jsonData.name,
            address: jsonData.address?.streetAddress,
            telephone: jsonData.telephone,
            category: jsonData.servesCuisine || '맛집'
          });
        }
      } catch (e) {
        console.error('Failed to parse JSON-LD:', e);
      }
    });
    
    res.json({ success: true, places });
  } catch (error) {
    console.error('Failed to parse Naver share link:', error);
    res.status(500).json({ 
      success: false, 
      error: '링크 파싱에 실패했습니다.',
      message: error.message 
    });
  }
};

// 네이버 검색 API로 장소 정보 가져오기
const searchNaverPlace = async (req, res) => {
  try {
    const { query, display = 20 } = req.query;
    
    const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
      params: {
        query,
        display,
        sort: 'comment'
      },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_SEARCH_CLIENT_SECRET
      }
    });
    
    // 네이버 검색 결과를 우리 형식으로 변환
    const places = response.data.items.map(item => ({
      name: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
      address: item.address,
      roadAddress: item.roadAddress,
      telephone: item.telephone,
      category: item.category,
      x: item.mapx,
      y: item.mapy,
      link: item.link
    }));
    
    res.json({ success: true, places });
  } catch (error) {
    console.error('Naver search API error:', error);
    res.status(500).json({ 
      success: false, 
      error: '네이버 검색 실패',
      message: error.message 
    });
  }
};

// 배치로 여러 장소 저장
const batchImportPlaces = async (req, res) => {
  try {
    const { places } = req.body;
    const userId = req.user?._id;
    
    if (!places || !Array.isArray(places)) {
      return res.status(400).json({ 
        success: false, 
        error: '유효하지 않은 데이터입니다.' 
      });
    }
    
    const importedRestaurants = [];
    const errors = [];
    
    for (const place of places) {
      try {
        // 중복 체크
        const existing = await Restaurant.findOne({
          $or: [
            { naverPlaceId: place.naverPlaceId },
            { 
              name: place.name,
              address: place.address
            }
          ]
        });
        
        if (existing) {
          // 이미 존재하는 경우, 사용자의 저장 목록에만 추가
          if (userId && !existing.savedBy?.includes(userId)) {
            existing.savedBy.push(userId);
            await existing.save();
          }
          importedRestaurants.push(existing);
        } else {
          // 새로운 맛집 생성
          const newRestaurant = new Restaurant({
            name: place.name,
            address: place.address,
            category: place.category || '맛집',
            cuisine: place.category || '기타',
            priceRange: place.priceRange || '₩₩',
            location: place.coordinates ? {
              type: 'Point',
              coordinates: [place.coordinates.lng, place.coordinates.lat]
            } : undefined,
            phone: place.phone,
            description: place.description,
            naverPlaceId: place.naverPlaceId,
            importedFrom: place.importedFrom || 'naver',
            addedBy: userId,
            savedBy: userId ? [userId] : [],
            images: [],
            rating: 0,
            reviewCount: 0
          });
          
          const saved = await newRestaurant.save();
          importedRestaurants.push(saved);
        }
      } catch (error) {
        console.error(`Failed to import place ${place.name}:`, error);
        errors.push({
          place: place.name,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      imported: importedRestaurants.length,
      total: places.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Batch import error:', error);
    res.status(500).json({ 
      success: false, 
      error: '배치 저장 실패',
      message: error.message 
    });
  }
};

// 네이버 OAuth 콜백 처리
const handleNaverOAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // 액세스 토큰 요청
    const tokenResponse = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_OAUTH_CLIENT_ID,
        client_secret: process.env.NAVER_OAUTH_CLIENT_SECRET,
        code,
        state
      }
    });
    
    const accessToken = tokenResponse.data.access_token;
    
    // 사용자 정보 요청
    const userResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    // MY플레이스 데이터 요청 (네이버에서 제공하는 경우)
    // 현재 네이버 API는 MY플레이스 직접 접근을 제공하지 않을 수 있음
    // 대안: 사용자에게 수동 내보내기 안내
    
    res.redirect(`/import/naver/success?token=${accessToken}`);
  } catch (error) {
    console.error('Naver OAuth callback error:', error);
    res.redirect('/import/naver/error');
  }
};

module.exports = {
  parseNaverShareLink,
  searchNaverPlace,
  batchImportPlaces,
  handleNaverOAuthCallback
};