const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: '사용자를 찾을 수 없습니다' });
      }
      
      req.user.lastActive = Date.now();
      await req.user.save();
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: '인증에 실패했습니다' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 없습니다' });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  
  next();
};

module.exports = { protect, optionalAuth };