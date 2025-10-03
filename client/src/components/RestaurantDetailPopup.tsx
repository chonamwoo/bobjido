import React, { useState } from 'react';
import {
  XMarkIcon,
  MapPinIcon,
  HeartIcon,
  BookmarkIcon,
  MapIcon,
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RestaurantDetailPopupProps {
  restaurant: any;
  onClose: () => void;
  onSave?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (restaurant: any) => void;
  isSaved?: boolean;
  isLiked?: boolean;
  recommendation?: string; // 플레이리스트 작성자의 추천 이유
}

const RestaurantDetailPopup: React.FC<RestaurantDetailPopupProps> = ({
  restaurant,
  onClose,
  onSave,
  onLike,
  onShare,
  isSaved = false,
  isLiked = false,
  recommendation
}) => {
  const handleKakaoMap = () => {
    if (restaurant.coordinates || restaurant.location?.coordinates) {
      const coords = restaurant.coordinates || restaurant.location?.coordinates;
      window.open(
        `https://map.kakao.com/link/map/${encodeURIComponent(restaurant.name)},${coords.lat || coords[1]},${coords.lng || coords[0]}`,
        '_blank'
      );
    } else {
      // 좌표가 없으면 검색으로
      window.open(
        `https://map.kakao.com/link/search/${encodeURIComponent(restaurant.name + ' ' + (restaurant.address || ''))}`,
        '_blank'
      );
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(restaurant._id);
    } else {
      toast.success(isSaved ? '저장 취소' : '저장됨!');
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(restaurant._id);
    } else {
      toast.success(isLiked ? '좋아요 취소' : '좋아요!');
    }
  };

  // 평점 표시
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <StarIcon className="absolute w-4 h-4 text-gray-300" />
            <div className="absolute overflow-hidden w-2">
              <StarSolidIcon className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  // 커스텀 마커 아이콘
  const customIcon = L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #FF6B35, #FF8E53);
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg max-h-[85vh] rounded-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 지도 헤더 */}
        <div className="relative">
          <div className="w-full h-48">
            {(restaurant.coordinates || restaurant.location?.coordinates || (restaurant.lat && restaurant.lng)) ? (
              <MapContainer
                center={[
                  restaurant.lat || restaurant.coordinates?.lat || restaurant.location?.coordinates?.lat || 37.5665,
                  restaurant.lng || restaurant.coordinates?.lng || restaurant.location?.coordinates?.lng || 126.9780
                ]}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
                zoomControl={false}
                dragging={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    restaurant.lat || restaurant.coordinates?.lat || restaurant.location?.coordinates?.lat,
                    restaurant.lng || restaurant.coordinates?.lng || restaurant.location?.coordinates?.lng
                  ]}
                  icon={customIcon}
                />
              </MapContainer>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPinIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <button
              onClick={onClose}
              className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 12rem)' }}>
          {/* 제목 및 카테고리 */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                {restaurant.category}
              </span>
              {restaurant.priceRange && (
                <span className="text-gray-500">{restaurant.priceRange}</span>
              )}
            </div>

            {/* 별점 표시 - 별도 줄로 분리하여 항상 표시 */}
            {(restaurant.rating || restaurant.rating > 0) && (
              <div className="flex items-center gap-1 mt-2">
                {renderStars(restaurant.rating)}
                <span className="ml-1 text-gray-700 font-medium">
                  {restaurant.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  ({restaurant.reviewCount || Math.floor(Math.random() * 100) + 10}개 리뷰)
                </span>
              </div>
            )}
          </div>

          {/* 주소 */}
          <div className="flex items-start gap-3 text-gray-700 mb-4">
            <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
            <span className="flex-1 text-sm">{restaurant.address}</span>
          </div>

          {/* 추천 이유 (있을 경우) */}
          {(recommendation || restaurant.reason) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    {recommendation ? '플레이리스트 작성자의 추천 이유' : '추천 이유'}
                  </p>
                  <p className="text-sm text-blue-800">{recommendation || restaurant.reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼들 - 2x2 그리드 */}
          <div className="space-y-3">
              {/* 첫 번째 줄: 좋아요와 저장 */}
              <div className="grid grid-cols-2 gap-3">
                {/* 좋아요 버튼 */}
                <button
                  onClick={handleLike}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isLiked
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>좋아요</span>
                </button>

                {/* 저장 버튼 */}
                <button
                  onClick={handleSave}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isSaved
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isSaved ? (
                    <BookmarkSolidIcon className="w-5 h-5" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5" />
                  )}
                  <span>저장</span>
                </button>
              </div>

              {/* 두 번째 줄: 지도 보기와 공유 */}
              <div className="grid grid-cols-2 gap-3">
                {/* 지도 보기 버튼 */}
                <button
                  onClick={handleKakaoMap}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-yellow-400 hover:bg-yellow-500 text-gray-800 transition-colors"
                >
                  <MapIcon className="w-5 h-5" />
                  <span>지도 보기</span>
                </button>

                {/* 공유 버튼 */}
                {onShare && (
                  <button
                    onClick={() => onShare(restaurant)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    <ShareIcon className="w-5 h-5" />
                    <span>공유</span>
                  </button>
                )}
              </div>
            </div>

          {/* 추가 정보 (있을 경우) */}
          {restaurant.phoneNumber && (
            <div className="mt-4 pt-4 border-t">
              <a
                href={`tel:${restaurant.phoneNumber}`}
                className="text-sm text-blue-600 hover:underline"
              >
                📞 {restaurant.phoneNumber}
              </a>
            </div>
          )}

          {/* 영업시간 (있을 경우) */}
          {restaurant.businessHours && (
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium mb-1">영업시간</p>
              <p>{restaurant.businessHours}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPopup;