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
      {/* 모바일 헤더 - Dynamic Island 대응 개선 */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40 w-full">
        <div className="pt-safe"> {/* iPhone notch/Dynamic Island safe area */}
          <div className="flex items-center justify-between h-11 px-4 max-w-full">
            <div className="flex items-center flex-1">
              {!isHomePage ? (
                <button
                  onClick={() => navigate(-1)}
                  className="p-1.5 -ml-1.5 mr-2"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                </button>
              ) : (
                <span className="text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  BobMap
                </span>
              )}
            </div>
            
            {/* 아이콘들을 더 간결하게, 알림 점 제거 */}
            <div className="flex items-center gap-0.5">
              <button 
                onClick={() => navigate('/create-playlist')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="만들기"
              >
                <PlusIcon className="w-5 h-5 text-gray-600" />
              </button>
              
              <button 
                onClick={() => navigate('/messages')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="메시지"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
              </button>
              
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="알림"
              >
                <BellIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pt-11 pb-20 w-full overflow-x-hidden">
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