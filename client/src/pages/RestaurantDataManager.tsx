import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import realRestaurantsData from '../data/realRestaurants.json';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  priceRange: string;
  location: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  tags: string[];
  image: string;
  coordinates: { lat: number; lng: number };
}

interface CategoryData {
  title: string;
  description: string;
  restaurants: Restaurant[];
}

type Categories = {
  [key: string]: CategoryData;
}

const RestaurantDataManager: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.isAdmin || user?.username === 'Admin' || user?.email === 'admin@bobmap.com';
  
  const [data, setData] = useState<{
    lastUpdated: string;
    categories: Categories;
    metadata: {
      totalRestaurants: number;
      lastModified: string;
      version: string;
    };
  }>(realRestaurantsData as any);
  const [selectedCategory, setSelectedCategory] = useState<string>('michelin');
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Restaurant>({
    id: '',
    name: '',
    category: '',
    rating: 0,
    priceRange: '',
    location: '',
    address: '',
    phone: '',
    hours: '',
    description: '',
    tags: [],
    image: '',
    coordinates: { lat: 0, lng: 0 }
  });

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem('restaurantData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  // 데이터 저장
  const saveData = () => {
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString().split('T')[0],
      metadata: {
        ...data.metadata,
        lastModified: new Date().toISOString(),
        totalRestaurants: Object.values(data.categories).reduce(
          (acc, cat) => acc + cat.restaurants.length, 0
        )
      }
    };
    localStorage.setItem('restaurantData', JSON.stringify(updatedData));
    setData(updatedData);
    alert('데이터가 저장되었습니다!');
  };

  // 레스토랑 추가/수정
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedCategories = { ...data.categories };
    
    if (isAddingNew) {
      // 새 레스토랑 추가
      const newId = `${selectedCategory}_${Date.now()}`;
      const newRestaurant = { ...formData, id: newId };
      updatedCategories[selectedCategory].restaurants.push(newRestaurant);
    } else if (editingRestaurant) {
      // 기존 레스토랑 수정
      const restaurantIndex = updatedCategories[selectedCategory].restaurants.findIndex(
        r => r.id === editingRestaurant.id
      );
      if (restaurantIndex !== -1) {
        updatedCategories[selectedCategory].restaurants[restaurantIndex] = formData;
      }
    }

    setData({ ...data, categories: updatedCategories });
    setEditingRestaurant(null);
    setIsAddingNew(false);
    resetForm();
    saveData();
  };

  // 레스토랑 삭제
  const handleDelete = (restaurantId: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updatedCategories = { ...data.categories };
      updatedCategories[selectedCategory].restaurants = 
        updatedCategories[selectedCategory].restaurants.filter(r => r.id !== restaurantId);
      
      setData({ ...data, categories: updatedCategories });
      saveData();
    }
  };

  // 폼 리셋
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      category: '',
      rating: 0,
      priceRange: '',
      location: '',
      address: '',
      phone: '',
      hours: '',
      description: '',
      tags: [],
      image: '',
      coordinates: { lat: 0, lng: 0 }
    });
  };

  // 데이터 내보내기
  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `restaurants_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // 데이터 가져오기
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          setData(importedData);
          localStorage.setItem('restaurantData', JSON.stringify(importedData));
          alert('데이터를 성공적으로 가져왔습니다!');
        } catch (error) {
          alert('파일 형식이 올바르지 않습니다.');
        }
      };
      reader.readAsText(file);
    }
  };

  // 관리자가 아니면 접근 차단
  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <LockClosedIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">접근 권한 없음</h2>
            <p className="text-gray-600 mb-6">
              이 페이지는 관리자만 접근할 수 있습니다.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">맛집 데이터 관리</h1>
            <p className="text-sm text-gray-600 mt-1">관리자 전용 페이지</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              내보내기
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
              <ArrowUpTrayIcon className="w-5 h-5" />
              가져오기
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button
              onClick={saveData}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              저장
            </button>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 mb-6 border-b">
          {Object.keys(data.categories).map(key => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 ${
                selectedCategory === key 
                  ? 'border-b-2 border-orange-500 text-orange-600' 
                  : 'text-gray-600'
              }`}
            >
              {data.categories[key as keyof typeof data.categories].title}
            </button>
          ))}
        </div>

        {/* 레스토랑 리스트 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {data.categories[selectedCategory].title}
            </h2>
            <button
              onClick={() => {
                setIsAddingNew(true);
                resetForm();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <PlusIcon className="w-5 h-5" />
              새 맛집 추가
            </button>
          </div>

          <div className="grid gap-4">
            {data.categories[selectedCategory].restaurants.map(restaurant => (
              <div key={restaurant.id} className="border rounded-lg p-4 hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                    <p className="text-gray-600">{restaurant.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>📍 {restaurant.address}</p>
                      <p>📞 {restaurant.phone}</p>
                      <p>⏰ {restaurant.hours}</p>
                      <p>💰 {restaurant.priceRange}</p>
                      <div className="flex gap-1 mt-1">
                        {restaurant.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRestaurant(restaurant);
                        setFormData(restaurant);
                        setIsAddingNew(false);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추가/수정 폼 */}
        {(editingRestaurant || isAddingNew) && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingNew ? '새 맛집 추가' : '맛집 정보 수정'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="맛집 이름"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="카테고리 (한식, 일식, 양식 등)"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="주소"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="px-3 py-2 border rounded col-span-2"
                required
              />
              <input
                type="text"
                placeholder="전화번호"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="영업시간"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="가격대 (₩, ₩₩, ₩₩₩, ₩₩₩₩)"
                value={formData.priceRange}
                onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="지역 (강남구, 종로구 등)"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="평점"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                className="px-3 py-2 border rounded"
                min="0"
                max="5"
                step="0.1"
              />
              <input
                type="text"
                placeholder="이미지 URL"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <textarea
                placeholder="설명"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="px-3 py-2 border rounded col-span-2"
                rows={3}
              />
              <input
                type="text"
                placeholder="태그 (쉼표로 구분)"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                className="px-3 py-2 border rounded col-span-2"
              />
              <div className="col-span-2 flex gap-2">
                <input
                  type="number"
                  placeholder="위도"
                  value={formData.coordinates.lat}
                  onChange={(e) => setFormData({...formData, coordinates: {...formData.coordinates, lat: parseFloat(e.target.value)}})}
                  className="px-3 py-2 border rounded flex-1"
                  step="0.0001"
                />
                <input
                  type="number"
                  placeholder="경도"
                  value={formData.coordinates.lng}
                  onChange={(e) => setFormData({...formData, coordinates: {...formData.coordinates, lng: parseFloat(e.target.value)}})}
                  className="px-3 py-2 border rounded flex-1"
                  step="0.0001"
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isAddingNew ? '추가' : '수정'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRestaurant(null);
                    setIsAddingNew(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 통계 */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-orange-600">{data.metadata.totalRestaurants}</p>
              <p className="text-gray-600">전체 맛집</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {Object.keys(data.categories).length}
              </p>
              <p className="text-gray-600">카테고리</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">마지막 업데이트</p>
              <p className="text-gray-700">{data.lastUpdated}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">버전</p>
              <p className="text-gray-700">{data.metadata.version}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDataManager;