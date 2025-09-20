import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowLeftIcon, CameraIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

// 음식 카테고리 목록
const FOOD_CATEGORIES = [
  { id: 'korean', name: '한식', emoji: '🍚' },
  { id: 'chinese', name: '중식', emoji: '🥟' },
  { id: 'japanese', name: '일식', emoji: '🍱' },
  { id: 'western', name: '양식', emoji: '🍝' },
  { id: 'asian', name: '아시안', emoji: '🍜' },
  { id: 'cafe', name: '카페', emoji: '☕' },
  { id: 'dessert', name: '디저트', emoji: '🍰' },
  { id: 'chicken', name: '치킨', emoji: '🍗' },
  { id: 'pizza', name: '피자', emoji: '🍕' },
  { id: 'burger', name: '버거', emoji: '🍔' },
  { id: 'meat', name: '고기', emoji: '🥩' },
  { id: 'seafood', name: '해물', emoji: '🦐' },
  { id: 'noodles', name: '면요리', emoji: '🍜' },
  { id: 'snack', name: '분식', emoji: '🍢' },
  { id: 'bar', name: '술집', emoji: '🍺' },
  { id: 'fastfood', name: '패스트푸드', emoji: '🍟' }
];

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location?.city || '',
    district: user?.location?.district || '',
    profileImage: user?.profileImage || ''
  });
  const [selectedFoods, setSelectedFoods] = useState<string[]>(user?.preferredFoods || []);
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('/api/users/profile', {
        username: formData.username,
        bio: formData.bio,
        location: {
          city: formData.location,
          district: formData.district
        },
        preferredFoods: selectedFoods
      });

      updateUser(response.data.user);
      toast.success('프로필이 업데이트되었습니다!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '프로필 업데이트 실패');
    } finally {
      setLoading(false);
    }
  };

  const toggleFood = (foodId: string) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter(id => id !== foodId));
    } else if (selectedFoods.length < 5) {
      setSelectedFoods([...selectedFoods, foodId]);
    } else {
      toast('최대 5개까지 선택 가능합니다', { icon: '⚠️' });
    }
  };

  const moveFood = (index: number, direction: 'up' | 'down') => {
    const newFoods = [...selectedFoods];
    if (direction === 'up' && index > 0) {
      [newFoods[index], newFoods[index - 1]] = [newFoods[index - 1], newFoods[index]];
    } else if (direction === 'down' && index < newFoods.length - 1) {
      [newFoods[index], newFoods[index + 1]] = [newFoods[index + 1], newFoods[index]];
    }
    setSelectedFoods(newFoods);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">프로필 수정</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* 폼 */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={formData.profileImage || `https://ui-avatars.com/api/?name=${formData.username}&background=FF6B35&color=fff`}
                alt="프로필"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                onClick={() => toast('프로필 이미지 업로드는 준비 중입니다', { icon: 'ℹ️' })}
              >
                <CameraIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 사용자명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사용자명
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              자기소개
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="자신을 소개해주세요"
            />
          </div>

          {/* 지역 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                도시
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="예: 서울"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                구/동
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="예: 강남구"
              />
            </div>
          </div>

          {/* 음식 선호도 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                선호 음식 (최대 5개, 순서대로 랭킹)
              </label>
              <button
                type="button"
                onClick={() => setShowFoodSelector(!showFoodSelector)}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                {showFoodSelector ? '닫기' : '선택하기'}
              </button>
            </div>

            {/* 선택된 음식들 표시 */}
            {selectedFoods.length > 0 && (
              <div className="mb-4 space-y-2">
                {selectedFoods.map((foodId, index) => {
                  const food = FOOD_CATEGORIES.find(f => f.id === foodId);
                  if (!food) return null;
                  return (
                    <div key={foodId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-orange-500">#{index + 1}</span>
                        <span className="text-xl">{food.emoji}</span>
                        <span className="font-medium">{food.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveFood(index, 'up')}
                            className="p-1 hover:bg-orange-100 rounded"
                          >
                            ↑
                          </button>
                        )}
                        {index < selectedFoods.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveFood(index, 'down')}
                            className="p-1 hover:bg-orange-100 rounded"
                          >
                            ↓
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleFood(foodId)}
                          className="ml-2 p-1 hover:bg-orange-100 rounded"
                        >
                          <XMarkIcon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 음식 카테고리 선택 그리드 */}
            {showFoodSelector && (
              <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 rounded-lg">
                {FOOD_CATEGORIES.map((food) => {
                  const isSelected = selectedFoods.includes(food.id);
                  const ranking = selectedFoods.indexOf(food.id) + 1;
                  return (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => toggleFood(food.id)}
                      className={`
                        relative p-3 rounded-lg transition-all
                        ${isSelected
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                        }
                      `}
                      disabled={!isSelected && selectedFoods.length >= 5}
                    >
                      {isSelected && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-orange-500 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                          {ranking}
                        </span>
                      )}
                      <div className="text-2xl mb-1">{food.emoji}</div>
                      <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                        {food.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedFoods.length === 0 && !showFoodSelector && (
              <p className="text-sm text-gray-500">선호하는 음식을 선택해주세요</p>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;