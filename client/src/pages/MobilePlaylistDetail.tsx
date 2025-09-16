import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { 
  HeartIcon, 
  BookmarkIcon, 
  ShareIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  EyeIcon,
  PlayIcon,
  StarIcon,
  PhoneIcon,
  ListBulletIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon, 
  BookmarkIcon as BookmarkSolidIcon,
  StarIcon as StarSolidIcon 
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuthStore } from '../store/authStore';
import { getDefaultAvatar } from '../utils/avatars';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { certifiedRestaurantLists } from '../data/certifiedRestaurantLists_fixed';
import { dataManager } from '../utils/dataManager';

const MobilePlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const [isLiked, setIsLiked] = useState(() => id ? dataManager.isPlaylistLiked(id) : false);
  const [isSaved, setIsSaved] = useState(() => id ? dataManager.isPlaylistSaved(id) : false);
  const [savedRestaurants, setSavedRestaurants] = useState<string[]>(() => {
    const savedData = dataManager.getSavedRestaurants();
    return savedData.map(r => r.restaurantId);
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [showRestaurantPopup, setShowRestaurantPopup] = useState(false);
  // viewMode 제거 - 항상 지도만 표시
  const [likedRestaurants, setLikedRestaurants] = useState<string[]>(() => {
    const likes = localStorage.getItem('likedRestaurants');
    return likes ? JSON.parse(likes) : [];
  });
  const [restaurantStats, setRestaurantStats] = useState<{[key: string]: {likes: number, saves: number, reviews: number}}>(() => {
    const stats = localStorage.getItem('restaurantStats');
    return stats ? JSON.parse(stats) : {};
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      // 인증 맛집 데이터 확인 (새로운 구조)
      if (id?.startsWith('certified-')) {
        const certifiedData = localStorage.getItem('certified_restaurants_data');
        if (certifiedData) {
          const parsedData = JSON.parse(certifiedData);
          const categoryKey = id.replace('certified-', '');
          const category = parsedData.categories[categoryKey];
          if (category) {
            // 카테고리를 플레이리스트 형식으로 변환
            return {
              _id: id,
              name: category.title,
              title: `${category.icon} ${category.title}`,
              description: category.description,
              creator: { username: 'Admin', isVerified: true },
              certification: category.title,
              restaurants: category.restaurants.map((r: any) => ({
                _id: r.id,
                restaurant: {
                  _id: r.id,
                  name: r.name,
                  category: r.category,
                  address: r.address,
                  phoneNumber: r.phoneNumber,
                  priceRange: r.priceRange,
                  rating: r.rating,
                  image: r.image,
                  coordinates: { lat: 37.5665, lng: 126.9780 } // 기본 좌표
                }
              })),
              likeCount: category.likeCount || 0,
              viewCount: category.viewCount || 0,
              tags: [category.title],
              coverImage: category.restaurants[0]?.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'
            };
          }
        }
      }
      
      // Admin에서 수정한 데이터 확인
      const adminPlaylists = localStorage.getItem('adminPlaylists');
      if (adminPlaylists) {
        const playlists = JSON.parse(adminPlaylists);
        const adminPlaylist = playlists.find((p: any) => p._id === id);
        if (adminPlaylist) {
          return adminPlaylist;
        }
      }
      
      // certifiedRestaurantLists에서 찾기
      const certifiedPlaylist = certifiedRestaurantLists.find(p => p._id === id);
      if (certifiedPlaylist) {
        return certifiedPlaylist;
      }
      
      // 로컬 스토리지에서 찾기
      const localPlaylists = localStorage.getItem('localPlaylists');
      if (localPlaylists) {
        const playlists = JSON.parse(localPlaylists);
        const localPlaylist = playlists.find((p: any) => p._id === id);
        if (localPlaylist) {
          return localPlaylist;
        }
      }
      
      // 둘 다 없으면 API 호출
      try {
        const response = await axios.get(`/api/playlists/${id}`);
        return response.data;
      } catch (err) {
        throw new Error('맛집 리스트를 찾을 수 없습니다');
      }
    },
    enabled: !!id,
  });
  
  // 저장 상태 동기화
  useEffect(() => {
    if (id && playlist) {
      const saved = dataManager.isPlaylistSaved(id);
      const liked = dataManager.isPlaylistLiked(id);
      setIsSaved(saved);
      setIsLiked(liked);
      console.log(`MobilePlaylistDetail - Loading state for ${id}: saved=${saved}, liked=${liked}`);
    }
  }, [id, playlist]); // playlist가 변경될 때마다 상태 재로드
  
  // Listen for dataManager updates
  useEffect(() => {
    const handleDataUpdate = () => {
      if (id) {
        const saved = dataManager.isPlaylistSaved(id);
        const liked = dataManager.isPlaylistLiked(id);
        setIsSaved(saved);
        setIsLiked(liked);
        console.log(`MobilePlaylistDetail - Data updated for ${id}: saved=${saved}, liked=${liked}`);
      }
      // Update saved restaurants
      const savedData = dataManager.getSavedRestaurants();
      setSavedRestaurants(savedData.map(r => r.restaurantId));
    };

    window.addEventListener('dataManager:update', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);

    return () => {
      window.removeEventListener('dataManager:update', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, [id]);

  // 맛집 목록 - 실제 데이터가 없으면 더미 데이터 사용
  // API에서 restaurants 배열은 { restaurant: {...}, addedBy, reason } 형태로 옴
  const restaurantList = playlist?.restaurants?.map((item: any) => {
    // item이 문자열(ID)인 경우 처리
    if (typeof item === 'string') {
      return {
        _id: item,
        name: `Restaurant ${item.slice(-4)}`,
        category: '맛집',
        rating: 4.0 + Math.random(),
        image: null
      };
    }
    const restaurant = item.restaurant || item;
    // coordinates 구조를 lat, lng로 변환
    if (restaurant.coordinates) {
      return {
        ...restaurant,
        lat: restaurant.coordinates.lat,
        lng: restaurant.coordinates.lng,
        reason: item.reason || ''
      };
    }
    return restaurant;
  }) || [];
  
  // 디버깅: 실제 데이터 확인
  console.log('Playlist data:', playlist);
  console.log('Restaurant list:', restaurantList);
  
  // 실제 데이터에 좌표가 없으면 더미 데이터 사용
  const hasValidCoordinates = restaurantList.some((r: any) => r.lat && r.lng);
  
  const restaurants = restaurantList.length > 0 && hasValidCoordinates
    ? restaurantList 
    : [
        { 
          _id: '1', 
          name: '브로이하우스 성수', 
          category: '양식', 
          rating: 4.5, 
          price: '₩₩', 
          address: '서울 성동구 연무장길 41-1',
          lat: 37.5447128,  // 실제 좌표
          lng: 127.0557743,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
          reason: '수제 맥주와 함께 즐기는 정통 독일식 소시지, 분위기도 최고!'
        },
        { 
          _id: '2', 
          name: '스시선수 청담', 
          category: '일식', 
          rating: 4.8, 
          price: '₩₩₩₩', 
          address: '서울 강남구 도산대로45길 6',
          lat: 37.5226894,  // 실제 좌표
          lng: 127.0423736,
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
          reason: '신선한 재료와 셰프님의 설명이 일품, 예약 필수입니다.'
        },
        { 
          _id: '3', 
          name: '피오니 홍대점', 
          category: '이탈리안', 
          rating: 4.3, 
          price: '₩₩', 
          address: '서울 마포구 홍익로3길 34',
          lat: 37.5530374,  // 실제 좌표
          lng: 126.9235845,
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
          reason: '로제 파스타가 시그니처! 웨이팅 있지만 기다릴 가치 있어요.'
        },
        { 
          _id: '4', 
          name: '카페 무이 이태원', 
          category: '브런치', 
          rating: 4.6, 
          price: '₩₩', 
          address: '서울 용산구 회나무로26길 39',
          lat: 37.5347819,  // 실제 좌표
          lng: 126.9947892,
          image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
          reason: '리코타 팬케이크가 유명해요. 주말엔 웨이팅 필수!'
        },
        { 
          _id: '5', 
          name: '다올 종로점', 
          category: '한식', 
          rating: 4.7, 
          price: '₩₩₩', 
          address: '서울 종로구 인사동길 30-1',
          lat: 37.5738639,  // 실제 좌표
          lng: 126.9864245,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
          reason: '정갈한 한정식, 외국인 접대나 어르신 모시고 가기 좋아요.'
        },
        { 
          _id: '6', 
          name: '민들레떡볶이 신촌점', 
          category: '분식', 
          rating: 4.4, 
          price: '₩', 
          address: '서울 마포구 신촌로12길 2',
          lat: 37.5559073,  // 실제 좌표
          lng: 126.9367825,
          image: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=400',
          reason: '바삭한 튀김과 쫄깃한 떡볶이, 대학생들의 성지!'
        },
        { 
          _id: '7', 
          name: '하노이의 아침 연남', 
          category: '아시안', 
          rating: 4.5, 
          price: '₩₩', 
          address: '서울 마포구 동교로41길 28',
          lat: 37.5627738,  // 실제 좌표
          lng: 126.9254852,
          image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
          reason: '정통 베트남 쌀국수, 현지맛 그대로!'
        }
      ];

  const tags = playlist?.tags || ['맛집', '데이트', '분위기좋은', '인스타감성'];

  // 커스텀 번호 마커 생성 함수 - 개선된 디자인
  const createNumberIcon = (number: number) => {
    const iconHtml = `
      <div style="
        position: relative;
        width: 24px;
        height: 28px;
      ">
        <div style="
          background: linear-gradient(135deg, #FF6B35, #FF8E53);
          color: white;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          text-align: center;
          line-height: 1;
        ">${number}</div>
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid white;
        "></div>
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [24, 28],
      iconAnchor: [12, 28]
    });
  };

  const handleLike = () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }
    
    if (id) {
      const liked = dataManager.togglePlaylistLike(id);
      setIsLiked(liked);
      toast.success(liked ? '좋아요!' : '좋아요 취소');
      console.log(`MobilePlaylistDetail - Like toggled for ${id}: liked=${liked}`);
      
      // 이벤트 발생
      window.dispatchEvent(new CustomEvent('dataManager:update'));
    }
  };

  const handleSave = () => {
    console.log('Mobile - handleSave called - id:', id, 'isSaved:', isSaved);
    
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }
    
    if (id) {
      if (isSaved) {
        console.log('Mobile - Unsaving playlist:', id);
        dataManager.unsavePlaylist(id);
        setIsSaved(false);
        toast.success('저장 취소됨');
      } else {
        console.log('Mobile - Saving playlist:', id);
        dataManager.savePlaylist(id);
        setIsSaved(true);
        toast.success('저장됨!');
      }
      
      // 저장 후 상태 확인
      const savedData = dataManager.getSavedPlaylists();
      console.log('Mobile - After save - Saved playlists:', savedData);
      
      // 이벤트 발생시켜 다른 컴포넌트들이 업데이트 되도록
      window.dispatchEvent(new CustomEvent('dataManager:update'));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: playlist?.title,
        text: playlist?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 복사되었습니다!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">플레이리스트를 찾을 수 없습니다</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-orange-600">
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 이미지 */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={playlist.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
          alt={playlist.title || playlist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* 플레이 버튼 */}
        <button className="absolute bottom-4 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg">
          <PlayIcon className="w-6 h-6" />
        </button>
      </div>

      {/* 플레이리스트 정보 */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{playlist.title || playlist.name}</h1>
          <p className="text-sm text-gray-600 mb-3">{playlist.description}</p>
          
          {/* 해시태그 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag: string, index: number) => (
              <span key={index} className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center">
              <img
                src={playlist.createdBy?.profileImage || getDefaultAvatar(playlist.createdBy?.username || 'User')}
                alt={playlist.createdBy?.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{playlist.createdBy?.username || '익명'}</p>
                <p className="text-xs text-gray-500">
                  {playlist.createdAt ? format(new Date(playlist.createdAt), 'yyyy.MM.dd', { locale: ko }) : ''}
                </p>
              </div>
            </div>
            <button className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full">
              팔로우
            </button>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex justify-around pt-4">
            <button onClick={handleLike} className="flex flex-col items-center">
              {isLiked ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-gray-600" />
              )}
              <span className="text-xs text-gray-600 mt-1">
                {(playlist.likeCount || 0) + (isLiked ? 1 : 0)}
              </span>
            </button>
            
            <button onClick={handleSave} className="flex flex-col items-center">
              {isSaved ? (
                <BookmarkSolidIcon className="w-6 h-6 text-orange-500" />
              ) : (
                <BookmarkIcon className="w-6 h-6 text-gray-600" />
              )}
              <span className="text-xs text-gray-600 mt-1">저장</span>
            </button>
            
            <button onClick={handleShare} className="flex flex-col items-center">
              <ShareIcon className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-600 mt-1">공유</span>
            </button>
            
            <button className="flex flex-col items-center">
              <EyeIcon className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-600 mt-1">
                {playlist.viewCount || 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 맛집 목록 헤더 */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            <MapIcon className="w-5 h-5 inline mr-1 text-orange-500" />
            맛집 지도 ({restaurants.length})
          </h2>
        </div>
      </div>

      {/* 지도 뷰 (항상 표시) */}
      <div className="px-4">
          <div className="w-full h-[400px] rounded-lg shadow-md overflow-hidden">
            <MapContainer 
              center={[37.5500, 126.9700]} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}  // 스크롤로 확대/축소 가능
              zoomControl={true}      // 줌 컨트롤 표시
              doubleClickZoom={true}  // 더블클릭으로 확대
              touchZoom={true}        // 터치로 확대/축소
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {restaurants.map((restaurant: any, index: number) => {
                // 실제 좌표 사용 (랜덤 생성 제거)
                const lat = restaurant.lat;
                const lng = restaurant.lng;
                
                // 디버깅을 위한 로그
                console.log(`Restaurant ${index + 1}: ${restaurant.name}`, { lat, lng });
                
                // 좌표가 없는 경우 스킵
                if (!lat || !lng) {
                  console.warn(`No coordinates for ${restaurant.name}`);
                  return null;
                }
                
                return (
                  <Marker 
                    key={restaurant._id || `marker-${index}`} 
                    position={[lat, lng]}
                    icon={createNumberIcon(index + 1)}
                    eventHandlers={{
                      click: () => {
                        setSelectedRestaurant(restaurant);
                        setShowRestaurantPopup(true);
                      }
                    }}
                  >
                    {/* 팝업 제거 - 클릭 시 하단 팝업만 표시 */}
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
          
          {/* 지도 조작 안내 */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 지도를 확대하려면 더블 클릭 또는 두 손가락으로 확대하세요
          </div>
          
          {/* 지도 아래 간단한 리스트 */}
          <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
            {restaurants.map((restaurant: any, index: number) => (
              <div
                key={restaurant._id || index}
                className="bg-white rounded-lg shadow-sm p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  setShowRestaurantPopup(true);
                }}
              >
                <div className="flex items-center flex-1">
                  <span className="text-sm font-bold text-orange-500 mr-2">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-sm text-gray-900">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {restaurant.category} · {restaurant.price}
                    </p>
                  </div>
                </div>
                {restaurant.rating && (
                  <div className="flex items-center">
                    <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
                    <span className="text-sm">{restaurant.rating}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
      </div>

      {/* 맛집 상세 팝업 */}
      {showRestaurantPopup && selectedRestaurant && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9999] flex items-end"
          onClick={() => setShowRestaurantPopup(false)} // 배경 클릭 시 닫기
        >
          <div 
            className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative z-[10000]"
            onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭은 막기
          >
            <div className="sticky top-0 bg-white p-4 border-b z-[10001]">
              {/* X 버튼 제거하고 드래그 핸들만 표시 */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-bold">{selectedRestaurant.name}</h2>
                  {selectedRestaurant.isVerified && (
                    <span className="ml-2 text-blue-500">✓</span>
                  )}
                </div>
                {/* 전체 통계 표시 */}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  {(restaurantStats[selectedRestaurant._id]?.saves > 0 || savedRestaurants.includes(selectedRestaurant._id)) && (
                    <span className="flex items-center">
                      <BookmarkSolidIcon className="w-3 h-3 text-orange-500 mr-0.5" />
                      <span>{restaurantStats[selectedRestaurant._id]?.saves || 0}명이 저장</span>
                    </span>
                  )}
                  {restaurantStats[selectedRestaurant._id]?.likes > 0 && (
                    <span className="flex items-center">
                      <HeartSolidIcon className="w-3 h-3 text-red-500 mr-0.5" />
                      <span>{restaurantStats[selectedRestaurant._id]?.likes}명이 좋아요</span>
                    </span>
                  )}
                  {restaurantStats[selectedRestaurant._id]?.reviews > 0 && (
                    <span className="flex items-center">
                      <StarSolidIcon className="w-3 h-3 text-yellow-500 mr-0.5" />
                      <span>{restaurantStats[selectedRestaurant._id]?.reviews}개 리뷰</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* 지도로 변경 - 식당 위치 표시 */}
              <div className="w-full h-48 rounded-lg overflow-hidden shadow-md">
                <MapContainer 
                  center={[
                    selectedRestaurant.lat || selectedRestaurant.coordinates?.lat || 37.5665, 
                    selectedRestaurant.lng || selectedRestaurant.coordinates?.lng || 126.9780
                  ]} 
                  zoom={16} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                  zoomControl={true}
                  dragging={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker 
                    position={[
                      selectedRestaurant.lat || selectedRestaurant.coordinates?.lat || 37.5665, 
                      selectedRestaurant.lng || selectedRestaurant.coordinates?.lng || 126.9780
                    ]}
                    icon={L.divIcon({
                      className: 'custom-marker',
                      html: `<div style="background-color: #ea580c; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>`,
                      iconSize: [30, 30],
                      iconAnchor: [15, 30]
                    })}
                  />
                </MapContainer>
              </div>

              {/* 기본 정보 및 통계 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedRestaurant.category}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedRestaurant.price || '₩₩'}
                    </span>
                  </div>
                  {selectedRestaurant.rating && (
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">{selectedRestaurant.rating}</span>
                    </div>
                  )}
                </div>
                
                {/* 액션 버튼들 - 저장, 좋아요, 리뷰, 지도 */}
                <div className="flex items-center justify-around pt-2 border-t">
                  <button 
                    onClick={() => {
                      if (savedRestaurants.includes(selectedRestaurant._id)) {
                        dataManager.unsaveRestaurant(selectedRestaurant._id);
                        toast.success('저장이 취소되었습니다');
                        setSavedRestaurants(prev => prev.filter(id => id !== selectedRestaurant._id));
                        // 저장 카운트 감소
                        setRestaurantStats(prev => {
                          const newStats = {
                            ...prev,
                            [selectedRestaurant._id]: {
                              ...prev[selectedRestaurant._id],
                              saves: Math.max(0, (prev[selectedRestaurant._id]?.saves || 0) - 1)
                            }
                          };
                          localStorage.setItem('restaurantStats', JSON.stringify(newStats));
                          return newStats;
                        });
                      } else {
                        const localRestaurants = localStorage.getItem('localRestaurants');
                        const restaurants = localRestaurants ? JSON.parse(localRestaurants) : [];
                        if (!restaurants.find((r: any) => r._id === selectedRestaurant._id)) {
                          restaurants.push(selectedRestaurant);
                          localStorage.setItem('localRestaurants', JSON.stringify(restaurants));
                        }
                        dataManager.saveRestaurant(selectedRestaurant._id, `${playlist?.title || '플레이리스트'}에서 저장`);
                        toast.success('맛집이 저장되었습니다!');
                        setSavedRestaurants(prev => [...prev, selectedRestaurant._id]);
                        // 저장 카운트 증가
                        setRestaurantStats(prev => {
                          const newStats = {
                            ...prev,
                            [selectedRestaurant._id]: {
                              ...prev[selectedRestaurant._id],
                              saves: (prev[selectedRestaurant._id]?.saves || 0) + 1
                            }
                          };
                          localStorage.setItem('restaurantStats', JSON.stringify(newStats));
                          return newStats;
                        });
                      }
                    }}
                    className="flex flex-col items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors relative"
                  >
                    {savedRestaurants.includes(selectedRestaurant._id) ? (
                      <BookmarkSolidIcon className="w-5 h-5 text-orange-500 mb-1" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5 text-gray-600 mb-1" />
                    )}
                    <span className="text-xs text-gray-700">저장</span>
                    {restaurantStats[selectedRestaurant._id]?.saves > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {restaurantStats[selectedRestaurant._id].saves}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      const isLiked = likedRestaurants.includes(selectedRestaurant._id);
                      if (isLiked) {
                        setLikedRestaurants(prev => prev.filter(id => id !== selectedRestaurant._id));
                        toast('좋아요 취소');
                        // 좋아요 카운트 감소
                        setRestaurantStats(prev => {
                          const newStats = {
                            ...prev,
                            [selectedRestaurant._id]: {
                              ...prev[selectedRestaurant._id],
                              likes: Math.max(0, (prev[selectedRestaurant._id]?.likes || 0) - 1)
                            }
                          };
                          localStorage.setItem('restaurantStats', JSON.stringify(newStats));
                          return newStats;
                        });
                      } else {
                        setLikedRestaurants(prev => [...prev, selectedRestaurant._id]);
                        toast.success('좋아요!');
                        // 좋아요 카운트 증가
                        setRestaurantStats(prev => {
                          const newStats = {
                            ...prev,
                            [selectedRestaurant._id]: {
                              ...prev[selectedRestaurant._id],
                              likes: (prev[selectedRestaurant._id]?.likes || 0) + 1
                            }
                          };
                          localStorage.setItem('restaurantStats', JSON.stringify(newStats));
                          return newStats;
                        });
                      }
                      const updatedLikedRestaurants = isLiked 
                        ? likedRestaurants.filter(id => id !== selectedRestaurant._id)
                        : [...likedRestaurants, selectedRestaurant._id];
                      localStorage.setItem('likedRestaurants', JSON.stringify(updatedLikedRestaurants));
                    }}
                    className="flex flex-col items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors relative"
                  >
                    {likedRestaurants.includes(selectedRestaurant._id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500 mb-1" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600 mb-1" />
                    )}
                    <span className="text-xs text-gray-700">좋아요</span>
                    {restaurantStats[selectedRestaurant._id]?.likes > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {restaurantStats[selectedRestaurant._id].likes}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowReviewModal(true);
                    }}
                    className="flex flex-col items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors relative"
                  >
                    <StarIcon className="w-5 h-5 text-gray-600 mb-1" />
                    <span className="text-xs text-gray-700">리뷰</span>
                    {restaurantStats[selectedRestaurant._id]?.reviews > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {restaurantStats[selectedRestaurant._id].reviews}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      // 지도 앱으로 이동 (카카오맵 우선, 없으면 네이버맵)
                      const address = encodeURIComponent(selectedRestaurant.address || selectedRestaurant.location);
                      window.open(`https://map.kakao.com/link/search/${address}`, '_blank');
                    }}
                    className="flex flex-col items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <MapPinIcon className="w-5 h-5 text-gray-600 mb-1" />
                    <span className="text-xs text-gray-700">지도</span>
                  </button>
                </div>
              </div>

              {/* 태그 */}
              {selectedRestaurant.tags && selectedRestaurant.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedRestaurant.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* DNA 프로필 */}
              {selectedRestaurant.dnaProfile && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3">
                  <h3 className="font-semibold text-sm mb-2">맛집 DNA</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">인스타그램성</span>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (selectedRestaurant.dnaProfile.instagramability || 0)
                                ? 'bg-pink-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">데이트 적합도</span>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (selectedRestaurant.dnaProfile.dateSpot || 0)
                                ? 'bg-red-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">단체 모임</span>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (selectedRestaurant.dnaProfile.groupFriendly || 0)
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">혼밥 적합도</span>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (selectedRestaurant.dnaProfile.soloFriendly || 0)
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 주소 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start">
                  <MapPinIcon className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-700">{selectedRestaurant.address}</p>
                    {selectedRestaurant.roadAddress && (
                      <p className="text-gray-500 text-xs mt-1">도로명: {selectedRestaurant.roadAddress}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 추천 이유 */}
              {selectedRestaurant.reason && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">추천 이유</p>
                  <p className="text-sm text-gray-700">"{selectedRestaurant.reason}"</p>
                </div>
              )}

              {/* 메뉴 (있을 경우) */}
              {selectedRestaurant.menuItems && selectedRestaurant.menuItems.length > 0 && (
                <div className="bg-white border rounded-lg p-3">
                  <h3 className="font-semibold text-sm mb-2">메뉴</h3>
                  <div className="space-y-2">
                    {selectedRestaurant.menuItems.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-start text-xs">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.isPopular && (
                            <span className="ml-1 bg-red-100 text-red-700 px-1 py-0.5 rounded text-xs">
                              인기
                            </span>
                          )}
                        </div>
                        {item.price && (
                          <span className="text-orange-600 font-medium">
                            {item.price.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    ))}
                    {selectedRestaurant.menuItems.length > 3 && (
                      <p className="text-xs text-gray-500 pt-1">
                        +{selectedRestaurant.menuItems.length - 3}개 더보기
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 영업 시간 (있을 경우) */}
              {selectedRestaurant.hours && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{selectedRestaurant.hours}</span>
                  </div>
                </div>
              )}

              {/* 전화번호 (있을 경우) */}
              {selectedRestaurant.phoneNumber && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <a href={`tel:${selectedRestaurant.phoneNumber}`} className="text-sm text-blue-600">
                      {selectedRestaurant.phoneNumber}
                    </a>
                  </div>
                </div>
              )}

              {/* 하단 액션 버튼들 */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                <button 
                  onClick={() => {
                    setShowRestaurantPopup(false);
                    navigate(`/restaurant/${selectedRestaurant._id || selectedRestaurant.id}`);
                  }}
                  className="border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  상세 보기
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + `/restaurant/${selectedRestaurant._id || selectedRestaurant.id}`);
                    toast.success('링크가 복사되었습니다!');
                  }}
                  className="border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  공유하기
                </button>
                <button 
                  onClick={() => {
                    if (selectedRestaurant.phoneNumber) {
                      window.location.href = `tel:${selectedRestaurant.phoneNumber}`;
                    } else {
                      toast.error('전화번호가 없습니다');
                    }
                  }}
                  className="border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  전화하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 작성 모달 */}
      {showReviewModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">{selectedRestaurant.name} 리뷰 작성</h3>
            
            {/* 별점 선택 */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">평점을 선택해주세요</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    {star <= reviewRating ? (
                      <StarSolidIcon className="w-8 h-8 text-yellow-400" />
                    ) : (
                      <StarIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 리뷰 텍스트 */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">리뷰 내용</p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="맛집에 대한 솔직한 리뷰를 남겨주세요..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {/* 버튼들 */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewText('');
                  setReviewRating(5);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (!reviewText.trim()) {
                    toast.error('리뷰 내용을 입력해주세요');
                    return;
                  }
                  
                  // 리뷰 저장
                  const reviews = JSON.parse(localStorage.getItem('restaurantReviews') || '{}');
                  if (!reviews[selectedRestaurant._id]) {
                    reviews[selectedRestaurant._id] = [];
                  }
                  reviews[selectedRestaurant._id].push({
                    id: Date.now(),
                    author: user?.username || '익명',
                    rating: reviewRating,
                    text: reviewText,
                    date: new Date().toISOString(),
                    helpful: 0
                  });
                  localStorage.setItem('restaurantReviews', JSON.stringify(reviews));
                  
                  // 리뷰 카운트 증가
                  setRestaurantStats(prev => {
                    const newStats = {
                      ...prev,
                      [selectedRestaurant._id]: {
                        ...prev[selectedRestaurant._id],
                        reviews: (prev[selectedRestaurant._id]?.reviews || 0) + 1
                      }
                    };
                    localStorage.setItem('restaurantStats', JSON.stringify(newStats));
                    return newStats;
                  });
                  
                  toast.success('리뷰가 등록되었습니다!');
                  setShowReviewModal(false);
                  setReviewText('');
                  setReviewRating(5);
                }}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                리뷰 등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePlaylistDetail;