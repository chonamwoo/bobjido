import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookmarkIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  FunnelIcon,
  FolderIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getRestaurantImage, getDefaultRestaurantImage } from '../utils/restaurantImages';

const SavedList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'collections'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'name'>('recent');

  const [restaurantImages, setRestaurantImages] = useState<{ [key: number]: string }>({});
  
  const mockSavedItems = [
    // 특별한 날 카테고리
    {
      id: 1,
      name: '스시 오마카세 긴자',
      category: '일식',
      rating: 4.8,
      savedDate: '2024-03-15',
      address: '강남구 청담동',
      priceRange: '₩₩₩₩',
      image: '',
      isFavorite: true,
      collection: '특별한 날'
    },
    {
      id: 2,
      name: '르브르 프렌치',
      category: '프렌치',
      rating: 4.9,
      savedDate: '2024-03-10',
      address: '강남구 신사동',
      priceRange: '₩₩₩₩',
      image: '',
      isFavorite: true,
      collection: '특별한 날'
    },
    {
      id: 3,
      name: '정식당',
      category: '한정식',
      rating: 4.7,
      savedDate: '2024-03-08',
      address: '종로구 삼청동',
      priceRange: '₩₩₩₩',
      image: '',
      isFavorite: false,
      collection: '특별한 날'
    },
    
    // 데이트 맛집 카테고리
    {
      id: 4,
      name: '파스타 부띠끄',
      category: '이탈리안',
      rating: 4.5,
      savedDate: '2024-03-14',
      address: '용산구 이태원동',
      priceRange: '₩₩₩',
      image: '',
      isFavorite: false,
      collection: '데이트 맛집'
    },
    {
      id: 5,
      name: '더 테라스 루프탑',
      category: '퓨전',
      rating: 4.6,
      savedDate: '2024-03-12',
      address: '성동구 성수동',
      priceRange: '₩₩₩',
      image: '',
      isFavorite: true,
      collection: '데이트 맛집'
    },
    {
      id: 6,
      name: '카페 드 파리',
      category: '카페',
      rating: 4.4,
      savedDate: '2024-03-11',
      address: '서초구 서초동',
      priceRange: '₩₩',
      image: '',
      isFavorite: false,
      collection: '데이트 맛집'
    },
    {
      id: 7,
      name: '와인바 르빈',
      category: '와인바',
      rating: 4.7,
      savedDate: '2024-03-09',
      address: '강남구 압구정동',
      priceRange: '₩₩₩',
      image: '',
      isFavorite: true,
      collection: '데이트 맛집'
    },
    
    // 매운맛 도전 카테고리
    {
      id: 8,
      name: '매운떡볶이 신전',
      category: '분식',
      rating: 4.3,
      savedDate: '2024-03-13',
      address: '신림동',
      priceRange: '₩',
      image: '',
      isFavorite: false,
      collection: '매운맛 도전'
    },
    {
      id: 9,
      name: '불타는 닭발',
      category: '한식',
      rating: 4.5,
      savedDate: '2024-03-07',
      address: '강남구 역삼동',
      priceRange: '₩₩',
      image: '',
      isFavorite: true,
      collection: '매운맛 도전'
    },
    {
      id: 10,
      name: '쓰천 마라탕',
      category: '중식',
      rating: 4.6,
      savedDate: '2024-03-06',
      address: '마포구 공덕동',
      priceRange: '₩₩',
      image: '',
      isFavorite: false,
      collection: '매운맛 도전'
    },
    {
      id: 11,
      name: '지옥불닭',
      category: '한식',
      rating: 4.4,
      savedDate: '2024-03-05',
      address: '종로구 종로3가',
      priceRange: '₩₩',
      image: '',
      isFavorite: true,
      collection: '매운맛 도전'
    },
    
    // 혼밥 맛집 카테고리
    {
      id: 12,
      name: '돈까스 전문점',
      category: '일식',
      rating: 4.4,
      savedDate: '2024-03-04',
      address: '종로구 종각',
      priceRange: '₩₩',
      image: '',
      isFavorite: false,
      collection: '혼밥 맛집'
    },
    {
      id: 13,
      name: '김밥천국',
      category: '분식',
      rating: 4.2,
      savedDate: '2024-03-03',
      address: '강남구 강남역',
      priceRange: '₩',
      image: '',
      isFavorite: false,
      collection: '혼밥 맛집'
    },
    {
      id: 14,
      name: '라면 전문점',
      category: '일식',
      rating: 4.3,
      savedDate: '2024-03-02',
      address: '종로구 명동',
      priceRange: '₩',
      image: '',
      isFavorite: true,
      collection: '혼밥 맛집'
    },
    {
      id: 15,
      name: '한우 명가',
      category: '한식',
      rating: 4.7,
      savedDate: '2024-03-13',
      address: '마포구 연남동',
      priceRange: '₩₩₩',
      image: '',
      isFavorite: true,
      collection: '회식 장소'
    },
    {
      id: 16,
      name: '삼겹살 마을',
      category: '한식',
      rating: 4.5,
      savedDate: '2024-03-01',
      address: '강남구 논현동',
      priceRange: '₩₩',
      image: '',
      isFavorite: false,
      collection: '회식 장소'
    },
    {
      id: 17,
      name: '대패 삼겹살',
      category: '한식',
      rating: 4.6,
      savedDate: '2024-02-28',
      address: '서초구 방배동',
      priceRange: '₩₩',
      image: '',
      isFavorite: true,
      collection: '회식 장소'
    }
  ];
  
  // 레스토랑 이미지 로드
  useEffect(() => {
    const loadImages = async () => {
      const images: { [key: number]: string } = {};
      
      for (const item of mockSavedItems) {
        try {
          const image = await getRestaurantImage(item.name);
          images[item.id] = image;
        } catch (error) {
          images[item.id] = getDefaultRestaurantImage(item.name);
        }
      }
      
      setRestaurantImages(images);
    };
    
    loadImages();
  }, []);

  const [collectionImages, setCollectionImages] = useState<{ [key: number]: string[] }>({});
  
  const mockCollections = [
    { id: 1, name: '특별한 날', count: 3, color: 'purple', restaurants: ['스시 오마카세 긴자', '르브르 프렌치', '정식당', '한우 구이'] },
    { id: 2, name: '데이트 맛집', count: 4, color: 'pink', restaurants: ['파스타 부띠끄', '더 테라스 루프탑', '카페 드 파리', '와인바 르빈'] },
    { id: 3, name: '매운맛 도전', count: 4, color: 'red', restaurants: ['매운떡볶이 신전', '불타는 닭발', '쓰천 마라탕', '지옥불닭'] },
    { id: 4, name: '혼밥 맛집', count: 3, color: 'green', restaurants: ['돈까스 전문점', '김밥천국', '라면 전문점', '패스트푸드'] },
    { id: 5, name: '회식 장소', count: 3, color: 'blue', restaurants: ['한우 명가', '삼겹살 마을', '대패 삼겹살', '중화요리'] }
  ];
  
  // 컨렉션 이미지 로드
  useEffect(() => {
    const loadCollectionImages = async () => {
      const images: { [key: number]: string[] } = {};
      
      for (const collection of mockCollections) {
        const collImages: string[] = [];
        // 각 컨렉션당 4개의 이미지만 로드
        for (let i = 0; i < Math.min(4, collection.restaurants.length); i++) {
          try {
            const image = await getRestaurantImage(collection.restaurants[i]);
            collImages.push(image);
          } catch (error) {
            collImages.push(getDefaultRestaurantImage(collection.restaurants[i]));
          }
        }
        images[collection.id] = collImages;
      }
      
      setCollectionImages(images);
    };
    
    loadCollectionImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <BookmarkIcon className="w-12 h-12 text-purple-600" />
              <HeartIcon className="absolute -top-2 -right-2 w-6 h-6 text-pink-500 fill-pink-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              저장한 맛집
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            마음에 드는 맛집을 저장하고 컬렉션으로 관리해보세요
          </p>
        </motion.div>

        {/* 준비중 안내 배너 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <ClockIcon className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-1">📌 준비 중입니다!</h3>
              <p className="text-purple-100">
                저장 기능이 곧 활성화됩니다. 맛집을 저장하고 나만의 컬렉션을 만들어보세요!
              </p>
            </div>
          </div>
        </motion.div>

        {/* 통계 카드 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600">42</div>
            <div className="text-sm text-gray-600">전체 저장</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-pink-600">18</div>
            <div className="text-sm text-gray-600">즐겨찾기</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">4</div>
            <div className="text-sm text-gray-600">컬렉션</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">7</div>
            <div className="text-sm text-gray-600">이번 달 추가</div>
          </div>
        </motion.div>

        {/* 탭 & 필터 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                즐겨찾기
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'collections'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                컬렉션
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                <ArrowsUpDownIcon className="w-5 h-5 inline mr-1" />
                정렬
              </button>
              <button className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                <FunnelIcon className="w-5 h-5 inline mr-1" />
                필터
              </button>
            </div>
          </div>
        </motion.div>

        {/* 컨텐츠 */}
        {activeTab === 'collections' ? (
          /* 컬렉션 뷰 */
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {mockCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${collection.color}-100 rounded-lg flex items-center justify-center`}>
                      <FolderIcon className={`w-6 h-6 text-${collection.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{collection.name}</h3>
                      <p className="text-sm text-gray-500">{collection.count}개 맛집</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {collectionImages[collection.id] ? (
                    collectionImages[collection.id].map((image, i) => (
                      <img
                        key={i}
                        src={image}
                        alt={`Restaurant ${i + 1}`}
                        className="aspect-square object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = getDefaultRestaurantImage(collection.restaurants[i]);
                        }}
                      />
                    ))
                  ) : (
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
                    ))
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed">
                    보기
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed">
                    편집
                  </button>
                </div>
              </motion.div>
            ))}
            
            {/* 새 컬렉션 추가 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center cursor-not-allowed"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PlusIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-400 font-medium">새 컬렉션 만들기</p>
              </div>
            </motion.div>
          </div>
        ) : (
          /* 맛집 리스트 뷰 */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {mockSavedItems
              .filter(item => activeTab === 'all' || (activeTab === 'favorites' && item.isFavorite))
              .map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {restaurantImages[item.id] ? (
                    <img
                      src={restaurantImages[item.id]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = getDefaultRestaurantImage(item.name);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      {item.isFavorite ? (
                        <HeartIcon className="w-5 h-5 text-pink-500 fill-pink-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-white/90 rounded text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <StarIconSolid className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium ml-1">{item.rating}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600">{item.priceRange}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{item.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{item.collection}</span>
                    <span>{item.savedDate}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-400 rounded text-sm cursor-not-allowed">
                      상세보기
                    </button>
                    <button className="px-3 py-2 text-gray-400 hover:text-red-500">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 기능 소개 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FolderIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">스마트 컬렉션</h3>
            <p className="text-sm text-gray-600">
              테마별로 맛집을 정리하고 친구들과 공유해보세요
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HeartIcon className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">즐겨찾기</h3>
            <p className="text-sm text-gray-600">
              자주 가는 맛집을 즐겨찾기에 추가하고 빠르게 찾아보세요
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShareIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">공유하기</h3>
            <p className="text-sm text-gray-600">
              나만의 맛집 리스트를 친구들과 쉽게 공유할 수 있어요
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SavedList;