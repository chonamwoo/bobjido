import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  UserIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  UserIcon as UserIconSolid,
  MapPinIcon as MapPinIconSolid
} from '@heroicons/react/24/solid';

const MobileNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      icon: HomeIcon, 
      iconActive: HomeIconSolid, 
      label: '홈' 
    },
    { 
      path: '/map', 
      icon: MapPinIcon, 
      iconActive: MapPinIconSolid, 
      label: '지도' 
    },
    { 
      path: '/community', 
      icon: UsersIcon, 
      iconActive: UsersIconSolid, 
      label: '커뮤니티' 
    },
    { 
      path: '/profile', 
      icon: UserIcon, 
      iconActive: UserIconSolid, 
      label: '프로필' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[9999] w-full">
      <div className="flex justify-around items-center h-16 px-2 w-full max-w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.iconActive : item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 py-2 min-w-0"
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${
                  isActive ? 'text-orange-500' : 'text-gray-400'
                }`} 
              />
              <span 
                className={`text-xs ${
                  isActive ? 'text-orange-500 font-medium' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* iPhone X 이상 홈 인디케이터 공간 */}
      <div className="pb-safe bg-white" />
    </nav>
  );
};

export default MobileNavigation;