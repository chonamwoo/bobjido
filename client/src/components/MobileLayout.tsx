import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MobileNavigation from './mobile/MobileNavigation';
import { 
  ChevronLeftIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  BellIcon 
} from '@heroicons/react/24/outline';

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
            <div className="flex items-center gap-2">
              {/* Create Button */}
              <button 
                onClick={() => navigate('/create-playlist')}
                className="p-2"
                title="만들기"
              >
                <PlusIcon className="w-6 h-6 text-gray-700" />
              </button>
              
              {/* Messages Button */}
              <button 
                onClick={() => navigate('/messages')}
                className="p-2 relative"
                title="메시지"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Notifications Button */}
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2 relative"
                title="알림"
              >
                <BellIcon className="w-6 h-6 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
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