const mongoose = require('mongoose');
const CommunityPost = require('./server/models/CommunityPost');
const User = require('./server/models/User');
const Restaurant = require('./server/models/Restaurant');
require('dotenv').config();

const communityPosts = [
  {
    type: 'review',
    title: '강남역 스시오마카세 갔다왔어요!',
    content: '정말 신선한 재료로 만든 스시였습니다. 셰프님의 설명도 친절하시고, 분위기도 좋았어요. 가격은 조금 비싸지만 특별한 날 방문하기 좋은 것 같아요.',
    tags: ['오마카세', '강남맛집', '스시', '데이트코스'],
    location: '강남',
    images: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800'
    ]
  },
  {
    type: 'question',
    title: '홍대 브런치 맛집 추천해주세요',
    content: '이번 주말에 친구들이랑 홍대에서 브런치 먹으려고 하는데 추천해주실 곳 있나요? 4명이서 가려고 하고, 예산은 인당 2-3만원 정도입니다.',
    tags: ['홍대', '브런치', '추천요청', '친구모임'],
    location: '홍대'
  },
  {
    type: 'tip',
    title: '미쉐린 레스토랑 예약 꿀팁',
    content: '미쉐린 레스토랑 예약하기 정말 어렵죠? 제가 알려드리는 꿀팁!\n\n1. 매월 1일 오전 10시에 다음달 예약이 오픈됩니다\n2. 캐치테이블, 네이버 예약을 모두 확인하세요\n3. 평일 런치가 상대적으로 예약하기 쉬워요\n4. 취소 문의는 직접 전화로 하는게 가장 빠릅니다',
    tags: ['미쉐린', '예약팁', '파인다이닝', '꿀팁'],
    location: '서울'
  },
  {
    type: 'meetup',
    title: '이태원 맛집 투어 같이 하실 분!',
    content: '이번 토요일(1/25) 이태원 맛집 투어 같이 하실 분 구해요!\n\n코스:\n1. 점심 - 터키 케밥\n2. 디저트 - 이태원 유명 베이커리\n3. 저녁 - 멕시칸 타코\n\n현재 2명 확정이고 2명 더 모집합니다~',
    tags: ['이태원', '맛집투어', '모임', '번개'],
    location: '이태원'
  },
  {
    type: 'discussion',
    title: '혼밥하기 좋은 식당의 조건은?',
    content: '요즘 혼밥을 자주 하는데, 혼자 가기 좋은 식당의 조건이 뭘까요?\n\n제 생각엔:\n- 바 테이블이 있는 곳\n- 주문이 간편한 곳 (키오스크)\n- 회전율이 빠른 곳\n- 1인 메뉴가 있는 곳\n\n여러분의 생각은 어떠신가요?',
    tags: ['혼밥', '토론', '맛집기준'],
    location: '서울'
  },
  {
    type: 'review',
    title: '성수동 카페거리 다녀왔어요',
    content: '성수동 카페거리 완전 힙하더라구요! 특히 ㅇㅇ카페 분위기 미쳤어요. 커피도 맛있고 디저트도 예쁘고 맛있었습니다. 사진 찍기에도 너무 좋아요!',
    tags: ['성수동', '카페', '브런치', '핫플레이스'],
    location: '성수',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'
    ]
  },
  {
    type: 'tip',
    title: '웨이팅 줄이는 방법 공유',
    content: '인기 맛집 웨이팅 줄이는 방법:\n\n1. 오픈 시간 10분 전 도착\n2. 브레이크 타임 끝나는 시간 활용\n3. 평일 2-3시 방문\n4. 날씨 안 좋은 날 노리기\n5. 테이블링 앱 활용하기',
    tags: ['웨이팅', '꿀팁', '맛집공략'],
    location: '서울'
  },
  {
    type: 'question',
    title: '부모님 모시고 갈 한정식집 추천',
    content: '부모님 생신 기념으로 한정식 대접해드리려고 하는데 추천 부탁드려요. 예산은 인당 5-7만원이고, 주차가 편했으면 좋겠어요.',
    tags: ['한정식', '부모님', '추천요청', '생일'],
    location: '서울'
  },
  {
    type: 'review',
    title: '을지로 힙한 술집 다녀왔어요',
    content: '을지로 정말 핫하네요! 오래된 건물 사이에 숨어있는 바 찾는 재미가 있어요. 특히 ㅇㅇ바는 칵테일도 맛있고 분위기도 좋았어요.',
    tags: ['을지로', '술집', '바', '힙지로'],
    location: '을지로',
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
    ]
  },
  {
    type: 'discussion',
    title: '맛집 평가 기준, 맛 vs 분위기',
    content: '여러분은 맛집을 평가할 때 뭘 더 중요하게 생각하시나요?\n\n맛이 최고지만 분위기가 별로인 곳 vs 맛은 평범하지만 분위기가 좋은 곳\n\n저는 개인적으로 7:3 정도로 맛이 더 중요한 것 같아요!',
    tags: ['토론', '맛집기준', '분위기'],
    location: '서울'
  }
];

async function seedCommunityPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('📌 MongoDB 연결 성공');

    // 기존 포스트 삭제 (선택사항)
    // await CommunityPost.deleteMany({});
    // console.log('🗑️ 기존 포스트 삭제 완료');

    // 랜덤 사용자 가져오기
    const users = await User.find({ isVerified: true }).limit(10);
    
    if (users.length === 0) {
      // 인증된 사용자가 없으면 일반 사용자 사용
      const allUsers = await User.find().limit(10);
      if (allUsers.length === 0) {
        console.log('❌ 사용자가 없습니다. 먼저 사용자를 생성하세요.');
        return;
      }
      users.push(...allUsers);
    }

    // 랜덤 레스토랑 가져오기 (있으면)
    const restaurants = await Restaurant.find().limit(5);

    const createdPosts = [];

    for (const postData of communityPosts) {
      // 랜덤 작성자 선택
      const randomAuthor = users[Math.floor(Math.random() * users.length)];
      
      const post = new CommunityPost({
        ...postData,
        author: randomAuthor._id,
        restaurant: restaurants.length > 0 && Math.random() > 0.5 
          ? restaurants[Math.floor(Math.random() * restaurants.length)]._id 
          : undefined,
        viewCount: Math.floor(Math.random() * 500) + 50,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // 최근 7일 내 랜덤
      });

      // 랜덤 좋아요 추가
      const likeCount = Math.floor(Math.random() * 30);
      for (let i = 0; i < likeCount && i < users.length; i++) {
        post.likes.push({
          user: users[i]._id,
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
        });
      }

      // 랜덤 저장 추가
      const saveCount = Math.floor(Math.random() * 15);
      for (let i = 0; i < saveCount && i < users.length; i++) {
        post.saves.push({
          user: users[i]._id,
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
        });
      }

      // 랜덤 댓글 추가
      const commentCount = Math.floor(Math.random() * 10);
      const sampleComments = [
        '좋은 정보 감사합니다!',
        '저도 가봤는데 정말 맛있어요',
        '다음에 꼭 가봐야겠네요',
        '와 사진 너무 맛있어 보여요',
        '추천 감사합니다~',
        '저도 이런 곳 찾고 있었어요',
        '분위기 진짜 좋네요',
        '가격 대비 괜찮은 것 같아요',
        '웨이팅이 길다고 들었는데 어땠나요?',
        '주차는 편한가요?'
      ];

      for (let i = 0; i < commentCount && i < users.length; i++) {
        post.comments.push({
          author: users[i]._id,
          content: sampleComments[Math.floor(Math.random() * sampleComments.length)],
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
        });
      }

      await post.save();
      createdPosts.push(post);
      console.log(`✅ 포스트 생성: ${post.title}`);
    }

    console.log(`\n🎉 총 ${createdPosts.length}개의 커뮤니티 포스트 생성 완료!`);
    
    // 생성된 포스트 통계
    const stats = {
      review: createdPosts.filter(p => p.type === 'review').length,
      question: createdPosts.filter(p => p.type === 'question').length,
      tip: createdPosts.filter(p => p.type === 'tip').length,
      discussion: createdPosts.filter(p => p.type === 'discussion').length,
      meetup: createdPosts.filter(p => p.type === 'meetup').length
    };
    
    console.log('\n📊 포스트 타입별 통계:');
    Object.entries(stats).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}개`);
    });

  } catch (error) {
    console.error('❌ 시드 생성 중 오류:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📴 MongoDB 연결 종료');
  }
}

seedCommunityPosts();