import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import KoreanMap from '../components/KoreanMap';
import { 
  HeartIcon, 
  BookmarkIcon, 
  ShareIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  FireIcon,
  SparklesIcon,
  HandThumbUpIcon,
  CameraIcon,
  MusicalNoteIcon,
  SunIcon,
  MoonIcon,
  UserGroupIcon,
  BanknotesIcon,
  WifiIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon, 
  BookmarkIcon as BookmarkSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';

// 평가 카테고리
const ratingCategories = [
  { id: 'taste', label: '맛', icon: FireIcon, color: 'text-red-500' },
  { id: 'atmosphere', label: '분위기', icon: SparklesIcon, color: 'text-purple-500' },
  { id: 'service', label: '서비스', icon: HandThumbUpIcon, color: 'text-blue-500' },
  { id: 'value', label: '가성비', icon: BanknotesIcon, color: 'text-green-500' },
  { id: 'cleanliness', label: '청결도', icon: CheckCircleIcon, color: 'text-teal-500' }
];

// 특징 태그
const featureTags = [
  { id: 'instagram', label: '인스타 감성', icon: CameraIcon },
  { id: 'quiet', label: '조용한', icon: MoonIcon },
  { id: 'lively', label: '활기찬', icon: SunIcon },
  { id: 'group', label: '단체 가능', icon: UserGroupIcon },
  { id: 'solo', label: '혼밥 가능', icon: UserIcon },
  { id: 'wifi', label: '와이파이', icon: WifiIcon },
  { id: 'music', label: '음악 좋음', icon: MusicalNoteIcon }
];

interface RestaurantRating {
  restaurantId: string;
  rating: number;
  personalNote: string;
  reasonForAdding: string;
  categoryRatings: {
    taste: number;
    atmosphere: number;
    service: number;
    value: number;
    cleanliness: number;
  };
  features: string[];
  visitDate?: string;
}

const EnhancedPlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const [editingRestaurant, setEditingRestaurant] = useState<string | null>(null);
  const [ratings, setRatings] = useState<{ [key: string]: RestaurantRating }>({});

  // 플레이리스트 데이터 조회
  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/playlists/${id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return response.data;
    },
    enabled: !!id,
  });

  // 레스토랑 평가 데이터 조회
  const { data: restaurantRatings } = useQuery({
    queryKey: ['playlist-ratings', id],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/playlists/${id}/ratings`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return response.data.ratings;
    },
    enabled: !!id,
  });

  // 평가 업데이트
  const updateRatingMutation = useMutation({
    mutationFn: async ({ restaurantId, data }: { restaurantId: string; data: any }) => {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/playlists/${id}/restaurants/${restaurantId}/rating`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist-ratings', id] });
      toast.success('평가가 저장되었습니다');
      setEditingRestaurant(null);
    }
  });

  const handleRatingUpdate = (restaurantId: string, category: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [restaurantId]: {
        ...prev[restaurantId],
        categoryRatings: {
          ...prev[restaurantId]?.categoryRatings,
          [category]: value
        }
      }
    }));
  };

  const handleFeatureToggle = (restaurantId: string, featureId: string) => {
    setRatings(prev => {
      const current = prev[restaurantId]?.features || [];
      const updated = current.includes(featureId)
        ? current.filter(f => f !== featureId)
        : [...current, featureId];
      
      return {
        ...prev,
        [restaurantId]: {
          ...prev[restaurantId],
          features: updated
        }
      };
    });
  };

  const saveRating = (restaurantId: string) => {
    const rating = ratings[restaurantId];
    if (!rating) return;

    updateRatingMutation.mutate({
      restaurantId,
      data: {
        rating: rating.rating || 0,
        personalNote: rating.personalNote || '',
        reasonForAdding: rating.reasonForAdding || '',
        categoryRatings: rating.categoryRatings,
        features: rating.features
      }
    });
  };

  const isOwner = user && playlist?.createdBy?._id === user._id;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="h-64 relative">
          {playlist?.restaurants?.length > 0 && (
            <KoreanMap
              restaurants={playlist.restaurants.map((r: any) => r.restaurant)}
              className="w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{playlist?.title}</h1>
            <p className="text-lg opacity-90">{playlist?.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <Link to={`/profile/${playlist?.createdBy?.username}`} className="flex items-center gap-2 hover:opacity-80">
                <img
                  src={playlist?.createdBy?.profileImage || `https://ui-avatars.com/api/?name=${playlist?.createdBy?.username}`}
                  alt={playlist?.createdBy?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{playlist?.createdBy?.username}</span>
              </Link>
              <span className="opacity-75">•</span>
              <span className="flex items-center gap-1">
                <EyeIcon className="w-5 h-5" />
                {playlist?.viewCount || 0}
              </span>
              <span className="opacity-75">•</span>
              <span className="flex items-center gap-1">
                <HeartIcon className="w-5 h-5" />
                {playlist?.likeCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 레스토랑 목록 */}
      <div className="space-y-6">
        {playlist?.restaurants?.map((item: any, index: number) => {
          const restaurant = item.restaurant;
          const rating = restaurantRatings?.find((r: any) => 
            r.restaurant?._id === restaurant._id
          ) || ratings[restaurant._id];
          const isEditing = editingRestaurant === restaurant._id;

          return (
            <motion.div
              key={restaurant._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                {/* 이미지 */}
                <div className="md:w-1/3">
                  <img
                    src={restaurant.images?.[0]?.url || '/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                {/* 콘텐츠 */}
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary-500">#{index + 1}</span>
                        <h3 className="text-2xl font-bold">{restaurant.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-gray-600">
                        <MapPinIcon className="w-5 h-5" />
                        <span>{restaurant.address}</span>
                        <span className="text-gray-400">•</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">{restaurant.category}</span>
                      </div>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => setEditingRestaurant(isEditing ? null : restaurant._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* 에디터 노트 */}
                  {(item.personalNote || rating?.personalNote) && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-blue-900 mb-1">📝 에디터 노트</h4>
                      <p className="text-blue-800">{item.personalNote || rating?.personalNote}</p>
                    </div>
                  )}

                  {/* 선정 이유 */}
                  {(rating?.reasonForAdding || isEditing) && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-green-900 mb-1">💡 이 맛집을 선정한 이유</h4>
                      {isEditing ? (
                        <textarea
                          value={ratings[restaurant._id]?.reasonForAdding || ''}
                          onChange={(e) => setRatings(prev => ({
                            ...prev,
                            [restaurant._id]: {
                              ...prev[restaurant._id],
                              reasonForAdding: e.target.value
                            }
                          }))}
                          className="w-full p-2 border rounded"
                          rows={3}
                          placeholder="왜 이 맛집을 리스트에 추가했나요?"
                        />
                      ) : (
                        <p className="text-green-800">{rating?.reasonForAdding}</p>
                      )}
                    </div>
                  )}

                  {/* 카테고리별 평점 */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-3">상세 평가</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {ratingCategories.map(category => {
                        const value = rating?.categoryRatings?.[category.id] || 0;
                        return (
                          <div key={category.id} className="text-center">
                            <category.icon className={`w-6 h-6 mx-auto mb-1 ${category.color}`} />
                            <p className="text-sm font-medium mb-1">{category.label}</p>
                            <div className="flex justify-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => isEditing && handleRatingUpdate(restaurant._id, category.id, star)}
                                  disabled={!isEditing}
                                  className={`${!isEditing && 'cursor-default'}`}
                                >
                                  {star <= value ? (
                                    <StarSolidIcon className="w-5 h-5 text-yellow-400" />
                                  ) : (
                                    <StarIcon className="w-5 h-5 text-gray-300" />
                                  )}
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{value}/5</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 특징 태그 */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-3">특징</h4>
                    <div className="flex flex-wrap gap-2">
                      {featureTags.map(tag => {
                        const isSelected = rating?.features?.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            onClick={() => isEditing && handleFeatureToggle(restaurant._id, tag.id)}
                            disabled={!isEditing}
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${
                              isSelected
                                ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                            } ${!isEditing && 'cursor-default'}`}
                          >
                            <tag.icon className="w-4 h-4" />
                            {tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 개인 메모 */}
                  {isEditing && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">개인 메모</h4>
                      <textarea
                        value={ratings[restaurant._id]?.personalNote || ''}
                        onChange={(e) => setRatings(prev => ({
                          ...prev,
                          [restaurant._id]: {
                            ...prev[restaurant._id],
                            personalNote: e.target.value
                          }
                        }))}
                        className="w-full p-3 border rounded-lg"
                        rows={3}
                        placeholder="이 맛집에 대한 개인적인 메모를 작성하세요..."
                      />
                    </div>
                  )}

                  {/* 저장 버튼 */}
                  {isEditing && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingRestaurant(null)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => saveRating(restaurant._id)}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                      >
                        저장
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedPlaylistDetail;