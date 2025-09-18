import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  ShareIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchCommunityPosts,
  togglePostLike,
  togglePostSave,
  formatTimeAgo,
  CommunityPostAPI
} from '../utils/communityApi';

const CommunityRealtime: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  
  const [posts, setPosts] = useState<CommunityPostAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const postTypes = [
    { id: 'all', label: '전체', icon: NewspaperIcon, color: 'gray' },
    { id: 'review', label: '리뷰', icon: NewspaperIcon, color: 'blue' },
    { id: 'question', label: '질문', icon: QuestionMarkCircleIcon, color: 'yellow' },
    { id: 'tip', label: '꿀팁', icon: LightBulbIcon, color: 'green' },
    { id: 'discussion', label: '토론', icon: ChatBubbleOvalLeftEllipsisIcon, color: 'purple' },
    { id: 'meetup', label: '모임', icon: UserGroupIcon, color: 'red' }
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedType]);

  const loadPosts = async (loadMore = false) => {
    try {
      setLoading(!loadMore);
      const currentPage = loadMore ? page + 1 : 1;
      
      const response = await fetchCommunityPosts(
        selectedType === 'all' ? undefined : selectedType,
        currentPage,
        20
      );

      if (response.success) {
        if (loadMore) {
          setPosts(prev => [...prev, ...response.data]);
        } else {
          setPosts(response.data);
        }
        
        setPage(currentPage);
        setHasMore(response.pagination.page < response.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('포스트를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!token) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }

    try {
      const response = await togglePostLike(postId);
      if (response.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, isLiked: response.data.isLiked, likeCount: response.data.likeCount }
            : post
        ));
      }
    } catch (error) {
      toast.error('좋아요 처리에 실패했습니다');
    }
  };

  const handleSave = async (postId: string) => {
    if (!token) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }

    try {
      const response = await togglePostSave(postId);
      if (response.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, isSaved: response.data.isSaved, saveCount: response.data.saveCount }
            : post
        ));
      }
    } catch (error) {
      toast.error('저장 처리에 실패했습니다');
    }
  };

  const getTypeIcon = (type: string) => {
    const postType = postTypes.find(t => t.id === type);
    return postType ? postType.icon : NewspaperIcon;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      review: 'bg-blue-100 text-blue-700',
      question: 'bg-yellow-100 text-yellow-700',
      tip: 'bg-green-100 text-green-700',
      discussion: 'bg-purple-100 text-purple-700',
      meetup: 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              커뮤니티
            </h1>
            
            <button
              onClick={() => {
                if (!token) {
                  toast.error('로그인이 필요합니다');
                  navigate('/auth');
                } else {
                  toast('포스트 작성 기능 준비 중입니다');
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span>글쓰기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="sticky top-16 bg-white border-b z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-3 overflow-x-auto">
            {postTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedType === type.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              <AnimatePresence>
                {posts.map((post, index) => {
                  const TypeIcon = getTypeIcon(post.type);
                  
                  return (
                    <motion.article
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/community/post/${post._id}`)}
                    >
                      <div className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white font-bold">
                              {post.author.profileImage ? (
                                <img 
                                  src={post.author.profileImage} 
                                  alt={post.author.username}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                post.author.username[0].toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-1">
                                <span className="font-semibold text-gray-900">
                                  {post.author.username}
                                </span>
                                {post.author.isVerified && (
                                  <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <ClockIcon className="w-3 h-3" />
                                <span>{formatTimeAgo(post.createdAt)}</span>
                                {post.location && (
                                  <>
                                    <span>•</span>
                                    <MapPinIcon className="w-3 h-3" />
                                    <span>{post.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs ${getTypeColor(post.type)}`}>
                            <TypeIcon className="w-3.5 h-3.5" />
                            <span>{postTypes.find(t => t.id === post.type)?.label}</span>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-700 line-clamp-3">
                            {post.content}
                          </p>
                        </div>

                        {/* Images */}
                        {post.images && post.images.length > 0 && (
                          <div className="mb-4 -mx-6">
                            <div className="flex space-x-2 px-6 overflow-x-auto">
                              {post.images.map((image, idx) => (
                                <img
                                  key={idx}
                                  src={image}
                                  alt={`Image ${idx + 1}`}
                                  className="h-32 w-32 object-cover rounded-lg flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Open image viewer
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                <TagIcon className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(post._id);
                              }}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                            >
                              {post.isLiked ? (
                                <HeartSolidIcon className="w-5 h-5 text-red-500" />
                              ) : (
                                <HeartIcon className="w-5 h-5" />
                              )}
                              <span className="text-sm">{post.likeCount}</span>
                            </button>
                            
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                            >
                              <ChatBubbleLeftIcon className="w-5 h-5" />
                              <span className="text-sm">{post.commentCount}</span>
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSave(post._id);
                              }}
                              className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition-colors"
                            >
                              {post.isSaved ? (
                                <BookmarkSolidIcon className="w-5 h-5 text-yellow-500" />
                              ) : (
                                <BookmarkIcon className="w-5 h-5" />
                              )}
                              <span className="text-sm">{post.saveCount}</span>
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-gray-400">
                            <EyeIcon className="w-4 h-4" />
                            <span className="text-xs">{post.viewCount}</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {hasMore && !loading && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => loadPosts(true)}
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition-all"
                >
                  더보기
                </button>
              </div>
            )}

            {loading && page > 1 && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            )}

            {posts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">아직 포스트가 없습니다</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityRealtime;