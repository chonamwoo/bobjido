import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, StarIcon, PhoneIcon, ClockIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { certifiedRestaurantsList } from '../data/certifiedRestaurantsList';
import { ExtendedRestaurant, isRestaurantOpen } from '../types/restaurant';
import { allCertifications, getCertificationLevel, getCertificationBadgeStyle } from '../data/certificationSystem';
import AdvancedFilters from '../components/AdvancedFilters';
import CertificationFilter, { CertificationFilters } from '../components/CertificationFilter';
import { dataManager } from '../utils/dataManager';
import toast from 'react-hot-toast';

export default function SuperExplore() {
  const [filteredRestaurants, setFilteredRestaurants] = useState<ExtendedRestaurant[]>(certifiedRestaurantsList);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'reviews'>('rating');
  const [certificationFilters, setCertificationFilters] = useState<CertificationFilters>({
    official: true,
    friend: false,
    tasteMatch: false
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<ExtendedRestaurant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Gangnam station
          setUserLocation({ lat: 37.4979, lng: 127.0276 });
        }
      );
    }
  }, []);
  
  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'distance':
        if (!userLocation) return 0;
        const distA = Math.sqrt(
          Math.pow(a.coordinates.lat - userLocation.lat, 2) +
          Math.pow(a.coordinates.lng - userLocation.lng, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.coordinates.lat - userLocation.lat, 2) +
          Math.pow(b.coordinates.lng - userLocation.lng, 2)
        );
        return distA - distB;
      default:
        return 0;
    }
  });
  
  const formatDistance = (restaurant: ExtendedRestaurant) => {
    if (!userLocation) return '';
    
    const R = 6371e3;
    const φ1 = userLocation.lat * Math.PI / 180;
    const φ2 = restaurant.coordinates.lat * Math.PI / 180;
    const Δφ = (restaurant.coordinates.lat - userLocation.lat) * Math.PI / 180;
    const Δλ = (restaurant.coordinates.lng - userLocation.lng) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const distance = R * c;
    
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                맛집 탐색
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                총 {sortedRestaurants.length}개의 맛집
              </p>
            </div>
            
            {/* Filters and Sort Options */}
            <div className="flex items-center gap-4">
              <CertificationFilter onFilterChange={setCertificationFilters} />
              
              <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">정렬:</span>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    sortBy === 'rating' 
                      ? 'bg-white text-orange-500 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  평점순
                </button>
                <button
                  onClick={() => setSortBy('reviews')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    sortBy === 'reviews' 
                      ? 'bg-white text-orange-500 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  리뷰순
                </button>
                {userLocation && (
                  <button
                    onClick={() => setSortBy('distance')}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      sortBy === 'distance' 
                        ? 'bg-white text-orange-500 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    거리순
                  </button>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedRestaurant(restaurant);
                setShowDetailModal(true);
              }}
            >
              {/* Restaurant Image or Placeholder */}
              <div className="relative h-48 overflow-hidden">
                {restaurant.images && restaurant.images.length > 0 ? (
                  <img 
                    src={restaurant.images[0]} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400" />
                )}
                
                {/* Open Now Badge */}
                {isRestaurantOpen(restaurant.operatingHours) && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    영업중
                  </div>
                )}
                
                {/* Certification Badges */}
                {restaurant.mediaCertifications && restaurant.mediaCertifications.length > 0 && (
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    {restaurant.mediaCertifications.slice(0, 3).map(certId => {
                      const cert = allCertifications.find(c => c.id === certId);
                      if (!cert) return null;
                      return (
                        <div
                          key={certId}
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                            getCertificationBadgeStyle(cert.type)
                          }`}
                          title={cert.description}
                        >
                          <span>{cert.icon}</span>
                          <span className="hidden sm:inline">{cert.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                  {restaurant.category}
                </div>
                
                {/* Price Badge */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                  {restaurant.priceRange}
                </div>
              </div>
              
              {/* Restaurant Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{restaurant.name}</h3>
                    {/* Certification Level */}
                    {restaurant.mediaCertifications && restaurant.mediaCertifications.length > 0 && (
                      <div className="mt-1">
                        {(() => {
                          const level = getCertificationLevel(restaurant.mediaCertifications);
                          return (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              level.color === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                              level.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                              level.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                              level.color === 'green' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {level.level} ({level.score}점)
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{restaurant.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                  </div>
                </div>
                
                {/* Description */}
                {restaurant.description && (
                  <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
                )}
                
                {/* Address and Distance */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="flex-1">{restaurant.address}</span>
                  {userLocation && (
                    <span className="font-medium text-orange-500">
                      {formatDistance(restaurant)}
                    </span>
                  )}
                </div>
                
                {/* Phone */}
                {restaurant.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{restaurant.phoneNumber}</span>
                  </div>
                )}
                
                {/* Signature Dishes */}
                {restaurant.signatureDishes && restaurant.signatureDishes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">대표메뉴</p>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.signatureDishes.slice(0, 3).map(dish => (
                        <span key={dish} className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Amenities */}
                {restaurant.amenities && restaurant.amenities.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">편의시설</p>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.amenities.slice(0, 4).map(amenity => (
                        <span key={amenity} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Special Features */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {restaurant.noDelivery && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      배달X
                    </span>
                  )}
                  {restaurant.localFavorite && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      현지인 인증
                    </span>
                  )}
                  {restaurant.hardParkingButBusy && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      주차어려움
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isSaved = dataManager.isRestaurantSaved(restaurant._id);
                      if (isSaved) {
                        dataManager.unsaveRestaurant(restaurant._id);
                        toast.success('맛집 저장 취소');
                      } else {
                        dataManager.saveRestaurant(restaurant._id);
                        toast.success('맛집 저장 완료!');
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {dataManager.isRestaurantSaved(restaurant._id) ? (
                      <BookmarkSolidIcon className="w-4 h-4 text-orange-500" />
                    ) : (
                      <BookmarkIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">저장</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: restaurant.name,
                          text: `${restaurant.name} - ${restaurant.category} 맛집`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('링크가 복사되었습니다!');
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShareIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">공유</span>
                  </button>
                </div>
                
                {/* Operating Hours */}
                {restaurant.operatingHours && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">
                      {restaurant.operatingHours.is24Hours ? (
                        '24시간 영업'
                      ) : (
                        <>
                          영업시간: {restaurant.operatingHours.monday?.open} - {restaurant.operatingHours.monday?.close}
                          {restaurant.operatingHours.breakTime && (
                            <span className="block">
                              브레이크타임: {restaurant.operatingHours.breakTime.start} - {restaurant.operatingHours.breakTime.end}
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {sortedRestaurants.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">필터 조건에 맞는 맛집이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">다른 필터를 선택해보세요.</p>
          </div>
        )}
      </div>
      
      {/* Advanced Filters */}
      <AdvancedFilters
        restaurants={certifiedRestaurantsList}
        onFilter={setFilteredRestaurants}
        userLocation={userLocation}
      />
      
      {/* Restaurant Detail Modal */}
      {showDetailModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header with Image */}
            <div className="relative h-64">
              {selectedRestaurant.images && selectedRestaurant.images.length > 0 ? (
                <img 
                  src={selectedRestaurant.images[0]} 
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400" />
              )}
              <button 
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                  {selectedRestaurant.category}
                </span>
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                  {selectedRestaurant.priceRange}
                </span>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{selectedRestaurant.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-bold">{selectedRestaurant.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({selectedRestaurant.reviewCount})</span>
                </div>
              </div>
              
              {/* Description */}
              {selectedRestaurant.description && (
                <p className="text-gray-700 mb-4">{selectedRestaurant.description}</p>
              )}
              
              {/* Certifications */}
              {selectedRestaurant.mediaCertifications && selectedRestaurant.mediaCertifications.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">인증</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurant.mediaCertifications.map(certId => {
                      const cert = allCertifications.find(c => c.id === certId);
                      if (!cert) return null;
                      return (
                        <span
                          key={certId}
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                            getCertificationBadgeStyle(cert.type)
                          }`}
                        >
                          <span>{cert.icon}</span>
                          <span>{cert.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Signature Dishes */}
              {selectedRestaurant.signatureDishes && selectedRestaurant.signatureDishes.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">대표메뉴</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurant.signatureDishes.map(dish => (
                      <span key={dish} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Operating Hours */}
              {selectedRestaurant.operatingHours && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">영업시간</h3>
                  <p className="text-gray-700">
                    {selectedRestaurant.operatingHours.is24Hours ? (
                      '24시간 영업'
                    ) : (
                      <>
                        {selectedRestaurant.operatingHours.monday?.open} - {selectedRestaurant.operatingHours.monday?.close}
                        {selectedRestaurant.operatingHours.breakTime && (
                          <span className="block text-sm text-gray-600">
                            브레이크타임: {selectedRestaurant.operatingHours.breakTime.start} - {selectedRestaurant.operatingHours.breakTime.end}
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              )}
              
              {/* Phone */}
              {selectedRestaurant.phoneNumber && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">연락처</h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <PhoneIcon className="w-5 h-5" />
                    <span>{selectedRestaurant.phoneNumber}</span>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const isSaved = dataManager.isRestaurantSaved(selectedRestaurant._id);
                    if (isSaved) {
                      dataManager.unsaveRestaurant(selectedRestaurant._id);
                      toast.success('맛집 저장 취소');
                    } else {
                      dataManager.saveRestaurant(selectedRestaurant._id);
                      toast.success('맛집 저장 완료!');
                    }
                    setShowDetailModal(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {dataManager.isRestaurantSaved(selectedRestaurant._id) ? (
                    <BookmarkSolidIcon className="w-5 h-5" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {dataManager.isRestaurantSaved(selectedRestaurant._id) ? '저장 취소' : '맛집 저장'}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({
                        title: selectedRestaurant.name,
                        text: `${selectedRestaurant.name} - ${selectedRestaurant.category} 맛집`,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('링크가 복사되었습니다!');
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShareIcon className="w-5 h-5" />
                  <span className="font-medium">공유</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}