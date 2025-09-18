const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

// 모든 포스트 조회
const getPosts = async (req, res) => {
  try {
    const { 
      type, 
      page = 1, 
      limit = 20, 
      sort = '-createdAt',
      tag 
    } = req.query;

    const query = { isActive: true };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (tag) {
      query.tags = tag;
    }

    const posts = await CommunityPost.find(query)
      .populate('author', 'username profileImage isVerified')
      .populate('restaurant', 'name address category')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments(query);

    // 사용자가 좋아요/저장한 포스트 확인
    const postsWithUserInteractions = posts.map(post => {
      const postObj = post.toJSON();
      if (req.user) {
        postObj.isLiked = post.likes.some(like => 
          like.user.toString() === req.user._id.toString()
        );
        postObj.isSaved = post.saves.some(save => 
          save.user.toString() === req.user._id.toString()
        );
      }
      return postObj;
    });

    res.json({
      success: true,
      data: postsWithUserInteractions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      success: false, 
      message: '포스트를 불러오는데 실패했습니다' 
    });
  }
};

// 단일 포스트 조회
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await CommunityPost.findById(id)
      .populate('author', 'username profileImage isVerified bio')
      .populate('restaurant', 'name address category images')
      .populate('comments.author', 'username profileImage isVerified');

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: '포스트를 찾을 수 없습니다' 
      });
    }

    // 조회수 증가
    post.viewCount += 1;
    
    // 고유 조회자 추가
    if (req.user && !post.uniqueViewers.includes(req.user._id)) {
      post.uniqueViewers.push(req.user._id);
    }
    
    await post.save();

    const postObj = post.toJSON();
    if (req.user) {
      postObj.isLiked = post.likes.some(like => 
        like.user.toString() === req.user._id.toString()
      );
      postObj.isSaved = post.saves.some(save => 
        save.user.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      data: postObj
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ 
      success: false, 
      message: '포스트를 불러오는데 실패했습니다' 
    });
  }
};

// 포스트 생성
const createPost = async (req, res) => {
  try {
    const {
      type,
      title,
      content,
      images,
      restaurant,
      location,
      tags
    } = req.body;

    const post = new CommunityPost({
      author: req.user._id,
      type,
      title,
      content,
      images: images || [],
      restaurant,
      location,
      tags: tags || []
    });

    await post.save();
    
    const populatedPost = await CommunityPost.findById(post._id)
      .populate('author', 'username profileImage isVerified')
      .populate('restaurant', 'name address category');

    res.status(201).json({
      success: true,
      data: populatedPost,
      message: '포스트가 생성되었습니다'
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      success: false, 
      message: '포스트 생성에 실패했습니다' 
    });
  }
};

// 포스트 수정
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, images, tags } = req.body;

    const post = await CommunityPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: '포스트를 찾을 수 없습니다' 
      });
    }

    // 작성자 확인
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: '권한이 없습니다' 
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.images = images || post.images;
    post.tags = tags || post.tags;

    await post.save();

    const updatedPost = await CommunityPost.findById(id)
      .populate('author', 'username profileImage isVerified')
      .populate('restaurant', 'name address category');

    res.json({
      success: true,
      data: updatedPost,
      message: '포스트가 수정되었습니다'
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ 
      success: false, 
      message: '포스트 수정에 실패했습니다' 
    });
  }
};

// 포스트 삭제
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await CommunityPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: '포스트를 찾을 수 없습니다' 
      });
    }

    // 작성자 또는 관리자 확인
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '권한이 없습니다' 
      });
    }

    // 소프트 삭제
    post.isActive = false;
    await post.save();

    res.json({
      success: true,
      message: '포스트가 삭제되었습니다'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      success: false, 
      message: '포스트 삭제에 실패했습니다' 
    });
  }
};

// 좋아요 토글
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await CommunityPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: '포스트를 찾을 수 없습니다' 
      });
    }

    const likeIndex = post.likes.findIndex(like => 
      like.user.toString() === userId.toString()
    );

    let isLiked;
    if (likeIndex > -1) {
      // 좋아요 취소
      post.likes.splice(likeIndex, 1);
      isLiked = false;
    } else {
      // 좋아요 추가
      post.likes.push({ user: userId });
      isLiked = true;
    }

    await post.save();

    res.json({
      success: true,
      data: {
        isLiked,
        likeCount: post.likes.length
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ 
      success: false, 
      message: '좋아요 처리에 실패했습니다' 
    });
  }
};

// 저장 토글
const toggleSave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await CommunityPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: '포스트를 찾을 수 없습니다' 
      });
    }

    const saveIndex = post.saves.findIndex(save => 
      save.user.toString() === userId.toString()
    );

    let isSaved;
    if (saveIndex > -1) {
      // 저장 취소
      post.saves.splice(saveIndex, 1);
      isSaved = false;
    } else {
      // 저장 추가
      post.saves.push({ user: userId });
      isSaved = true;
    }

    await post.save();

    res.json({
      success: true,
      data: {
        isSaved,
        saveCount: post.saves.length
      }
    });
  } catch (error) {
    console.error('Toggle save error:', error);
    res.status(500).json({ 
      success: false, 
      message: '저장 처리에 실패했습니다' 
    });
  }
};

// 댓글 추가
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await CommunityPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: '포스트를 찾을 수 없습니다' 
      });
    }

    const comment = {
      author: req.user._id,
      content
    };

    post.comments.push(comment);
    await post.save();

    const updatedPost = await CommunityPost.findById(id)
      .populate('comments.author', 'username profileImage isVerified');

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json({
      success: true,
      data: newComment,
      message: '댓글이 추가되었습니다'
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      success: false, 
      message: '댓글 추가에 실패했습니다' 
    });
  }
};

// 댓글 삭제
const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const post = await CommunityPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: '포스트를 찾을 수 없습니다' 
      });
    }

    const comment = post.comments.id(commentId);
    
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: '댓글을 찾을 수 없습니다' 
      });
    }

    // 작성자 또는 관리자 확인
    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '권한이 없습니다' 
      });
    }

    comment.remove();
    await post.save();

    res.json({
      success: true,
      message: '댓글이 삭제되었습니다'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ 
      success: false, 
      message: '댓글 삭제에 실패했습니다' 
    });
  }
};

// 인기 포스트 조회
const getTrendingPosts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // 최근 7일간 좋아요가 많은 포스트
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await CommunityPost.find({
      isActive: true,
      createdAt: { $gte: sevenDaysAgo }
    })
    .populate('author', 'username profileImage isVerified')
    .populate('restaurant', 'name address category')
    .sort('-likes.length -viewCount')
    .limit(limit * 1);

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get trending posts error:', error);
    res.status(500).json({ 
      success: false, 
      message: '인기 포스트를 불러오는데 실패했습니다' 
    });
  }
};

// 사용자의 포스트 조회
const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const user = await User.findOne({ 
      $or: [
        { username: username },
        { userId: username.toLowerCase() }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: '사용자를 찾을 수 없습니다' 
      });
    }

    const posts = await CommunityPost.find({
      author: user._id,
      isActive: true
    })
    .populate('author', 'username profileImage isVerified')
    .populate('restaurant', 'name address category')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments({
      author: user._id,
      isActive: true
    });

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ 
      success: false, 
      message: '사용자 포스트를 불러오는데 실패했습니다' 
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  addComment,
  deleteComment,
  getTrendingPosts,
  getUserPosts
};