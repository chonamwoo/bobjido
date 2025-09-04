import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import KoreanMap from '../components/KoreanMap';
import RestaurantSearchModal from '../components/RestaurantSearchModal';
import { Restaurant } from '../types';
import { 
  PlusIcon, 
  MapPinIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface CreatePlaylistFormData {
  title: string;
  description: string;
  category: string;
  tags: string;
  isPublic: boolean;
  theme?: string;
  estimatedCost?: {
    min: number;
    max: number;
    perPerson: boolean;
  };
  estimatedDuration?: number;
}

interface CreatePlaylistData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  theme?: string;
  estimatedCost?: {
    min: number;
    max: number;
    perPerson: boolean;
  };
  estimatedDuration?: number;
}


const CreatePlaylist: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<{ [key: string]: string }>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([15000, 35000]);
  const [estimatedDuration, setEstimatedDuration] = useState(120);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePlaylistFormData>({
    defaultValues: {
      isPublic: true,
      estimatedCost: {
        perPerson: true,
      },
    },
  });

  const createPlaylistMutation = useMutation({
    mutationFn: async (data: CreatePlaylistData) => {
      // API로 실제 저장 시도
      try {
        const response = await axios.post('/api/playlists', {
          ...data,
          restaurants: selectedRestaurants.map(r => ({
            restaurant: r._id || r,
            personalNote: personalNotes[r._id] || '',
            mustTry: []
          }))
        });
        return response.data;
      } catch (error: any) {
        console.error('플레이리스트 저장 실패:', error.response?.data || error.message);
        
        // 인증 오류 시 로그인 페이지로 리다이렉트
        if (error.response?.status === 401) {
          toast.error('로그인이 필요합니다.');
          navigate('/login');
          return;
        }
        
        // 다른 에러는 그대로 throw
        throw error;
      }
    },
    onSuccess: (playlist) => {
      toast.success('맛집리스트가 생성되었습니다!');
      navigate(`/playlist/${playlist._id}`);
    },
    onError: (error: any) => {
      toast.error('맛집리스트 생성에 실패했습니다.');
    },
  });

  const addRestaurantMutation = useMutation({
    mutationFn: async ({ playlistId, restaurantId, personalNote }: {
      playlistId: string;
      restaurantId: string;
      personalNote?: string;
    }) => {
      const response = await axios.post(`/api/playlists/${playlistId}/restaurants`, {
        restaurantId,
        personalNote,
      });
      return response.data;
    },
  });

  const onSubmit = async (data: CreatePlaylistFormData) => {
    if (selectedRestaurants.length === 0) {
      toast.error('최소 1개 이상의 맛집을 추가해주세요.');
      return;
    }

    try {
      // 1. 맛집리스트 생성
      const playlistData: CreatePlaylistData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        estimatedCost: {
          min: priceRange[0],
          max: priceRange[1],
          perPerson: true
        },
        estimatedDuration: estimatedDuration
      };
      const playlist = await createPlaylistMutation.mutateAsync(playlistData);
      
      // restaurants가 이미 createPlaylistMutation에서 처리됨
      // 별도의 추가 작업 불필요
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  const handleAddRestaurant = (restaurant: any) => {
    if (!selectedRestaurants.find(r => r._id === restaurant._id)) {
      const formattedRestaurant: Restaurant = {
        ...restaurant,
        x: restaurant.coordinates?.lng || 0,
        y: restaurant.coordinates?.lat || 0,
      };
      setSelectedRestaurants([...selectedRestaurants, formattedRestaurant]);
      toast.success(`${restaurant.name}이(가) 추가되었습니다.`);
    } else {
      toast.error('이미 추가된 맛집입니다.');
    }
    setShowSearchModal(false);
  };

  const handleRemoveRestaurant = (restaurantId: string) => {
    setSelectedRestaurants(selectedRestaurants.filter(r => r._id !== restaurantId));
    const { [restaurantId]: removed, ...rest } = personalNotes;
    setPersonalNotes(rest);
  };

  const handleNoteChange = (restaurantId: string, note: string) => {
    setPersonalNotes({
      ...personalNotes,
      [restaurantId]: note,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-8">새 맛집리스트 만들기</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 기본 정보 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">맛집리스트 제목 *</label>
              <input
                {...register('title', { required: '제목을 입력하세요' })}
                type="text"
                className="input"
                placeholder="예: 홍대 데이트 코스"
              />
              {errors.title && (
                <p className="error-text">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="label">카테고리 *</label>
              <select
                {...register('category', { required: '카테고리를 선택하세요' })}
                className="input"
              >
                <option value="">카테고리 선택</option>
                <option value="데이트코스">데이트코스</option>
                <option value="혼밥">혼밥</option>
                <option value="가족모임">가족모임</option>
                <option value="친구모임">친구모임</option>
                <option value="출장/여행">출장/여행</option>
                <option value="회식">회식</option>
                <option value="카페투어">카페투어</option>
                <option value="맛집투어">맛집투어</option>
                <option value="기타">기타</option>
              </select>
              {errors.category && (
                <p className="error-text">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">설명</label>
            <textarea
              {...register('description')}
              className="input h-24 resize-none"
              placeholder="이 맛집리스트에 대한 설명을 작성해주세요..."
            />
          </div>

          <div>
            <label className="label">태그</label>
            <input
              {...register('tags')}
              type="text"
              className="input"
              placeholder="태그를 쉼표로 구분해서 입력하세요 (예: 데이트, 분위기좋은, 가성비)"
            />
            <p className="text-sm text-gray-500 mt-1">
              태그는 다른 사용자들이 맛집리스트를 찾는데 도움이 됩니다.
            </p>
          </div>

          {/* 예상 비용 및 시간 - 모던한 슬라이더 UI */}
          <div className="space-y-6">
            <div>
              <label className="label flex items-center justify-between">
                <span>💰 예상 비용 (1인당)</span>
                <span className="text-sm font-semibold text-orange-600">
                  {priceRange[0].toLocaleString()}원 ~ {priceRange[1].toLocaleString()}원
                </span>
              </label>
              <div className="mt-4">
                <div className="relative">
                  {/* 슬라이더 트랙 */}
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                      style={{
                        left: `${(priceRange[0] / 100000) * 100}%`,
                        width: `${((priceRange[1] - priceRange[0]) / 100000) * 100}%`
                      }}
                    />
                  </div>
                  {/* 슬라이더 핸들들 */}
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="absolute w-full h-2 opacity-0 cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="absolute w-full h-2 opacity-0 cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>
                {/* 프리셋 버튼들 */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { label: '💵 저렴', range: [5000, 15000] as [number, number] },
                    { label: '💰 보통', range: [15000, 35000] as [number, number] },
                    { label: '💎 고급', range: [35000, 70000] as [number, number] },
                    { label: '🌟 럭셔리', range: [70000, 100000] as [number, number] }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setPriceRange(preset.range)}
                      className={`px-3 py-1 rounded-full text-sm transition-all whitespace-nowrap ${
                        JSON.stringify(priceRange) === JSON.stringify(preset.range)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="label flex items-center justify-between">
                <span>⏱️ 예상 소요시간</span>
                <span className="text-sm font-semibold text-blue-600">
                  {Math.floor(estimatedDuration / 60)}시간 {estimatedDuration % 60}분
                </span>
              </label>
              <div className="mt-4">
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="30"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                {/* 시간 프리셋 */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { label: '⚡ 간단히', time: 60 },
                    { label: '🍽️ 보통', time: 120 },
                    { label: '🍷 여유롭게', time: 180 },
                    { label: '🌃 올나잇', time: 240 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setEstimatedDuration(preset.time)}
                      className={`px-3 py-1 rounded-full text-sm transition-all whitespace-nowrap ${
                        estimatedDuration === preset.time
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 공개 설정 */}
          <div>
            <label className="flex items-center">
              <input
                {...register('isPublic')}
                type="checkbox"
                className="mr-2"
              />
              <span>공개 맛집리스트로 만들기</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              체크 해제 시 비공개 맛집리스트로 생성됩니다.
            </p>
          </div>

          {/* 맛집 추가 섹션 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">맛집 추가</h2>
              <button
                type="button"
                onClick={() => setShowSearchModal(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>맛집 검색</span>
              </button>
            </div>

            {selectedRestaurants.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">아직 추가된 맛집이 없습니다.</p>
                <button
                  type="button"
                  onClick={() => setShowSearchModal(true)}
                  className="btn btn-outline"
                >
                  첫 번째 맛집 추가하기
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 지도 */}
                <div>
                  <h3 className="font-semibold mb-2">맛집리스트 지도</h3>
                  <KoreanMap 
                    restaurants={selectedRestaurants}
                    className="w-full h-[300px]"
                  />
                </div>

                {/* 맛집 목록 */}
                <div>
                  <h3 className="font-semibold mb-4">
                    추가된 맛집 ({selectedRestaurants.length}개)
                  </h3>
                  <div className="space-y-4">
                    {selectedRestaurants.map((restaurant, index) => (
                      <div
                        key={restaurant._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                              <span className="text-primary-600 font-bold">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{restaurant.name}</h4>
                                <p className="text-gray-600 text-sm flex items-center">
                                  <MapPinIcon className="w-4 h-4 mr-1" />
                                  {restaurant.address}
                                </p>
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-2">
                                  {restaurant.category}
                                </span>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => handleRemoveRestaurant(restaurant._id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="mt-4">
                              <label className="label text-sm">개인 메모 (선택)</label>
                              <textarea
                                value={personalNotes[restaurant._id] || ''}
                                onChange={(e) => handleNoteChange(restaurant._id, e.target.value)}
                                className="input h-20 text-sm resize-none"
                                placeholder="이 맛집에 대한 개인적인 메모를 작성하세요..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createPlaylistMutation.isPending}
              className="btn btn-primary"
            >
              {createPlaylistMutation.isPending ? '생성 중...' : '맛집리스트 생성'}
            </button>
          </div>
        </form>
      </div>

      {/* 맛집 검색 모달 */}
      {showSearchModal && (
        <RestaurantSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelect={handleAddRestaurant}
        />
      )}
    </div>
  );
};

export default CreatePlaylist;