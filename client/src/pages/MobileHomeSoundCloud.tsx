import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  HeartIcon,
  MapPinIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  BookmarkIcon,
  UserPlusIcon,
  UserMinusIcon,
  ChevronRightIcon,
  XMarkIcon,
  EyeIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import axios from '../utils/axios';
import { getImageForCategory, getPlaylistImage } from '../utils/foodImages';
import { getRestaurantImage } from '../utils/restaurantImages';
import { getUniquePlaylistImage } from '../utils/playlistImages';
import { formatTimeAgo } from '../utils/communityApi';
import { dataManager } from '../utils/dataManager';
import { playlistDataManager } from '../utils/playlistDataManager';

const MobileHomeSoundCloud: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [certifiedPlaylists, setCertifiedPlaylists] = useState<any[]>([]);
  const [friendsPlaylists, setFriendsPlaylists] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // sessionStorage에서 이전 필터 상태 복원
  const [activeFilter, setActiveFilter] = useState<'certified' | 'friends' | 'community'>(() => {
    const savedFilter = sessionStorage.getItem('mobileHomeFilter');
    return (savedFilter as 'certified' | 'friends' | 'community') || 'certified';
  });
  const [selectedCreatorForExplore, setSelectedCreatorForExplore] = useState<any>(null);
  const [selectedList, setSelectedList] = useState<any>(null);
  const { followUser, unfollowUser, isFollowing, syncWithLocalStorage, followingUsers, followingUserDetails } = useSocialStore();
  
  // 필터 변경시 sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem('mobileHomeFilter', activeFilter);
  }, [activeFilter]);

  // Sync on mount - 한번만 실행 (테스트용 더미 데이터 추가)
  useEffect(() => {
    syncWithLocalStorage();

    // 테스트용: 팔로우 데이터가 없으면 더미 데이터 추가
    if (followingUsers.length === 0) {
      console.log('[DEBUG] No following users found, adding test data');
      // 흑백요리사와 백종원을 자동으로 팔로우
      followUser('test-bw-1', {
        _id: 'test-bw-1',
        username: '흑백요리사',
        bio: '넷플릭스 흑백요리사 공식 계정',
        isVerified: true,
        profileImage: '🍳'
      });
      followUser('test-bjw-1', {
        _id: 'test-bjw-1',
        username: '백종원',
        bio: '백종원의 골목식당',
        isVerified: true,
        profileImage: '👨‍🍳'
      });
    }
  }, []); // dependency를 빈 배열로 변경

  // 기본 더미 데이터 정의
  const getCertifiedDummyData = () => [
    {
      id: 'cert-1',
      _id: 'cert-1',
      name: '미슐랭 가이드 서울 2024',
      title: '미슐랭 가이드 서울 2024',
      description: '미슐랭이 인정한 서울의 맛집들',
      creator: '미슐랭 가이드',
      createdBy: { username: '미슐랭 가이드', isVerified: true },
      isVerified: true,
      creatorImage: '🎖️',
      followers: 0,
      plays: 0,
      tags: ['미슐랭', '파인다이닝', '서울'],
      restaurants: [
        { 
          _id: 'rest-1',
          restaurant: {
            _id: 'rest-1',
            name: '정식당',
            category: '한식',
            rating: 4.8,
            address: '서울 강남구 선릉로 158길 11',
            priceRange: '₩₩₩₩',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5226894, lng: 127.0423736 }
          },
          reason: '한국 전통의 맛을 현대적으로 재해석한 미슐랭 2스타'
        },
        { 
          _id: 'rest-2',
          restaurant: {
            _id: 'rest-2',
            name: '라연',
            category: '한식',
            rating: 4.9,
            address: '서울 중구 퇴계로 130-3',
            priceRange: '₩₩₩₩',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5597, lng: 127.0037 }
          },
          reason: '신라호텔의 품격있는 한정식, 미슐랭 3스타'
        },
        { 
          _id: 'rest-3',
          restaurant: {
            _id: 'rest-3',
            name: '가온',
            category: '한식',
            rating: 4.7,
            address: '서울 강남구 도산대로 317',
            priceRange: '₩₩₩₩',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5233, lng: 127.0387 }
          },
          reason: '한국의 사계절을 담은 창의적 요리'
        }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
      coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800'
    },
    {
      id: 'cert-2',
      _id: 'cert-2',
      name: '백종원의 골목식당 BEST',
      title: '백종원의 골목식당 BEST',
      description: '백종원이 극찬한 진짜 맛집들',
      creator: '백종원',
      createdBy: { username: '백종원', isVerified: true },
      isVerified: true,
      creatorImage: '👨‍🍳',
      followers: 0,
      plays: 0,
      tags: ['백종원', '골목식당', '맛집'],
      restaurants: [
        {
          _id: 'rest-4',
          restaurant: {
            _id: 'rest-4',
            name: '원조쌈밥집',
            category: '한식',
            rating: 4.5,
            address: '서울 종로구 돈화문로 30-1',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5738, lng: 126.9988 }
          },
          reason: '쌈밥의 정석, 신선한 쌈 채소와 된장찌개가 일품'
        },
        {
          _id: 'rest-5',
          restaurant: {
            _id: 'rest-5',
            name: '홍대족발',
            category: '족발',
            rating: 4.6,
            address: '서울 마포구 와우산로21길 31-8',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5534, lng: 126.9229 }
          },
          reason: '쫄깃한 족발과 새콤달콤한 막국수 조합'
        },
        {
          _id: 'rest-6',
          restaurant: {
            _id: 'rest-6',
            name: '을지로골뱅이',
            category: '포차',
            rating: 4.4,
            address: '서울 중구 을지로14길 2',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5657, lng: 126.9911 }
          },
          reason: '매콤한 골뱅이무침과 소면, 을지로 직장인들의 성지'
        }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'
    },
    {
      id: 'cert-3',
      _id: 'cert-3',
      name: '성시경의 먹을텐데 Pick',
      title: '성시경의 먹을텐데 Pick',
      description: '성시경이 사랑한 맛집 리스트',
      creator: '성시경',
      createdBy: { username: '성시경', isVerified: true },
      isVerified: true,
      creatorImage: '🎤',
      followers: 0,
      plays: 0,
      tags: ['성시경', '먹을텐데', '방송맛집'],
      restaurants: [
        {
          _id: 'rest-7',
          restaurant: {
            _id: 'rest-7',
            name: '스시효',
            category: '일식',
            rating: 4.8,
            address: '서울 강남구 도산대로67길 13-5',
            priceRange: '₩₩₩₩',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5263, lng: 127.0380 }
          },
          reason: '정통 에도마에 스시, 성시경이 극찬한 오마카세'
        },
        {
          _id: 'rest-8',
          restaurant: {
            _id: 'rest-8',
            name: '한남북엇국',
            category: '한식',
            rating: 4.6,
            address: '서울 용산구 한남대로20길 31',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5345, lng: 127.0106 }
          },
          reason: '시원한 북엇국과 깔끔한 밑반찬'
        },
        {
          _id: 'rest-9',
          restaurant: {
            _id: 'rest-9',
            name: '평양면옥',
            category: '냉면',
            rating: 4.7,
            address: '서울 중구 장충단로 207',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5608, lng: 127.0074 }
          },
          reason: '전통 평양냉면, 깔끔한 육수가 일품'
        }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
    },
    {
      id: 'cert-4',
      _id: 'cert-4',
      name: '수요미식회 레전드',
      title: '수요미식회 레전드',
      description: '수요미식회 역대 최고 평점 맛집',
      creator: '수요미식회',
      createdBy: { username: '수요미식회', isVerified: true },
      isVerified: true,
      creatorImage: '📺',
      followers: 0,
      plays: 0,
      tags: ['수요미식회', 'TV맛집', '레전드'],
      restaurants: [
        {
          _id: 'rest-10',
          restaurant: {
            _id: 'rest-10',
            name: '을밀대',
            category: '평양냉면',
            rating: 4.9,
            address: '서울 마포구 독막로 26-10',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5496, lng: 126.9147 }
          },
          reason: '평양냉면의 진수, 담백한 육수와 쫄깃한 면발'
        },
        {
          _id: 'rest-11',
          restaurant: {
            _id: 'rest-11',
            name: '우래옥',
            category: '평양냉면',
            rating: 4.8,
            address: '서울 중구 창경궁로 62-29',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5724, lng: 126.9973 }
          },
          reason: '1946년 전통의 평양냉면 명가'
        },
        {
          _id: 'rest-12',
          restaurant: {
            _id: 'rest-12',
            name: '필동면옥',
            category: '평양냉면',
            rating: 4.7,
            address: '서울 중구 서애로 26',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5593, lng: 126.9942 }
          },
          reason: '진한 육수와 메밀향 가득한 면발'
        }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
    },
    {
      id: 'cert-5',
      _id: 'cert-5',
      name: '흑백요리사 우승자의 Pick',
      title: '흑백요리사 우승자의 Pick',
      description: '넷플릭스 흑백요리사 우승자 추천 맛집',
      creator: '에드워드 리',
      createdBy: { username: '에드워드 리', isVerified: true },
      isVerified: true,
      creatorImage: '🏆',
      followers: 0,
      plays: 0,
      tags: ['흑백요리사', '넷플릭스', '셰프추천'],
      restaurants: [
        {
          _id: 'rest-13',
          restaurant: {
            _id: 'rest-13',
            name: '밍글스',
            category: '모던한식',
            rating: 4.9,
            address: '서울 강남구 도산대로67길 19',
            priceRange: '₩₩₩₩',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5254, lng: 127.0384 }
          },
          reason: '한국 식재료로 만든 창의적인 모던 한식'
        },
        {
          _id: 'rest-14',
          restaurant: {
            _id: 'rest-14',
            name: '임프레션',
            category: '프렌치',
            rating: 4.8,
            address: '서울 강남구 도산대로55길 22',
            priceRange: '₩₩₩₩',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5235, lng: 127.0372 }
          },
          reason: '정통 프렌치에 한국적 해석을 더한 파인다이닝'
        },
        {
          _id: 'rest-15',
          restaurant: {
            _id: 'rest-15',
            name: '에빗룸',
            category: '모던유럽',
            rating: 4.7,
            address: '서울 강남구 청담동 94-9',
            priceRange: '₩₩₩₩',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5236, lng: 127.0446 }
          },
          reason: '혁신적인 요리와 아트같은 플레이팅'
        }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
      coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
    }
  ];

  const getFriendsDummyData = () => {
    // socialStore에서 팔로잉 목록과 상세 정보 가져오기
    const followingList = followingUserDetails || [];

    console.log('[DEBUG] Following User Details from socialStore:', followingList);
    console.log('[DEBUG] Following Users IDs:', followingUsers);
    console.log('[DEBUG] Full socialStore state:', { followingUsers, followingUserDetails });

    if (!followingList || followingList.length === 0) {
      return [
        {
          id: 'friend-empty',
          _id: 'friend-empty',
          name: '아직 팔로우한 친구가 없어요',
          title: '친구를 팔로우해보세요',
          description: '친구를 팔로우하면 그들의 맛집이 표시됩니다',
          creator: 'BobMap',
          createdBy: { username: 'BobMap', isVerified: false },
          isVerified: false,
          followers: 0,
          plays: 0,
          tags: ['팔로우', '친구'],
          restaurants: [],
          imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
          coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'
        }
      ];
    }
    
    // 팔로잉한 사람들의 플레이리스트 생성
    return followingList.map((userDetail: any, index: number) => {
      const username = userDetail.username || userDetail._id;
      const playlistId = `friend-${username}-${index}`;

      // 중앙 관리 시스템에서 통계 가져오기
      const stats = playlistDataManager.getPlaylistStats(playlistId);

      // 흑백요리사를 팔로잉하는 경우 실제 인증 플레이리스트 반환
      if (username === '흑백요리사') {
        const blackWhitePlaylist = getCertifiedDummyData().find(p => p.creator === '흑백요리사');
        if (blackWhitePlaylist) {
          return {
            ...blackWhitePlaylist,
            id: `friend-${username}-${index}`,
            _id: `friend-${username}-${index}`
          };
        }
      }
      
      // 다른 인증 크리에이터들도 체크
      const certifiedCreators = ['미슐랭 가이드', '블루리본', '백종원', '수요미식회', '에드워드 리'];
      if (certifiedCreators.includes(username)) {
        const certPlaylist = getCertifiedDummyData().find(p => p.creator === username);
        if (certPlaylist) {
          return {
            ...certPlaylist,
            id: `friend-${username}-${index}`,
            _id: `friend-${username}-${index}`
          };
        }
      }
      
      // localStorage에서 사용자의 실제 플레이리스트 찾기
      const localPlaylists = localStorage.getItem('localPlaylists');
      let userPlaylist = null;
      
      if (localPlaylists) {
        const playlists = JSON.parse(localPlaylists);
        // 해당 사용자가 만든 플레이리스트 찾기
        userPlaylist = playlists.find((p: any) => 
          p.createdBy?.username === username || p.creator === username
        );
      }
      
      // 사용자의 실제 플레이리스트가 있으면 반환
      if (userPlaylist) {
        return {
          ...userPlaylist,
          id: `friend-${username}-${index}`,
          _id: `friend-${username}-${index}`,
          creator: username,
          createdBy: {
            username: username,
            isVerified: userDetail.isVerified || false,
            profileImage: userDetail.profileImage
          },
          viewCount: stats.viewCount,
          likeCount: stats.likeCount,
          saveCount: stats.saveCount,
          isLiked: stats.isLiked,
          isSaved: stats.isSaved
        };
      }
      
      // 플레이리스트가 없는 경우 기본 플레이리스트 반환
      return {
        id: `friend-${username}-${index}`,
        _id: `friend-${username}-${index}`,
        name: `${username}의 맛집 리스트`,
        title: `${username}의 맛집 컬렉션`,
        description: `${username}님이 추천하는 맛집들입니다`,
        creator: username,
        createdBy: {
          username: username,
          isVerified: userDetail.isVerified || false,
          profileImage: userDetail.profileImage
        },
        isVerified: userDetail.isVerified || false,
        followers: 0,
        plays: 0,
        viewCount: stats.viewCount,
        likeCount: stats.likeCount,
        saveCount: stats.saveCount,
        isLiked: stats.isLiked,
        isSaved: stats.isSaved,
      tags: ['추천', '맛집', username],
      restaurants: [
        { 
          _id: `${username}-rest-1`,
          restaurant: {
            _id: `${username}-rest-1`,
            name: '우래옥',
            category: '한식',
            rating: 4.5,
            address: '서울 중구 창경궁로 62-29',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5724, lng: 126.9973 }
          },
          reason: '평양냉면 맛집, 시원한 육수가 일품'
        },
        { 
          _id: `${username}-rest-2`,
          restaurant: {
            _id: `${username}-rest-2`,
            name: '하동관',
            category: '한식',
            rating: 4.3,
            address: '서울 중구 명동9길 12',
            priceRange: '₩₩',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5632, lng: 126.9869 }
          },
          reason: '곰탕 전문점, 진한 국물맛'
        },
        { 
          _id: `${username}-rest-3`,
          restaurant: {
            _id: `${username}-rest-3`,
            name: '명동교자',
            category: '한식',
            rating: 4.4,
            address: '서울 중구 명동10길 29',
            priceRange: '₩',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
            coordinates: { lat: 37.5629, lng: 126.9851 }
          },
          reason: '칼국수와 만두가 유명한 맛집'
        }
      ],
      imageUrl: index % 2 === 0 
        ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop'
        : 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
      coverImage: index % 2 === 0 
        ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop'
        : 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop'
    };
    });
  };

  const getCommunityDummyData = () => [
    {
      id: 'recommend-1',
      name: 'AI 추천 맛집 (준비중)',
      description: '당신의 취향을 분석해서 추천하는 맛집',
      creator: 'BobMap AI',
      isVerified: true,
      creatorImage: '🤖',
      followers: 0,
      plays: 0,
      tags: ['AI추천', '취향분석', '맞춤'],
      restaurants: [],
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      isPreparing: true
    }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  // 팔로잉 데이터 변경시 친구 맛집 업데이트
  useEffect(() => {
    const friends = getFriendsDummyData();
    setFriendsPlaylists(friends);
  }, [followingUsers]);

  // 실시간 통계 업데이트 리스너
  useEffect(() => {
    const handleStatsUpdate = (event: any) => {
      console.log('[MobileHomeSoundCloud] Stats update event received:', event.detail);

      // 인증 플레이리스트 업데이트
      setCertifiedPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) => {
          const stats = playlistDataManager.getPlaylistStats(playlist.id || playlist._id);
          console.log(`[MobileHomeSoundCloud] Updating certified playlist ${playlist.id}:`, stats);
          return {
            ...playlist,
            viewCount: stats.viewCount,
            likeCount: stats.likeCount,
            saveCount: stats.saveCount,
            isLiked: stats.isLiked,
            isSaved: stats.isSaved
          };
        })
      );

      // 친구 플레이리스트 업데이트
      setFriendsPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) => {
          const stats = playlistDataManager.getPlaylistStats(playlist.id || playlist._id);
          console.log(`[MobileHomeSoundCloud] Updating friend playlist ${playlist.id}:`, stats);
          return {
            ...playlist,
            viewCount: stats.viewCount,
            likeCount: stats.likeCount,
            saveCount: stats.saveCount,
            isLiked: stats.isLiked,
            isSaved: stats.isSaved
          };
        })
      );
    };

    window.addEventListener('playlistStats:update', handleStatsUpdate);
    console.log('[MobileHomeSoundCloud] Stats update listener registered');
    return () => {
      window.removeEventListener('playlistStats:update', handleStatsUpdate);
      console.log('[MobileHomeSoundCloud] Stats update listener removed');
    };
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    console.log('[MobileHomeSoundCloud] Loading initial data...');

    // 더미 데이터 사용 (팔로잉 데이터는 동적으로 생성)
    const certified = getCertifiedDummyData();
    const friends = getFriendsDummyData();
    const community = getCommunityDummyData();

    // 중앙 관리 시스템에서 통계 가져와서 모든 플레이리스트 업데이트
    let updatedCertified = certified.map((playlist: any) => {
      const stats = playlistDataManager.getPlaylistStats(playlist.id || playlist._id);
      console.log(`[MobileHomeSoundCloud] Loading stats for certified playlist ${playlist.id}:`, stats);
      return {
        ...playlist,
        likeCount: stats.likeCount,
        saveCount: stats.saveCount,
        viewCount: stats.viewCount,
        isLiked: stats.isLiked,
        isSaved: stats.isSaved
      };
    });

    // 사용자 음식 선호도에 따라 플레이리스트 정렬
    if (user?.preferredFoods && user.preferredFoods.length > 0) {
      console.log('[MobileHomeSoundCloud] Sorting by user food preferences:', user.preferredFoods);

      // 음식 카테고리 매핑
      const categoryMap: { [key: string]: string[] } = {
        korean: ['한식', '한정식', '전통'],
        chinese: ['중식', '중국', '짜장면', '짬뽕'],
        japanese: ['일식', '스시', '라멘', '일본'],
        western: ['양식', '스테이크', '파스타', '이탈리안'],
        asian: ['아시안', '베트남', '태국', '인도'],
        cafe: ['카페', '커피', '브런치', '베이커리'],
        dessert: ['디저트', '케이크', '빙수', '아이스크림'],
        chicken: ['치킨', '닭', '후라이드'],
        pizza: ['피자', '이탈리안'],
        burger: ['버거', '수제버거', '패티'],
        meat: ['고기', '삼겹살', 'BBQ', '구이'],
        seafood: ['해물', '해산물', '수산물', '회'],
        noodles: ['면', '라면', '국수', '우동'],
        snack: ['분식', '떡볶이', '김밥', '순대'],
        bar: ['술집', '포차', '이자카야', '바'],
        fastfood: ['패스트푸드', '맥도날드', 'KFC']
      };

      updatedCertified = updatedCertified.sort((a, b) => {
        // 각 플레이리스트의 선호도 점수 계산
        const getPreferenceScore = (playlist: any) => {
          let score = 0;
          const playlistText = `${playlist.name} ${playlist.description} ${playlist.tags?.join(' ')} ${playlist.restaurants?.map((r: any) => r.restaurant?.category).join(' ')}`.toLowerCase();

          user.preferredFoods?.forEach((foodId, index) => {
            const weight = user.preferredFoods!.length - index; // 높은 순위일수록 높은 가중치
            const keywords = categoryMap[foodId] || [];

            if (keywords.some(keyword => playlistText.includes(keyword.toLowerCase()))) {
              score += weight * 10;
            }
          });

          return score;
        };

        return getPreferenceScore(b) - getPreferenceScore(a);
      });

      console.log('[MobileHomeSoundCloud] Playlists sorted by preferences');
    }

    console.log('[MobileHomeSoundCloud] Certified playlists loaded:', updatedCertified.length);
    console.log('[MobileHomeSoundCloud] Friend playlists loaded:', friends.length);

    setCertifiedPlaylists(updatedCertified);
    setFriendsPlaylists(friends); // friends는 이미 getFriendsDummyData()에서 stats 적용됨
    setCommunityPosts(community);
    setLoading(false);
  };

  const handleLikeToggle = async (playlistId: string, type: 'certified' | 'friends') => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }

    console.log(`[MobileHomeSoundCloud] Like toggle for playlist ${playlistId}`);
    // 중앙 관리 시스템 사용
    const isLiked = playlistDataManager.toggleLike(playlistId);

    // UI 업데이트
    const playlists = type === 'certified' ? certifiedPlaylists : friendsPlaylists;
    const setPlaylists = type === 'certified' ? setCertifiedPlaylists : setFriendsPlaylists;

    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        const stats = playlistDataManager.getPlaylistStats(playlistId);
        return {
          ...p,
          isLiked: stats.isLiked,
          likeCount: stats.likeCount
        };
      }
      return p;
    });

    setPlaylists(updatedPlaylists);

    toast.success(isLiked ? '좋아요!' : '좋아요 취소');
  };

  const handleSaveToggle = async (playlistId: string, type: 'certified' | 'friends') => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }

    // 중앙 관리 시스템 사용
    const isSaved = playlistDataManager.toggleSave(playlistId);

    // UI 업데이트
    const playlists = type === 'certified' ? certifiedPlaylists : friendsPlaylists;
    const setPlaylists = type === 'certified' ? setCertifiedPlaylists : setFriendsPlaylists;

    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        const stats = playlistDataManager.getPlaylistStats(playlistId);
        return {
          ...p,
          isSaved: stats.isSaved,
          saveCount: stats.saveCount
        };
      }
      return p;
    });

    setPlaylists(updatedPlaylists);

    toast.success(isSaved ? '저장했습니다!' : '저장 취소');
  };

  const handleFollow = (creator: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }
    
    if (isFollowing(creator)) {
      unfollowUser(creator);
      toast.success(`${creator}님을 언팔로우했습니다`);
    } else {
      followUser(creator, creator);
      toast.success(`${creator}님을 팔로우했습니다`);
    }
  };

  const getCurrentData = () => {
    switch (activeFilter) {
      case 'certified':
        return certifiedPlaylists;
      case 'friends':
        return friendsPlaylists;
      case 'community':
        return communityPosts;
      default:
        return [];
    }
  };

  const renderPlaylistCard = (playlist: any, type: 'certified' | 'friends') => (
    <motion.div
      key={playlist.id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        console.log(`[MobileHomeSoundCloud] Playlist clicked: ${playlist.id || playlist._id}`);
        // Increment view count using centralized data manager
        playlistDataManager.incrementViewCount(playlist.id || playlist._id);
        navigate(`/playlist/${playlist.id || playlist._id}`);
      }}
    >
      <div className="relative h-40 bg-gradient-to-br from-orange-400 to-red-500 overflow-hidden">
        {playlist.imageUrl || playlist.coverImage ? (
          <img
            src={playlist.imageUrl || playlist.coverImage}
            alt={playlist.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const fallbackImg = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
              if (e.currentTarget.src !== fallbackImg) {
                e.currentTarget.src = fallbackImg;
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        ) : (
          <img
            src={getUniquePlaylistImage(playlist)}
            alt={playlist.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Title overlay - 이미지 아래쪽에 위치 */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="font-bold text-white text-sm leading-tight drop-shadow-lg">
            {playlist.name}
          </h3>
          <p className="text-white/90 text-xs leading-tight mt-1 line-clamp-2">{playlist.description}</p>
        </div>
      </div>

      <div className="p-3">
        {/* Creator info - 작성자 정보 섹션 */}
        <div className="flex items-center justify-between mb-2">
          <div 
            className="flex items-center space-x-2 cursor-pointer flex-1 min-w-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${playlist.creator}`);
            }}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {playlist.creatorImage || (playlist.creator ? playlist.creator[0]?.toUpperCase() : 'B')}
            </div>
            <span className="text-sm font-medium truncate">{playlist.creator}</span>
            {playlist.isVerified && (
              <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFollow(playlist.creator);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isFollowing(playlist.creator)
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isFollowing(playlist.creator) ? '팔로잉' : '팔로우'}
          </button>
        </div>

        {/* Stats - 통계 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle(playlist.id, type);
              }}
              className="flex items-center space-x-0.5 hover:text-red-500 transition-colors"
            >
              {playlist.isLiked ? (
                <HeartIconSolid className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <HeartIcon className="w-3.5 h-3.5" />
              )}
              <span className="text-xs">{playlist.likeCount !== undefined ? playlist.likeCount : 0}</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveToggle(playlist.id, type);
              }}
              className="flex items-center space-x-0.5 hover:text-yellow-500 transition-colors"
            >
              {playlist.isSaved ? (
                <BookmarkIconSolid className="w-3.5 h-3.5 text-yellow-500" />
              ) : (
                <BookmarkIcon className="w-3.5 h-3.5" />
              )}
              <span className="text-xs">{playlist.saveCount !== undefined ? playlist.saveCount : 0}</span>
            </button>
            
            <div className="flex items-center space-x-0.5">
              <EyeIcon className="w-3.5 h-3.5" />
              <span className="text-xs">{playlist.viewCount !== undefined ? playlist.viewCount : 0}</span>
            </div>
          </div>
          
          <span className="text-xs">
            {playlist.restaurants?.length || 0}개 맛집
          </span>
        </div>

        {/* Tags */}
        {playlist.tags && (
          <div className="mt-2 flex flex-wrap gap-1">
            {playlist.tags.slice(0, 3).map((tag: string, idx: number) => (
              <span 
                key={idx}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderCommunityCard = (post: any) => (
    <motion.div
      key={post.id}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/community/post/${post.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold">
            {post.authorImage || post.author[0].toUpperCase()}
          </div>
          <div>
            <span className="font-medium text-sm">{post.author}</span>
            <div className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</div>
          </div>
        </div>
        
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          {post.type === 'review' && '리뷰'}
          {post.type === 'question' && '질문'}
          {post.type === 'tip' && '꿀팁'}
        </span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">{post.title}</h4>
      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <HeartIcon className="w-4 h-4" />
          <span>{post.likes || 0}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ChatBubbleLeftIcon className="w-4 h-4" />
          <span>{post.comments || 0}</span>
        </div>
        <div className="flex items-center space-x-1">
          <BookmarkIcon className="w-4 h-4" />
          <span>{post.saves || 0}</span>
        </div>
      </div>
    </motion.div>
  );

  // 디버그용 함수
  const handleDebugReset = () => {
    playlistDataManager.resetStats();
    loadInitialData();
    toast.success('통계가 초기화되었습니다');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              BobMap
            </h1>
            {/* 디버그 버튼 (임시) */}
            <button
              onClick={handleDebugReset}
              className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              title="통계 초기화 (디버그)"
            >
              🔄
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => setActiveFilter('certified')}
              className={`flex-1 py-2 px-1 rounded-lg font-medium transition-colors ${
                activeFilter === 'certified'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-0.5">
                <StarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs whitespace-nowrap">인증맛집</span>
              </div>
            </button>
            <button
              onClick={() => setActiveFilter('friends')}
              className={`flex-1 py-2 px-1 rounded-lg font-medium transition-colors ${
                activeFilter === 'friends'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-0.5">
                <UserPlusIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs whitespace-nowrap">친구맛집</span>
              </div>
            </button>
            <button
              onClick={() => setActiveFilter('community')}
              className={`flex-1 py-2 px-1 rounded-lg font-medium transition-colors ${
                activeFilter === 'community'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-0.5">
                <SparklesIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs whitespace-nowrap">추천맛집</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeFilter === 'community' ? (
              // 추천맛집 - 서비스 준비중
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">추천 맛집 서비스 준비중</h3>
                <p className="text-sm text-gray-600 mb-4">
                  사용자들의 데이터를 기반으로 맞춤 추천을 준비하고 있습니다.
                </p>
                <p className="text-xs text-gray-500">
                  빠른 시일 내에 오픈 예정입니다!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {getCurrentData().map(playlist => 
                  renderPlaylistCard(playlist, activeFilter as 'certified' | 'friends')
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHomeSoundCloud;