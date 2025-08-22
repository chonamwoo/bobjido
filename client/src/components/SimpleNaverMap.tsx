import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    naver: any;
  }
}

interface SimpleNaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const SimpleNaverMap: React.FC<SimpleNaverMapProps> = ({
  center = { lat: 37.5665, lng: 126.9780 }, // 서울 시청
  zoom = 10,
  className = "w-full h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNaverMap = async () => {
      try {
        // 이미 스크립트가 로드되어 있는지 확인
        if (window.naver && window.naver.maps) {
          initializeMap();
          return;
        }

        // 스크립트 로드
        const script = document.createElement('script');
        script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=g6woqkryyb';
        script.async = true;
        
        script.onload = () => {
          console.log('Naver Maps script loaded');
          // 잠시 대기 후 맵 초기화
          setTimeout(() => {
            if (window.naver && window.naver.maps) {
              initializeMap();
            } else {
              setError('네이버 지도 API 로드에 실패했습니다.');
              setLoading(false);
            }
          }, 100);
        };

        script.onerror = () => {
          console.error('Failed to load Naver Maps script');
          setError('네이버 지도 스크립트 로드에 실패했습니다.');
          setLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('Error loading Naver Map:', err);
        setError('지도 로드 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) {
        console.error('Map container not found');
        setError('지도 컨테이너를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        console.log('Initializing map...');
        const mapOptions = {
          center: new window.naver.maps.LatLng(center.lat, center.lng),
          zoom: zoom,
          mapTypeControl: true,
          zoomControl: true,
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        console.log('Map initialized successfully:', map);
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('지도 초기화에 실패했습니다.');
        setLoading(false);
      }
    };

    loadNaverMap();
  }, [center.lat, center.lng, zoom]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border rounded`}>
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default SimpleNaverMap;