import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ClockIcon,
  UserGroupIcon,
  FireIcon,
  CheckCircleIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

interface CommunityPostModalProps {
  post: any;
  onClose: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onCommentAdd?: (postId: string, comment: any) => void;
  isShareMode?: boolean;
}

const CommunityPostModal: React.FC<CommunityPostModalProps> = ({
  post,
  onClose,
  onLike,
  onSave,
  onShare,
  onCommentAdd,
  isShareMode = false,
}) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);

  // localStorage에서 댓글 데이터 불러오기
  useEffect(() => {
    if (post) {
      const storedComments = localStorage.getItem(`comments_${post.id}`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        setComments([]);
      }
    }
  }, [post]);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        id: `c_${Date.now()}`,
        author: {
          id: 'current_user',
          name: '사용자',
          avatar: '😊',
        },
        content: commentText,
        createdAt: '방금 전',
        likes: 0,
        isLiked: false,
        replies: [],
      };

      const updatedComments = [...comments, newComment];
      setComments(updatedComments);

      // localStorage에 저장
      localStorage.setItem(`comments_${post.id}`, JSON.stringify(updatedComments));

      // 댓글 수 업데이트
      if (onCommentAdd) {
        onCommentAdd(post.id, newComment);
      }

      setCommentText('');
      setShowCommentInput(false);
    }
  };

  if (!post) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 ${isShareMode ? 'z-[30]' : 'z-50'}`} onClick={onClose}>
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white">
              {post.author.avatar}
            </div>
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-xs text-gray-500">{post.author.level} · {post.createdAt}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            {/* Title & Category */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  post.type === 'recipe' ? 'bg-orange-100 text-orange-800' :
                  post.type === 'tip' ? 'bg-blue-100 text-blue-800' :
                  post.type === 'review' ? 'bg-purple-100 text-purple-800' :
                  post.type === 'combination' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {post.category}
                </span>
                {post.author.isVerified && (
                  <span className="text-blue-500 text-sm flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    인증됨
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold">{post.title}</h1>
            </div>

            {/* Recipe Info */}
            {post.type === 'recipe' && (
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
                <div className="text-center">
                  <FireIcon className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                  <div className="text-sm text-gray-600">난이도</div>
                  <div className="font-medium">{post.difficulty}</div>
                </div>
                <div className="text-center">
                  <ClockIcon className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                  <div className="text-sm text-gray-600">조리시간</div>
                  <div className="font-medium">{post.cookTime}</div>
                </div>
                <div className="text-center">
                  <UserGroupIcon className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                  <div className="text-sm text-gray-600">인분</div>
                  <div className="font-medium">{post.servings}인분</div>
                </div>
              </div>
            )}

            {/* Tip Info */}
            {post.type === 'tip' && post.tipDetails && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <StarIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">핵심 꿀팁</h3>
                    <p className="text-blue-800">{post.tipDetails.summary}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content/Description */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">소개</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.detailedContent || post.content}</p>
            </div>

            {/* Ingredients for Recipe */}
            {post.type === 'recipe' && post.ingredients && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">재료</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="grid grid-cols-2 gap-2">
                    {post.ingredients.map((ingredient: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Steps for Recipe */}
            {post.type === 'recipe' && post.steps && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">조리 순서</h3>
                <div className="space-y-4">
                  {post.steps.map((step: any) => (
                    <div key={step.order} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {step.order}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">{step.description}</p>
                        {step.tip && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            💡 팁: {step.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Tips */}
            {post.type === 'tip' && post.detailedSteps && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">상세 방법</h3>
                <div className="space-y-4">
                  {post.detailedSteps.map((step: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{step.title}</h4>
                        <p className="text-gray-700">{step.description}</p>
                        {step.warning && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            ⚠️ 주의: {step.warning}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Tips or Notes */}
            {post.additionalTips && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">추가 팁</h4>
                <ul className="space-y-1">
                  {post.additionalTips.map((tip: string, index: number) => (
                    <li key={index} className="text-green-800 flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 댓글 작성 버튼 강조 */}
            <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
              <button
                onClick={() => setShowCommentInput(!showCommentInput)}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
                댓글 작성하기
              </button>
            </div>

            {/* 댓글 섹션 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <ChatBubbleLeftIcon className="w-5 h-5 text-gray-600" />
                  댓글 ({comments.length})
                </h3>
              </div>

              {/* 댓글 입력창 */}
              {showCommentInput && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="w-full p-2 border rounded-lg text-sm resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setCommentText('');
                        setShowCommentInput(false);
                      }}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleCommentSubmit}
                      className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      등록
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {comments.length > 0 ? (
                  comments.map((comment: any) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm">
                          {comment.author.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.author.name}</span>
                            <span className="text-xs text-gray-500">{comment.createdAt}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500">
                              <HeartIcon className="w-3 h-3" />
                              {comment.likes}
                            </button>
                            {comment.replies && (
                              <span className="text-xs text-gray-500">
                                답글 {comment.replies.length}개
                              </span>
                            )}
                          </div>
                          {/* 답글 표시 */}
                          {comment.replies && comment.replies.map((reply: any) => (
                            <div key={reply.id} className="mt-3 ml-4 p-2 bg-white rounded border-l-2 border-gray-300">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold">{reply.author.name}</span>
                                <span className="text-xs text-gray-400">{reply.createdAt}</span>
                              </div>
                              <p className="text-xs text-gray-700">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">첫 번째 댓글을 남겨보세요!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions - 댓글 제거, 좋아요/저장/공유만 표시 */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onLike}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {post.isLiked ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="font-medium">{post.likes}</span>
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {post.isSaved ? (
                  <BookmarkSolidIcon className="w-5 h-5 text-orange-500" />
                ) : (
                  <BookmarkIcon className="w-5 h-5" />
                )}
                <span className="font-medium">{post.saves}</span>
              </button>
              <button
                onClick={onShare}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
                <span>공유</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostModal;