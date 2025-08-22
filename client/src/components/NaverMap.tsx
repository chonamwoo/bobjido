import React, { useEffect, useRef, useState } from 'react';
import KoreanMap from './KoreanMap';
import { Restaurant } from '../types';

declare global {
  interface Window {
    naver: any;
  }
}

interface NaverMapProps {
  center?: { lat: number; lng: number };
  level?: number;
  restaurants?: Restaurant[];
  onRestaurantClick?: (restaurant: Restaurant) => void;
  searchKeyword?: string;
  className?: string;
  height?: string;
  showRoute?: boolean;
}

const NaverMap: React.FC<NaverMapProps> = (props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isNaverMapLoaded, setIsNaverMapLoaded] = useState(false);

  const {
    center = { lat: 37.5665, lng: 126.9780 }, // 서울 시청 기본값
    level = 10,
    restaurants = [],
    onRestaurantClick,
    className = '',
    height = '400px'
  } = props;

  // 네이버 지도 스크립트 로드
  useEffect(() => {
    const clientId = process.env.REACT_APP_NAVER_MAP_CLIENT_ID;
    
    if (!clientId) {
      console.warn('네이버 맵 클라이언트 ID가 설정되지 않음. KoreanMap으로 대체합니다.');
      return;
    }

    // 이미 로드된 경우
    if (window.naver && window.naver.maps) {
      setIsNaverMapLoaded(true);
      return;
    }

    // 스크립트 로드
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;
    script.onload = () => {
      setIsNaverMapLoaded(true);
    };
    script.onerror = () => {
      console.error('네이버 지도 스크립트 로드 실패. KoreanMap으로 대체합니다.');
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isNaverMapLoaded || !mapRef.current || !window.naver) return;

    try {
      const mapOptions = {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: level,
        mapTypeId: window.naver.maps.MapTypeId.NORMAL,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
      };

      const naverMap = new window.naver.maps.Map(mapRef.current, mapOptions);
      setMap(naverMap);
    } catch (error) {
      console.error('네이버 지도 초기화 실패:', error);
    }
  }, [isNaverMapLoaded, center, level]);

  // 마커 업데이트
  useEffect(() => {
    if (!map || !restaurants.length) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));

    // 새 마커 생성
    const newMarkers = restaurants.map((restaurant) => {
      if (!restaurant.coordinates) return null;

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          restaurant.coordinates.lat,
          restaurant.coordinates.lng
        ),
        map,
        title: restaurant.name,
        icon: {
          content: `
            <div style="
              background: #8B5CF6;
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              cursor: pointer;
            ">
              ${restaurant.name}
            </div>
          `,
          size: new window.naver.maps.Size(22, 22),
          anchor: new window.naver.maps.Point(11, 11)
        }
      });

      // 클릭 이벤트
      if (onRestaurantClick) {
        window.naver.maps.Event.addListener(marker, 'click', () => {
          onRestaurantClick(restaurant);
        });
      }

      return marker;
    }).filter(Boolean);

    setMarkers(newMarkers);

    // 마커가 모두 보이도록 지도 영역 조정
    if (newMarkers.length > 1) {
      const bounds = new window.naver.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [map, restaurants, onRestaurantClick]);

  // 네이버 지도를 로드할 수 없는 경우 KoreanMap으로 대체
  if (!isNaverMapLoaded && !window.naver) {
    return (
      <KoreanMap
        center={center}
        zoom={level}
        restaurants={restaurants}
        onRestaurantClick={onRestaurantClick}
        className={className}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height }}
        className="rounded-lg overflow-hidden"
      />
      
      {/* 로딩 상태 */}
      {!map && isNaverMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-600">지도 로딩 중...</div>
        </div>
      )}
      
      {/* 맛집 수 표시 */}
      {restaurants.length > 0 && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium">
          맛집 {restaurants.length}개
        </div>
      )}
    </div>
  );
};

export default NaverMap;