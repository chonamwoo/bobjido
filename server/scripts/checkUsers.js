require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}).select('+password');
    console.log('\n=== User Password Status ===');
    
    users.forEach(user => {
      console.log({
        userId: user.userId,
        email: user.email,
        username: user.username,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        passwordStartsWith: user.password ? user.password.substring(0, 10) : 'N/A'
      });
    });
    
    console.log('\nTotal users:', users.length);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();