const Restaurant = require('../models/Restaurant');
const axios = require('axios');
const cheerio = require('cheerio');

// 네이버 공유 링크에서 장소 정보 파싱
const parseNaverShareLink = async (req, res) => {
  try {
    const { shareLink } = req.body;

    console.log('Parsing Naver share link:', shareLink);

    // 네이버 단축 URL을 실제 URL로 변환하고 장소 ID 추출
    let finalUrl;
    let placeId;

    try {
      // 리다이렉트를 따라가서 최종 URL 얻기
      const response = await axios.get(shareLink, {
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // 리다이렉트도 성공으로 처리
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      finalUrl = response.request.res.responseUrl || response.config.url;
      console.log('Final URL:', finalUrl);

      // URL에서 장소 ID 추출 (예: /restaurant/12345678 or place?id=12345678)
      const idMatch = finalUrl.match(/(?:restaurant|place)[\/\?](?:id=)?(\d+)/);
      if (idMatch) {
        placeId = idMatch[1];
        console.log('Extracted place ID:', placeId);
      }

      // HTML에서 정보 추출
      const $ = cheerio.load(response.data);
      const places = [];

      // 방법 1: meta 태그에서 정보 추출
      const title = $('meta[property="og:title"]').attr('content') ||
                   $('meta[name="twitter:title"]').attr('content') ||
                   $('title').text();

      const description = $('meta[property="og:description"]').attr('content') ||
                         $('meta[name="description"]').attr('content');

      const image = $('meta[property="og:image"]').attr('content');

      // 방법 2: 구조화된 데이터(JSON-LD) 찾기
      $('script[type="application/ld+json"]').each((index, element) => {
        try {
          const jsonData = JSON.parse($(element).html());
          if (jsonData['@type'] === 'Restaurant' || jsonData['@type'] === 'LocalBusiness' || jsonData['@type'] === 'FoodEstablishment') {
            places.push({
              name: jsonData.name || title,
              address: jsonData.address?.streetAddress || jsonData.address?.addressLocality || '',
              telephone: jsonData.telephone || '',
              category: jsonData.servesCuisine || jsonData['@type'] || '음식점',
              url: finalUrl,
              image: jsonData.image || image,
              priceRange: jsonData.priceRange,
              rating: jsonData.aggregateRating?.ratingValue
            });
          }
        } catch (e) {
          console.log('JSON-LD parse error:', e.message);
        }
      });

      // 방법 3: 네이버 지도 페이지 구조 파싱
      if (places.length === 0) {
        // 장소명 추출
        const placeName = $('.GHAhO').text() || // 새로운 네이버 지도
                         $('._3XamX').text() || // 이전 버전
                         $('.place_name').text() || // MY플레이스
                         $('#_title').text() || // 구버전
                         title?.replace(' : 네이버 지도', '').replace(' - 네이버 MY플레이스', '');

        // 주소 추출
        const placeAddress = $('.PkgBl').text() ||
                            $('._2yqUQ').text() ||
                            $('.place_address').text() ||
                            $('[class*="address"]').first().text();

        // 전화번호 추출
        const placeTel = $('.xlx7Q').text() ||
                        $('[class*="phone"]').first().text() ||
                        $('a[href^="tel:"]').text();

        // 카테고리 추출
        const placeCategory = $('.DJJvD').text() ||
                             $('._3ocDE').text() ||
                             $('.place_category').text() ||
                             $('[class*="category"]').first().text();

        if (placeName) {
          places.push({
            name: placeName.trim(),
            address: placeAddress?.trim() || '',
            telephone: placeTel?.trim() || '',
            category: placeCategory?.trim() || '음식점',
            url: finalUrl,
            placeId: placeId
          });
        }
      }

      // 방법 4: 네이버 검색 API로 보완
      if (places.length === 0 && title) {
        // 제목에서 장소명 추출
        const placeName = title.replace(' : 네이버 지도', '').replace(' - 네이버 MY플레이스', '').trim();

        if (placeName) {
          // 네이버 검색 API로 추가 정보 얻기
          const searchResponse = await axios.get('https://openapi.naver.com/v1/search/local.json', {
            params: {
              query: placeName,
              display: 5
            },
            headers: {
              'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID,
              'X-Naver-Client-Secret': process.env.NAVER_SEARCH_CLIENT_SECRET
            }
          });

          if (searchResponse.data.items && searchResponse.data.items.length > 0) {
            // 가장 유사한 결과 찾기
            const bestMatch = searchResponse.data.items[0];
            places.push({
              name: bestMatch.title.replace(/<[^>]*>/g, ''),
              address: bestMatch.address || bestMatch.roadAddress,
              telephone: bestMatch.telephone,
              category: bestMatch.category,
              url: finalUrl,
              placeId: placeId
            });
          }
        }
      }

      console.log('Extracted places:', places);

      if (places.length > 0) {
        res.json({ success: true, places });
      } else {
        // 최소한의 정보라도 반환
        res.json({
          success: true,
          places: [{
            name: title?.replace(' : 네이버 지도', '').replace(' - 네이버 MY플레이스', '').trim() || '알 수 없는 장소',
            address: description || '',
            url: finalUrl,
            category: '음식점'
          }]
        });
      }

    } catch (axiosError) {
      console.error('Axios error:', axiosError.message);

      // 네이버 공유 링크가 막혀있는 경우 검색 API 사용
      if (shareLink.includes('naver.me')) {
        res.json({
          success: false,
          error: '공유 링크 파싱 실패',
          message: '네이버 지도에서 장소명을 복사해서 검색해주세요.',
          alternative: 'search'
        });
      } else {
        throw axiosError;
      }
    }

  } catch (error) {
    console.error('Failed to parse Naver share link:', error);
    res.status(500).json({
      success: false,
      error: '링크 파싱에 실패했습니다.',
      message: error.message,
      hint: '네이버 지도에서 장소명을 복사해서 검색 기능을 사용해주세요.'
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