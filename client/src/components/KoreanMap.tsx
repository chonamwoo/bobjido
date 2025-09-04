import React, { useEffect, useRef, useState } from 'react';
import { Restaurant } from '../types';

interface KoreanMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  restaurants?: Restaurant[];
  lists?: any[];
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onListClick?: (list: any) => void;
  onMapClick?: (lat: number, lng: number) => void;  // onMapClick 속성 추가
  markerSize?: string;  // markerSize 속성 추가
}

const KoreanMap: React.FC<KoreanMapProps> = ({
  center = { lat: 37.5665, lng: 126.9780 }, // 서울 시청
  zoom = 12,
  className = "w-full h-96",
  restaurants = [],
  lists = [],
  onRestaurantClick,
  onListClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
            // 더 긴 지연시간으로 DOM이 완전히 준비되도록 함
            setTimeout(initializeMap, 500);
          };
          script.onerror = () => {
            setError('지도 라이브러리 로드에 실패했습니다.');
            setLoading(false);
          };
          document.head.appendChild(script);
        } else {
          // Leaflet이 이미 로드되었더라도 지연 추가
          setTimeout(initializeMap, 200);
        }
      } catch (err) {
        console.error('Error loading map:', err);
        setError('지도 로드 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    const initializeMap = (retryCount = 0) => {
      if (!mapRef.current) {
        if (retryCount < 3) {
          // 컨테이너가 없으면 재시도
          setTimeout(() => initializeMap(retryCount + 1), 500);
          return;
        }
        setError('지도 컨테이너를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const L = (window as any).L;
        
        // 기존 맵 인스턴스가 있으면 제거
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.off();
            mapInstanceRef.current.remove();
          } catch (e) {
            console.warn('Error removing previous map instance:', e);
          }
          mapInstanceRef.current = null;
        }
        
        // 컨테이너 초기화 확인 - 모든 Leaflet 관련 속성 제거
        if ((mapRef.current as any)._leaflet_id) {
          delete (mapRef.current as any)._leaflet_id;
        }
        // innerHTML 초기화로 모든 하위 요소 제거
        mapRef.current.innerHTML = '';
        
        // 컨테이너가 DOM에 있는지 확인
        if (!document.body.contains(mapRef.current)) {
          if (retryCount < 3) {
            console.warn('Map container not in DOM, retrying...');
            setTimeout(() => initializeMap(retryCount + 1), 500);
            return;
          }
          setError('지도 컨테이너가 DOM에 없습니다.');
          setLoading(false);
          return;
        }
        
        // 컨테이너 크기 확인
        const rect = mapRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          if (retryCount < 3) {
            console.warn('Map container has no size, retrying...');
            setTimeout(() => initializeMap(retryCount + 1), 500);
            return;
          }
        }
        
        // 맵 초기화 - preferCanvas 옵션 추가로 성능 향상
        const newMap = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
          preferCanvas: true,
        });

        // OpenStreetMap 타일 레이어 추가 (한국어 지원)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(newMap);

        console.log('Korean Map initialized successfully');
        mapInstanceRef.current = newMap;
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize map:', err);
        if (retryCount < 3) {
          console.warn('Retrying map initialization...');
          setTimeout(() => initializeMap(retryCount + 1), 500);
        } else {
          setError('지도 초기화에 실패했습니다.');
          setLoading(false);
        }
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (err) {
          console.warn('Error cleaning up map:', err);
        }
      }
    };
  }, []); // Remove center and zoom from dependencies to prevent reinitializing

  // Update map center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      try {
        // 맵이 유효한지 확인
        const container = mapInstanceRef.current.getContainer();
        if (container && document.body.contains(container)) {
          mapInstanceRef.current.setView([center.lat, center.lng], zoom, {
            animate: true,
            duration: 1
          });
        }
      } catch (err) {
        console.warn('Error updating map center:', err);
      }
    }
  }, [center, zoom]);

  // 레스토랑 및 리스트 마커 추가
  useEffect(() => {
    if (!mapInstanceRef.current || (!restaurants?.length && !lists?.length)) return;

    const L = (window as any).L;
    const map = mapInstanceRef.current;
    
    try {
      // 기존 마커들 제거
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // 레스토랑 마커 추가
      restaurants.forEach((restaurant, index) => {
        if (restaurant.coordinates) {
          // 커스텀 밥 아이콘 생성 (레스토랑)
          const foodIcon = L.divIcon({
            html: `
              <div style="
                position: relative;
                width: 28px;
                height: 32px;
              ">
                <div style="
                  background: linear-gradient(135deg, #FF6B35, #FF8E53);
                  width: 28px;
                  height: 28px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 16px;
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                ">🍚</div>
                <div style="
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  border-left: 4px solid transparent;
                  border-right: 4px solid transparent;
                  border-top: 5px solid white;
                "></div>
              </div>
            `,
            className: 'food-marker',
            iconSize: [28, 32],
            iconAnchor: [14, 32]
          });

          const marker = L.marker([restaurant.coordinates.lat, restaurant.coordinates.lng], { icon: foodIcon })
            .addTo(map);

          // 클릭 이벤트 처리
          if (onRestaurantClick) {
            marker.on('click', () => {
              onRestaurantClick(restaurant);
            });
          }
        }
      });

      // 리스트 마커 추가
      lists.forEach((list, index) => {
        // 리스트의 첫 번째 레스토랑 위치 사용
        if (list.restaurants && list.restaurants.length > 0) {
          const firstRestaurant = list.restaurants[0].restaurant;
          // 간단한 좌표 생성 (서울 주변 랜덤)
          const lat = 37.5665 + (Math.random() - 0.5) * 0.1;
          const lng = 126.9780 + (Math.random() - 0.5) * 0.1;
          
          // 커스텀 리스트 아이콘 생성
          const listIcon = L.divIcon({
            html: `
              <div style="
                position: relative;
                width: 36px;
                height: 40px;
              ">
                <div style="
                  background: linear-gradient(135deg, #3B82F6, #2563EB);
                  width: 36px;
                  height: 36px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 18px;
                  border-radius: 8px;
                  border: 2px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                ">📋</div>
                <div style="
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  border-left: 5px solid transparent;
                  border-right: 5px solid transparent;
                  border-top: 6px solid white;
                "></div>
              </div>
            `,
            className: 'list-marker',
            iconSize: [36, 40],
            iconAnchor: [18, 40]
          });

          const marker = L.marker([lat, lng], { icon: listIcon })
            .addTo(map);

          // 클릭 이벤트 처리
          if (onListClick) {
            marker.on('click', () => {
              onListClick(list);
            });
          }
        }
      });

      // 모든 마커가 보이도록 지도 범위 조정
      const allMarkers: any[] = [];
      restaurants.forEach(r => {
        if (r.coordinates) {
          allMarkers.push(L.marker([r.coordinates.lat, r.coordinates.lng]));
        }
      });
      lists.forEach(l => {
        if (l.restaurants && l.restaurants.length > 0) {
          const lat = 37.5665 + (Math.random() - 0.5) * 0.1;
          const lng = 126.9780 + (Math.random() - 0.5) * 0.1;
          allMarkers.push(L.marker([lat, lng]));
        }
      });
      
      if (allMarkers.length > 0) {
        const group = new L.featureGroup(allMarkers);
        if (group.getLayers().length > 0) {
          map.fitBounds(group.getBounds().pad(0.1));
        }
      }
    } catch (err) {
      console.error('Error adding markers:', err);
    }
  }, [restaurants, lists, onRestaurantClick, onListClick]);

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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-[1000] rounded">
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

export default KoreanMap;