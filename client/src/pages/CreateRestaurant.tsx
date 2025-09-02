import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import KoreanMap from '../components/KoreanMap';

interface NaverSearchResult {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

interface RestaurantForm {
  name: string;
  category: string;
  address: string;
  roadAddress: string;
  coordinates: { lat: number; lng: number };
  phoneNumber: string;
  priceRange: string;
  description: string;
  tags: string[];
  popularMenu: string[];
  images: File[];
  businessHours: {
    open: string;
    close: string;
    breakTime?: string;
    lastOrder?: string;
  };
}

const CreateRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NaverSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<NaverSearchResult | null>(null);
  const [showMap, setShowMap] = useState(false);
  
  const [form, setForm] = useState<RestaurantForm>({
    name: '',
    category: '한식',
    address: '',
    roadAddress: '',
    coordinates: { lat: 37.5665, lng: 126.9780 },
    phoneNumber: '',
    priceRange: '보통',
    description: '',
    tags: [],
    popularMenu: [],
    images: [],
    businessHours: {
      open: '11:00',
      close: '22:00',
      breakTime: '',
      lastOrder: ''
    }
  });

  const [tagInput, setTagInput] = useState('');
  const [menuInput, setMenuInput] = useState('');

  const categories = ['한식', '중식', '일식', '양식', '분식', '카페', '주점', '디저트', '기타'];
  const priceRanges = ['저렴한', '보통', '비싼', '매우비싼'];

  // 네이버 검색 API 호출
  const searchNaver = async () => {
    if (!searchQuery.trim()) {
      toast.error('검색어를 입력해주세요');
      return;
    }

    setSearching(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/restaurants/search/naver`,
        {
          params: { query: searchQuery },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSearchResults(response.data.items || []);
      if (response.data.items.length === 0) {
        toast('검색 결과가 없습니다');
      }
    } catch (error) {
      console.error('네이버 검색 실패:', error);
      toast.error('검색 중 오류가 발생했습니다');
    } finally {
      setSearching(false);
    }
  };

  // 검색 결과 선택
  const selectPlace = (place: NaverSearchResult) => {
    // 네이버 좌표를 WGS84로 변환 (TM128 -> WGS84)
    const lat = parseFloat(place.mapy) / 10000000;
    const lng = parseFloat(place.mapx) / 10000000;
    
    setForm({
      ...form,
      name: place.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
      address: place.address,
      roadAddress: place.roadAddress,
      coordinates: { lat, lng },
      phoneNumber: place.telephone,
      description: place.description,
      category: mapNaverCategory(place.category)
    });
    
    setSelectedPlace(place);
    setShowMap(true);
    setSearchResults([]);
  };

  // 네이버 카테고리를 앱 카테고리로 매핑
  const mapNaverCategory = (naverCategory: string): string => {
    if (naverCategory.includes('한식')) return '한식';
    if (naverCategory.includes('중식') || naverCategory.includes('중국')) return '중식';
    if (naverCategory.includes('일식') || naverCategory.includes('일본')) return '일식';
    if (naverCategory.includes('양식') || naverCategory.includes('이탈리')) return '양식';
    if (naverCategory.includes('분식')) return '분식';
    if (naverCategory.includes('카페') || naverCategory.includes('커피')) return '카페';
    if (naverCategory.includes('술집') || naverCategory.includes('주점')) return '주점';
    if (naverCategory.includes('디저트') || naverCategory.includes('베이커리')) return '디저트';
    return '기타';
  };

  // 태그 추가
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  // 메뉴 추가
  const addMenu = () => {
    if (menuInput.trim() && !form.popularMenu.includes(menuInput.trim())) {
      setForm({ ...form, popularMenu: [...form.popularMenu, menuInput.trim()] });
      setMenuInput('');
    }
  };

  // 이미지 선택
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setForm({ ...form, images: [...form.images, ...newImages] });
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.address) {
      toast.error('필수 정보를 입력해주세요');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'images') {
          form.images.forEach(image => {
            formData.append('images', image);
          });
        } else if (key === 'coordinates' || key === 'businessHours') {
          formData.append(key, JSON.stringify(form[key as keyof RestaurantForm]));
        } else if (key === 'tags' || key === 'popularMenu') {
          formData.append(key, JSON.stringify(form[key as keyof RestaurantForm]));
        } else {
          formData.append(key, String(form[key as keyof RestaurantForm]));
        }
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/restaurants`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('맛집이 등록되었습니다!');
      navigate(`/restaurant/${response.data.restaurant._id}`);
    } catch (error: any) {
      console.error('맛집 등록 실패:', error);
      toast.error(error.response?.data?.message || '등록 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">맛집 등록하기</h1>

      {/* 네이버 검색 섹션 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <MagnifyingGlassIcon className="w-6 h-6 mr-2 text-green-500" />
          네이버에서 맛집 검색
        </h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchNaver()}
            placeholder="맛집 이름을 검색하세요 (예: 강남 파스타)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={searchNaver}
            disabled={searching}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {searching ? '검색 중...' : '검색'}
          </button>
        </div>

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.map((place, index) => (
              <div
                key={index}
                onClick={() => selectPlace(place)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <h3 
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: place.title }}
                />
                <p className="text-sm text-gray-600">{place.address}</p>
                <p className="text-xs text-gray-500">{place.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 선택된 장소 정보 */}
      {selectedPlace && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-green-800">{form.name}</h3>
              <p className="text-sm text-green-600">{form.address}</p>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {showMap ? '지도 숨기기' : '지도 보기'}
            </button>
          </div>
        </div>
      )}

      {/* 지도 */}
      {showMap && form.coordinates && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">위치 확인</h2>
          <KoreanMap 
            restaurants={[{
              _id: 'temp',
              name: form.name,
              coordinates: form.coordinates,
              address: form.address
            }] as any}
            className="w-full h-[400px]"
            zoom={16}
          />
        </div>
      )}

      {/* 상세 정보 입력 폼 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">맛집 상세 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">맛집 이름 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">카테고리</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">주소 *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">가격대</label>
            <select
              value={form.priceRange}
              onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {priceRanges.map(price => (
                <option key={price} value={price}>{price}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">전화번호</label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">영업 시간</label>
            <div className="flex gap-2">
              <input
                type="time"
                value={form.businessHours.open}
                onChange={(e) => setForm({ 
                  ...form, 
                  businessHours: { ...form.businessHours, open: e.target.value }
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="self-center">~</span>
              <input
                type="time"
                value={form.businessHours.close}
                onChange={(e) => setForm({ 
                  ...form, 
                  businessHours: { ...form.businessHours, close: e.target.value }
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">설명</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="맛집에 대한 설명을 입력하세요"
          />
        </div>

        {/* 인기 메뉴 */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">인기 메뉴</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={menuInput}
              onChange={(e) => setMenuInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMenu())}
              placeholder="메뉴명 입력 후 Enter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addMenu}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.popularMenu.map((menu, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center"
              >
                {menu}
                <button
                  type="button"
                  onClick={() => setForm({ 
                    ...form, 
                    popularMenu: form.popularMenu.filter((_, i) => i !== index) 
                  })}
                  className="ml-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 태그 */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">태그</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="태그 입력 후 Enter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => setForm({ 
                    ...form, 
                    tags: form.tags.filter((_, i) => i !== index) 
                  })}
                  className="ml-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">이미지</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {form.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ 
                      ...form, 
                      images: form.images.filter((_, i) => i !== index) 
                    })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            맛집 등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRestaurant;