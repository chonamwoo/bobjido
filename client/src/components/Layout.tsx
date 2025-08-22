import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getUserAvatar } from '../utils/userAvatars';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  PlusCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  MapPinIcon,
  BeakerIcon,
  SparklesIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ListBulletIcon,
  BellIcon,
  ChevronDownIcon,
  ArrowsRightLeftIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  LightBulbIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { 
  SparklesIcon as SparklesSolidIcon,
  HeartIcon as HeartSolidIcon,
  UserGroupIcon as UserGroupSolidIcon 
} from '@heroicons/react/24/solid';

// 음식 관련 커스텀 SVG 아이콘 컴포넌트
const FoodIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 2c-1.5 0-3 1.5-3 3v1c0 .5.5 1 1 1h4c.5 0 1-.5 1-1V5c0-1.5-1.5-3-3-3zM8 7v13c0 .5.5 1 1 1h6c.5 0 1-.5 1-1V7H8z" />
  </svg>
);

const BowlIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M7 10c.6-.6 1.4-1 2.2-1h5.6c.8 0 1.6.4 2.2 1" />
  </svg>
);

// 스푼과 포크 아이콘
const SpoonForkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18M9 3c0 1.657-1.343 3-3 3S3 4.657 3 3s1.343-3 3-3 3 1.343 3 3zM15 3v18M15 7h6M15 11h6M15 3h6v8h-6" />
  </svg>
);

const PlateIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" strokeWidth={2} />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

// 메인 로고 - 오렌지 동그라미 + 흰색 접시
const MainLogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 접시 모양 */}
    <circle cx="24" cy="24" r="8" fill="white"/>
    <circle cx="24" cy="24" r="4" fill="white" opacity="0.8"/>
  </svg>
);

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header - 핵심 기능 중심 */}
      <header className="bg-white shadow-soft border-b border-neutral-200 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all">
                <MainLogoIcon className="w-10 h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  BobMap
                </span>
                <span className="text-xs text-gray-600 font-medium -mt-1">맛있는 여행</span>
              </div>
            </Link>

            {/* 중앙 검색 - 맛집/사람/지역 통합 */}
            <div className="flex-1 max-w-md mx-4 sm:mx-6 hidden md:block">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={user ? "맛집, 취향 매칭, 지역 검색..." : "맛집, 지역 검색..."}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 rounded-lg text-sm placeholder-neutral-400 border border-transparent hover:bg-white hover:border-neutral-300 focus:bg-white focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10 transition-all"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-accent-500 transition-colors" />
              </div>
            </div>

            {/* 우측 네비게이션 - 핵심 액션 */}
            <nav className="flex items-center space-x-2">
              {user ? (
                <>

                  {/* 내 맛집 */}
                  <Link
                    to="/my-restaurants"
                    className="p-2.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all hover:scale-110"
                    title="내 맛집"
                  >
                    <BuildingStorefrontIcon className="w-6 h-6" />
                  </Link>

                  {/* 채팅 */}
                  <Link 
                    to="/chats" 
                    className="p-2.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all hover:scale-110"
                    title="채팅"
                  >
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                  </Link>

                  {/* 알림 */}
                  <Link
                    to="/notifications" 
                    className="p-2.5 text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 rounded-lg transition-all relative"
                    title="알림"
                  >
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Link>

                  {/* 프로필 드롭다운 */}
                  <div className="relative group ml-2">
                    <button className="flex items-center space-x-2 px-3 py-2 hover:bg-neutral-100 rounded-lg transition-all">
                      <img 
                        src={user.profileImage || getUserAvatar(user.username)} 
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-soft"
                      />
                      <span className="hidden sm:inline text-sm font-medium text-primary-700">{user.username}</span>
                      <ChevronDownIcon className="w-4 h-4 text-neutral-400" />
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="p-2">
                        <Link
                          to={`/profile/${user.username}`}
                          className="flex items-center gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <UserIcon className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium">내 프로필</span>
                        </Link>
                        <Link
                          to="/my-restaurants"
                          className="flex items-center gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <BuildingStorefrontIcon className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium">내 맛집</span>
                        </Link>
                        <Link
                          to="/my-lists"
                          className="flex items-center gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <ListBulletIcon className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium">내 리스트</span>
                        </Link>
                        <Link
                          to="/saved"
                          className="flex items-center gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <BookmarkIcon className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium">저장한 맛집</span>
                        </Link>
                        <Link
                          to="/taste-analysis"
                          className="flex items-center gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <BeakerIcon className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium">취향 분석</span>
                        </Link>
                        <div className="my-2 border-t border-neutral-100"></div>
                        <Link
                          to="/my-stats"
                          className="flex items-center gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <ChartBarIcon className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium">내 통계</span>
                        </Link>
                        <Link
                          to="/help"
                          className="flex items-center gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <QuestionMarkCircleIcon className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium">도움말</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <Cog6ToothIcon className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium">설정</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 text-error hover:bg-error/5 w-full text-left rounded-lg transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">로그아웃</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full hover:from-orange-700 hover:to-red-700 transition-all font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    시작하기
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden fixed top-16 w-full bg-white border-b border-neutral-200 px-4 py-2 z-40">
        <div className="relative">
          <input
            type="text"
            placeholder="검색..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
        </div>
      </div>

      {/* Sidebar - 재구성 */}
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-neutral-200 hidden lg:block overflow-y-auto">
        <div className="p-4">
          {user && (
            <>
              {/* 핵심 기능 섹션 */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-3">
                  핵심 기능
                </h3>
                
                {/* 취향 매칭 - 가장 중요! */}
                <div className="relative group">
                  <Link
                    to="/matches"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 rounded-xl transition-all mb-2 border border-pink-200 hover:shadow-lg animate-fade-in"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                      <SparklesSolidIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">취향 매칭</div>
                      <div className="text-xs text-gray-900">나와 입맛이 통하는 사람</div>
                    </div>
                    <span className="ml-auto px-2 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full font-bold">
                      NEW
                    </span>
                  </Link>
                  
                  {/* 취향 매칭 호버 드롭다운 */}
                  <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-3">
                      <Link
                        to="/matches"
                        onClick={() => {
                          window.location.hash = '';
                          window.dispatchEvent(new CustomEvent('matches-tab-change', { detail: { tab: 'today' } }));
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-pink-50 rounded-lg transition-colors mb-2"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                          <UserGroupIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">추천 친구</div>
                          <div className="text-xs text-gray-600">오늘의 추천 친구</div>
                        </div>
                      </Link>
                      <Link
                        to="/matches#twins"
                        onClick={() => {
                          window.location.hash = 'twins';
                          window.dispatchEvent(new CustomEvent('matches-tab-change', { detail: { tab: 'twins' } }));
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-pink-50 rounded-lg transition-colors mb-2"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                          <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">취향 쌍둥이</div>
                          <div className="text-xs text-gray-600">90% 이상 매칭</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 동행 찾기 */}
                <div className="relative group">
                  <Link
                    to="/dining-buddy"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 rounded-xl transition-all mb-2 border border-yellow-200 hover:shadow-lg animate-fade-in"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                      <UsersIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">동행 찾기</div>
                      <div className="text-xs text-gray-900">혼밥 NO, 같이 먹어요</div>
                    </div>
                    <span className="ml-auto px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full font-bold">
                      HOT
                    </span>
                  </Link>
                  
                  {/* 동행 찾기 호버 드롭다운 */}
                  <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-3">
                      <Link
                        to="/dining-buddy"
                        onClick={() => {
                          window.location.hash = '';
                          window.dispatchEvent(new CustomEvent('dining-tab-change', { detail: { tab: 'today' } }));
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors mb-2"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center">
                          <SpoonForkIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">오늘의 동행</div>
                          <div className="text-xs text-gray-600">오늘 같이 먹어요</div>
                        </div>
                      </Link>
                      <Link
                        to="/dining-buddy#recommended"
                        onClick={() => {
                          window.location.hash = 'recommended';
                          window.dispatchEvent(new CustomEvent('dining-tab-change', { detail: { tab: 'recommended' } }));
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors mb-2"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg flex items-center justify-center">
                          <UserGroupIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">추천 기반</div>
                          <div className="text-xs text-gray-600">취향 기반 추천</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

              {/* 탐색 섹션 */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-3">
                  탐색
                </h3>

                {/* 맛집 지도 - 강조된 스타일 */}
                <Link
                  to="/map"
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-xl transition-all mb-3 border border-red-200 hover:shadow-lg group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                    <MapPinIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">맛집 지도</div>
                    <div className="text-xs text-gray-700">🤖 AI가 추천하는 내 주변 맛집</div>
                  </div>
                  <span className="ml-auto px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-bold">
                    AI
                  </span>
                </Link>

                {/* 지역별 탐색 */}
                <Link
                  to="/explore/local"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-lg transition-all mb-2"
                >
                  <GlobeAltIcon className="w-5 h-5 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">지역별 탐색</span>
                </Link>

                {/* 실시간 인기 */}
                <Link
                  to="/trending"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-lg transition-all mb-2"
                >
                  <FireIcon className="w-5 h-5 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">실시간 인기</span>
                </Link>
              </div>

              {/* 내 맛집 관리 섹션 - 네 번째 */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-3">
                  내 맛집 관리
                </h3>
                
                <Link
                  to="/my-restaurants"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-lg transition-all mb-2"
                >
                  <BuildingStorefrontIcon className="w-5 h-5 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">전체 맛집</span>
                  <span className="ml-auto text-xs text-neutral-500">42</span>
                </Link>
                
                <Link
                  to="/my-lists"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-lg transition-all mb-2"
                >
                  <ListBulletIcon className="w-5 h-5 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">리스트 관리</span>
                  <span className="ml-auto text-xs text-neutral-500">5</span>
                </Link>
                
                <Link
                  to="/saved"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-lg transition-all mb-2"
                >
                  <BookmarkIcon className="w-5 h-5 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">저장한 맛집</span>
                  <span className="ml-auto text-xs text-neutral-500">18</span>
                </Link>
                
                <Link
                  to="/create-playlist"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <PlusCircleIcon className="w-5 h-5 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">새 리스트 만들기</span>
                </Link>
              </div>
            </>
          )}

          {/* 하단 링크 */}
          <div className="pt-6 border-t border-neutral-200 space-y-1">
            <Link
              to="/help"
              className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-primary-700 text-sm"
            >
              <QuestionMarkCircleIcon className="w-4 h-4" />
              <span>도움말</span>
            </Link>
            {user && (
              <Link
                to="/stats"
                className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-primary-700 text-sm"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>내 통계</span>
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="md:hidden h-14"></div>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation - 극도로 단순화 (3개) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 shadow-large">
        <div className="grid grid-cols-3 h-16">
          {user ? (
            <>
              {/* 취향 매칭 - 핵심 */}
              <Link 
                to="/matches" 
                className="flex flex-col items-center justify-center p-2 text-neutral-600 hover:text-accent-600 transition-colors"
              >
                <SparklesIcon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">매칭</span>
              </Link>
              
              {/* 동행 찾기 - 핵심 */}
              <Link 
                to="/dining-buddy" 
                className="flex flex-col items-center justify-center p-2 text-neutral-600 hover:text-primary-600 transition-colors"
              >
                <UsersIcon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">동행</span>
              </Link>
              
              {/* 프로필/더보기 */}
              <Link 
                to={`/profile/${user.username}`} 
                className="flex flex-col items-center justify-center p-2 text-neutral-600 hover:text-primary-700 transition-colors"
              >
                <img 
                  src={user.profileImage || getUserAvatar(user.username)} 
                  alt={user.username}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-neutral-200"
                />
                <span className="text-xs mt-1 font-medium">내정보</span>
              </Link>
            </>
          ) : (
            <>
              {/* 홈 */}
              <Link 
                to="/" 
                className="flex flex-col items-center justify-center p-2 text-neutral-600 hover:text-accent-600 transition-colors"
              >
                <HomeIcon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">홈</span>
              </Link>
              
              {/* 둘러보기 */}
              <Link 
                to="/discover" 
                className="flex flex-col items-center justify-center p-2 text-neutral-600 hover:text-accent-600 transition-colors"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">탐색</span>
              </Link>
              
              {/* 로그인 */}
              <Link 
                to="/auth" 
                className="flex flex-col items-center justify-center p-2 text-accent-600 font-semibold"
              >
                <UserIcon className="w-6 h-6" />
                <span className="text-xs mt-1 font-bold">시작하기</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Layout;