import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  StarIcon, 
  ClockIcon,
  FunnelIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  ChevronDownIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { dataManager } from '../utils/dataManager';
import toast from 'react-hot-toast';
import { certifiedRestaurantsList } from '../data/certifiedRestaurantsList';
import { ExtendedRestaurant, isRestaurantOpen } from '../types/restaurant';
import { allCertifications, getCertificationLevel, getCertificationBadgeStyle } from '../data/certificationSystem';
import { foodCategories, atmosphereFilters, amenityFilters } from '../data/categoryHierarchy';

export default function MobileSuperExplore() {
  const [filteredRestaurants, setFilteredRestaurants] = useState<ExtendedRestaurant[]>(certifiedRestaurantsList);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<string | null>(null);
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);
  const [certificationFilter, setCertificationFilter] = useState<'all' | 'official' | 'friend' | 'taste'>('all');
  
  // Quick filter presets
  const quickFilters = [
    { id: 'open-now', label: '영업중', icon: '⏰' },
    { id: 'near-me', label: '내 주변', icon: '📍' },
    { id: 'hot', label: '인기', icon: '🔥' },
    { id: 'certified', label: '인증', icon: '✅' }
  ];
  
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
        () => {
          setUserLocation({ lat: 37.4979, lng: 127.0276 });
        }
      );
    }
  }, []);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...certifiedRestaurantsList];
    
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }
    
    if (isOpenNow) {
      filtered = filtered.filter(r => isRestaurantOpen(r.operatingHours));
    }
    
    if (selectedAtmosphere) {
      filtered = filtered.filter(r => r.atmosphere?.includes(selectedAtmosphere));
    }
    
    if (selectedAmenity) {
      filtered = filtered.filter(r => r.amenities?.includes(selectedAmenity));
    }
    
    setFilteredRestaurants(filtered);
  }, [selectedCategory, isOpenNow, selectedAtmosphere, selectedAmenity]);
  
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
    
    return distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">맛집 탐색</h1>
          <p className="text-xs text-gray-500 mt-1">총 {filteredRestaurants.length}개</p>
        </div>
        
        {/* Quick Filters */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setIsOpenNow(!isOpenNow)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
              isOpenNow ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            ⏰ 영업중
          </button>
          
          {foodCategories.slice(0, 5).map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedCategory === cat.name ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
          
          <button
            onClick={() => setShowFilters(true)}
            className="px-3 py-1.5 rounded-full bg-gray-800 text-white text-xs font-medium whitespace-nowrap flex items-center gap-1"
          >
            <FunnelIcon className="w-3 h-3" />
            더보기
          </button>
        </div>
      </div>
      
      {/* Restaurant List */}
      <div className="px-4 py-4 space-y-3">
        {filteredRestaurants.map((restaurant) => (
          <motion.div
            key={restaurant._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Restaurant Image */}
            <div className="relative h-32 overflow-hidden">
              {restaurant.images && restaurant.images.length > 0 ? (
                <img 
                  src={restaurant.images[0]} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400" />
              )}
              {isRestaurantOpen(restaurant.operatingHours) && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                  영업중
                </div>
              )}
              
              {restaurant.mediaCertifications && restaurant.mediaCertifications.length > 0 && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {restaurant.mediaCertifications.slice(0, 2).map(certId => {
                    const cert = allCertifications.find(c => c.id === certId);
                    if (!cert) return null;
                    return (
                      <div
                        key={certId}
                        className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          getCertificationBadgeStyle(cert.type)
                        }`}
                        title={cert.description}
                      >
                        {cert.icon}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 flex gap-1">
                <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-medium">
                  {restaurant.category}
                </span>
                <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-medium">
                  {restaurant.priceRange}
                </span>
              </div>
            </div>
            
            {/* Restaurant Info */}
            <div className="p-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base">{restaurant.name}</h3>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium">{restaurant.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({restaurant.reviewCount})</span>
                </div>
              </div>
              
              {restaurant.description && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{restaurant.description}</p>
              )}
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPinIcon className="w-3 h-3" />
                <span className="flex-1 truncate">{restaurant.address}</span>
                {userLocation && (
                  <span className="font-medium text-orange-500">
                    {formatDistance(restaurant)}
                  </span>
                )}
              </div>
              
              {/* Special Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {restaurant.noDelivery && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                    배달X
                  </span>
                )}
                {restaurant.localFavorite && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    현지인 인증
                  </span>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-2 px-3 pb-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const isSaved = dataManager.isRestaurantSaved(restaurant._id);
                    if (isSaved) {
                      dataManager.unsaveRestaurant(restaurant._id);
                      toast.success('저장 취소');
                    } else {
                      dataManager.saveRestaurant(restaurant._id);
                      toast.success('저장 완료!');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-gray-300 rounded-lg"
                >
                  {dataManager.isRestaurantSaved(restaurant._id) ? (
                    <BookmarkSolidIcon className="w-3 h-3 text-orange-500" />
                  ) : (
                    <BookmarkIcon className="w-3 h-3" />
                  )}
                  <span>저장</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({
                        title: restaurant.name,
                        text: `${restaurant.name} - ${restaurant.category}`,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('링크 복사됨!');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-gray-300 rounded-lg"
                >
                  <ShareIcon className="w-3 h-3" />
                  <span>공유</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">필터 조건에 맞는 맛집이 없습니다</p>
          </div>
        )}
      </div>
      
      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">필터</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* 인증 필터 */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CheckBadgeIcon className="w-4 h-4" />
                    인증 타입
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setCertificationFilter('all');
                        setShowFilters(false);
                      }}
                      className={`p-2 rounded-lg text-xs flex items-center gap-1 ${
                        certificationFilter === 'all'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      전체
                    </button>
                    <button
                      onClick={() => {
                        setCertificationFilter('official');
                        setShowFilters(false);
                      }}
                      className={`p-2 rounded-lg text-xs flex items-center gap-1 ${
                        certificationFilter === 'official'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <StarIcon className="w-3 h-3" />
                      공식 인증
                    </button>
                    <button
                      onClick={() => {
                        setCertificationFilter('friend');
                        setShowFilters(false);
                      }}
                      className={`p-2 rounded-lg text-xs flex items-center gap-1 ${
                        certificationFilter === 'friend'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <UserGroupIcon className="w-3 h-3" />
                      친구 인증
                    </button>
                    <button
                      onClick={() => {
                        setCertificationFilter('taste');
                        setShowFilters(false);
                      }}
                      className={`p-2 rounded-lg text-xs flex items-center gap-1 ${
                        certificationFilter === 'taste'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <HeartIcon className="w-3 h-3" />
                      취향 매칭
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <BuildingStorefrontIcon className="w-4 h-4" />
                    음식 종류
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {foodCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat.name ? null : cat.name);
                          setShowFilters(false);
                        }}
                        className={`p-2 rounded-lg text-xs ${
                          selectedCategory === cat.name
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Atmosphere */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    분위기
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {atmosphereFilters.slice(0, 6).map(atm => (
                      <button
                        key={atm.id}
                        onClick={() => {
                          setSelectedAtmosphere(selectedAtmosphere === atm.id ? null : atm.id);
                          setShowFilters(false);
                        }}
                        className={`p-2 rounded-lg text-xs ${
                          selectedAtmosphere === atm.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {atm.icon} {atm.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <h3 className="font-medium mb-2">편의시설</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {amenityFilters.slice(0, 6).map(amenity => (
                      <button
                        key={amenity.id}
                        onClick={() => {
                          setSelectedAmenity(selectedAmenity === amenity.id ? null : amenity.id);
                          setShowFilters(false);
                        }}
                        className={`p-2 rounded-lg text-xs ${
                          selectedAmenity === amenity.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {amenity.icon} {amenity.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedAtmosphere(null);
                    setSelectedAmenity(null);
                    setIsOpenNow(false);
                    setShowFilters(false);
                  }}
                  className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium"
                >
                  필터 초기화
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}