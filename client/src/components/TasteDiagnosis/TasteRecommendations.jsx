import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  BeakerIcon,
  ChevronRightIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const TasteRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/taste-profile/recommendations');
      setRecommendations(response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        setError('notAnalyzed');
      } else {
        setError('failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 flex justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error === 'notAnalyzed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <BeakerIcon className="w-6 h-6" />
              취향 진단을 받아보세요!
            </h3>
            <p className="text-purple-100">
              당신의 맛집 취향을 분석하고 비슷한 취향의 친구들을 찾아드립니다
            </p>
          </div>
          <Link
            to="/taste-diagnosis"
            className="btn bg-white text-purple-600 hover:bg-purple-50"
          >
            진단 시작
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </motion.div>
    );
  }

  if (error || !recommendations) {
    return null;
  }

  const { userType, recommendedRestaurants, friendsRecommendations } = recommendations;

  return (
    <div className="space-y-6">
      {userType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm mb-1">당신의 취향 타입</p>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">{userType.primary?.emoji}</span>
                {userType.primary?.koreanName}
              </h3>
            </div>
            <Link
              to="/taste-diagnosis"
              className="text-white/80 hover:text-white transition-colors"
            >
              <SparklesIcon className="w-6 h-6" />
            </Link>
          </div>
          <p className="text-purple-100">
            {userType.primary?.description}
          </p>
        </motion.div>
      )}

      {recommendedRestaurants && recommendedRestaurants.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-purple-500" />
              당신의 취향에 맞는 맛집
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedRestaurants.slice(0, 6).map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurant/${restaurant._id}`}
                  className="group hover:shadow-md transition-all rounded-lg overflow-hidden border border-gray-200"
                >
                  {restaurant.images && restaurant.images[0] && (
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img
                        src={restaurant.images[0].url}
                        alt={restaurant.name}
                        className="object-cover w-full h-32 group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {restaurant.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" />
                      {restaurant.address}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {restaurant.category}
                      </span>
                      {restaurant.averageRating > 0 && (
                        <span className="flex items-center gap-1 text-sm text-yellow-600">
                          <StarIcon className="w-4 h-4 fill-current" />
                          {restaurant.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {friendsRecommendations && friendsRecommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-pink-500" />
              비슷한 취향 친구들의 추천
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {friendsRecommendations.slice(0, 5).map((restaurant, idx) => (
                <Link
                  key={`${restaurant._id}-${idx}`}
                  to={`/restaurant/${restaurant._id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {restaurant.images && restaurant.images[0] && (
                    <img
                      src={restaurant.images[0].url}
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {restaurant.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {restaurant.category} · {restaurant.address}
                    </p>
                    {restaurant.recommendedBy && (
                      <p className="text-xs text-purple-600 mt-1">
                        @{restaurant.recommendedBy.username} 님이 추천
                      </p>
                    )}
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasteRecommendations;