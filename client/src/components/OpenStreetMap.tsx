import React, { useEffect, useRef, useState } from 'react';

// OpenStreetMap을 사용한 간단한 지도 컴포넌트
interface OpenStreetMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  center = { lat: 37.5665, lng: 126.9780 }, // 서울 시청
  zoom = 12,
  className = "w-full h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mapInstance: any = null;
    let initTimeout: NodeJS.Timeout;

    const loadLeaflet = async () => {
      try {
        // Leaflet CSS 로드
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Leaflet JS 로드
        if (!(window as any).L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => {
            // 스크립트 로드 후 약간의 지연을 주어 안정화
            initTimeout = setTimeout(() => {
              initializeMap();
            }, 100);
          };
          script.onerror = () => {
            setError('지도 라이브러리 로드에 실패했습니다.');
            setLoading(false);
          };
          document.head.appendChild(script);
        } else {
          // 이미 로드되어 있다면 바로 초기화
          initTimeout = setTimeout(() => {
            initializeMap();
          }, 100);
        }
      } catch (err) {
        console.error('Error loading map:', err);
        setError('지도 로드 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) {
        console.warn('Map container not found, retrying...');
        // 컨테이너가 아직 렌더링되지 않았을 수 있으므로 재시도
        initTimeout = setTimeout(() => {
          if (mapRef.current) {
            initializeMap();
          } else {
            setError('지도 컨테이너를 찾을 수 없습니다.');
            setLoading(false);
          }
        }, 500);
        return;
      }

      try {
        const L = (window as any).L;
        
        // 기존 맵 인스턴스가 있다면 제거
        if ((mapRef.current as any)._leaflet_id) {
          (mapRef.current as any)._leaflet_id = null;
          mapRef.current.innerHTML = '';
        }
        
        // 맵 초기화
        mapInstance = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
          attributionControl: true
        });

        // OpenStreetMap 타일 레이어 추가
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          minZoom: 3
        }).addTo(mapInstance);

        // 중심점에 마커 추가
        L.marker([center.lat, center.lng])
          .addTo(mapInstance)
          .bindPopup('현재 위치')
          .openPopup();

        // 지도 크기 재조정 (초기 렌더링 문제 해결)
        setTimeout(() => {
          if (mapInstance) {
            mapInstance.invalidateSize();
          }
        }, 200);

        console.log('OpenStreetMap initialized successfully');
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('지도 초기화에 실패했습니다.');
        setLoading(false);
      }
    };

    // 초기 로드 시작
    const initTimer = setTimeout(() => {
      loadLeaflet();
    }, 50);

    // Cleanup
    return () => {
      clearTimeout(initTimer);
      clearTimeout(initTimeout);
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.warn('Map cleanup error:', e);
        }
      }
    };
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
    <div className={`${className} relative`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 rounded">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded" />
    </div>
  );
};

export default OpenStreetMap;