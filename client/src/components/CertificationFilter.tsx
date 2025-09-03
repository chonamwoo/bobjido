import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon,
  UserGroupIcon,
  HeartIcon,
  CheckBadgeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface CertificationFilterProps {
  onFilterChange: (filters: CertificationFilters) => void;
}

export interface CertificationFilters {
  official: boolean;
  friend: boolean;
  tasteMatch: boolean;
}

const CertificationFilter: React.FC<CertificationFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<CertificationFilters>({
    official: true,
    friend: false,
    tasteMatch: false
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const handleFilterChange = (type: keyof CertificationFilters) => {
    const newFilters = {
      ...filters,
      [type]: !filters[type]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const filterOptions = [
    {
      id: 'official',
      label: '공식 인증',
      description: 'TV 방송, 미쉐린, 백년가게',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'friend',
      label: '친구 인증',
      description: '내 친구들이 추천한 맛집',
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'tasteMatch',
      label: '취향 매칭',
      description: '나와 입맛이 비슷한 사람들',
      icon: HeartIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    }
  ];

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="relative">
      {/* 필터 버튼 */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FunnelIcon className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-700">인증 필터</span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* 드롭다운 메뉴 */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 left-0 z-50 w-80 bg-white rounded-xl shadow-xl border border-gray-200"
          >
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckBadgeIcon className="w-5 h-5 text-orange-500" />
                맛집 인증 타입
              </h3>
              
              <div className="space-y-3">
                {filterOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = filters[option.id as keyof CertificationFilters];
                  
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleFilterChange(option.id as keyof CertificationFilters)}
                      className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                        isActive 
                          ? `${option.bgColor} ${option.borderColor}`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${option.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-semibold ${isActive ? option.color : 'text-gray-700'}`}>
                              {option.label}
                            </h4>
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              isActive 
                                ? `${option.borderColor} ${option.bgColor}`
                                : 'border-gray-300'
                            }`}>
                              {isActive && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`w-full h-full ${option.color}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </motion.svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setFilters({ official: false, friend: false, tasteMatch: false });
                      onFilterChange({ official: false, friend: false, tasteMatch: false });
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    모두 해제
                  </button>
                  <button
                    onClick={() => {
                      setFilters({ official: true, friend: true, tasteMatch: true });
                      onFilterChange({ official: true, friend: true, tasteMatch: true });
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    모두 선택
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CertificationFilter;