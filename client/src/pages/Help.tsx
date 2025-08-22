import React, { useState } from 'react';
import { 
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  BugAntIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: '시작하기',
    question: 'BobMap은 어떤 서비스인가요?',
    answer: 'BobMap은 음식 취향 기반 매칭 서비스입니다. AI가 당신의 취향을 분석하여 입맛이 비슷한 사람들과 연결해드리고, 맞춤형 맛집을 추천해드립니다.'
  },
  {
    category: '시작하기',
    question: '취향 진단은 어떻게 받나요?',
    answer: '회원가입 후 첫 로그인 시 자동으로 취향 진단이 시작됩니다. 8가지 간단한 질문에 답하면 AI가 당신의 취향 타입을 분석해드립니다.'
  },
  {
    category: '취향 매칭',
    question: '취향 매칭은 어떻게 이루어지나요?',
    answer: 'AI가 사용자들의 취향 프로필, 맛집 방문 기록, 리뷰 패턴을 분석하여 가장 잘 맞는 사람들을 매칭해드립니다. 매칭 점수가 높을수록 입맛이 비슷합니다.'
  },
  {
    category: '취향 매칭',
    question: '취향 쌍둥이는 무엇인가요?',
    answer: '취향 쌍둥이는 당신과 90% 이상 일치하는 취향을 가진 특별한 매칭입니다. 이들이 좋아하는 맛집은 당신도 좋아할 확률이 매우 높습니다.'
  },
  {
    category: '맛집 탐색',
    question: '지역별 맛집은 어떻게 찾나요?',
    answer: '상단 메뉴의 "지역별 탐색"을 클릭하면 강남, 홍대, 이태원 등 주요 지역별 인기 맛집을 확인할 수 있습니다. 카테고리, 가격대별로 필터링도 가능합니다.'
  },
  {
    category: '맛집 탐색',
    question: '실시간 트렌딩은 어떻게 결정되나요?',
    answer: '최근 24시간 동안의 방문 인증, 리뷰, 저장 횟수 등을 종합하여 실시간으로 업데이트됩니다. 순위 변동도 함께 표시됩니다.'
  },
  {
    category: '동행 찾기',
    question: '동행 찾기는 어떻게 이용하나요?',
    answer: '"동행 찾기" 메뉴에서 오늘 함께 식사할 사람을 찾을 수 있습니다. 원하는 시간대, 지역, 음식 종류를 선택하면 매칭 가능한 사람들이 표시됩니다.'
  },
  {
    category: '동행 찾기',
    question: '동행 매칭 후 어떻게 연락하나요?',
    answer: '매칭이 성사되면 앱 내 채팅으로 자동 연결됩니다. 채팅을 통해 만날 장소와 시간을 정하실 수 있습니다.'
  },
  {
    category: '계정 관리',
    question: '프로필 사진은 어떻게 변경하나요?',
    answer: '프로필 페이지에서 사진을 클릭하거나 드래그&드롭으로 새 사진을 업로드할 수 있습니다. JPG, PNG, GIF 형식을 지원하며 5MB 이하만 가능합니다.'
  },
  {
    category: '계정 관리',
    question: '취향 프로필을 다시 진단받을 수 있나요?',
    answer: '취향 프로필은 자동으로 업데이트됩니다. 맛집 방문, 리뷰 작성 등의 활동이 쌓이면 AI가 자연스럽게 취향을 재분석합니다.'
  },
  {
    category: '신뢰도',
    question: '신뢰도 점수는 어떻게 올리나요?',
    answer: '정확한 맛집 정보 등록, 도움이 되는 리뷰 작성, 실제 방문 인증, 다른 사용자의 추천 등으로 신뢰도가 상승합니다.'
  },
  {
    category: '신뢰도',
    question: '신뢰도가 낮으면 어떤 제한이 있나요?',
    answer: '신뢰도가 낮으면 동행 매칭 우선순위가 낮아지고, 맛집 등록 시 검토 시간이 길어질 수 있습니다. 50점 미만은 일부 기능이 제한됩니다.'
  },
  {
    category: '기술 지원',
    question: '앱이 느려요. 어떻게 해야 하나요?',
    answer: '설정 > 캐시 삭제를 시도해보세요. 문제가 지속되면 앱을 재설치하거나 beta-feedback@bobmap.com으로 문의해주세요.'
  },
  {
    category: '기술 지원',
    question: '오류가 발생했어요.',
    answer: '화면 캡처와 함께 발생 시간, 수행하던 작업을 beta-feedback@bobmap.com으로 보내주시면 빠르게 해결해드리겠습니다.'
  }
];

const categories = [
  { name: '시작하기', icon: BookOpenIcon, color: 'bg-blue-100 text-blue-600' },
  { name: '취향 매칭', icon: SparklesIcon, color: 'bg-pink-100 text-pink-600' },
  { name: '맛집 탐색', icon: MapPinIcon, color: 'bg-green-100 text-green-600' },
  { name: '동행 찾기', icon: UserGroupIcon, color: 'bg-purple-100 text-purple-600' },
  { name: '계정 관리', icon: ShieldCheckIcon, color: 'bg-yellow-100 text-yellow-600' },
  { name: '신뢰도', icon: HeartIcon, color: 'bg-red-100 text-red-600' },
  { name: '기술 지원', icon: BugAntIcon, color: 'bg-gray-100 text-gray-600' }
];

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const quickGuides = [
    {
      title: '빠른 시작 가이드',
      description: '3분 만에 BobMap 마스터하기',
      icon: '🚀',
      steps: [
        '회원가입 & 취향 진단 받기',
        '관심 지역 맛집 둘러보기',
        '취향 매칭으로 친구 찾기',
        '동행 찾기로 오늘 저녁 약속 잡기'
      ]
    },
    {
      title: '인기 기능 TOP 5',
      description: '사용자들이 가장 좋아하는 기능',
      icon: '🏆',
      steps: [
        '취향 쌍둥이 찾기',
        '실시간 트렌딩 맛집',
        '동행 매칭',
        'AI 맛집 추천',
        '지역별 숨은 맛집'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <QuestionMarkCircleIcon className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">도움말 센터</h1>
            <p className="text-white/80 mt-1">BobMap을 200% 활용하는 방법</p>
          </div>
        </div>

        {/* 검색바 */}
        <div className="relative mt-6">
          <input
            type="text"
            placeholder="무엇을 도와드릴까요? (예: 취향 매칭, 동행 찾기)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 pl-12 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
        </div>
      </div>

      {/* 빠른 가이드 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {quickGuides.map((guide, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{guide.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{guide.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                <ol className="space-y-2">
                  {guide.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {stepIdx + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 카테고리 필터 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">카테고리별 도움말</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                className={`p-3 rounded-lg transition-all ${
                  selectedCategory === cat.name 
                    ? 'ring-2 ring-orange-500 ' + cat.color 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs font-medium">{cat.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ 목록 */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="font-bold text-lg">
            자주 묻는 질문 
            {filteredFAQs.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({filteredFAQs.length}개)
              </span>
            )}
          </h2>
        </div>

        <div className="divide-y">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                <button
                  onClick={() => toggleExpanded(idx)}
                  className="w-full flex items-start gap-4 text-left"
                >
                  <div className="flex-shrink-0 mt-1">
                    {expandedItems.has(idx) ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    {expandedItems.has(idx) && (
                      <p className="text-gray-600 mt-3 leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">검색 결과가 없습니다</p>
              <p className="text-gray-400 text-sm mt-1">다른 키워드로 검색해보세요</p>
            </div>
          )}
        </div>
      </div>

      {/* 추가 도움 섹션 */}
      <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center gap-4">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-orange-600" />
          <div>
            <h3 className="font-bold text-gray-900">더 많은 도움이 필요하신가요?</h3>
            <p className="text-gray-600 mt-1">
              이메일: <a href="mailto:help@bobmap.com" className="text-orange-600 hover:underline">help@bobmap.com</a>
            </p>
            <p className="text-gray-600">
              카카오톡: <span className="text-orange-600">@bobmap</span> (평일 10:00 - 18:00)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;