export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  tasteProfile?: string | {
    type?: string;
    scores?: {
      spicy_adventurer: number;
      trendy_explorer: number;
      comfort_lover: number;
      social_foodie: number;
      budget_gourmet: number;
      premium_diner: number;
      solo_explorer: number;
      traditional_taste: number;
    };
    lastUpdated?: string;
    spicyTolerance?: number;
    sweetPreference?: number;
    pricePreference?: string;
    atmosphereStyle?: string[];
    cuisineExpertise?: string[];
  };
  onboardingCompleted?: boolean;
  rankings?: Record<string, { rank: number; score: number }>;
  trustScore: number;
  followerCount: number;
  followingCount: number;
  visitedRestaurantsCount: number;
  isFollowing?: boolean;
  isAdmin?: boolean;  // Admin 속성 추가
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  roadAddress?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: string;
  subCategory?: string;
  priceRange: string;
  images: Array<{
    url: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  phoneNumber?: string;
  businessHours?: Record<string, {
    open: string;
    close: string;
    isOpen: boolean;
  }>;
  averageRating: number;
  reviewCount: number;
  tags: string[];
  dnaProfile: {
    atmosphere: string[];
    foodStyle: string[];
    instagramability: number;
    dateSpot: number;
    groupFriendly: number;
    soloFriendly: number;
  };
  menuItems?: Array<{
    name: string;
    price?: number;
    description?: string;
    isPopular: boolean;
    category?: string;
  }>;
  features: string[];
  createdBy: User;
  verifiedBy: Array<{
    user: User;
    verifiedAt: string;
  }>;
  isVerified: boolean;
  viewCount: number;
  saveCount: number;
  savedBy?: Array<{  // savedBy 속성 추가
    user: string | User;
    savedAt?: string;
  }>;
  detailedAverages?: {  // detailedAverages 속성 추가
    taste: number;
    service: number;
    cleanliness: number;
    price: number;
  };
  region?: {
    city: string;
    district: string;
    neighborhood: string;
  };
  similarRestaurants?: Array<{
    restaurant: Restaurant;
    similarity: number;
  }>;
  externalReviewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  createdBy: User;
  collaborators: Array<{
    user: User;
    role: 'editor' | 'viewer';
    addedAt: string;
  }>;
  restaurants: Array<{
    restaurant: Restaurant;
    order: number;
    personalNote?: string;
    mustTry: string[];
    addedBy: User;
    addedAt: string;
  }>;
  tags: string[];
  isPublic: boolean;
  category: string;
  theme?: string;
  targetAudience: string[];
  estimatedCost?: {
    min: number;
    max: number;
    perPerson: boolean;
  };
  estimatedDuration?: number;
  region?: {
    city: string;
    district: string;
    neighborhood: string;
  };
  likes: Array<{
    user: string;
    likedAt: string;
  }>;
  saves: Array<{
    user: string;
    savedAt: string;
  }>;
  completions: Array<{
    user: string;
    completedAt: string;
    visitedRestaurants: string[];
  }>;
  shareCount: number;
  viewCount: number;
  commentCount: number;
  remixedFrom?: Playlist;
  remixes: Array<{
    playlist: Playlist;
    createdAt: string;
  }>;
  route?: {
    type: 'walking' | 'transit' | 'driving';
    totalDistance: number;
    totalDuration: number;
    waypoints: Array<{
      restaurant: string;
      arrivalTime: string;
      departureTime: string;
    }>;
  };
  isActive: boolean;
  isFeatured: boolean;
  featuredAt?: string;
  
  // Computed fields
  likeCount: number;
  saveCount: number;
  completionCount: number;
  restaurantCount: number;
  isLiked: boolean;
  isSaved: boolean;
  canEdit: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistCardProps {
  playlist: Playlist;
}

export interface KakaoPlace {
  id: string;
  name: string;
  address: string;
  roadAddress?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
  telephone?: string; // Naver API uses 'telephone' field
  phoneNumber?: string; // Alternative phone field name
  category: string;
  kakaoPlaceId?: string;
  naverId?: string; // Naver API identifier
  images?: Array<{
    url: string;
    uploadedAt?: Date;
  }> | string[]; // Support both string array and object array
}

export interface SearchFilters {
  category?: string;
  city?: string;
  district?: string;
  tags?: string;
  priceRange?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  data?: T;
  pagination?: PaginationInfo;
  message?: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}