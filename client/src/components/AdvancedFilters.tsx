import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  XMarkIcon, 
  ClockIcon, 
  MapPinIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
  FilmIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { 
  foodCategories, 
  contextFilters, 
  distanceFilters,
  atmosphereFilters,
  amenityFilters
} from '../data/categoryHierarchy';
import { mediaPrograms } from '../data/mediaPrograms';
import { isRestaurantOpen, ExtendedRestaurant } from '../types/restaurant';

interface AdvancedFiltersProps {
  restaurants: ExtendedRestaurant[];
  onFilter: (filteredRestaurants: ExtendedRestaurant[]) => void;
  userLocation?: { lat: number; lng: number };
}

export default function AdvancedFilters({ restaurants, onFilter, userLocation }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['category']));
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubDishes, setSelectedSubDishes] = useState<Set<string>>(new Set());
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<Set<string>>(new Set());
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [selectedSpecialFilters, setSelectedSpecialFilters] = useState<Set<string>>(new Set());
  
  // Special filters
  const specialFilters = [
    { id: 'no-delivery', name: '배달 안하는 집', icon: '🚫' },
    { id: 'elder-reviews', name: '어르신 리뷰 많은 집', icon: '👴' },
    { id: 'delivery-bike-waiting', name: '배달 오토바이도 줄서는 집', icon: '🛵' },
    { id: 'local-favorite', name: '현지인 단골 많은 집', icon: '🏘️' },
    { id: 'hard-parking-busy', name: '주차 어려운데도 붐비는 집', icon: '🚗' }
  ];
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };
  
  const toggleSetFilter = (set: Set<string>, value: string, setter: (set: Set<string>) => void) => {
    const newSet = new Set(set);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setter(newSet);
  };
  
  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // Distance in meters
  };
  
  // Apply all filters
  useEffect(() => {
    let filtered = [...restaurants];
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }
    
    // Signature dishes filter
    if (selectedSubDishes.size > 0) {
      filtered = filtered.filter(r => 
        r.signatureDishes?.some(dish => selectedSubDishes.has(dish))
      );
    }
    
    // Open now filter
    if (isOpenNow) {
      filtered = filtered.filter(r => isRestaurantOpen(r.operatingHours));
    }
    
    // Distance filter
    if (selectedDistance && userLocation) {
      const distanceFilter = distanceFilters.find(d => d.id === selectedDistance);
      if (distanceFilter) {
        filtered = filtered.filter(r => {
          const distance = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            r.coordinates.lat, 
            r.coordinates.lng
          );
          return distance <= distanceFilter.distance;
        });
      }
    }
    
    // Context filter
    if (selectedContext) {
      const context = Object.values(contextFilters).find(c => c.id === selectedContext);
      if (context) {
        filtered = filtered.filter(r => r.contextTags?.includes(selectedContext));
      }
    }
    
    // Atmosphere filter
    if (selectedAtmosphere.size > 0) {
      filtered = filtered.filter(r => 
        r.atmosphere?.some(atm => selectedAtmosphere.has(atm))
      );
    }
    
    // Amenities filter
    if (selectedAmenities.size > 0) {
      filtered = filtered.filter(r => 
        Array.from(selectedAmenities).every(amenity => 
          r.amenities?.includes(amenity)
        )
      );
    }
    
    // Media certification filter
    if (selectedMedia.size > 0) {
      filtered = filtered.filter(r => 
        r.mediaCertifications?.some(cert => selectedMedia.has(cert))
      );
    }
    
    // Special filters
    if (selectedSpecialFilters.size > 0) {
      selectedSpecialFilters.forEach(filter => {
        switch(filter) {
          case 'no-delivery':
            filtered = filtered.filter(r => r.noDelivery);
            break;
          case 'elder-reviews':
            filtered = filtered.filter(r => r.elderReviews);
            break;
          case 'delivery-bike-waiting':
            filtered = filtered.filter(r => r.deliveryBikeWaiting);
            break;
          case 'local-favorite':
            filtered = filtered.filter(r => r.localFavorite);
            break;
          case 'hard-parking-busy':
            filtered = filtered.filter(r => r.hardParkingButBusy);
            break;
        }
      });
    }
    
    onFilter(filtered);
  }, [
    selectedCategory, selectedSubDishes, isOpenNow, selectedDistance,
    selectedContext, selectedAtmosphere, selectedAmenities, selectedMedia,
    selectedSpecialFilters, restaurants, userLocation
  ]);
  
  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedSubDishes(new Set());
    setIsOpenNow(false);
    setSelectedDistance(null);
    setSelectedContext(null);
    setSelectedAtmosphere(new Set());
    setSelectedAmenities(new Set());
    setSelectedMedia(new Set());
    setSelectedSpecialFilters(new Set());
  };
  
  const activeFiltersCount = 
    (selectedCategory ? 1 : 0) +
    selectedSubDishes.size +
    (isOpenNow ? 1 : 0) +
    (selectedDistance ? 1 : 0) +
    (selectedContext ? 1 : 0) +
    selectedAtmosphere.size +
    selectedAmenities.size +
    selectedMedia.size +
    selectedSpecialFilters.size;
  
  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
      >
        <FunnelIcon className="w-6 h-6" />
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
      
      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            
            {/* Filter Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white z-10 p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">고급 필터</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    모든 필터 초기화 ({activeFiltersCount})
                  </button>
                )}
              </div>
              
              <div className="p-4 space-y-4">
                {/* Open Now Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">지금 영업중</span>
                  </div>
                  <button
                    onClick={() => setIsOpenNow(!isOpenNow)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isOpenNow ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isOpenNow ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {/* Category Filter */}
                <div className="border rounded-lg p-3">
                  <button
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <BuildingStorefrontIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">음식 종류</span>
                      {selectedCategory && (
                        <span className="text-sm text-orange-500">({selectedCategory})</span>
                      )}
                    </div>
                    {expandedSections.has('category') ? 
                      <ChevronDownIcon className="w-4 h-4" /> : 
                      <ChevronRightIcon className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.has('category') && (
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {foodCategories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(
                              selectedCategory === category.name ? null : category.name
                            )}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              selectedCategory === category.name
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {category.icon} {category.name}
                          </button>
                        ))}
                      </div>
                      
                      {/* Sub-dishes for selected category */}
                      {selectedCategory && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">대표 메뉴:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {foodCategories
                              .find(c => c.name === selectedCategory)
                              ?.signatureDishes.map(dish => (
                                <button
                                  key={dish.id}
                                  onClick={() => toggleSetFilter(selectedSubDishes, dish.id, setSelectedSubDishes)}
                                  className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                    selectedSubDishes.has(dish.id)
                                      ? 'bg-orange-400 text-white'
                                      : 'bg-white hover:bg-gray-100 border'
                                  }`}
                                >
                                  {dish.name}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Distance Filter */}
                {userLocation && (
                  <div className="border rounded-lg p-3">
                    <button
                      onClick={() => toggleSection('distance')}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">거리</span>
                        {selectedDistance && (
                          <span className="text-sm text-orange-500">
                            ({distanceFilters.find(d => d.id === selectedDistance)?.name})
                          </span>
                        )}
                      </div>
                      {expandedSections.has('distance') ? 
                        <ChevronDownIcon className="w-4 h-4" /> : 
                        <ChevronRightIcon className="w-4 h-4" />
                      }
                    </button>
                    
                    {expandedSections.has('distance') && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {distanceFilters.map(distance => (
                          <button
                            key={distance.id}
                            onClick={() => setSelectedDistance(
                              selectedDistance === distance.id ? null : distance.id
                            )}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedDistance === distance.id
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {distance.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Context Filter */}
                <div className="border rounded-lg p-3">
                  <button
                    onClick={() => toggleSection('context')}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">상황별 추천</span>
                    </div>
                    {expandedSections.has('context') ? 
                      <ChevronDownIcon className="w-4 h-4" /> : 
                      <ChevronRightIcon className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.has('context') && (
                    <div className="mt-3 space-y-2">
                      {Object.values(contextFilters).map(context => (
                        <button
                          key={context.id}
                          onClick={() => setSelectedContext(
                            selectedContext === context.id ? null : context.id
                          )}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedContext === context.id
                              ? 'bg-orange-100 border-orange-500 border'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium text-sm">{context.name}</div>
                          <div className="text-xs text-gray-500">{context.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Atmosphere Filter */}
                <div className="border rounded-lg p-3">
                  <button
                    onClick={() => toggleSection('atmosphere')}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="font-medium">분위기</span>
                    {selectedAtmosphere.size > 0 && (
                      <span className="text-sm text-orange-500">({selectedAtmosphere.size})</span>
                    )}
                    {expandedSections.has('atmosphere') ? 
                      <ChevronDownIcon className="w-4 h-4" /> : 
                      <ChevronRightIcon className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.has('atmosphere') && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {atmosphereFilters.map(atm => (
                        <button
                          key={atm.id}
                          onClick={() => toggleSetFilter(selectedAtmosphere, atm.id, setSelectedAtmosphere)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedAtmosphere.has(atm.id)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {atm.icon} {atm.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Amenities Filter */}
                <div className="border rounded-lg p-3">
                  <button
                    onClick={() => toggleSection('amenities')}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="font-medium">편의시설</span>
                    {selectedAmenities.size > 0 && (
                      <span className="text-sm text-orange-500">({selectedAmenities.size})</span>
                    )}
                    {expandedSections.has('amenities') ? 
                      <ChevronDownIcon className="w-4 h-4" /> : 
                      <ChevronRightIcon className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.has('amenities') && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {amenityFilters.map(amenity => (
                        <button
                          key={amenity.id}
                          onClick={() => toggleSetFilter(selectedAmenities, amenity.id, setSelectedAmenities)}
                          className={`px-2 py-2 rounded-lg text-xs transition-colors ${
                            selectedAmenities.has(amenity.id)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-lg">{amenity.icon}</div>
                          <div>{amenity.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Media Certifications */}
                <div className="border rounded-lg p-3">
                  <button
                    onClick={() => toggleSection('media')}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <FilmIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">미디어 인증</span>
                    </div>
                    {expandedSections.has('media') ? 
                      <ChevronDownIcon className="w-4 h-4" /> : 
                      <ChevronRightIcon className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.has('media') && (
                    <div className="mt-3 space-y-3">
                      {['tv', 'michelin', 'youtube', 'certification'].map(type => (
                        <div key={type}>
                          <p className="text-xs text-gray-500 mb-1 uppercase">{type}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {mediaPrograms
                              .filter(p => p.type === type)
                              .map(program => (
                                <button
                                  key={program.id}
                                  onClick={() => toggleSetFilter(selectedMedia, program.id, setSelectedMedia)}
                                  className={`px-2 py-1 rounded text-xs transition-colors ${
                                    selectedMedia.has(program.id)
                                      ? 'bg-orange-500 text-white'
                                      : 'bg-gray-100 hover:bg-gray-200'
                                  }`}
                                >
                                  {program.icon} {program.name}
                                </button>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Special Filters */}
                <div className="border rounded-lg p-3">
                  <button
                    onClick={() => toggleSection('special')}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="font-medium">찐맛집 필터</span>
                    {expandedSections.has('special') ? 
                      <ChevronDownIcon className="w-4 h-4" /> : 
                      <ChevronRightIcon className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.has('special') && (
                    <div className="mt-3 space-y-2">
                      {specialFilters.map(filter => (
                        <button
                          key={filter.id}
                          onClick={() => toggleSetFilter(selectedSpecialFilters, filter.id, setSelectedSpecialFilters)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedSpecialFilters.has(filter.id)
                              ? 'bg-orange-100 border-orange-500 border'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {filter.icon} {filter.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}