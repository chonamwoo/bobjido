import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  HeartIcon,
  MapPinIcon,
  SparklesIcon,
  FireIcon,
  PlusCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { certifiedRestaurantLists, getTrendingLists, getLatestLists } from '../data/certifiedRestaurantLists';

const MobileHomeSoundCloud: React.FC = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPlaylists, setLikedPlaylists] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'certified' | 'following' | 'similar'>('certified');

  useEffect(() => {
    fetchPlaylists();
  }, [activeFilter]);

  const fetchPlaylists = async () => {
    try {
      // Admin에서 수정한 데이터가 있으면 사용, 없으면 기본 데이터 사용
      const adminPlaylists = localStorage.getItem('adminPlaylists');
      let allPlaylists = adminPlaylists ? JSON.parse(adminPlaylists) : certifiedRestaurantLists;
      
      let filteredLists = [];
      
      if (activeFilter === 'certified') {
        // 인증 맛집 리스트 (미디어/인플루언서/유튜브 등장)
        filteredLists = allPlaylists.filter((p: any) => 
          p.certification && [
            '흑백요리사',
            '수요미식회',
            '미쉐린스타',
            '백종원의3대천왕',
            '백년가게'
          ].includes(p.certification)
        );
      } else if (activeFilter === 'following') {
        // 지인(팔로잉) 인증 맛집 리스트 - 실제 친구 이름처럼
        filteredLists = [
          {
            _id: 'following-1',
            name: '김재광님의 성수동 맛집리스트',
            title: '재광님이 인증한 성수동 핫플',
            description: '성수동 가면 꼭 가봐야할 곳들! 분위기도 맛도 최고',
            creator: { username: '김재광', isVerified: false },
            certification: null,
            likeCount: 234,
            viewCount: 1520,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            restaurants: [
              { _id: 'rest-14', restaurant: { _id: 'rest-14', name: '어반플레이스', category: '카페', address: '서울 성수동' }},
              { _id: 'rest-15', restaurant: { _id: 'rest-15', name: '대림창고', category: '브런치', address: '서울 성수동' }},
              { _id: 'rest-9', restaurant: { _id: 'rest-9', name: '성수족발', category: '한식', address: '서울 성수동' }},
              { _id: 'rest-16', restaurant: { _id: 'rest-16', name: '온더보더', category: '양식', address: '서울 성수동' }}
            ],
            tags: ['성수동', '핫플', '데이트'],
            coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
          },
          {
            _id: 'following-2',
            name: '남우님의 제육 맛집리스트',
            title: '제육볶음 원탑 맛집 모음',
            description: '전국 제육볶음 투어하면서 찾은 진짜들만',
            creator: { username: '조남우', isVerified: false },
            certification: null,
            likeCount: 156,
            viewCount: 892,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            restaurants: [
              { _id: 'rest-3', restaurant: { _id: 'rest-3', name: '을지면옥', category: '한식', address: '서울 중구' }},
              { _id: 'rest-8', restaurant: { _id: 'rest-8', name: '하동관', category: '한식', address: '서울 중구' }},
              { _id: 'rest-17', restaurant: { _id: 'rest-17', name: '강남면옥', category: '한식', address: '서울 강남구' }}
            ],
            tags: ['제육볶음', '한식', '밥도둑'],
            coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop'
          },
          {
            _id: 'following-3',
            name: '민정이의 브런치 카페 리스트',
            title: '주말 브런치 예약 필수 맛집',
            description: '인스타 감성 + 맛까지 보장하는 브런치 맛집',
            creator: { username: '박민정', isVerified: false },
            certification: null,
            likeCount: 412,
            viewCount: 2341,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            restaurants: [
              { _id: 'rest-15', restaurant: { _id: 'rest-15', name: '대림창고', category: '브런치', address: '서울 성수동' }},
              { _id: 'rest-18', restaurant: { _id: 'rest-18', name: '빌즈', category: '브런치', address: '서울 강남구' }},
              { _id: 'rest-19', restaurant: { _id: 'rest-19', name: '엘리스리틀이태리', category: '양식', address: '서울 이태원' }},
              { _id: 'rest-20', restaurant: { _id: 'rest-20', name: '카페마마스', category: '브런치', address: '서울 용산구' }},
              { _id: 'rest-21', restaurant: { _id: 'rest-21', name: '테라스키친', category: '브런치', address: '서울 한남동' }}
            ],
            tags: ['브런치', '카페', '디저트'],
            coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'
          },
          {
            _id: 'following-4',
            name: '준서형의 고기 맛집리스트',
            title: '육식파를 위한 고기 맛집 총정리',
            description: '소고기 돼지고기 양고기까지, 고기러버 필수 코스',
            creator: { username: '이준서', isVerified: false },
            certification: null,
            likeCount: 567,
            viewCount: 3456,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            restaurants: [
              { _id: 'rest-10', restaurant: { _id: 'rest-10', name: '새마을식당', category: '한식', address: '서울 강남구' }},
              { _id: 'rest-22', restaurant: { _id: 'rest-22', name: '정식당', category: '한식', address: '서울 강남구' }},
              { _id: 'rest-4', restaurant: { _id: 'rest-4', name: '라이너스 바베큐', category: '양식', address: '서울 이태원' }}
            ],
            tags: ['고기', '삼겹살', '스테이크'],
            coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
          },
          {
            _id: 'following-5',
            name: '혜진이의 이태원 맛집리스트',
            title: '이태원 국제 음식 투어',
            description: '이태원에서 세계여행! 각 나라 진짜 맛집들',
            creator: { username: '김혜진', isVerified: false },
            certification: null,
            likeCount: 289,
            viewCount: 1789,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            restaurants: [
              { _id: 'rest-4', restaurant: { _id: 'rest-4', name: '라이너스 바베큐', category: '양식', address: '서울 이태원' }},
              { _id: 'rest-23', restaurant: { _id: 'rest-23', name: '바토스', category: '멕시칸', address: '서울 이태원' }},
              { _id: 'rest-24', restaurant: { _id: 'rest-24', name: '카사블랑카', category: '모로칸', address: '서울 이태원' }},
              { _id: 'rest-25', restaurant: { _id: 'rest-25', name: '페트라', category: '중동음식', address: '서울 이태원' }}
            ],
            tags: ['이태원', '세계음식', '이국적'],
            coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop'
          }
        ];
      } else if (activeFilter === 'similar') {
        // 나와 비슷한 먹성 추천 기반 - 더 리얼한 데이터
        filteredLists = [
          {
            _id: 'similar-1',
            name: '매운맛 마니아들의 성지',
            title: '🔥 불맛 매운맛 끝판왕',
            description: '매운맛 좋아하는 사람들이 인정한 진짜 매운 맛집',
            creator: { username: '매운맛협회', isVerified: false },
            certification: null,
            likeCount: 678,
            viewCount: 4523,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            restaurants: [
              { _id: 'rest-26', restaurant: { _id: 'rest-26', name: '사천짜장', category: '중식', address: '서울 마포구' }},
              { _id: 'rest-27', restaurant: { _id: 'rest-27', name: '병천순대국', category: '한식', address: '서울 양천구' }},
              { _id: 'rest-28', restaurant: { _id: 'rest-28', name: '불타는고추', category: '한식', address: '서울 강남구' }},
              { _id: 'rest-29', restaurant: { _id: 'rest-29', name: '진짜매운탕', category: '한식', address: '서울 종로구' }}
            ],
            tags: ['매운맛', '불맛', '중독성'],
            coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
            recommendedReason: '취향 매칭 92%'
          },
          {
            _id: 'similar-2',
            name: '가성비 최강 맛집',
            title: '💰 1만원 이하 가성비 끝판왕',
            description: '만원의 행복! 가성비로 승부하는 진짜 맛집',
            creator: { username: '알뜰살뜰', isVerified: false },
            certification: null,
            likeCount: 892,
            viewCount: 6234,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            restaurants: [
              { _id: 'rest-30', restaurant: { _id: 'rest-30', name: '김밥천국', category: '분식', address: '서울 종로구' }},
              { _id: 'rest-31', restaurant: { _id: 'rest-31', name: '이모네집', category: '한식', address: '서울 마포구' }},
              { _id: 'rest-32', restaurant: { _id: 'rest-32', name: '광장시장', category: '한식', address: '서울 종로구' }},
              { _id: 'rest-33', restaurant: { _id: 'rest-33', name: '통인동칼국수', category: '한식', address: '서울 종로구' }},
              { _id: 'rest-34', restaurant: { _id: 'rest-34', name: '순대국밥', category: '한식', address: '서울 중구' }}
            ],
            tags: ['가성비', '저렴한', '푸짐한'],
            coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
            recommendedReason: '취향 매칭 88%'
          },
          {
            _id: 'similar-3',
            name: '한식 러버들의 집밥 맛집',
            title: '🍚 엄마 손맛 같은 한식당',
            description: '집밥이 그리울 때 가는 정통 한식 맛집',
            creator: { username: '한식사랑', isVerified: true },
            certification: null,
            likeCount: 543,
            viewCount: 3421,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            restaurants: [
              { _id: 'rest-8', restaurant: { _id: 'rest-8', name: '하동관', category: '한식', address: '서울 중구' }},
              { _id: 'rest-35', restaurant: { _id: 'rest-35', name: '진주회관', category: '한식', address: '서울 종로구' }},
              { _id: 'rest-36', restaurant: { _id: 'rest-36', name: '토속촌', category: '한식', address: '서울 강남구' }}
            ],
            tags: ['한식', '집밥', '건강한'],
            coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
            recommendedReason: '취향 매칭 95%'
          }
        ];
      }
      
      setPlaylists(filteredLists.slice(0, 6));
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = (playlistId: string) => {
    setLikedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playlistId)) {
        newSet.delete(playlistId);
      } else {
        newSet.add(playlistId);
      }
      return newSet;
    });
  };

  const PlaylistCard = ({ playlist }: { playlist: any }) => {
    const isLiked = likedPlaylists.has(playlist._id);
    const localLikeCount = (playlist.likes || playlist.likeCount || 0) + (isLiked ? 1 : 0);

    const getPlaylistImage = () => {
      if (playlist.coverImage) return playlist.coverImage;
      // 카테고리별 기본 이미지
      const defaultImages: { [key: string]: string } = {
        '흑백요리사': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        '수요미식회': 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop',
        '미쉐린스타': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
        '백종원의3대천왕': 'https://images.unsplash.com/photo-1554679665-f5537f187268?w=400&h=300&fit=crop'
      };
      return defaultImages[playlist.certification] || 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&q=80';
    };

    const getRestaurantNames = () => {
      if (playlist.restaurants && playlist.restaurants.length > 0) {
        const names = playlist.restaurants
          .slice(0, 3)
          .map((r: any) => {
            // restaurant 객체 처리 - certifiedRestaurantLists 형식 지원
            if (typeof r === 'object' && r !== null) {
              return r.restaurant?.name || r.name || '';
            }
            return r || '';
          })
          .filter((name: string) => name) // 빈 문자열 제거
          .join(', ');
        
        if (names) {
          return names + (playlist.restaurants.length > 3 ? ` 외 ${playlist.restaurants.length - 3}곳` : '');
        }
      }
      
      // 인증 리스트의 경우 디폴트 설명
      if (playlist.certification) {
        const certDescriptions: { [key: string]: string } = {
          '흑백요리사': '임페리얼 트레져, 네오포차, 스시조 외',
          '수요미식회': '평래옥, 라이너스 바베큐, 을지면옥 외',
          '미쉐린스타': '밍글스, 곳간, 라연, 품서울 외',
          '백종원의3대천왕': '진진, 홍탁집, 황해면옥 외',
          '백년가게': '우래옥, 평래옥, 하동관 외'
        };
        return certDescriptions[playlist.certification] || '인증 맛집';
      }
      
      return '맛집 리스트';
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div 
          className="relative cursor-pointer overflow-hidden"
          style={{ aspectRatio: '16/9' }}
          onClick={() => navigate(`/playlist/${playlist._id}`)}
        >
          <img
            src={getPlaylistImage()}
            alt={playlist.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
          
          {/* 인증 배지 또는 추천 이유 */}
          {playlist.certification && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
              {playlist.certification === '미쉐린스타' ? '⭐ 미쉐린' :
               playlist.certification === '백년가게' ? '💯 백년가게' :
               playlist.certification === '흑백요리사' ? '👨‍🍳 흑백요리사' :
               playlist.certification === '수요미식회' ? '🍽️ 수요미식회' :
               playlist.certification === '백종원의3대천왕' ? '👑 3대천왕' :
               playlist.certification}
            </div>
          )}
          {playlist.recommendedReason && (
            <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-white">
              {playlist.recommendedReason}
            </div>
          )}
          
          <button 
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              // 플레이 기능 추가 예정
            }}
          >
            <PlayIcon className="w-4 h-4 text-gray-900" />
          </button>
        </div>
        
        <div className="p-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
              {playlist.title || playlist.name}
            </h3>
            <button 
              onClick={() => handleLikeToggle(playlist._id)}
              className="ml-2 text-gray-600 hover:text-red-500 transition-colors flex items-center space-x-1"
            >
              {isLiked ? (
                <HeartIconSolid className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              <span className="text-xs">{localLikeCount}</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-600 mb-1 line-clamp-1">
            {playlist.description || '맛집 큐레이션'}
          </p>
          
          {/* 크리에이터 정보 */}
          {playlist.creator && (
            <p className="text-xs text-gray-500 mb-1">
              by {playlist.creator.username}
              {playlist.creator.isVerified && ' ✓'}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{playlist.restaurants?.length || playlist.restaurantCount || 0}개 맛집</span>
            <span>{playlist.views || playlist.viewCount || 0}회 조회</span>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-1">
              {getRestaurantNames()}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">맛집 리스트 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 모바일 히어로 섹션 - 심플한 디자인 */}
      <section className="relative h-[280px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-4 pb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              BobMap
            </h1>
            <p className="text-lg font-medium text-white/95">
              진짜 맛집만 모았다
            </p>
            <p className="text-sm text-white/80">
              현지인이 줄서는 진짜 맛집
            </p>
          </motion.div>
        </div>
      </section>


      {/* 필터 탭 */}
      <section className="px-4 mt-6">
        <div className="flex space-x-2 mb-4 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveFilter('certified')}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'certified'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            인증맛집
          </button>
          <button
            onClick={() => setActiveFilter('following')}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'following'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            팔로잉
          </button>
          <button
            onClick={() => setActiveFilter('similar')}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'similar'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            취향매칭
          </button>
        </div>

        {/* 필터별 설명 */}
        <div className="mb-4">
          {activeFilter === 'certified' && (
            <p className="text-xs text-gray-600">
              <StarIcon className="w-4 h-4 inline mr-1 text-yellow-500" />
              미디어, 인플루언서, 유튜브 등에 등장한 검증된 맛집
            </p>
          )}
          {activeFilter === 'following' && (
            <p className="text-xs text-gray-600">
              <HeartIcon className="w-4 h-4 inline mr-1 text-red-500" />
              내가 팔로우하는 사람들이 인증한 맛집
            </p>
          )}
          {activeFilter === 'similar' && (
            <p className="text-xs text-gray-600">
              <SparklesIcon className="w-4 h-4 inline mr-1 text-purple-500" />
              나와 비슷한 먹성을 가진 사람들의 추천
            </p>
          )}
        </div>
        
        {/* 플레이리스트 표시 */}
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              {activeFilter === 'following' 
                ? '팔로우하는 사람이 없습니다. 다른 사용자를 팔로우해보세요!'
                : activeFilter === 'similar'
                ? '취향 분석 중입니다. 더 많은 활동을 해주세요!'
                : '아직 등록된 맛집이 없습니다.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MobileHomeSoundCloud;