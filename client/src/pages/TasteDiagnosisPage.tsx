import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axios';
import { 
  BeakerIcon, 
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import TasteProfileCard from '../components/TasteDiagnosis/TasteProfileCard';
import TasteMatchingUsers from '../components/TasteDiagnosis/TasteMatchingUsers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TasteDiagnosisPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('intro');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const response = await axiosInstance.get(`/api/taste-profile/profile/${user._id}`);
      if (response.data.profile) {
        setProfile(response.data.profile);
        setStep('result');
        if (response.data.profile.confirmedByUser) {
          fetchMatchingUsers();
        }
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error fetching profile:', error);
      }
    }
  };

  const fetchMatchingUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/taste-profile/matching-users');
      setMatchingUsers(response.data.matchingUsers);
    } catch (error) {
      console.error('Error fetching matching users:', error);
    }
  };

  const startAnalysis = async () => {
    setLoading(true);
    setError(null);
    setStep('analyzing');

    try {
      const response = await axiosInstance.post('/api/taste-profile/analyze');
      
      if (response.data.profile) {
        setProfile(response.data.profile);
        setStep('result');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '분석 중 오류가 발생했습니다');
      setStep('intro');
    } finally {
      setLoading(false);
    }
  };

  const confirmProfile = async () => {
    try {
      const response = await axiosInstance.post('/api/taste-profile/confirm', {
        confirm: true,
        sharePreference: 'public'
      });
      
      setProfile(response.data.profile);
      fetchMatchingUsers();
    } catch (error) {
      console.error('Error confirming profile:', error);
    }
  };

  const reanalyze = () => {
    setProfile(null);
    setStep('intro');
    startAnalysis();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <ExclamationCircleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">
            취향 진단을 받으려면 먼저 로그인해주세요
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary w-full"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            맛 취향 진단
          </h1>
          <p className="text-lg text-gray-600">
            당신의 맛집 방문 기록을 분석해 취향을 진단하고, 비슷한 취향의 친구들을 찾아드립니다
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto"
          >
            <p className="flex items-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5" />
              {error}
            </p>
          </motion.div>
        )}

        {step === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
                <div className="flex items-center justify-center mb-6">
                  <BeakerIcon className="w-20 h-20" />
                </div>
                <h2 className="text-3xl font-bold text-center mb-4">
                  나만의 맛 취향을 발견해보세요
                </h2>
                <p className="text-center text-purple-100 max-w-2xl mx-auto">
                  지금까지 방문한 맛집들을 AI가 분석하여 당신만의 고유한 맛 취향 타입을 진단해드립니다
                </p>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ChartBarIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">데이터 분석</h3>
                    <p className="text-sm text-gray-600">
                      방문 기록과 평점을 종합 분석
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <SparklesIcon className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">타입 진단</h3>
                    <p className="text-sm text-gray-600">
                      8가지 타입 중 당신의 타입 발견
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserGroupIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">친구 매칭</h3>
                    <p className="text-sm text-gray-600">
                      비슷한 취향의 친구들과 연결
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">진단 가능한 취향 타입</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['모험가', '전통주의자', '트렌드세터', '편안함 추구자', 
                      '미식가', '소셜 다이너', '디저트 러버', '건강 지향'].map((type, idx) => (
                      <div key={idx} className="bg-white rounded-lg px-3 py-2 text-center">
                        <span className="text-sm text-gray-700">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startAnalysis}
                  disabled={loading}
                  className="w-full btn btn-primary btn-lg group"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <>
                      취향 진단 시작하기
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <LoadingSpinner size="lg" />
              <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
                취향을 분석하고 있습니다...
              </h2>
              <p className="text-gray-600">
                당신의 맛집 방문 기록을 종합적으로 분석 중입니다
              </p>
              <div className="mt-8 space-y-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3 }}
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 'result' && profile && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TasteProfileCard
                profile={profile}
                onConfirm={confirmProfile}
                onReanalyze={reanalyze}
              />
            </div>
            
            <div>
              <TasteMatchingUsers
                matchingUsers={matchingUsers}
                userType={profile.primaryType}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasteDiagnosisPage;