const rateLimit = require('express-rate-limit');

// 메시지 전송 rate limiter
const messageLimiter = rateLimit({
  windowMs: 1000, // 1초
  max: 5, // 최대 5개 메시지
  message: '메시지를 너무 빠르게 전송하고 있습니다. 잠시 후 다시 시도해주세요.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: '메시지 전송 속도 제한을 초과했습니다.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// 일반 API rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 100, // 최대 100개 요청
  message: '너무 많은 요청을 보내고 있습니다. 잠시 후 다시 시도해주세요.',
  standardHeaders: true,
  legacyHeaders: false
});

// 로그인 시도 rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5번 시도
  message: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.',
  skipSuccessfulRequests: true // 성공적인 로그인은 카운트하지 않음
});

// Socket.io를 위한 메모리 기반 rate limiter
class SocketRateLimiter {
  constructor(windowMs = 1000, maxRequests = 5) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map();
  }

  check(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // 윈도우 시간이 지난 요청들 제거
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false; // rate limit 초과
    }
    
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    
    // 메모리 정리 (1시간마다)
    if (Math.random() < 0.001) {
      this.cleanup();
    }
    
    return true;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [userId, timestamps] of this.requests.entries()) {
      const validRequests = timestamps.filter(
        timestamp => now - timestamp < this.windowMs
      );
      if (validRequests.length === 0) {
        this.requests.delete(userId);
      } else {
        this.requests.set(userId, validRequests);
      }
    }
  }
}

module.exports = {
  messageLimiter,
  apiLimiter,
  loginLimiter,
  SocketRateLimiter
};