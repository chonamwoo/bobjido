const User = require('../models/User');
const Notification = require('../models/Notification');

// 팔로우
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id;

    // 자기 자신을 팔로우할 수 없음
    if (userId === followerId.toString()) {
      return res.status(400).json({ message: '자기 자신을 팔로우할 수 없습니다.' });
    }

    // 대상 사용자 확인
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 현재 사용자 확인
    const currentUser = await User.findById(followerId);

    // 이미 팔로우 중인지 확인
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: '이미 팔로우 중입니다.' });
    }

    // 팔로우 추가
    currentUser.following.push(userId);
    userToFollow.followers.push(followerId);

    await currentUser.save();
    await userToFollow.save();

    // 알림 생성
    await Notification.create({
      recipient: userId,
      sender: followerId,
      type: 'follow',
      message: `${currentUser.username}님이 회원님을 팔로우하기 시작했습니다.`
    });

    // Socket.io로 실시간 알림 전송 (나중에 구현)
    const io = req.app.get('io');
    if (io) {
      io.to(userId).emit('notification', {
        type: 'follow',
        message: `${currentUser.username}님이 회원님을 팔로우하기 시작했습니다.`,
        sender: {
          _id: currentUser._id,
          username: currentUser.username,
          profileImage: currentUser.profileImage
        }
      });
    }

    res.json({ 
      message: '팔로우 성공',
      following: currentUser.following.length,
      followers: currentUser.followers.length
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: '팔로우 중 오류가 발생했습니다.' });
  }
};

// 언팔로우
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id;

    // 대상 사용자 확인
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 현재 사용자 확인
    const currentUser = await User.findById(followerId);

    // 팔로우 중인지 확인
    if (!currentUser.following.includes(userId)) {
      return res.status(400).json({ message: '팔로우 중이 아닙니다.' });
    }

    // 팔로우 제거
    currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== followerId.toString());

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ 
      message: '언팔로우 성공',
      following: currentUser.following.length,
      followers: currentUser.followers.length
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: '언팔로우 중 오류가 발생했습니다.' });
  }
};

// 팔로워 목록 조회
const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'username profileImage bio tasteProfile.type followerCount',
        options: {
          skip,
          limit
        }
      });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      followers: user.followers,
      total: user.followers.length,
      page,
      totalPages: Math.ceil(user.followers.length / limit)
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: '팔로워 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 팔로잉 목록 조회
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .populate({
        path: 'following',
        select: 'username profileImage bio tasteProfile.type followerCount',
        options: {
          skip,
          limit
        }
      });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      following: user.following,
      total: user.following.length,
      page,
      totalPages: Math.ceil(user.following.length / limit)
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: '팔로잉 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 팔로우 상태 확인
const checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(userId);

    const targetUser = await User.findById(userId);
    const isFollower = targetUser.following.includes(currentUserId);

    res.json({
      isFollowing,
      isFollower,
      isMutual: isFollowing && isFollower
    });
  } catch (error) {
    console.error('Check follow status error:', error);
    res.status(500).json({ message: '팔로우 상태 확인 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus
};