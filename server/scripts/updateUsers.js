require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({ userId: { $exists: false } });
    console.log(`Found ${users.length} users without userId`);
    
    for (const user of users) {
      let userId = user.username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (userId.length > 20) {
        userId = userId.substring(0, 20);
      }
      
      const existing = await User.findOne({ userId });
      let finalUserId = userId;
      let counter = 1;
      
      while (existing && existing._id.toString() !== user._id.toString()) {
        finalUserId = `${userId}${counter}`;아아니모바일
        counter++;
        const check = await User.findOne({ userId: finalUserId });
        if (!check) break;
      }
      
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