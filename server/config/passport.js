const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT 토큰 생성 함수
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy - only if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8888}`}/api/auth/google/callback`,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 기존 사용자 확인
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // 기존 사용자가 있으면 Google ID 연결
          if (!user.googleId) {
            user.googleId = profile.id;
          }
          // userId가 없으면 추가
          if (!user.userId) {
            const baseUserId = profile.emails[0].value.split('@')[0].toLowerCase();
            user.userId = baseUserId.replace(/[^a-z0-9_]/g, '') || `google_${profile.id.slice(-8)}`;
          }
          await user.save();
        } else {
          // 새 사용자 생성
          const baseUserId = profile.emails[0].value.split('@')[0].toLowerCase();
          const userId = baseUserId.replace(/[^a-z0-9_]/g, ''); // 영문 소문자, 숫자, 언더스코어만
          
          user = await User.create({
            userId: userId || `google_${profile.id.slice(-8)}`,
            googleId: profile.id,
            username: profile.displayName || profile.emails[0].value.split('@')[0],
            email: profile.emails[0].value,
            profileImage: profile.photos[0]?.value,
            emailVerified: true, // OAuth 로그인은 이메일 인증 완료로 처리
            // OAuth 로그인은 비밀번호 불필요
            password: 'oauth-' + Math.random().toString(36).slice(-8),
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
    )
  );
}

// Kakao OAuth Strategy - only if credentials are provided
if (process.env.KAKAO_CLIENT_ID) {
  const kakaoCallbackURL = `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8888}`}/api/auth/kakao/callback`;
  console.log('🔐 Kakao OAuth Callback URL:', kakaoCallbackURL);
  
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: kakaoCallbackURL,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.kakao_account?.email;
        const kakaoId = String(profile.id); // 숫자를 문자열로 변환
        const nickname = profile._json.properties?.nickname || profile.displayName || profile.username;
        
        // 카카오 프로필 이미지 처리
        let profileImage = profile._json.properties?.profile_image || profile._json.properties?.thumbnail_image;
        
        // 프로필 이미지가 없으면 기본 아바타 생성 (이름 기반)
        if (!profileImage) {
          const displayName = nickname || 'K';
          profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FEE500&color=3C1E1E&bold=true&size=200`;
        }
        
        // 이메일이 없으면 kakaoId로 사용자 찾기
        let user;
        
        if (email) {
          // 이메일이 있으면 이메일로 먼저 검색
          user = await User.findOne({ $or: [{ email }, { kakaoId }] });
        } else {
          // 이메일이 없으면 kakaoId로만 검색
          user = await User.findOne({ kakaoId });
        }

        if (user) {
          // 기존 사용자가 있으면 Kakao ID 연결
          if (!user.kakaoId) {
            user.kakaoId = kakaoId;
          }
          // userId가 없으면 추가
          if (!user.userId) {
            user.userId = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : `kakao_${kakaoId.slice(-8)}`;
          }
          await user.save();
        } else {
          // 새 사용자 생성
          // 이메일이 없는 경우 kakaoId를 기반으로 고유 이메일 생성
          const userEmail = email || `kakao${kakaoId}@bobmap.com`;
          const username = nickname || `kakao_user_${kakaoId.slice(-6)}`;
          const userId = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : `kakao_${kakaoId.slice(-8)}`;
          
          user = await User.create({
            userId: userId,
            kakaoId: kakaoId,
            username: username,
            email: userEmail,
            emailVerified: true, // OAuth 로그인은 이메일 인증 완료로 처리
            profileImage: profileImage, // 위에서 처리한 프로필 이미지 사용
            // OAuth 로그인은 비밀번호 불필요
            password: 'oauth-' + Math.random().toString(36).slice(-8),
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
    )
  );
}

module.exports = { passport, generateToken };