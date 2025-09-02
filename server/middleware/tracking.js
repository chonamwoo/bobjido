const UserInteraction = require('../models/UserInteraction');

// 사용자 활동 트래킹 미들웨어
const trackUserActivity = async (req, res, next) => {
  // 원본 send 메서드 저장
  const originalSend = res.send;
  const originalJson = res.json;
  
  // 트래킹할 활동 정의
  const trackingRules = {
    'GET /api/playlists/:id': { type: 'view', targetType: 'playlist' },
    'GET /api/restaurants/:id': { type: 'view', targetType: 'restaurant' },
    'POST /api/playlists/:id/like': { type: 'like', targetType: 'playlist' },
    'POST /api/playlists/:id/save': { type: 'save', targetType: 'playlist' },
    'POST /api/playlists/:id/share': { type: 'share', targetType: 'playlist' },
    'POST /api/restaurants/:id/save': { type: 'save', targetType: 'restaurant' },
    'POST /api/reviews': { type: 'review', targetType: 'restaurant' },
  };
  
  // 현재 요청이 트래킹 대상인지 확인
  let trackingInfo = null;
  for (const [pattern, info] of Object.entries(trackingRules)) {
    const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
    const match = req.path.match(regex);
    if (match && req.method === pattern.split(' ')[0]) {
      trackingInfo = {
        ...info,
        targetId: req.params.id || req.body.restaurantId || req.body.playlistId
      };
      break;
    }
  }
  
  // 응답 전송 시 트래킹
  if (trackingInfo && req.user) {
    const trackResponse = async (body) => {
      try {
        // 성공적인 응답인 경우에만 트래킹
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const interaction = new UserInteraction({
            user: req.user._id,
            type: trackingInfo.type,
            targetType: trackingInfo.targetType,
            targetId: trackingInfo.targetId,
            context: {
              source: req.get('referer') || 'direct',
              device: req.get('user-agent'),
              ip: req.ip,
              timestamp: new Date()
            },
            metadata: {
              responseTime: Date.now() - req.startTime,
              statusCode: res.statusCode
            }
          });
          
          await interaction.save();
          
          // 특정 활동에 대한 추가 처리
          if (trackingInfo.type === 'view') {
            // 뷰 카운트는 이미 컨트롤러에서 처리됨
          } else if (trackingInfo.type === 'like' || trackingInfo.type === 'save') {
            // 좋아요/저장은 모델 메서드에서 처리
          }
        }
      } catch (error) {
        console.error('Activity tracking error:', error);
        // 트래킹 실패가 API 응답을 막지 않도록 함
      }
    };
    
    // res.json 오버라이드
    res.json = function(body) {
      trackResponse(body);
      return originalJson.call(this, body);
    };
    
    // res.send 오버라이드
    res.send = function(body) {
      trackResponse(body);
      return originalSend.call(this, body);
    };
  }
  
  // 요청 시작 시간 기록
  req.startTime = Date.now();
  
  next();
};

// 실시간 통계 업데이트 미들웨어
const updateRealtimeStats = async (req, res, next) => {
  // 실시간 통계 업데이트 로직
  // Redis나 메모리 캐시를 사용하여 실시간 집계
  next();
};

module.exports = {
  trackUserActivity,
  updateRealtimeStats
};