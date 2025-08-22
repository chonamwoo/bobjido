import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  CameraIcon,
  TagIcon,
  DocumentTextIcon,
  StarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  ClockIcon,
  CheckBadgeIcon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Certification {
  id: string;
  type: string;
  description: string;
  badge: string;
  verified: boolean;
}

interface RestaurantForm {
  name: string;
  category: string;
  location: string;
  address: string;
  phone: string;
  openingHours: string;
  priceRange: number;
  rating: number;
  photos: File[];
  tags: string[];
  personalNote: string;
  whyISaved: string;
  certification?: Certification;
}

const AddRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCertification, setShowCertification] = useState(false);
  const [form, setForm] = useState<RestaurantForm>({
    name: '',
    category: '',
    location: '',
    address: '',
    phone: '',
    openingHours: '',
    priceRange: 2,
    rating: 4,
    photos: [],
    tags: [],
    personalNote: '',
    whyISaved: ''
  });

  const categories = [
    '한식', '중식', '일식', '양식', '아시안', '카페', '디저트', 
    '분식', '패스트푸드', '해산물', '고기', '비건', '브런치', '바/펍'
  ];

  const certificationTypes = [
    { id: 'local', label: '현지인 인증', badge: '🏠', examples: ['10년 이상 거주', '토박이', '동네 주민'] },
    { id: 'expert', label: '전문가 인증', badge: '👨‍🍳', examples: ['셰프', '요리사', '베이커리 종사자'] },
    { id: 'travel', label: '여행 전문가', badge: '✈️', examples: ['해당 국가 거주 경험', '유학생', '여행 블로거'] },
    { id: 'foodie', label: '음식 애호가', badge: '🍽️', examples: ['100곳 이상 방문', '푸드 인플루언서', '미식 동호회'] },
    { id: 'culture', label: '문화 전문가', badge: '🌏', examples: ['문화 연구자', '해당 국가 출신', '언어 능통자'] }
  ];

  const whyISavedSuggestions = [
    '현지인만 아는 숨은 맛집',
    '가성비 최고의 점심 메뉴',
    '데이트하기 좋은 분위기',
    '줄 서서 먹을 만한 가치',
    '특별한 날 방문하기 좋은 곳',
    '혼밥하기 좋은 편안한 곳',
    '회식 장소로 추천',
    '외국인 친구에게 소개하고 싶은 한식당',
    '새벽까지 영업하는 심야식당',
    '채식 메뉴가 다양한 곳'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setForm(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleCertificationSubmit = (type: any) => {
    const certification: Certification = {
      id: Date.now().toString(),
      type: type.label,
      description: '', // 실제로는 입력받아야 함
      badge: type.badge,
      verified: false // 실제로는 검증 프로세스 필요
    };
    setForm(prev => ({ ...prev, certification }));
    setShowCertification(false);
  };

  const handleSubmit = () => {
    // 실제로는 API 호출
    console.log('Submitting restaurant:', form);
    navigate('/my-restaurants');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">맛집 등록하기</h1>
          <p className="text-gray-600">당신만의 특별한 맛집을 공유해주세요</p>
        </motion.div>

        {/* 진행 상태 바 */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: 기본 정보 */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">기본 정보</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  맛집 이름 *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  placeholder="예: 성수동 감자탕"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        form.category === cat
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  위치 *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                    placeholder="예: 성수동, 강남역"
                  />
                  <button className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                    <MapPinIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 주소
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  placeholder="예: 서울시 성동구 성수동 2가 123-45"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가격대
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(price => (
                      <button
                        key={price}
                        onClick={() => setForm(prev => ({ ...prev, priceRange: price }))}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                          form.priceRange >= price
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        ₩
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    평점
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                        className="p-1"
                      >
                        {star <= form.rating ? (
                          <StarSolidIcon className="w-8 h-8 text-yellow-400" />
                        ) : (
                          <StarIcon className="w-8 h-8 text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                다음 단계
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: 개인 메모 & 이유 */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">왜 이 맛집을 저장하시나요?</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SparklesIcon className="w-4 h-4 inline mr-1" />
                  이 맛집을 저장하는 이유 *
                </label>
                <textarea
                  value={form.whyISaved}
                  onChange={(e) => setForm(prev => ({ ...prev, whyISaved: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder="예: 현지인만 아는 숨은 맛집, 가성비 최고의 점심 메뉴"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {whyISavedSuggestions.slice(0, 5).map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setForm(prev => ({ ...prev, whyISaved: suggestion }))}
                      className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm hover:bg-orange-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DocumentTextIcon className="w-4 h-4 inline mr-1" />
                  개인 메모 (나만 볼 수 있어요)
                </label>
                <textarea
                  value={form.personalNote}
                  onChange={(e) => setForm(prev => ({ ...prev, personalNote: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                  rows={4}
                  placeholder="예: 매운 음식 못 먹는 친구랑 가기 좋음, 주차 어려움, 웨이팅 30분 이상"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="w-4 h-4 inline mr-1" />
                  태그 추가
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="태그 입력 후 Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1"
                    >
                      #{tag}
                      <button onClick={() => removeTag(tag)}>
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CameraIcon className="w-4 h-4 inline mr-1" />
                  사진 추가
                </label>
                <div className="flex flex-wrap gap-3">
                  {form.photos.map((photo, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <PlusIcon className="w-8 h-8 text-gray-400" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                이전
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                다음 단계
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: 전문가 인증 */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">전문가 인증 (선택)</h2>
            <p className="text-gray-600 mb-6">
              특별한 경험이나 전문성이 있다면 인증을 받아보세요!
            </p>

            {!form.certification && !showCertification && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <ShieldCheckIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">인증 뱃지를 받으면?</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• 당신의 추천이 더 신뢰받아요</li>
                      <li>• 맛집 카드에 특별한 뱃지가 표시돼요</li>
                      <li>• 전문가 랭킹에 오를 수 있어요</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => setShowCertification(true)}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  인증 받기
                </button>
              </div>
            )}

            {showCertification && (
              <div className="space-y-4 mb-6">
                <h3 className="font-bold text-gray-900">어떤 전문성이 있으신가요?</h3>
                {certificationTypes.map(type => (
                  <div
                    key={type.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 cursor-pointer transition-all"
                    onClick={() => handleCertificationSubmit(type)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{type.badge}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{type.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          예: {type.examples.join(', ')}
                        </p>
                      </div>
                      <CheckBadgeIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowCertification(false)}
                  className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  나중에 하기
                </button>
              </div>
            )}

            {form.certification && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{form.certification.badge}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-800">{form.certification.type} 신청 완료</h4>
                    <p className="text-sm text-green-600">검증 후 뱃지가 부여됩니다</p>
                  </div>
                  <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            )}

            {/* 미리보기 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">맛집 카드 미리보기</h3>
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{form.name || '맛집 이름'}</h4>
                    <p className="text-sm text-gray-600">{form.location || '위치'} · {form.category || '카테고리'}</p>
                  </div>
                  {form.certification && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                      <span>{form.certification.badge}</span>
                      <span className="text-xs font-bold text-blue-700">{form.certification.type}</span>
                    </div>
                  )}
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-sm text-orange-800 font-medium">
                    💬 "{form.whyISaved || '이 맛집을 저장한 이유'}"
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon
                          key={i}
                          className={`w-4 h-4 ${i < form.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{form.rating}.0</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {'₩'.repeat(form.priceRange)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                이전
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                등록 완료
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddRestaurant;