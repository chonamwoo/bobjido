import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MobileNavigation from './mobile/MobileNavigation';
import { 
  ChevronLeftIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

const MobileLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 알림 상태 (실제로는 API나 상태 관리에서 가져와야 함)
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* 모바일 헤더 - Dynamic Island 대응 개선 */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40 w-full">
        <div className="pt-safe"> {/* iPhone notch/Dynamic Island safe area */}
          <div className="flex items-center justify-between h-12 px-3 max-w-full">
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
            
            {/* 드롭다운 메뉴 버튼 */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label="메뉴"
              >
                <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
                {/* 알림 표시 */}
                {(hasNewMessage || hasNewNotification) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* 드롭다운 메뉴 */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                  <button
                    onClick={() => {
                      navigate('/create-playlist');
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <PlusIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">플레이리스트 만들기</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/messages');
                      setHasNewMessage(false);
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">메시지</span>
                    </div>
                    {hasNewMessage && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setHasNewNotification(false);
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <BellIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">알림</span>
                    </div>
                    {hasNewNotification && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pt-12 pb-20 w-full overflow-x-hidden">
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