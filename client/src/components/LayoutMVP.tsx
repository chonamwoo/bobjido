import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  PlayIcon,
  TrophyIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  HomeIcon,
  SparklesIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const LayoutMVP: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('로그아웃 되었습니다');
    navigate('/');
  };

  // 메인 네비게이션 메뉴 - 심플하게
  const mainMenuItems = [
    { path: '/', label: '홈', icon: HomeIcon },
    { path: '/discover', label: '둘러보기', icon: PlayIcon },
    { path: '/game-hub', label: '게임', icon: SparklesIcon },
    { path: '/create-playlist', label: '플레이리스트', icon: PlusCircleIcon },
    { path: '/local-experts', label: '맛잘알', icon: TrophyIcon },
  ];

  const userMenuItems = [
    { path: '/my-lists', label: '내 플레이리스트', icon: MapIcon },
    { path: '/profile', label: '프로필', icon: UserIcon },
    { path: '/my-stats', label: '통계', icon: ChartBarIcon },
    { path: '/settings', label: '설정', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <MapIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">BobMap</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user.username}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                      >
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                          로그아웃
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    회원가입
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="md:hidden overflow-hidden bg-white border-t"
            >
              <nav className="px-4 py-4 space-y-2">
                {mainMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <>
                    <hr className="my-2" />
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg"
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <MapIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">BobMap</span>
              </div>
              <p className="text-sm text-gray-600">
                진짜 맛집을 찾는 가장 똑똑한 방법
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">서비스</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/discover" className="hover:text-gray-900">플레이리스트 둘러보기</Link></li>
                <li><Link to="/create-playlist" className="hover:text-gray-900">플레이리스트 만들기</Link></li>
                <li><Link to="/food-mbti" className="hover:text-gray-900">음식 MBTI</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">커뮤니티</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/curators" className="hover:text-gray-900">맛잘알 큐레이터</Link></li>
                <li><Link to="/trending" className="hover:text-gray-900">트렌딩</Link></li>
                <li><Link to="/local" className="hover:text-gray-900">지역별 맛집</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">고객지원</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/help" className="hover:text-gray-900">도움말</Link></li>
                <li><Link to="/contact" className="hover:text-gray-900">문의하기</Link></li>
                <li><Link to="/privacy" className="hover:text-gray-900">개인정보처리방침</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            © 2025 BobMap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LayoutMVP;