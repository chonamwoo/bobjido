const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function createSuperAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI가 설정되지 않았습니다');
      return;
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 연결 성공');
    
    // 이미 존재하는지 확인
    const existing = await User.findOne({ username: 'superadmin' });
    if (existing) {
      console.log('⚠️ superadmin 계정이 이미 존재합니다');
      
      // 비밀번호 재설정
      const newPassword = 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await User.updateOne(
        { username: 'superadmin' },
        { 
          password: hashedPassword,
          isAdmin: true  // admin 권한도 확실히 설정
        }
      );
      
      console.log('✅ superadmin 비밀번호가 재설정되었습니다');
      console.log('\n📝 로그인 정보:');
      console.log('   Username: superadmin');
      console.log(`   Password: ${newPassword}`);
      
    } else {
      // 새로 생성
      const password = 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const superadmin = new User({
        username: 'superadmin',
        email: 'admin@bobmap.com',
        password: hashedPassword,
        isAdmin: true,
        bio: '시스템 관리자',
        onboardingCompleted: true,
        tasteProfile: {
          type: 'premium_diner',
          scores: {
            spicy_adventurer: 50,
            trendy_explorer: 50,
            comfort_lover: 50,
            social_foodie: 50,
            budget_gourmet: 50,
            premium_diner: 100,
            solo_explorer: 50,
            traditional_taste: 50
          }
        }
      });
      
      await superadmin.save();
      
      console.log('✅ superadmin 계정이 생성되었습니다');
      console.log('\n📝 로그인 정보:');
      console.log('   Username: superadmin');
      console.log(`   Password: ${password}`);
      console.log('   권한: Admin ✅');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ 완료');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

createSuperAdmin();