import React, { useState } from 'react';
import { MapPinIcon, StarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { getRestaurantImage } from '../utils/restaurantImages';

interface RestaurantImagePreviewProps {
  restaurant: {
    _id?: string;
    name: string;
    category?: string;
    address?: string;
    rating?: number;
    image?: string;
    kakaoMapUrl?: string;
  };
  className?: string;
  showOverlay?: boolean;
  onClick?: () => void;
}

const RestaurantImagePreview: React.FC<RestaurantImagePreviewProps> = ({
  restaurant,
  className = '',
  showOverlay = true,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // 이미지 소스 결정
  const imageSrc = restaurant.image && !imageError 
    ? restaurant.image 
    : getRestaurantImage(restaurant.name);
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg group cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* 로딩 스켈레톤 */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-gray-400" />
          </div>
        </div>
      )}
      
      {/* 이미지 */}
      <img
        src={imageSrc}
        alt={restaurant.name}
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
      
      {/* 그라데이션 오버레이 */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* 상단 정보 */}
          {restaurant.category && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-gray-800">
                {restaurant.category}
              </span>
            </div>
          )}
          
          {/* 평점 */}
          {restaurant.rating && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center px-2 py-1 bg-black/60 backdrop-blur rounded-full">
                <StarIcon className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span className="text-xs text-white font-medium">{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>
          )}
          
          {/* 하단 정보 */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
              {restaurant.name}
            </h3>
            {restaurant.address && (
              <div className="flex items-center text-white/80 text-sm">
                <MapPinIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{restaurant.address}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 카카오맵 링크 버튼 */}
      {restaurant.kakaoMapUrl && showOverlay && (
        <a
          href={restaurant.kakaoMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-300 transition-colors flex items-center">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23181818' d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 3c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 2c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5z'/%3E%3C/svg%3E"
              alt="Kakao"
              className="w-4 h-4 mr-1"
            />
            지도
          </div>
        </a>
      )}
    </div>
  );
};

// 그리드용 프리뷰 카드 컴포넌트
export const RestaurantPreviewCard: React.FC<{
  restaurant: any;
  onClick?: () => void;
}> = ({ restaurant, onClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <RestaurantImagePreview
        restaurant={restaurant}
        className="w-full h-48"
        showOverlay={true}
        onClick={onClick}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{restaurant.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{restaurant.category || '맛집'}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium">{restaurant.rating?.toFixed(1) || '4.5'}</span>
          </div>
          {restaurant.priceRange && (
            <span className="text-sm text-gray-500">{restaurant.priceRange}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// 리스트용 프리뷰 컴포넌트
export const RestaurantListItem: React.FC<{
  restaurant: any;
  onClick?: () => void;
}> = ({ restaurant, onClick }) => {
  return (
    <div 
      className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <RestaurantImagePreview
        restaurant={restaurant}
        className="w-20 h-20 rounded-lg flex-shrink-0"
        showOverlay={false}
      />
      <div className="ml-4 flex-grow">
        <h3 className="font-semibold text-base mb-1">{restaurant.name}</h3>
        <p className="text-sm text-gray-500 mb-1">{restaurant.category || '맛집'}</p>
        <div className="flex items-center text-sm">
          <StarIcon className="w-3 h-3 text-yellow-400 fill-current mr-1" />
          <span className="font-medium mr-3">{restaurant.rating?.toFixed(1) || '4.5'}</span>
          {restaurant.address && (
            <>
              <MapPinIcon className="w-3 h-3 text-gray-400 mr-1" />
              <span className="text-gray-500 line-clamp-1">{restaurant.address}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantImagePreview;