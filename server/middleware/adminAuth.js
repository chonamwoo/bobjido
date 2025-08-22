const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminProtect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.admin = await Admin.findById(decoded.id).select('-password');
      
      if (!req.admin || !req.admin.isActive) {
        return res.status(401).json({ message: '어드민 권한이 없습니다' });
      }
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: '어드민 인증에 실패했습니다' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: '어드민 인증 토큰이 없습니다' });
  }
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: '어드민 권한이 필요합니다' });
    }
    
    if (!req.admin.hasPermission(permission)) {
      return res.status(403).json({ message: '해당 작업에 대한 권한이 없습니다' });
    }
    
    next();
  };
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'super_admin') {
    return res.status(403).json({ message: '슈퍼 어드민 권한이 필요합니다' });
  }
  next();
};

module.exports = { adminProtect, requirePermission, requireSuperAdmin };