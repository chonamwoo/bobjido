import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const BetaFeedback: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState({
    liked: '',
    improved: '',
    features: '',
    wouldUse: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Google Forms 또는 자체 API로 전송
    const formData = {
      rating,
      ...feedback,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // 여기에 실제 전송 로직 추가
    console.log('Feedback:', formData);
    
    // 임시로 localStorage에 저장
    const feedbacks = JSON.parse(localStorage.getItem('betaFeedbacks') || '[]');
    feedbacks.push(formData);
    localStorage.setItem('betaFeedbacks', JSON.stringify(feedbacks));
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">감사합니다! 🎉</h2>
          <p className="text-gray-600 mb-6">
            소중한 피드백이 BobMap을 더 좋게 만듭니다
          </p>
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-orange-800 mb-2">
              🎁 베타 테스터 혜택
            </p>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 정식 출시 시 프리미엄 1개월 무료</li>
              <li>• 추첨을 통한 기프티콘 증정</li>
              <li>• Early Adopter 배지 부여</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
          >
            홈으로 돌아가기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">🧪 BobMap 베타 테스트</h1>
            <p className="text-orange-100">
              여러분의 의견이 BobMap의 미래를 만듭니다
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800">테스트 버전 안내</p>
                <ul className="mt-1 text-yellow-700 space-y-1">
                  <li>• 실제 개인정보를 입력하지 마세요</li>
                  <li>• 데이터는 주기적으로 초기화됩니다</li>
                  <li>• 일부 기능이 불안정할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                전체적인 만족도
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <StarIcon 
                      className={`w-10 h-10 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Liked */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <SparklesIcon className="w-5 h-5 text-orange-500" />
                가장 마음에 든 기능은?
              </label>
              <textarea
                value={feedback.liked}
                onChange={(e) => setFeedback({...feedback, liked: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="취향 매칭이 정말 신선했어요!"
                required
              />
            </div>

            {/* Improvements */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                개선이 필요한 부분은?
              </label>
              <textarea
                value={feedback.improved}
                onChange={(e) => setFeedback({...feedback, improved: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="로딩이 조금 느린 것 같아요"
                required
              />
            </div>

            {/* New Features */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <LightBulbIcon className="w-5 h-5 text-blue-500" />
                추가됐으면 하는 기능은?
              </label>
              <textarea
                value={feedback.features}
                onChange={(e) => setFeedback({...feedback, features: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="맛집 예약 기능이 있으면 좋겠어요"
              />
            </div>

            {/* Would Use */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <ChatBubbleLeftIcon className="w-5 h-5 text-green-500" />
                정식 출시되면 사용하실 건가요?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['꼭 사용할게요!', '고민중이에요', '글쎄요...', '아니요'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFeedback({...feedback, wouldUse: option})}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      feedback.wouldUse === option
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일 (선택사항 - 혜택 안내용)
              </label>
              <input
                type="email"
                value={feedback.email}
                onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              피드백 제출하기 🚀
            </button>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
            <p>문의: bobmap.beta@gmail.com</p>
            <p className="mt-1">카톡 오픈채팅: BobMap 베타테스터</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BetaFeedback;