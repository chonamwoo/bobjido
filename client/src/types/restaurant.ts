export interface OperatingHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
  is24Hours?: boolean;
  breakTime?: { start: string; end: string };
  lastOrder?: string;
}

export interface ExtendedRestaurant {
  _id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  
  // Category System
  category: string; // Main category (e.g., '한식')
  subCategory?: string; // Specific cuisine type
  signatureDishes?: string[]; // Array of signature dish IDs
  
  // Price and Ratings
  priceRange: '저렴한' | '보통' | '비싼' | '매우비싼';
  averagePrice?: number; // Average price per person
  averageRating: number;
  reviewCount: number;
  detailedAverages: {
    taste: number;
    cleanliness: number;
    service: number;
    price: number;
    location: number;
  };
  
  // Operating Info
  phoneNumber?: string;
  operatingHours?: OperatingHours;
  isOpenNow?: boolean; // Calculated based on current time
  
  // Amenities
  amenities?: string[]; // Array of amenity IDs from amenityFilters
  
  // Atmosphere
  atmosphere?: string[]; // Array of atmosphere IDs from atmosphereFilters
  
  // Media & Certifications
  mediaCertifications?: string[]; // Array of media program IDs
  
  // Distance (calculated dynamically based on user location)
  distance?: number; // in meters
  walkingTime?: number; // in minutes
  drivingTime?: number; // in minutes
  
  // Context Tags
  contextTags?: string[]; // e.g., 'date-night', 'business-meeting'
  
  // Additional Info
  description?: string;
  images?: string[];
  savedBy?: string[];
  createdBy?: any;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Special Features
  noDelivery?: boolean; // 배달 안하는 집
  elderReviews?: boolean; // 어르신 리뷰 많은 집
  deliveryBikeWaiting?: boolean; // 배달 오토바이도 줄서는 집
  localFavorite?: boolean; // 현지인 단골 많은 집
  hardParkingButBusy?: boolean; // 주차 어려운데도 붐비는 집
}

export const isRestaurantOpen = (hours?: OperatingHours): boolean => {
  if (!hours) return false;
  if (hours.is24Hours) return true;
  
  const now = new Date();
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const todayHours = hours[currentDay as keyof OperatingHours] as { open: string; close: string } | undefined;
  if (!todayHours) return false;
  
  // Handle break time
  if (hours.breakTime) {
    if (currentTime >= hours.breakTime.start && currentTime < hours.breakTime.end) {
      return false;
    }
  }
  
  // Check if within operating hours
  if (currentTime >= todayHours.open && currentTime < todayHours.close) {
    return true;
  }
  
  // Handle overnight hours (e.g., close time is after midnight)
  if (todayHours.close < todayHours.open) {
    return currentTime >= todayHours.open || currentTime < todayHours.close;
  }
  
  return false;
};