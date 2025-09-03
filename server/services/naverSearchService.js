const axios = require('axios');

class NaverSearchService {
  constructor() {
    this.clientId = process.env.NAVER_SEARCH_CLIENT_ID;
    this.clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;
    this.baseUrl = 'https://openapi.naver.com/v1/search/local.json';
  }

  /**
   * 네이버 검색 API로 맛집 검색
   * @param {string} query - 검색어 (예: "강남 맛집", "홍대 카페")
   * @param {number} display - 검색 결과 출력 개수 (기본값: 50, 최대: 100)
   * @param {number} start - 검색 시작 위치 (기본값: 1, 최대: 1000)
   * @param {string} sort - 정렬 옵션 (sim: 유사도순, date: 날짜순, comment: 리뷰순)
   */
  async searchRestaurants(query, display = 50, start = 1, sort = 'sim') {
    try {
      // display 값 검증 (최대 100)
      const validDisplay = Math.min(Math.max(1, display), 100);
      
      // 검색어 처리 - 식당 이름을 정확히 검색할 수 있도록 개선
      let enhancedQuery = query;
      
      // 이미 맛집/음식점/카페가 포함되어 있으면 그대로 사용
      if (!query.includes('맛집') && !query.includes('음식점') && !query.includes('카페')) {
        // 한글 2-3글자만 있는 경우 (예: 강남, 홍대) - 지역명으로 판단
        if (/^[가-힣]{2,3}$/.test(query)) {
          enhancedQuery = `${query} 음식점`;
        } else {
          // 그 외는 그대로 사용 (식당 이름으로 판단)
          enhancedQuery = query;
        }
      }

      console.log(`Naver API 검색: "${enhancedQuery}", display: ${validDisplay}, sort: ${sort}`);
      
      const response = await axios.get(this.baseUrl, {
        params: {
          query: enhancedQuery,
          display: validDisplay,
          start,
          sort
        },
        headers: {
          'X-Naver-Client-Id': this.clientId,
          'X-Naver-Client-Secret': this.clientSecret
        }
      });

      console.log(`Naver API 응답: total=${response.data.total}, items=${response.data.items?.length}`);
      
      // 네이버 검색 결과를 우리 형식으로 변환
      const restaurants = response.data.items.map(item => this.formatRestaurant(item));
      
      return {
        success: true,
        total: response.data.total,
        start: response.data.start,
        display: response.data.display,
        restaurants
      };
    } catch (error) {
      console.error('네이버 검색 API 오류:', error);
      return {
        success: false,
        error: error.message,
        restaurants: []
      };
    }
  }

  /**
   * 네이버 API 응답을 우리 Restaurant 모델 형식으로 변환
   */
  formatRestaurant(naverItem) {
    // HTML 태그 제거
    const cleanTitle = naverItem.title.replace(/<[^>]*>/g, '');
    const cleanCategory = naverItem.category.split('>').pop().trim();
    
    // 좌표 변환 (네이버는 KATECH 좌표계 사용, 위경도로 변환)
    const lat = naverItem.mapy ? this.convertToLat(naverItem.mapy) : null;
    const lng = naverItem.mapx ? this.convertToLng(naverItem.mapx) : null;

    // 가격대 추정 (네이버 리뷰나 카테고리 기반)
    const priceRange = this.estimatePriceRange(cleanCategory, cleanTitle);

    // 이미지 URL 생성 (카테고리 기반 기본 이미지)
    const images = this.getCategoryImages(cleanCategory);

    return {
      // 네이버 고유 ID
      naverId: naverItem.link,
      
      // 기본 정보
      name: cleanTitle,
      address: naverItem.address || naverItem.roadAddress,
      roadAddress: naverItem.roadAddress,
      
      // 좌표
      coordinates: lat && lng ? { lat, lng } : null,
      
      // 카테고리 및 태그
      category: this.mapCategory(cleanCategory),
      originalCategory: cleanCategory,
      tags: this.extractTags(cleanCategory, cleanTitle),
      
      // 연락처
      telephone: naverItem.telephone,
      
      // 가격 정보
      priceRange,
      
      // 이미지
      images,
      
      // 설명
      description: `${cleanCategory} 전문점`,
      
      // 네이버 링크
      naverLink: naverItem.link,
      
      // 임시 평점 (실제 리뷰 시스템 연동 전까지)
      rating: 4.0 + Math.random() * 0.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      
      // 소스 표시
      source: 'naver'
    };
  }

  /**
   * 네이버 좌표를 위도로 변환
   */
  convertToLat(mapy) {
    // 네이버 지도 API의 좌표계를 WGS84 위도로 변환
    // 간단한 변환 (정확한 변환은 proj4 라이브러리 사용 권장)
    return parseFloat(mapy) / 10000000;
  }

  /**
   * 네이버 좌표를 경도로 변환
   */
  convertToLng(mapx) {
    // 네이버 지도 API의 좌표계를 WGS84 경도로 변환
    return parseFloat(mapx) / 10000000;
  }

  /**
   * 카테고리를 우리 시스템 카테고리로 매핑
   */
  mapCategory(naverCategory) {
    const categoryMap = {
      '한식': '한식',
      '중식': '중식',
      '일식': '일식',
      '양식': '양식',
      '분식': '분식',
      '카페': '카페',
      '디저트': '디저트',
      '술집': '술집',
      '치킨': '치킨',
      '피자': '피자',
      '패스트푸드': '패스트푸드',
      '아시아음식': '아시아음식',
      '뷔페': '뷔페',
      '베이커리': '베이커리'
    };

    // 네이버 카테고리에서 매칭되는 키워드 찾기
    for (const [key, value] of Object.entries(categoryMap)) {
      if (naverCategory.includes(key)) {
        return value;
      }
    }

    // 기본값
    return '기타';
  }

  /**
   * 가격대 추정
   */
  estimatePriceRange(category, title) {
    // 고급 키워드
    if (title.includes('호텔') || title.includes('스테이크') || title.includes('오마카세')) {
      return '₩₩₩₩';
    }
    // 중고급
    if (category.includes('일식') || category.includes('스시') || title.includes('전문')) {
      return '₩₩₩';
    }
    // 저렴한
    if (category.includes('분식') || category.includes('김밥') || title.includes('포장마차')) {
      return '₩';
    }
    // 기본값
    return '₩₩';
  }

  /**
   * 태그 추출
   */
  extractTags(category, title) {
    const tags = [];
    
    // 카테고리 기반 태그
    if (category) {
      tags.push(category.split('>')[0].trim());
    }
    
    // 제목 기반 태그
    if (title.includes('맛집')) tags.push('맛집');
    if (title.includes('유명')) tags.push('유명맛집');
    if (title.includes('줄서는')) tags.push('줄서는집');
    if (title.includes('24시')) tags.push('24시간');
    if (title.includes('배달')) tags.push('배달가능');
    
    return tags;
  }

  /**
   * 카테고리별 기본 이미지
   */
  getCategoryImages(category) {
    const imageMap = {
      '한식': [
        'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
        'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800'
      ],
      '중식': [
        'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800'
      ],
      '일식': [
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        'https://images.unsplash.com/photo-1562436260-8c9216eeb703?w=800'
      ],
      '양식': [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800'
      ],
      '카페': [
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
      ],
      '디저트': [
        'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'
      ]
    };

    // 매칭되는 카테고리 이미지 찾기
    for (const [key, images] of Object.entries(imageMap)) {
      if (category.includes(key)) {
        return images.map(url => ({ url, uploadedAt: new Date() }));
      }
    }

    // 기본 이미지
    return [
      { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', uploadedAt: new Date() },
      { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', uploadedAt: new Date() }
    ];
  }
}

module.exports = new NaverSearchService();