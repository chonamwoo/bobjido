require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // 모든 사용자 찾기
    const users = await User.find({ userId: { $exists: false } });
    console.log(`Found ${users.length} users without userId`);
    
    for (const user of users) {
      // username을 기반으로 userId 생성 (최대 20자)
      let userId = user.username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (userId.length > 20) {
        userId = userId.substring(0, 20);
      }
      
      // userId 중복 체크
      const existing = await User.findOne({ userId });
      let finalUserId = userId;
      let counter = 1;
      
      while (existing && existing._id.toString() !== user._id.toString()) {
        finalUserId = `${userId}${counter}`;
        counter++;
        const check = await User.findOne({ userId: finalUserId });
        if (!check) break;
      }
      
      // 사용자 업데이트
      user.userId = finalUserId;
      await user.save();
      console.log(`Updated user ${user.username} with userId: ${finalUserId}`);
    }
    
    console.log('All users updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUsers();