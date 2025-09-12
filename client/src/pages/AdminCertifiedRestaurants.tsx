import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon,
  SparklesIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  NewspaperIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

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
  icon?: string;
  color?: string;
  restaurants: Restaurant[];
}

type Categories = {
  [key: string]: CategoryData;
}

const AdminCertifiedRestaurants: React.FC = () => {
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
  }>({
    lastUpdated: new Date().toISOString().split('T')[0],
    categories: {},
    metadata: {
      totalRestaurants: 0,
      lastModified: new Date().toISOString(),
      version: '1.0.0'
    }
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ title: '', description: '', icon: '', color: '' });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryKey, setNewCategoryKey] = useState('');
  
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

  // 기본 아이콘과 색상
  const defaultIcons = {
    michelin: '⭐',
    masterChef: '👨‍🍳',
    blackBook: '📖',
    bluRibbon: '🎖️',
    local: '🏘️'
  };

  const defaultColors = {
    michelin: 'from-yellow-500 to-orange-500',
    masterChef: 'from-red-500 to-pink-500',
    blackBook: 'from-purple-500 to-indigo-500',
    bluRibbon: 'from-blue-500 to-cyan-500',
    local: 'from-green-500 to-emerald-500'
  };

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem('restaurantData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
      if (Object.keys(parsedData.categories).length > 0) {
        setSelectedCategory(Object.keys(parsedData.categories)[0]);
      }
    } else {
      // 기본 카테고리 생성
      const defaultData = {
        lastUpdated: new Date().toISOString().split('T')[0],
        categories: {
          michelin: {
            title: '미쉐린 가이드 선정 맛집',
            description: '미쉐린 가이드 선정 레스토랑',
            icon: '⭐',
            color: 'from-yellow-500 to-orange-500',
            restaurants: []
          },
          masterChef: {
            title: '생활의 달인 인정 맛집',
            description: 'SBS 생활의 달인 방송 출연 맛집',
            icon: '👨‍🍳',
            color: 'from-red-500 to-pink-500',
            restaurants: []
          },
          blackBook: {
            title: '수요미식회 블랙북',
            description: 'tvN 수요미식회 추천 맛집',
            icon: '📖',
            color: 'from-purple-500 to-indigo-500',
            restaurants: []
          },
          bluRibbon: {
            title: '블루리본 서베이',
            description: '블루리본 서베이 선정 맛집',
            icon: '🎖️',
            color: 'from-blue-500 to-cyan-500',
            restaurants: []
          }
        },
        metadata: {
          totalRestaurants: 0,
          lastModified: new Date().toISOString(),
          version: '1.0.0'
        }
      };
      setData(defaultData);
      localStorage.setItem('restaurantData', JSON.stringify(defaultData));
      setSelectedCategory('michelin');
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
    
    // 모바일 앱에도 반영되도록 이벤트 발생
    window.dispatchEvent(new Event('restaurantDataUpdated'));
    toast.success('데이터가 저장되었습니다!');
  };

  // 카테고리 추가
  const handleAddCategory = () => {
    if (!categoryForm.title) {
      toast.error('맛집 리스트 이름을 입력해주세요');
      return;
    }
    
    // 자동으로 키 생성 (사용자가 입력한 이름 기반)
    const categoryKey = newCategoryKey || categoryForm.title.toLowerCase()
      .replace(/[^가-힣a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30) || 'new_list_' + Date.now();
    
    if (data.categories[categoryKey]) {
      toast.error('이미 존재하는 맛집 리스트입니다. 다른 이름을 사용해주세요.');
      return;
    }
    
    const updatedCategories = {
      ...data.categories,
      [categoryKey]: {
        title: categoryForm.title,
        description: categoryForm.description || `${categoryForm.title} 맛집 모음`,
        icon: categoryForm.icon || '🍽️',
        color: categoryForm.color || 'from-purple-500 to-pink-500',
        restaurants: []
      }
    };
    
    setData({ ...data, categories: updatedCategories });
    setSelectedCategory(categoryKey);
    setIsAddingCategory(false);
    setNewCategoryKey('');
    setCategoryForm({ title: '', description: '', icon: '', color: '' });
    
    // 저장 후 성공 메시지
    const updatedData = { ...data, categories: updatedCategories };
    localStorage.setItem('certified_restaurants_data', JSON.stringify(updatedData));
    toast.success(`✅ "${categoryForm.title}" 맛집 리스트가 생성되었습니다!`);
  };

  // 카테고리 수정
  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    
    const updatedCategories = {
      ...data.categories,
      [editingCategory]: {
        ...data.categories[editingCategory],
        title: categoryForm.title,
        description: categoryForm.description,
        icon: categoryForm.icon || data.categories[editingCategory].icon,
        color: categoryForm.color || data.categories[editingCategory].color
      }
    };
    
    setData({ ...data, categories: updatedCategories });
    setEditingCategory(null);
    setCategoryForm({ title: '', description: '', icon: '', color: '' });
    saveData();
  };

  // 카테고리 삭제
  const handleDeleteCategory = (categoryKey: string) => {
    if (window.confirm(`정말 "${data.categories[categoryKey].title}" 카테고리를 삭제하시겠습니까? 모든 맛집 데이터가 삭제됩니다.`)) {
      const updatedCategories = { ...data.categories };
      delete updatedCategories[categoryKey];
      
      setData({ ...data, categories: updatedCategories });
      
      // 다른 카테고리 선택
      const remainingKeys = Object.keys(updatedCategories);
      if (remainingKeys.length > 0) {
        setSelectedCategory(remainingKeys[0]);
      } else {
        setSelectedCategory('');
      }
      
      saveData();
    }
  };

  // 레스토랑 추가/수정
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedCategories = { ...data.categories };
    
    if (isAddingNew) {
      const newId = `${selectedCategory}_${Date.now()}`;
      const newRestaurant = { ...formData, id: newId };
      updatedCategories[selectedCategory].restaurants.push(newRestaurant);
    } else if (editingRestaurant) {
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
          if (Object.keys(importedData.categories).length > 0) {
            setSelectedCategory(Object.keys(importedData.categories)[0]);
          }
          toast.success('데이터를 성공적으로 가져왔습니다!');
        } catch (error) {
          toast.error('파일 형식이 올바르지 않습니다.');
        }
      };
      reader.readAsText(file);
    }
  };

  // 관리자가 아니면 접근 차단
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XMarkIcon className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">접근 권한 없음</h2>
            <p className="text-gray-600 mb-6">
              이 페이지는 관리자만 접근할 수 있습니다.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* 관리자 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <CogIcon className="w-8 h-8 text-white mr-3" />
              <h1 className="text-white text-xl font-bold">관리자 대시보드</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <ChartBarIcon className="w-4 h-4 mr-1" />
                통계
              </button>
              <button
                onClick={() => navigate('/admin-users')}
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <UserGroupIcon className="w-4 h-4 mr-1" />
                사용자
              </button>
              <button
                className="text-white bg-white/20 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <BuildingStorefrontIcon className="w-4 h-4 mr-1" />
                인증 맛집
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <CogIcon className="w-4 h-4 mr-1" />
                설정
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* 도구 모음 */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">인증 맛집 관리</h2>
                <p className="text-sm text-gray-600 mt-1">미디어 및 인증 기관에서 선정한 맛집 데이터 관리</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  내보내기
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer transition-colors">
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  가져오기
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
                <button
                  onClick={saveData}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  저장
                </button>
              </div>
            </div>
          </div>

          {/* 카테고리 관리 섹션 */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
                카테고리 관리
              </h3>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                새 카테고리
              </button>
            </div>

            {/* 카테고리 탭 */}
            <div className="flex gap-2 flex-wrap">
              {Object.keys(data.categories).map(key => (
                <div key={key} className="relative group">
                  <button
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      selectedCategory === key 
                        ? 'bg-gradient-to-r text-white shadow-lg' 
                        : 'bg-white text-gray-700 hover:shadow-md'
                    }`}
                    style={selectedCategory === key ? {
                      background: 'linear-gradient(to right, #f97316, #ef4444)'
                    } as React.CSSProperties : {}}
                  >
                    <span className="text-lg">{data.categories[key].icon || defaultIcons[key as keyof typeof defaultIcons] || '🍽️'}</span>
                    <span className="font-medium">{data.categories[key].title}</span>
                    <span className="text-xs opacity-75">({data.categories[key].restaurants.length})</span>
                  </button>
                  
                  {/* 카테고리 편집/삭제 버튼 */}
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => {
                        setEditingCategory(key);
                        setCategoryForm({
                          title: data.categories[key].title,
                          description: data.categories[key].description,
                          icon: data.categories[key].icon || '',
                          color: data.categories[key].color || ''
                        });
                      }}
                      className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                    >
                      <PencilIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(key)}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 카테고리 추가 폼 */}
            {isAddingCategory && (
              <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-200">
                <h4 className="font-medium mb-3 text-purple-700">🎯 새 맛집 리스트 만들기</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">리스트 이름 (예: 2024 미쉐린 가이드)</label>
                    <input
                      type="text"
                      placeholder="새 맛집 리스트 이름을 입력하세요"
                      value={categoryForm.title}
                      onChange={(e) => {
                        setCategoryForm({...categoryForm, title: e.target.value});
                        // 자동으로 ID 생성
                        const autoId = e.target.value.toLowerCase()
                          .replace(/[^가-힣a-z0-9\s]/g, '')
                          .replace(/\s+/g, '_')
                          .substring(0, 30);
                        setNewCategoryKey(autoId || 'new_list');
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">설명</label>
                      <input
                        type="text"
                        placeholder="리스트 설명"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">아이콘 (이모지)</label>
                      <input
                        type="text"
                        placeholder="🍽️"
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddCategory}
                      disabled={!categoryForm.title}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      리스트 만들기
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryKey('');
                        setCategoryForm({ title: '', description: '', icon: '', color: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 카테고리 수정 폼 */}
            {editingCategory && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <h4 className="font-medium mb-3">카테고리 수정: {editingCategory}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="카테고리 이름"
                    value={categoryForm.title}
                    onChange={(e) => setCategoryForm({...categoryForm, title: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="설명"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="아이콘 (이모지)"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleUpdateCategory}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    수정 완료
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ title: '', description: '', icon: '', color: '' });
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 레스토랑 리스트 */}
          {selectedCategory && data.categories[selectedCategory] && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold flex items-center">
                    <span className="text-2xl mr-2">{data.categories[selectedCategory].icon || '🍽️'}</span>
                    {data.categories[selectedCategory].title}
                  </h3>
                  <p className="text-sm text-gray-600">{data.categories[selectedCategory].description}</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingNew(true);
                    resetForm();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  <PlusIcon className="w-5 h-5" />
                  새 맛집 추가
                </button>
              </div>

              <div className="grid gap-4">
                {data.categories[selectedCategory].restaurants.map(restaurant => (
                  <div key={restaurant.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{restaurant.name}</h4>
                        <p className="text-gray-600 mt-1">{restaurant.description}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <p className="flex items-center">📍 {restaurant.address}</p>
                          <p className="flex items-center">📞 {restaurant.phone}</p>
                          <p className="flex items-center">⏰ {restaurant.hours}</p>
                          <p className="flex items-center">💰 {restaurant.priceRange}</p>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {restaurant.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingRestaurant(restaurant);
                            setFormData(restaurant);
                            setIsAddingNew(false);
                          }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(restaurant.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 추가/수정 폼 */}
              {(editingRestaurant || isAddingNew) && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {isAddingNew ? '새 맛집 추가' : '맛집 정보 수정'}
                  </h3>
                  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="맛집 이름"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="px-3 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="카테고리 (한식, 일식, 양식 등)"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="px-3 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="주소"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="px-3 py-2 border rounded-lg col-span-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="전화번호"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="영업시간"
                      value={formData.hours}
                      onChange={(e) => setFormData({...formData, hours: e.target.value})}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="가격대 (₩, ₩₩, ₩₩₩, ₩₩₩₩)"
                      value={formData.priceRange}
                      onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="지역 (강남구, 종로구 등)"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="평점"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                      className="px-3 py-2 border rounded-lg"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    <input
                      type="text"
                      placeholder="이미지 URL"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <textarea
                      placeholder="설명"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="px-3 py-2 border rounded-lg col-span-2"
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="태그 (쉼표로 구분)"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                      className="px-3 py-2 border rounded-lg col-span-2"
                    />
                    <div className="col-span-2 flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
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
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* 통계 */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <p className="text-3xl font-bold text-orange-600">{data.metadata.totalRestaurants}</p>
                <p className="text-gray-600 text-sm mt-1">전체 맛집</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-3xl font-bold text-blue-600">
                  {Object.keys(data.categories).length}
                </p>
                <p className="text-gray-600 text-sm mt-1">카테고리</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-500">마지막 업데이트</p>
                <p className="text-gray-700 font-medium">{data.lastUpdated}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-500">버전</p>
                <p className="text-gray-700 font-medium">{data.metadata.version}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCertifiedRestaurants;