import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../utils/axios';
import { 
  MapPinIcon, 
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  MapIcon,
  ListBulletIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid,
  BookmarkIcon as BookmarkSolid
} from '@heroicons/react/24/solid';
import KoreanMap from '../components/KoreanMap';
import { toast } from 'react-hot-toast';
import RestaurantComments from '../components/RestaurantComments';

const SimplePlaylistDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [playlist, setPlaylist] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      
      try {
        const response = await axios.get(`/api/playlists/${id}`);
        setPlaylist(response.data);
        setIsLiked(response.data.isLiked || false);
        setIsSaved(response.data.isSaved || false);
      } catch (error) {
        console.error('Error fetching playlist:', error);
        toast.error('플레이리스트를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">플레이리스트 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">플레이리스트를 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // KoreanMap에 맞는 Restaurant 형식으로 변환
  const mapRestaurants = (playlist.restaurants || []).map((item: any) => {
    // restaurant가 중첩된 객체인지 확인
    const r = item.restaurant || item;
    return {
      _id: r._id || r.id,
      name: r.name,
      address: r.address,
      roadAddress: r.address,
      coordinates: r.coordinates,
      category: r.category || r.cuisine,
      subCategory: r.subCategory || r.cuisine,
      priceRange: r.priceRange,
      images: r.images || (r.image ? [{
        url: r.image,
        uploadedBy: 'expert',
        uploadedAt: new Date().toISOString()
      }] : []),
      phoneNumber: r.phoneNumber || '',
      businessHours: r.businessHours || {},
      averageRating: r.averageRating || r.rating || 4.5,
      reviewCount: r.reviewCount || r.userReviewCount || 0,
      tags: r.tags || r.authenticTags || [],
      dnaProfile: r.dnaProfile || {
        atmosphere: [],
        foodStyle: [],
        instagramability: 0,
        dateSpot: 0,
        groupFriendly: 0,
        soloFriendly: 0
      },
      menuItems: r.menuItems || [],
      features: r.features || [],
      createdBy: {
        _id: playlist.createdBy?._id || 'expert',
        username: playlist.createdBy?.username || playlist.expertName,
        email: 'expert@bobmap.com',
        trustScore: 100,
        followerCount: 0,
        followingCount: 0,
        visitedRestaurantsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any,
      verifiedBy: [],
      isVerified: true,
      viewCount: 0,
      saveCount: 0,
      savedBy: [],
      detailedAverages: {
        taste: 4.5,
        service: 4.0,
        cleanliness: 4.3,
        price: 4.2
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {isLiked ? (
                  <HeartSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {isSaved ? (
                  <BookmarkSolid className="w-5 h-5 text-orange-500" />
                ) : (
                  <BookmarkIcon className="w-5 h-5" />
                )}
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('링크가 복사되었습니다!');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 플레이리스트 정보 */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            {playlist.expertAvatar && (
              <img
                src={playlist.expertAvatar}
                alt={playlist.expertName}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            )}
            <div>
              <p className="text-sm opacity-90">{playlist.expertName}</p>
              <p className="text-xs opacity-75">{playlist.expertTitle || '미식 전문가'}</p>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{playlist.title}</h1>
          <p className="text-lg opacity-90 mb-6">{playlist.description}</p>
          
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {playlist.restaurants.length}개 맛집
            </span>
            {playlist.saves && (
              <span className="flex items-center gap-1">
                <BookmarkIcon className="w-4 h-4" />
                {(Array.isArray(playlist.saves) ? playlist.saves.length : (playlist.saves || 0)).toLocaleString()} 저장
              </span>
            )}
            {playlist.views && (
              <span className="flex items-center gap-1">
                👁️ {typeof playlist.views === 'object' ? (playlist.views.total || 0).toLocaleString() : playlist.views.toLocaleString()} 조회
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 뷰 모드 토글 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              viewMode === 'map' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MapIcon className="w-5 h-5" />
            지도 보기
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              viewMode === 'list' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ListBulletIcon className="w-5 h-5" />
            리스트 보기
          </button>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {viewMode === 'map' ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-[600px]">
              <KoreanMap
                restaurants={mapRestaurants}
                onRestaurantClick={(restaurant) => {
                  toast.success(`${restaurant.name} 선택됨`);
                }}
                className="w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlist.restaurants.map((restaurant: any, index: number) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                {restaurant.image && (
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold">{index + 1}. {restaurant.name}</h3>
                    {restaurant.rating && (
                      <span className="text-sm text-orange-500 font-medium">
                        ⭐ {restaurant.rating}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{restaurant.address}</p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {restaurant.category || restaurant.cuisine}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {restaurant.priceRange}
                    </span>
                  </div>
                  
                  {restaurant.expertReview && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-700">
                        💬 {restaurant.expertReview.summary}
                      </p>
                    </div>
                  )}
                  
                  {/* 댓글 기능 */}
                  <RestaurantComments 
                    restaurantId={restaurant._id || restaurant.id}
                    playlistId={playlist._id || playlist.id}
                    isOpen={false}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePlaylistDetail;