// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  tasteProfile?: TasteProfile;
  followers?: string[];
  following?: string[];
  savedPlaylists?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TasteProfile {
  spicyLevel: number;
  sweetLevel: number;
  priceRange: string;
  tasteType: string;
  lastUpdated?: string;
}

// Restaurant Types
export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  category: string;
  price?: string;
  rating?: number;
  image?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  reviews?: Review[];
  placeId?: string;
}

// Playlist Types
export interface Playlist {
  _id: string;
  title: string;
  description: string;
  creator: User | string;
  restaurants: Restaurant[];
  likes: string[];
  saves: string[];
  tags?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  user: User | string;
  restaurant: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  type: 'follow' | 'playlist_like' | 'playlist_save' | 'comment' | 'mention' | 'new_playlist' | 'match_suggestion' | 'message';
  sender: User;
  recipient: string;
  message: string;
  relatedPlaylist?: string;
  relatedRestaurant?: string;
  read: boolean;
  createdAt: string;
}

// Chat Types
export interface Chat {
  _id: string;
  type: 'personal' | 'group';
  participants: User[];
  name?: string;
  lastMessage?: Message;
  unreadCount?: number;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chat: string;
  sender: User | string;
  content: string;
  type: 'text' | 'image' | 'location' | 'restaurant';
  restaurantData?: {
    name: string;
    address: string;
    image: string;
    placeId: string;
  };
  read: boolean;
  createdAt: string;
}