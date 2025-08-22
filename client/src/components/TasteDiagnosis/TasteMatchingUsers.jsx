import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  SparklesIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';

const TasteMatchingUsers = ({ matchingUsers, userType }) => {
  if (!matchingUsers || matchingUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">아직 매칭된 사용자가 없습니다.</p>
        <p className="text-sm text-gray-400 mt-2">
          더 많은 사용자가 취향 진단을 완료하면 추천해드릴게요!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <UserGroupIcon className="w-6 h-6" />
          비슷한 취향의 친구들
        </h3>
        <p className="text-purple-100 mt-1">
          당신과 같은 {userType?.koreanName} 타입의 사용자들입니다
        </p>
      </div>

      <div className="p-6">
        <div className="grid gap-4">
          {matchingUsers.map((match, idx) => (
            <motion.div
              key={match.user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <Link
                  to={`/profile/${match.user._id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="relative">
                    <img
                      src={match.user.profileImage || '/default-avatar.png'}
                      alt={match.user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: `conic-gradient(from 0deg, #a855f7 0deg, #ec4899 ${match.compatibility * 3.6}deg, #e5e7eb ${match.compatibility * 3.6}deg)`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900">
                      {match.user.username}
                    </p>
                    {match.user.bio && (
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {match.user.bio}
                      </p>
                    )}
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                        match.compatibilityGrade === 'S' ? 'bg-purple-600' :
                        match.compatibilityGrade === 'A' ? 'bg-blue-600' :
                        match.compatibilityGrade === 'B' ? 'bg-green-600' :
                        'bg-gray-600'
                      }`}>
                        {match.compatibilityGrade}
                      </span>
                      <p className="text-sm font-semibold text-purple-600">
                        {match.compatibility}%
                      </p>
                    </div>
                    {match.user.trustScore > 0 && (
                      <p className="text-xs text-gray-500">
                        신뢰도 {match.user.trustScore}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 취향 벡터 미리보기 */}
              {match.tasteVector && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">취향 분포</p>
                  <div className="grid grid-cols-4 gap-1">
                    {match.tasteVector.slice(0, 4).map((taste, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-xs text-gray-600 truncate">{taste.type}</div>
                        <div className="text-xs font-semibold text-purple-600">
                          {taste.percentage.toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {match.sharedTypes && match.sharedTypes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">공통 강점 취향</p>
                  <div className="flex gap-2">
                    {match.sharedTypes.slice(0, 3).map(type => (
                      <span
                        key={type._id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs"
                      >
                        <SparklesIcon className="w-3 h-3" />
                        {type.koreanName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <Link
                  to={`/profile/${match.user._id}`}
                  className="flex-1 btn btn-sm btn-outline text-xs"
                >
                  프로필 보기
                </Link>
                <button className="flex-1 btn btn-sm btn-primary text-xs">
                  <HeartIcon className="w-3 h-3 mr-1" />
                  팔로우
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {matchingUsers.length >= 10 && (
          <div className="mt-6 text-center">
            <button className="btn btn-outline">
              더 많은 친구 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasteMatchingUsers;