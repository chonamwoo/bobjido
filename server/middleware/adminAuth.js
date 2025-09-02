const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminProtect = async (req, res, next) => {
  // Simple admin auth for MVP - 더 관대한 체크
  const isAdminAuth = req.headers['x-admin-auth'] === 'true' || 
                      req.headers['X-Admin-Auth'] === 'true'; // 대소문자 모두 허용
  const adminToken = req.headers.authorization?.replace('Bearer ', '');
  
  // Check for simple admin authentication
  if (isAdminAuth || (adminToken && adminToken.startsWith('admin-token-'))) {
    req.admin = { 
      _id: 'admin',
      role: 'super_admin',
      permissions: ['user_management', 'playlist_management', 'restaurant_management'],
      hasPermission: (perm) => true // Admin has all permissions for MVP
    };
    return next();
  }
  
  // Check for JWT token (existing logic)
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
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
  
  if (!token && !isAdminAuth) {
    return res.status(401).json({ message: '어드민 인증 토큰이 없습니다' });
  }
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: '어드민 권한이 필요합니다' });
    }
    
    // MVP에서는 admin이면 모든 권한 허용
    if (req.admin.role === 'super_admin' || req.admin._id === 'admin') {
      return next();
    }
    
    if (req.admin.hasPermission && !req.admin.hasPermission(permission)) {
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