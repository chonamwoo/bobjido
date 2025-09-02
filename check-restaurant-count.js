require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./server/models/Restaurant');

async function checkRestaurantCount() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
    
    const totalCount = await Restaurant.countDocuments({});
    console.log(`\n총 레스토랑 수: ${totalCount}개\n`);
    
    // 카테고리별 통계
    const categoryStats = await Restaurant.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('카테고리별 분포:');
    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}개`);
    });
    
    // 샘플 레스토랑 몇 개 확인
    console.log('\n=== 샘플 레스토랑 10개 ===');
    const samples = await Restaurant.find().limit(10);
    samples.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.name} (${r.category})`);
      console.log(`   주소: ${r.address}`);
      console.log(`   가격대: ${r.priceRange}`);
      console.log(`   평점: ${r.averageRating?.toFixed(1)}`);
      console.log(`   리뷰: ${r.reviewCount}개`);
      if (r.dnaProfile) {
        console.log(`   분위기: ${r.dnaProfile.atmosphere?.join(', ') || 'N/A'}`);
        console.log(`   음식스타일: ${r.dnaProfile.foodStyle?.join(', ') || 'N/A'}`);
        console.log(`   인스타: ${r.dnaProfile.instagramability}/5`);
        console.log(`   데이트: ${r.dnaProfile.dateSpot}/5`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkRestaurantCount();