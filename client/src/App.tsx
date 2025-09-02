import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayoutMVP from './components/LayoutMVP';
import MobileLayout from './components/MobileLayout';
import { useIsMobile } from './hooks/useIsMobile';
import './styles/mobile.css';
import 'leaflet/dist/leaflet.css';
import HomeSoundCloud from './pages/HomeSoundCloud';
import MobileHomeSoundCloud from './pages/MobileHomeSoundCloud';
import FoodMBTI from './pages/FoodMBTI';
import GameHub from './pages/GameHub';
import LunchRecommendation from './pages/LunchRecommendation';
import MoodFood from './pages/MoodFood';
import FoodVS from './pages/FoodVS';
import FoodRoulette from './pages/FoodRoulette';
import RestaurantQuiz from './pages/RestaurantQuiz';
import Auth from './pages/Auth';
import PlaylistDetail from './pages/PlaylistDetail';
import MobilePlaylistDetail from './pages/MobilePlaylistDetail';
import CreatePlaylist from './pages/CreatePlaylist';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import SimpleAdminPanel from './pages/SimpleAdminPanel';
import EnhancedAdminPanel from './pages/EnhancedAdminPanel';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminRestaurantManagement from './pages/AdminRestaurantManagement';
import EnhancedProfile from './pages/EnhancedProfile';
import Discover from './pages/Discover';
import RestaurantDetail from './pages/RestaurantDetail';
import MobileRestaurantDetail from './pages/MobileRestaurantDetail';
import RestaurantMap from './pages/RestaurantMap';
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
import Explore from './pages/Explore';
import CreateRestaurant from './pages/CreateRestaurant';
import Followers from './pages/Followers';
import Following from './pages/Following';

function App() {
  const isMobile = useIsMobile();
  const Layout = isMobile ? MobileLayout : LayoutMVP;
  const HomePage = isMobile ? MobileHomeSoundCloud : HomeSoundCloud;
  const PlaylistPage = isMobile ? MobilePlaylistDetail : PlaylistDetail;
  const RestaurantPage = isMobile ? MobileRestaurantDetail : RestaurantDetail;
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="game-hub" element={<GameHub />} />
        <Route path="food-mbti" element={<FoodMBTI />} />
        <Route path="lunch-recommendation" element={<LunchRecommendation />} />
        <Route path="mood-food" element={<MoodFood />} />
        <Route path="food-vs" element={<FoodVS />} />
        <Route path="food-roulette" element={<FoodRoulette />} />
        <Route path="restaurant-quiz" element={<RestaurantQuiz />} />
        <Route path="auth" element={<Auth />} />
        <Route path="login" element={<Auth />} />
        <Route path="register" element={<Auth />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="discover" element={<Discover />} />
        <Route path="explore" element={<Explore />} />
        <Route path="create-restaurant" element={
          <ProtectedRoute>
            <CreateRestaurant />
          </ProtectedRoute>
        } />
        <Route path="map" element={<RestaurantMap />} />
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
              <Profile />
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
      <Route path="/admin" element={<EnhancedAdminPanel />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/panel" element={<EnhancedAdminPanel />} />
      <Route path="/admin/users" element={<AdminUserManagement />} />
      <Route path="/admin/restaurants" element={<AdminRestaurantManagement />} />
    </Routes>
  );
}

export default App;