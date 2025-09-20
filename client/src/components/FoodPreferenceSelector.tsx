import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FoodPreferenceSelectorProps {
  onComplete: (preferences: string[]) => void;
  initialPreferences?: string[];
  maxSelection?: number;
  minSelection?: number;
}

const FoodPreferenceSelector: React.FC<FoodPreferenceSelectorProps> = ({
  onComplete,
  initialPreferences = [],
  maxSelection = 10,
  minSelection = 3
}) => {
  const [selectedFoods, setSelectedFoods] = useState<string[]>(initialPreferences);

  const foodCategories = [
    // 대분류
    { name: '한식', emoji: '🍚', color: 'bg-red-100 text-red-600' },
    { name: '중식', emoji: '🥟', color: 'bg-yellow-100 text-yellow-600' },
    { name: '일식', emoji: '🍱', color: 'bg-pink-100 text-pink-600' },
    { name: '양식', emoji: '🍝', color: 'bg-purple-100 text-purple-600' },
    { name: '카페', emoji: '☕', color: 'bg-brown-100 text-brown-600' },
    { name: '디저트', emoji: '🍰', color: 'bg-pink-100 text-pink-600' },
    { name: '분식', emoji: '🍜', color: 'bg-orange-100 text-orange-600' },
    { name: '치킨', emoji: '🍗', color: 'bg-amber-100 text-amber-600' },
    { name: '피자', emoji: '🍕', color: 'bg-red-100 text-red-600' },
    { name: '버거', emoji: '🍔', color: 'bg-yellow-100 text-yellow-600' },
    { name: '아시안', emoji: '🍛', color: 'bg-green-100 text-green-600' },
    { name: '돈가스', emoji: '🍖', color: 'bg-amber-100 text-amber-600' },
    { name: '회/초밥', emoji: '🍣', color: 'bg-blue-100 text-blue-600' },
    { name: '고기', emoji: '🥩', color: 'bg-red-100 text-red-600' },
    { name: '찜/탕', emoji: '🍲', color: 'bg-orange-100 text-orange-600' },
    { name: '면요리', emoji: '🍝', color: 'bg-yellow-100 text-yellow-600' },
    { name: '해물', emoji: '🦐', color: 'bg-blue-100 text-blue-600' },
    { name: '술집', emoji: '🍺', color: 'bg-amber-100 text-amber-600' },
    // 세부 카테고리
    { name: '카레', emoji: '🍛', color: 'bg-yellow-100 text-yellow-600' },
    { name: '냉면', emoji: '🥶', color: 'bg-blue-100 text-blue-600' },
    { name: '제육', emoji: '🥘', color: 'bg-red-100 text-red-600' },
    { name: '떡볶이', emoji: '🌶️', color: 'bg-red-100 text-red-600' },
    { name: '김치찌개', emoji: '🍲', color: 'bg-orange-100 text-orange-600' },
    { name: '삼겹살', emoji: '🥓', color: 'bg-pink-100 text-pink-600' },
    { name: '족발', emoji: '🦶', color: 'bg-amber-100 text-amber-600' },
    { name: '보쌈', emoji: '🥬', color: 'bg-green-100 text-green-600' }
  ];

  const toggleFood = (foodName: string) => {
    setSelectedFoods(prev => {
      if (prev.includes(foodName)) {
        return prev.filter(f => f !== foodName);
      } else if (prev.length < maxSelection) {
        return [...prev, foodName];
      }
      return prev;
    });
  };

  const handleComplete = () => {
    if (selectedFoods.length >= minSelection) {
      onComplete(selectedFoods);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🍽️ 좋아하는 음식을 선택해주세요
          </h2>
          <p className="text-gray-600">
            선택한 음식 카테고리 기반으로 맛집과 플레이리스트를 추천해드립니다
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              최소 {minSelection}개 이상 선택
            </span>
            <span className={`text-sm font-medium ${
              selectedFoods.length < minSelection ? 'text-red-500' :
              selectedFoods.length === maxSelection ? 'text-orange-500' : 'text-green-500'
            }`}>
              {selectedFoods.length} / {maxSelection} 선택됨
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {foodCategories.map((food) => {
            const isSelected = selectedFoods.includes(food.name);
            const isDisabled = !isSelected && selectedFoods.length >= maxSelection;

            return (
              <motion.button
                key={food.name}
                onClick={() => toggleFood(food.name)}
                disabled={isDisabled}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-orange-400 bg-orange-50 shadow-md'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50'
                }`}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <CheckCircleIcon className="w-6 h-6 text-orange-500" />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">{food.emoji}</span>
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-orange-600' : 'text-gray-700'
                  }`}>
                    {food.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {selectedFoods.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">선택한 음식:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedFoods.map((food) => {
                const foodData = foodCategories.find(f => f.name === food);
                return (
                  <motion.span
                    key={food}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm"
                  >
                    <span>{foodData?.emoji}</span>
                    <span>{food}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFood(food);
                      }}
                      className="ml-1 hover:text-orange-900"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </motion.span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleComplete}
            disabled={selectedFoods.length < minSelection}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedFoods.length >= minSelection
                ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white hover:from-orange-500 hover:to-red-500 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedFoods.length < minSelection
              ? `${minSelection - selectedFoods.length}개 더 선택해주세요`
              : '선택 완료'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodPreferenceSelector;