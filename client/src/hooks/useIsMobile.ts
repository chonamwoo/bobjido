import { useState, useEffect } from 'react';

// 모바일 디바이스 감지 훅
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // 화면 크기 기반 체크
      const screenWidth = window.innerWidth <= 768;
      
      // User Agent 기반 체크
      const mobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // 터치 지원 체크
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(screenWidth || mobileDevice || touchDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// 모바일 기기 타입 감지
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      
      if (width <= 480) {
        setDeviceType('mobile');
      } else if (width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return deviceType;
};

// 특정 모바일 OS 감지
export const useMobileOS = () => {
  const [os, setOS] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setOS('ios');
    } else if (/android/i.test(userAgent)) {
      setOS('android');
    }
  }, []);

  return os;
};