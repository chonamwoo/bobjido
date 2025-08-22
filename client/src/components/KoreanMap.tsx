import React, { useEffect, useRef, useState } from 'react';
import { Restaurant } from '../types';

interface KoreanMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  restaurants?: Restaurant[];
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onMapClick?: (lat: number, lng: number) => void;  // onMapClick 속성 추가
  markerSize?: string;  // markerSize 속성 추가
}

const KoreanMap: React.FC<KoreanMapProps> = ({
  center = { lat: 37.5665, lng: 126.9780 }, // 서울 시청
  zoom = 12,
  className = "w-full h-96",
  restaurants = [],
  onRestaurantClick
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
            setTimeout(initializeMap, 100);
          };
          script.onerror = () => {
            setError('지도 라이브러리 로드에 실패했습니다.');
            setLoading(false);
          };
          document.head.appendChild(script);
        } else {
          initializeMap();
        }
      } catch (err) {
        console.error('Error loading map:', err);
        setError('지도 로드 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) {
        setError('지도 컨테이너를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const L = (window as any).L;
        
        // 기존 맵 인스턴스가 있으면 제거
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        
        // 컨테이너 초기화 확인
        if ((mapRef.current as any)._leaflet_id) {
          delete (mapRef.current as any)._leaflet_id;
        }
        
        // 맵 초기화
        const newMap = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
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
        setError('지도 초기화에 실패했습니다.');
        setLoading(false);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (err) {
          console.warn('Error cleaning up map:', err);
        }
      }
    };
  }, [center.lat, center.lng, zoom]);

  // 레스토랑 마커 추가
  useEffect(() => {
    if (!mapInstanceRef.current || !restaurants?.length) return;

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
      restaurants.forEach((restaurant) => {
        if (restaurant.coordinates) {
          const marker = L.marker([restaurant.coordinates.lat, restaurant.coordinates.lng])
            .addTo(map);

          // 팝업 내용
          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold text-lg mb-2">${restaurant.name}</h3>
              <p class="text-sm text-gray-600 mb-1">${restaurant.category}</p>
              <p class="text-sm text-gray-500">${restaurant.address}</p>
              ${restaurant.averageRating ? `<p class="text-sm text-yellow-600 mt-2">⭐ ${restaurant.averageRating}</p>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);

          // 클릭 이벤트
          if (onRestaurantClick) {
            marker.on('click', () => {
              onRestaurantClick(restaurant);
            });
          }
        }
      });

      // 모든 마커가 보이도록 지도 범위 조정
      if (restaurants.length > 0) {
        const group = new L.featureGroup(
          restaurants
            .filter(r => r.coordinates)
            .map(r => L.marker([r.coordinates.lat, r.coordinates.lng]))
        );
        if (group.getLayers().length > 0) {
          map.fitBounds(group.getBounds().pad(0.1));
        }
      }
    } catch (err) {
      console.error('Error adding markers:', err);
    }
  }, [restaurants, onRestaurantClick]);

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