require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

async function checkPlaylists() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('✅ MongoDB 연결 성공\n');
    
    const Playlist = require('./server/models/Playlist');
    const User = require('./server/models/User');
    
    const allPlaylists = await Playlist.find({})
      .populate('createdBy', 'username userId email')
      .select('title isPublic isActive createdBy createdAt');
    
    console.log('Total playlists in DB:', allPlaylists.length);
    console.log('=' .repeat(80));
    
    if (allPlaylists.length === 0) {
      console.log('데이터베이스에 플레이리스트가 없습니다.\n');
    } else {
      allPlaylists.forEach(playlist => {
        console.log(`
Title: ${playlist.title}
ID: ${playlist._id}
Created By: ${playlist.createdBy ? `${playlist.createdBy.username} (${playlist.createdBy.userId})` : 'Unknown'}
isPublic: ${playlist.isPublic}
isActive: ${playlist.isActive}
Created: ${playlist.createdAt ? new Date(playlist.createdAt).toLocaleString('ko-KR') : 'N/A'}
${'=' .repeat(80)}`);
      });
    }
    
    const publicPlaylists = await Playlist.find({ isPublic: true, isActive: true });
    console.log(`\n✅ Public & Active playlists: ${publicPlaylists.length}`);
    
    const users = await User.find({}).select('username userId');
    console.log('\n📊 사용자별 플레이리스트 수:');
    for (const user of users) {
      const count = await Playlist.countDocuments({ createdBy: user._id });
      console.log(`- ${user.username} (${user.userId}): ${count}개`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

checkPlaylists();