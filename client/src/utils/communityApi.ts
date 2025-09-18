import axios from './axios';

export interface CommunityPostAPI {
  _id: string;
  type: 'review' | 'question' | 'tip' | 'discussion' | 'meetup';
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  restaurant?: {
    _id: string;
    name: string;
    address: string;
    category: string;
  };
  location?: string;
  tags: string[];
  images?: string[];
  likeCount: number;
  commentCount: number;
  saveCount: number;
  viewCount: number;
  comments: Array<{
    _id: string;
    author: {
      _id: string;
      username: string;
      profileImage?: string;
      isVerified?: boolean;
    };
    content: string;
    createdAt: string;
  }>;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 포스트 목록 조회
export const fetchCommunityPosts = async (
  type?: string,
  page = 1,
  limit = 20,
  sort = '-createdAt'
) => {
  try {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('sort', sort);

    const response = await axios.get(`/community/posts?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch community posts:', error);
    throw error;
  }
};

// 단일 포스트 조회
export const fetchCommunityPost = async (postId: string) => {
  try {
    const response = await axios.get(`/community/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch community post:', error);
    throw error;
  }
};

// 포스트 생성
export const createCommunityPost = async (postData: {
  type: string;
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
  restaurant?: string;
  location?: string;
}) => {
  try {
    const response = await axios.post('/community/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Failed to create community post:', error);
    throw error;
  }
};

// 좋아요 토글
export const togglePostLike = async (postId: string) => {
  try {
    const response = await axios.post(`/community/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Failed to toggle like:', error);
    throw error;
  }
};

// 저장 토글
export const togglePostSave = async (postId: string) => {
  try {
    const response = await axios.post(`/community/posts/${postId}/save`);
    return response.data;
  } catch (error) {
    console.error('Failed to toggle save:', error);
    throw error;
  }
};

// 댓글 추가
export const addComment = async (postId: string, content: string) => {
  try {
    const response = await axios.post(`/community/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (postId: string, commentId: string) => {
  try {
    const response = await axios.delete(`/community/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete comment:', error);
    throw error;
  }
};

// 트렌딩 포스트 조회
export const fetchTrendingPosts = async (limit = 10) => {
  try {
    const response = await axios.get(`/community/posts/trending?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending posts:', error);
    throw error;
  }
};

// 사용자 포스트 조회
export const fetchUserPosts = async (username: string, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`/community/users/${username}/posts?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user posts:', error);
    throw error;
  }
};

// 포스트 수정
export const updateCommunityPost = async (
  postId: string,
  postData: {
    title?: string;
    content?: string;
    tags?: string[];
    images?: string[];
  }
) => {
  try {
    const response = await axios.put(`/community/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Failed to update post:', error);
    throw error;
  }
};

// 포스트 삭제
export const deleteCommunityPost = async (postId: string) => {
  try {
    const response = await axios.delete(`/community/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete post:', error);
    throw error;
  }
};

// 시간 포맷팅 헬퍼
export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return past.toLocaleDateString('ko-KR');
  } else if (days > 0) {
    return `${days}일 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else if (minutes > 0) {
    return `${minutes}분 전`;
  } else {
    return '방금 전';
  }
};