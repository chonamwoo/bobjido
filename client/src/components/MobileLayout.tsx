import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MobileNavigation from './mobile/MobileNavigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const MobileLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* 모바일 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40 w-full">
        <div className="pt-safe">
          <div className="flex items-center justify-between h-14 px-4 max-w-full">
            <div className="flex items-center">
              {!isHomePage ? (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
              ) : (
                <span className="text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  BobMap
                </span>
              )}
            </div>
            <button 
              onClick={() => navigate('/notifications')}
              className="p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pt-14 pb-20 w-full overflow-x-hidden">
        <div className="w-full max-w-full">
          <Outlet />
        </div>
      </main>

      {/* 모바일 하단 네비게이션 */}
      <MobileNavigation />
    </div>
  );
};

export default MobileLayout;