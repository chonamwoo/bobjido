import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftIcon,
  HeartIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface RestaurantCommentsProps {
  restaurantId: string;
  playlistId: string;
  isOpen?: boolean;
}

const RestaurantComments: React.FC<RestaurantCommentsProps> = ({ 
  restaurantId, 
  playlistId,
  isOpen = false 
}) => {
  const [showComments, setShowComments] = useState(isOpen);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'user1',
      userName: '맛집탐험가',
      userAvatar: 'https://ui-avatars.com/api/?name=맛집탐험가&size=150&background=FF6B6B&color=fff',
      content: '여기 진짜 맛있어요! 특히 갈비탕이 끝내줍니다 👍',
      createdAt: new Date('2024-03-10'),
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          userId: 'user2',
          userName: '푸드러버',
          content: '저도 동의해요! 국물이 진짜 진해요',
          createdAt: new Date('2024-03-11'),
          likes: 3,
          isLiked: false
        }
      ]
    },
    {
      id: '2',
      userId: 'user3',
      userName: '강남미식가',
      userAvatar: 'https://ui-avatars.com/api/?name=강남미식가&size=150&background=4F46E5&color=fff',
      content: '웨이팅이 좀 있지만 기다릴 가치가 있어요. 평일 2시쯤 가면 바로 들어갈 수 있습니다',
      createdAt: new Date('2024-03-12'),
      likes: 8,
      isLiked: true
    }
  ]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: '나',
      userAvatar: 'https://ui-avatars.com/api/?name=나&size=150&background=10B981&color=fff',
      content: newComment,
      createdAt: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  return (
    <div className="border-t pt-4">
      {/* 댓글 토글 버튼 */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChatBubbleLeftIcon className="w-5 h-5 text-gray-600" />
          <span className="font-medium">댓글 {comments.length}개</span>
        </div>
        {showComments ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* 댓글 섹션 */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* 댓글 입력 */}
            <div className="p-3 bg-gray-50 rounded-lg mb-3">
              <div className="flex gap-2">
                <UserCircleIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="이 맛집에 대한 의견을 남겨주세요..."
                    className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {newComment.length}/200
                    </span>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                        newComment.trim()
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                      <span className="text-sm">등록</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div className="flex gap-3">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
                          {format(comment.createdAt, 'MM월 dd일', { locale: ko })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors"
                        >
                          {comment.isLiked ? (
                            <HeartSolid className="w-4 h-4 text-red-500" />
                          ) : (
                            <HeartIcon className="w-4 h-4" />
                          )}
                          <span>{Array.isArray(comment.likes) ? comment.likes.length : comment.likes || 0}</span>
                        </button>
                        
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          답글
                        </button>
                      </div>

                      {/* 답글 */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-xs">{reply.userName}</span>
                                <span className="text-xs text-gray-400">
                                  {format(reply.createdAt, 'MM/dd', { locale: ko })}
                                </span>
                              </div>
                              <p className="text-gray-600">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantComments;