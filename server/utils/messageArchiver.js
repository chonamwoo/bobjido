const Message = require('../models/Message');
const ArchivedMessage = require('../models/ArchivedMessage');
const cron = require('node-cron');

// 오래된 메시지 아카이빙 함수
async function archiveOldMessages() {
  try {
    console.log('🗄️ 메시지 아카이빙 시작...');
    
    // 30일 이상 된 메시지 찾기
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // 배치 처리를 위한 설정
    const batchSize = 100;
    let processedCount = 0;
    let hasMore = true;
    
    while (hasMore) {
      // 오래된 메시지 배치로 가져오기
      const oldMessages = await Message.find({ 
        createdAt: { $lt: thirtyDaysAgo } 
      })
      .limit(batchSize)
      .lean(); // lean()으로 plain object 반환 (성능 향상)
      
      if (oldMessages.length === 0) {
        hasMore = false;
        break;
      }
      
      // 아카이브에 추가
      const archivedMessages = oldMessages.map(msg => ({
        ...msg,
        _id: undefined, // 새로운 _id 생성
        originalId: msg._id,
        archivedAt: new Date()
      }));
      
      await ArchivedMessage.insertMany(archivedMessages, { 
        ordered: false // 일부 실패해도 계속 진행
      });
      
      // 원본 메시지 삭제
      const messageIds = oldMessages.map(msg => msg._id);
      await Message.deleteMany({ _id: { $in: messageIds } });
      
      processedCount += oldMessages.length;
      
      // 배치 처리 간 잠시 대기 (DB 부하 감소)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ 메시지 아카이빙 완료: ${processedCount}개 메시지 처리됨`);
    return processedCount;
  } catch (error) {
    console.error('❌ 메시지 아카이빙 실패:', error);
    throw error;
  }
}

// 아카이브된 메시지 조회 함수
async function getArchivedMessages(chatId, options = {}) {
  try {
    const { page = 1, limit = 50 } = options;
    
    const messages = await ArchivedMessage.find({ chat: chatId })
      .populate('sender', 'username profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    return messages.reverse(); // 시간순 정렬
  } catch (error) {
    console.error('아카이브된 메시지 조회 실패:', error);
    throw error;
  }
}

// 메시지 복원 함수 (필요시)
async function restoreArchivedMessage(archivedMessageId) {
  try {
    const archivedMessage = await ArchivedMessage.findById(archivedMessageId).lean();
    
    if (!archivedMessage) {
      throw new Error('아카이브된 메시지를 찾을 수 없습니다.');
    }
    
    // 원본으로 복원
    const restoredMessage = new Message({
      ...archivedMessage,
      _id: archivedMessage.originalId || undefined,
      archivedAt: undefined,
      originalId: undefined
    });
    
    await restoredMessage.save();
    await ArchivedMessage.findByIdAndDelete(archivedMessageId);
    
    return restoredMessage;
  } catch (error) {
    console.error('메시지 복원 실패:', error);
    throw error;
  }
}

// 크론 작업 설정 (매일 새벽 3시에 실행)
function setupArchivingCron() {
  // 개발 환경에서는 크론 작업 비활성화
  if (process.env.NODE_ENV !== 'production') {
    console.log('📌 개발 환경: 메시지 아카이빙 크론 작업 비활성화');
    return;
  }
  
  cron.schedule('0 3 * * *', async () => {
    console.log('🕐 정기 메시지 아카이빙 시작...');
    try {
      await archiveOldMessages();
    } catch (error) {
      console.error('정기 아카이빙 실패:', error);
    }
  });
  
  console.log('✅ 메시지 아카이빙 크론 작업 설정 완료');
}

// 수동 아카이빙 트리거 (관리자용)
async function manualArchive(daysOld = 30) {
  const targetDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  console.log(`📅 ${daysOld}일 이상 된 메시지 아카이빙 시작...`);
  
  const oldMessages = await Message.find({ 
    createdAt: { $lt: targetDate } 
  }).count();
  
  console.log(`🔍 아카이빙 대상: ${oldMessages}개 메시지`);
  
  if (oldMessages > 0) {
    return await archiveOldMessages();
  }
  
  return 0;
}

module.exports = {
  archiveOldMessages,
  getArchivedMessages,
  restoreArchivedMessage,
  setupArchivingCron,
  manualArchive
};