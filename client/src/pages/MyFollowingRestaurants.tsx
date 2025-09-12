import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, HeartIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface Restaurant {
  _id: string;
  restaurant: {
    _id: string;
    name: string;
    category: string;
    address: string;
  };
}

interface FollowingList {
  _id: string;
  name: string;
  title: string;
  description: string;
  creator: {
    username: string;
    isVerified: boolean;
  };
  restaurants: Restaurant[];
  tags: string[];
  coverImage: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
}

const MyFollowingRestaurants: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [lists, setLists] = useState<FollowingList[]>([]);
  const [editingList, setEditingList] = useState<FollowingList | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    restaurants: [] as Restaurant[],
    tags: [] as string[],
    coverImage: ''
  });
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    category: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserLists();
  }, [user, navigate]);

  const loadUserLists = () => {
    const savedData = localStorage.getItem(`following_restaurants_${user?._id}`);
    if (savedData) {
      setLists(JSON.parse(savedData));
    } else {
      // 기본 샘플 리스트
      const defaultLists: FollowingList[] = [
        {
          _id: `following-${user?._id}-1`,
          name: '나의 단골 맛집',
          title: '자주 가는 최애 맛집들',
          description: '정말 맛있어서 계속 가게 되는 곳들',
          creator: {
            username: user?.username || '',
            isVerified: false
          },
          restaurants: [],
          tags: ['단골', '맛집'],
          coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
          likeCount: 0,
          viewCount: 0,
          createdAt: new Date().toISOString()
        }
      ];
      setLists(defaultLists);
      saveUserLists(defaultLists);
    }
  };

  const saveUserLists = (updatedLists: FollowingList[]) => {
    localStorage.setItem(`following_restaurants_${user?._id}`, JSON.stringify(updatedLists));
    setLists(updatedLists);
    toast.success('저장되었습니다!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAddingNew) {
      const newList: FollowingList = {
        _id: `following-${user?._id}-${Date.now()}`,
        name: formData.name,
        title: formData.title,
        description: formData.description,
        creator: {
          username: user?.username || '',
          isVerified: false
        },
        restaurants: formData.restaurants,
        tags: formData.tags,
        coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        likeCount: 0,
        viewCount: 0,
        createdAt: new Date().toISOString()
      };
      saveUserLists([...lists, newList]);
    } else if (editingList) {
      const updatedLists = lists.map(list =>
        list._id === editingList._id
          ? { ...list, ...formData }
          : list
      );
      saveUserLists(updatedLists);
    }
    
    resetForm();
  };

  const handleDelete = (listId: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updatedLists = lists.filter(list => list._id !== listId);
      saveUserLists(updatedLists);
    }
  };

  const handleAddRestaurant = () => {
    if (newRestaurant.name && newRestaurant.category && newRestaurant.address) {
      const restaurant: Restaurant = {
        _id: `rest-${Date.now()}`,
        restaurant: {
          _id: `rest-${Date.now()}`,
          name: newRestaurant.name,
          category: newRestaurant.category,
          address: newRestaurant.address
        }
      };
      setFormData({
        ...formData,
        restaurants: [...formData.restaurants, restaurant]
      });
      setNewRestaurant({ name: '', category: '', address: '' });
      toast.success('맛집이 추가되었습니다');
    } else {
      toast.error('모든 정보를 입력해주세요');
    }
  };

  const handleRemoveRestaurant = (restId: string) => {
    setFormData({
      ...formData,
      restaurants: formData.restaurants.filter(r => r._id !== restId)
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      restaurants: [],
      tags: [],
      coverImage: ''
    });
    setNewRestaurant({ name: '', category: '', address: '' });
    setEditingList(null);
    setIsAddingNew(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">나의 팔로잉 맛집 관리</h1>
            <p className="text-sm text-gray-600 mt-1">내가 좋아하는 맛집들을 리스트로 만들어 관리하세요</p>
          </div>
          <button
            onClick={() => {
              setIsAddingNew(true);
              resetForm();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <PlusIcon className="w-5 h-5" />
            새 리스트 만들기
          </button>
        </div>

        {/* 리스트 목록 */}
        <div className="grid gap-4 mb-6">
          {lists.map(list => (
            <div key={list._id} className="border rounded-lg p-4 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{list.title}</h3>
                  <p className="text-gray-600">{list.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {list.restaurants.length}개 맛집
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      {list.likeCount} 좋아요
                    </span>
                    <span>{list.viewCount} 조회</span>
                  </div>
                  <div className="mt-2">
                    {list.tags.map(tag => (
                      <span key={tag} className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {list.restaurants.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium mb-2">포함된 맛집:</p>
                      <div className="text-sm text-gray-600">
                        {list.restaurants.slice(0, 3).map(r => (
                          <div key={r._id} className="mb-1">
                            • {r.restaurant.name} ({r.restaurant.category}) - {r.restaurant.address}
                          </div>
                        ))}
                        {list.restaurants.length > 3 && (
                          <div className="text-gray-500">...외 {list.restaurants.length - 3}곳 더</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingList(list);
                      setFormData({
                        name: list.name,
                        title: list.title,
                        description: list.description,
                        restaurants: list.restaurants,
                        tags: list.tags,
                        coverImage: list.coverImage
                      });
                      setIsAddingNew(false);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(list._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 추가/수정 폼 */}
        {(editingList || isAddingNew) && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingNew ? '새 리스트 만들기' : '리스트 수정'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="리스트 ID (예: my-favorite)"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="리스트 제목"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <textarea
                placeholder="리스트 설명"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                required
              />
              
              <input
                type="text"
                placeholder="커버 이미지 URL (선택사항)"
                value={formData.coverImage}
                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
              
              <input
                type="text"
                placeholder="태그 (쉼표로 구분)"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                className="w-full px-3 py-2 border rounded"
              />

              {/* 맛집 추가 섹션 */}
              <div className="border rounded p-4 bg-gray-50">
                <h4 className="font-medium mb-3">맛집 추가</h4>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="맛집 이름"
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                    className="px-3 py-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="카테고리 (한식, 일식 등)"
                    value={newRestaurant.category}
                    onChange={(e) => setNewRestaurant({...newRestaurant, category: e.target.value})}
                    className="px-3 py-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="주소"
                    value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                    className="px-3 py-2 border rounded bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRestaurant}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  맛집 추가
                </button>
                
                {/* 추가된 맛집 목록 */}
                {formData.restaurants.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">추가된 맛집:</p>
                    {formData.restaurants.map(r => (
                      <div key={r._id} className="flex justify-between items-center p-2 bg-white rounded mb-1">
                        <span className="text-sm">
                          {r.restaurant.name} ({r.restaurant.category}) - {r.restaurant.address}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRestaurant(r._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isAddingNew ? '리스트 만들기' : '수정 완료'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFollowingRestaurants;