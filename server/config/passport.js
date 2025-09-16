const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver-v2').Strategy;
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
        // googleId로만 사용자 찾기 (계정 삭제 후 재가입 시 새 계정 생성을 위해)
        let user = await User.findOne({ googleId: profile.id });
        
        console.log('🔍 Google Login Check:', {
          googleId: profile.id,
          email: profile.emails[0].value,
          foundUser: user ? `Found user with id: ${user._id}` : 'No user found',
          willCreateNew: !user
        });

        if (user) {
          // 기존 사용자가 있으면 정보 업데이트
          // userId가 없으면 추가
          if (!user.userId) {
            const baseUserId = profile.emails[0].value.split('@')[0].toLowerCase();
            user.userId = baseUserId.replace(/[^a-z0-9_]/g, '') || `google_${profile.id.slice(-8)}`;
          }
          // 프로필 이미지 업데이트
          if (profile.photos[0]?.value) {
            user.profileImage = profile.photos[0].value;
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
        
        // 카카오 프로필 정보 로깅
        console.log('🎨 Kakao Profile Data:', {
          properties: profile._json.properties,
          kakao_account: profile._json.kakao_account,
          profile_needs_agreement: profile._json.kakao_account?.profile_needs_agreement,
          profile_image_needs_agreement: profile._json.kakao_account?.profile_image_needs_agreement
        });
        
        // 카카오 프로필 이미지 처리 - 여러 곳에서 시도
        let profileImage = 
          profile._json.properties?.profile_image || 
          profile._json.properties?.thumbnail_image ||
          profile._json.kakao_account?.profile?.profile_image_url ||
          profile._json.kakao_account?.profile?.thumbnail_image_url;
        
        console.log('🖼️ Kakao Profile Image:', profileImage);
        
        // 프로필 이미지가 없으면 기본 아바타 생성 (이름 기반)
        if (!profileImage) {
          const displayName = nickname || 'K';
          profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FEE500&color=3C1E1E&bold=true&size=200`;
          console.log('📷 Using default avatar for:', displayName);
        }
        
        // kakaoId로만 사용자 찾기 (계정 삭제 후 재가입 시 새 계정 생성을 위해)
        // kakaoId를 문자열로 확실히 변환
        const kakaoIdStr = String(kakaoId);
        let user = await User.findOne({ kakaoId: kakaoIdStr });
        
        console.log('🔍 Kakao Login Check:', {
          kakaoId: kakaoIdStr,
          email,
          foundUser: user ? `Found user with id: ${user._id}` : 'No user found',
          willCreateNew: !user
        });
        
        // kakaoId로 찾지 못하면 무조건 새 계정 생성
        // 이메일이 같아도 새로운 계정으로 처리 (계정 삭제 후 재가입 케이스)

        if (user) {
          // 기존 사용자가 있으면 Kakao ID 연결
          if (!user.kakaoId) {
            user.kakaoId = kakaoIdStr;
          }
          // userId가 없으면 추가
          if (!user.userId) {
            user.userId = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : `kakao_${kakaoIdStr.slice(-8)}`;
          }
          // 프로필 이미지 업데이트 (카카오에서 새로운 이미지를 가져왔을 수 있음)
          user.profileImage = profileImage;
          await user.save();
        } else {
          // 새 사용자 생성
          // 이메일이 없는 경우 kakaoId를 기반으로 고유 이메일 생성
          const userEmail = email || `kakao${kakaoIdStr}@bobmap.com`;
          const username = nickname || `kakao_user_${kakaoIdStr.slice(-6)}`;
          const userId = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : `kakao_${kakaoIdStr.slice(-8)}`;
          
          user = await User.create({
            userId: userId,
            kakaoId: kakaoIdStr,
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

// Naver OAuth Strategy - only if credentials are provided
if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
  const naverCallbackURL = `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8888}`}/api/auth/naver/callback`;
  console.log('🔐 Naver OAuth Callback URL:', naverCallbackURL);
  
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: naverCallbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const naverId = String(profile.id);
          const email = profile.email;
          const nickname = profile.nickname || profile.name || email?.split('@')[0];
          const profileImage = profile.profileImage;
          
          console.log('🟢 Naver Profile Data:', {
            naverId,
            email,
            nickname,
            profileImage
          });
          
          // naverId로 사용자 찾기
          let user = await User.findOne({ naverId: naverId });
          
          console.log('🔍 Naver Login Check:', {
            naverId,
            email,
            foundUser: user ? `Found user with id: ${user._id}` : 'No user found',
            willCreateNew: !user
          });
          
          if (user) {
            // 기존 사용자가 있으면 정보 업데이트
            if (!user.naverId) {
              user.naverId = naverId;
            }
            // userId가 없으면 추가
            if (!user.userId) {
              user.userId = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : `naver_${naverId.slice(-8)}`;
            }
            // 프로필 이미지 업데이트
            if (profileImage) {
              user.profileImage = profileImage;
            }
            await user.save();
          } else {
            // 새 사용자 생성
            const userEmail = email || `naver${naverId}@bobmap.com`;
            const username = nickname || `naver_user_${naverId.slice(-6)}`;
            const userId = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : `naver_${naverId.slice(-8)}`;
            
            // 프로필 이미지가 없으면 기본 아바타 생성
            const userProfileImage = profileImage || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=03C75A&color=FFFFFF&bold=true&size=200`;
            
            user = await User.create({
              userId: userId,
              naverId: naverId,
              username: username,
              email: userEmail,
              emailVerified: true, // OAuth 로그인은 이메일 인증 완료로 처리
              profileImage: userProfileImage,
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