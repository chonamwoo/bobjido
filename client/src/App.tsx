import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LayoutMVP from './components/LayoutMVP';
import MobileLayout from './components/MobileLayout';
import { useIsMobile } from './hooks/useIsMobile';
import { useAuthStore } from './store/authStore';
import socketService from './services/socketService';
import './styles/mobile.css';
import 'leaflet/dist/leaflet.css';
import HomeSoundCloud from './pages/HomeSoundCloud';
import MobileHomeSoundCloud from './pages/MobileHomeSoundCloud';
import FoodMBTI from './pages/FoodMBTI';
import GameHub from './pages/GameHub';
import GameResults from './pages/GameResults';
import LunchRecommendation from './pages/LunchRecommendation';
import FoodVS from './pages/FoodVS';
import FoodRoulette from './pages/FoodRoulette';
import RestaurantQuiz from './pages/RestaurantQuiz';
import Auth from './pages/Auth';
import PlaylistDetail from './pages/PlaylistDetail';
import MobilePlaylistDetail from './pages/MobilePlaylistDetail';
import CreatePlaylist from './pages/CreatePlaylist';
import ProfileV2 from './pages/ProfileV2';
import AdminPanel from './pages/AdminPanel';
import SimpleAdminPanel from './pages/SimpleAdminPanel';
import EnhancedAdminPanel from './pages/EnhancedAdminPanel';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminRestaurantManagement from './pages/AdminRestaurantManagement';
import EnhancedProfile from './pages/EnhancedProfile';
import Discover from './pages/Discover';
import RestaurantDetail from './pages/RestaurantDetail';
import MobileRestaurantDetail from './pages/MobileRestaurantDetail';
import RestaurantMapV3 from './pages/RestaurantMapV3';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';
import SavedList from './pages/SavedList';
import Settings from './pages/Settings';
import MyLists from './pages/MyLists';
import UserProfile from './pages/UserProfile';
import MyRestaurants from './pages/MyRestaurants';
import Notifications from './pages/Notifications';
import BetaFeedback from './pages/BetaFeedback';
import Help from './pages/Help';
import MyStats from './pages/MyStats';
import LocalExpertsRanking from './pages/LocalExpertsRanking';
import InfluencerProfile from './pages/InfluencerProfile';
import RestaurantExplorer from './pages/RestaurantExplorer';
import SimplePlaylistDetail from './pages/SimplePlaylistDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SuperExplore from './pages/SuperExplore';
import MobileSuperExplore from './pages/MobileSuperExplore';
import Community from './pages/Community';
import Messages from './pages/Messages';
import MobileCommunity from './pages/MobileCommunity';
import MobileMessages from './pages/MobileMessages';
import CreateRestaurant from './pages/CreateRestaurant';
import Followers from './pages/Followers';
import Following from './pages/Following';
import Admin from './pages/Admin';
import RestaurantDataManager from './pages/RestaurantDataManager';
import MyFollowingRestaurants from './pages/MyFollowingRestaurants';
import AdminCertifiedRestaurants from './pages/AdminCertifiedRestaurants';

function App() {
  const isMobile = useIsMobile();
  const { token } = useAuthStore();
  const isAuthenticated = !!token;
  const Layout = isMobile ? MobileLayout : LayoutMVP;
  const HomePage = isMobile ? MobileHomeSoundCloud : HomeSoundCloud;
  const PlaylistPage = isMobile ? MobilePlaylistDetail : PlaylistDetail;
  const RestaurantPage = isMobile ? MobileRestaurantDetail : RestaurantDetail;
  const ExplorePage = isMobile ? MobileSuperExplore : SuperExplore;
  const CommunityPage = isMobile ? MobileCommunity : Community;
  const MessagesPage = isMobile ? MobileMessages : Messages;
  
  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
    } else {
      socketService.disconnect();
    }
    
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, token]);
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="game-hub" element={<GameHub />} />
        <Route path="food-mbti" element={<FoodMBTI />} />
        <Route path="game-results" element={<GameResults />} />
        <Route path="lunch-recommendation" element={<LunchRecommendation />} />
        <Route path="food-vs" element={<FoodVS />} />
        <Route path="food-roulette" element={<FoodRoulette />} />
        <Route path="restaurant-quiz" element={<RestaurantQuiz />} />
        <Route path="auth" element={<Auth />} />
        <Route path="login" element={<Auth />} />
        <Route path="register" element={<Auth />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="discover" element={<Discover />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="messages" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
        <Route path="create-restaurant" element={
          <ProtectedRoute>
            <CreateRestaurant />
          </ProtectedRoute>
        } />
        <Route path="map" element={<RestaurantMapV3 />} />
        <Route path="saved" element={<SavedList />} />
        <Route path="my-lists" element={<MyLists />} />
        <Route path="playlist/:id" element={<PlaylistPage />} />
        <Route path="restaurant/:id" element={<RestaurantPage />} />
        <Route
          path="create-playlist"
          element={
            <ProtectedRoute>
              <CreatePlaylist />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfileV2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/:username"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-restaurants"
          element={
            <ProtectedRoute>
              <MyRestaurants />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route path="beta-feedback" element={<BetaFeedback />} />
        <Route path="help" element={<Help />} />
        <Route path="restaurant-data" element={<RestaurantDataManager />} />
        <Route 
          path="my-following-restaurants" 
          element={
            <ProtectedRoute>
              <MyFollowingRestaurants />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="my-stats" 
          element={
            <ProtectedRoute>
              <MyStats />
            </ProtectedRoute>
          } 
        />
        <Route path="local-experts" element={<LocalExpertsRanking />} />
        <Route path="expert/:username" element={<EnhancedProfile />} />
        <Route path="expert/:username/followers" element={<Followers />} />
        <Route path="expert/:username/following" element={<Following />} />
        <Route path="expert-playlist/:id" element={<SimplePlaylistDetail />} />
        <Route path="influencer/:id" element={<InfluencerProfile />} />
      </Route>
      
      {/* Admin Routes - Layout 밖에 배치 */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/edit" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/panel" element={<EnhancedAdminPanel />} />
      <Route path="/admin/users" element={<AdminUserManagement />} />
      <Route path="/admin/restaurants" element={<AdminRestaurantManagement />} />
      <Route path="/admin/certified-restaurants" element={<AdminCertifiedRestaurants />} />
    </Routes>
  );
}

export default App;