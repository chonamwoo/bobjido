import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface GroupFormData {
  name: string;
  category: string;
  region: string;
  description: string;
  rules: string[];
  maxMembers: number;
  isPublic: boolean;
  tags: string[];
  meetingFrequency: string;
  ageRange?: { min: number; max: number };
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    category: '',
    region: '',
    description: '',
    rules: ['서로 존중하며 대화해요', '맛집 정보는 자유롭게 공유해요'],
    maxMembers: 20,
    isPublic: true,
    tags: [],
    meetingFrequency: 'weekly',
    ageRange: undefined
  });
  const [newRule, setNewRule] = useState('');
  const [newTag, setNewTag] = useState('');

  const categories = [
    { id: 'region', label: '지역 모임', icon: '📍', description: '같은 지역에서 활동하는 모임' },
    { id: 'taste', label: '취향 모임', icon: '🌶️', description: '특정 음식이나 맛을 좋아하는 모임' },
    { id: 'age', label: '연령대 모임', icon: '👥', description: '비슷한 연령대가 모이는 모임' },
    { id: 'theme', label: '테마 모임', icon: '🎉', description: '특별한 테마가 있는 모임' }
  ];

  const regions = [
    '강남/서초', '강동/송파', '강서/양천', '강북/노원',
    '관악/동작', '광진/성동', '구로/금천', '도봉/강북',
    '동대문/중랑', '마포/서대문', '서초/강남', '성북/종로',
    '송파/강동', '양천/강서', '영등포/구로', '용산/중구',
    '은평/서대문', '종로/중구', '중구/용산', '중랑/동대문'
  ];

  const meetingFrequencies = [
    { value: 'daily', label: '매일' },
    { value: 'weekly', label: '주 1회' },
    { value: 'biweekly', label: '격주' },
    { value: 'monthly', label: '월 1회' },
    { value: 'flexible', label: '자유롭게' }
  ];

  const handleAddRule = () => {
    if (newRule.trim() && formData.rules.length < 5) {
      setFormData({
        ...formData,
        rules: [...formData.rules, newRule.trim()]
      });
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormData({
      ...formData,
      rules: formData.rules.filter((_, i) => i !== index)
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && formData.tags.length < 5) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    // 그룹 생성 API 호출
    console.log('Creating group:', formData);
    // groups 탭으로 이동
    sessionStorage.setItem('matchesActiveTab', 'groups');
    navigate('/matches?tab=groups');
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.category;
      case 2:
        return formData.region && formData.description;
      case 3:
        return formData.rules.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                } else {
                  const savedTab = sessionStorage.getItem('matchesActiveTab') || 'groups';
                  navigate(`/matches?tab=${savedTab}`);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">먹친구룹 만들기</h1>
              <p className="text-xs text-gray-500">Step {step} of 3</p>
            </div>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">어떤 그룹을 만들까요?</h2>
              <p className="text-gray-600">그룹의 기본 정보를 입력해주세요</p>
            </div>

            {/* 그룹명 */}
            <div>
              <label className="block text-sm font-medium mb-2">그룹 이름 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 강남 맛집 탐험대"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={30}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.name.length}/30</p>
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium mb-3">카테고리 *</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === category.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium mb-1">{category.label}</div>
                    <div className="text-xs text-gray-500">{category.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 공개 여부 */}
            <div>
              <label className="block text-sm font-medium mb-3">공개 설정</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormData({ ...formData, isPublic: true })}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    formData.isPublic
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="font-medium mb-1">공개 그룹</div>
                  <div className="text-xs text-gray-500">누구나 가입 가능</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, isPublic: false })}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    !formData.isPublic
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="font-medium mb-1">비공개 그룹</div>
                  <div className="text-xs text-gray-500">승인 후 가입</div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: 상세 정보 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">그룹을 소개해주세요</h2>
              <p className="text-gray-600">멤버들이 그룹을 이해할 수 있도록 설명해주세요</p>
            </div>

            {/* 활동 지역 */}
            <div>
              <label className="block text-sm font-medium mb-2">주 활동 지역 *</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">지역을 선택하세요</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* 그룹 소개 */}
            <div>
              <label className="block text-sm font-medium mb-2">그룹 소개 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="그룹의 목적과 활동을 자유롭게 소개해주세요"
                className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200</p>
            </div>

            {/* 모임 주기 */}
            <div>
              <label className="block text-sm font-medium mb-2">모임 주기</label>
              <div className="grid grid-cols-3 gap-2">
                {meetingFrequencies.map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => setFormData({ ...formData, meetingFrequency: freq.value })}
                    className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                      formData.meetingFrequency === freq.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 태그 */}
            <div>
              <label className="block text-sm font-medium mb-2">태그 (최대 5개)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="예: 한식, 매운맛, 브런치"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || formData.tags.length >= 5}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="ml-1 text-purple-500 hover:text-purple-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 최대 인원 */}
            <div>
              <label className="block text-sm font-medium mb-2">최대 인원</label>
              <input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                min={2}
                max={100}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: 규칙 설정 */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">그룹 규칙을 정해주세요</h2>
              <p className="text-gray-600">건강한 커뮤니티를 위한 규칙을 설정해주세요</p>
            </div>

            {/* 규칙 추가 */}
            <div>
              <label className="block text-sm font-medium mb-2">그룹 규칙 (최대 5개)</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                  placeholder="새로운 규칙을 입력하세요"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddRule}
                  disabled={!newRule.trim() || formData.rules.length >= 5}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors"
                >
                  추가
                </button>
              </div>

              <div className="space-y-2">
                {formData.rules.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                  >
                    <ShieldCheckIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="flex-1 text-sm">{rule}</span>
                    <button
                      onClick={() => handleRemoveRule(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 연령 제한 (선택) */}
            <div>
              <label className="block text-sm font-medium mb-2">연령 제한 (선택)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="최소"
                  min={18}
                  max={100}
                  value={formData.ageRange?.min || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    ageRange: {
                      min: parseInt(e.target.value) || 18,
                      max: formData.ageRange?.max || 100
                    }
                  })}
                  className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-gray-500">~</span>
                <input
                  type="number"
                  placeholder="최대"
                  min={18}
                  max={100}
                  value={formData.ageRange?.max || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    ageRange: {
                      min: formData.ageRange?.min || 18,
                      max: parseInt(e.target.value) || 100
                    }
                  })}
                  className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-500">세</span>
              </div>
            </div>

            {/* 미리보기 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <h3 className="font-semibold mb-3">그룹 미리보기</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">이름:</span> {formData.name}</p>
                <p><span className="font-medium">카테고리:</span> {categories.find(c => c.id === formData.category)?.label}</p>
                <p><span className="font-medium">지역:</span> {formData.region}</p>
                <p><span className="font-medium">최대 인원:</span> {formData.maxMembers}명</p>
                <p><span className="font-medium">공개 여부:</span> {formData.isPublic ? '공개' : '비공개'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                이전
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className="flex-1 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors font-medium"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 transition-all font-medium"
              >
                그룹 만들기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;