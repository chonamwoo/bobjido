import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAxios from '../utils/adminAxios';
import toast from 'react-hot-toast';
import { 
  BuildingStorefrontIcon, 
  TrashIcon, 
  CheckBadgeIcon,
  MapPinIcon,
  ArrowPathIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  category: string;
  priceRange: string;
  averageRating: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdBy?: {
    username: string;
  };
  viewCount: number;
}

const AdminRestaurantManagement: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    loadRestaurants();
  }, [navigate]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get('/api/admin/restaurants');
      setRestaurants(response.data.restaurants || []);
    } catch (error: any) {
      console.error('Failed to load restaurants:', error);
      toast.error('맛집 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRestaurant = async (restaurantId: string, restaurantName: string) => {
    if (!window.confirm(`"${restaurantName}"을(를) 인증하시겠습니까?`)) {
      return;
    }

    try {
      await adminAxios.put(`/api/admin/restaurants/${restaurantId}/verify`, {
        isVerified: true
      });
      toast.success('맛집이 인증되었습니다');
      loadRestaurants();
    } catch (error: any) {
      toast.error('인증에 실패했습니다');
    }
  };

  const handleDeleteRestaurant = async (restaurantId: string, restaurantName: string) => {
    if (!window.confirm(`정말로 "${restaurantName}" 맛집을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await adminAxios.delete(`/api/admin/restaurants/${restaurantId}`);
      toast.success('맛집이 삭제되었습니다');
      loadRestaurants();
    } catch (error: any) {
      toast.error('맛집 삭제에 실패했습니다');
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          restaurant.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || restaurant.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    let aVal: any = a[sortBy as keyof Restaurant];
    let bVal: any = b[sortBy as keyof Restaurant];
    
    if (sortBy === 'createdAt') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const categories = ['all', '한식', '중식', '일식', '양식', '카페', '디저트', '주점', '패스트푸드', '동남아', '기타'];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">맛집 관리</h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              ← 대시보드로 돌아가기
            </button>
          </div>
          <button
            onClick={loadRestaurants}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            새로고침
          </button>
        </div>
        
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="맛집 검색 (이름, 주소)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? '모든 카테고리' : cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="createdAt">등록일</option>
            <option value="name">이름</option>
            <option value="averageRating">평점</option>
            <option value="reviewCount">리뷰수</option>
            <option value="viewCount">조회수</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '오름차순 ↑' : '내림차순 ↓'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">맛집 목록 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-2">
                    <BuildingStorefrontIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg">
                        {restaurant.name}
                        {restaurant.isVerified && (
                          <CheckBadgeIcon className="w-5 h-5 text-blue-500 inline ml-1" />
                        )}
                      </h3>
                      <p className="text-xs text-gray-500">ID: {restaurant._id.slice(-6)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    restaurant.category === '한식' ? 'bg-red-100 text-red-800' :
                    restaurant.category === '중식' ? 'bg-yellow-100 text-yellow-800' :
                    restaurant.category === '일식' ? 'bg-blue-100 text-blue-800' :
                    restaurant.category === '양식' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {restaurant.category}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>가격대: {restaurant.priceRange}</span>
                    <span>평점: ⭐ {restaurant.averageRating.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>리뷰 {restaurant.reviewCount}개</span>
                    <span>조회 {restaurant.viewCount}회</span>
                  </div>
                  
                  {restaurant.createdBy && (
                    <div className="text-xs">
                      등록자: {restaurant.createdBy.username}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400">
                    {new Date(restaurant.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {!restaurant.isVerified && (
                    <button
                      onClick={() => handleVerifyRestaurant(restaurant._id, restaurant.name)}
                      className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      인증
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/admin/restaurant/${restaurant._id}/edit`)}
                    className="flex-1 px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    <PencilIcon className="w-4 h-4 inline mr-1" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteRestaurant(restaurant._id, restaurant.name)}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {sortedRestaurants.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg">
            <BuildingStorefrontIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurantManagement;