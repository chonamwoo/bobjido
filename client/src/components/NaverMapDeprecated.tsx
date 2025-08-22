import React from 'react';
import KoreanMap from './KoreanMap';
import { Restaurant } from '../types';

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

// NaverMap은 더 이상 사용되지 않으므로 KoreanMap으로 리다이렉트
const NaverMap: React.FC<NaverMapProps> = (props) => {
  console.warn('NaverMap is deprecated and redirected to KoreanMap');
  
  return (
    <div className={props.className}>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>알림:</strong> 네이버맵 API 인증 문제로 OpenStreetMap 기반의 KoreanMap을 사용합니다.
      </div>
      <KoreanMap
        center={props.center}
        zoom={props.level}
        restaurants={props.restaurants}
        onRestaurantClick={props.onRestaurantClick}
        className="w-full h-full"
      />
    </div>
  );
};

export default NaverMap;