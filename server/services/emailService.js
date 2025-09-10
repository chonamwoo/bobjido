const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 이메일 전송 설정
const createTransporter = () => {
  // Gmail을 사용하는 경우 (앱 비밀번호 필요)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Gmail 앱 비밀번호
      }
    });
  }
  
  // 일반 SMTP 설정
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * 이메일 인증 토큰 생성
 * @returns {string} - 6자리 인증 코드
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * 이메일 인증 코드 발송
 * @param {string} email - 수신자 이메일
 * @param {string} username - 사용자 이름
 * @param {string} verificationCode - 인증 코드
 */
const sendVerificationEmail = async (email, username, verificationCode) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"BobMap" <${process.env.EMAIL_USER || 'noreply@bobmap.com'}>`,
    to: email,
    subject: '[BobMap] 이메일 인증 코드',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
              padding: 2px;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .verification-code {
              background: #f8f9fa;
              border: 2px dashed #FF6B35;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #FF6B35;
              letter-spacing: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 10px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <div class="logo">🍜 BobMap</div>
                <p style="color: #666; margin-top: 10px;">맛집 공유 플랫폼</p>
              </div>
              
              <h2>안녕하세요, ${username}님!</h2>
              
              <p>BobMap 회원가입을 환영합니다! 아래 인증 코드를 입력하여 이메일 인증을 완료해주세요.</p>
              
              <div class="verification-code">
                <p style="margin: 0 0 10px 0; color: #666;">인증 코드</p>
                <div class="code">${verificationCode}</div>
                <p style="margin: 10px 0 0 0; color: #999; font-size: 14px;">10분 이내에 입력해주세요</p>
              </div>
              
              <div class="warning">
                ⚠️ 본인이 요청하지 않은 경우, 이 이메일을 무시하세요.
              </div>
              
              <p>인증이 완료되면 BobMap의 모든 기능을 이용하실 수 있습니다:</p>
              <ul style="color: #666;">
                <li>맛집 플레이리스트 만들기</li>
                <li>다른 사용자와 맛집 정보 공유</li>
                <li>취향 기반 맛집 추천 받기</li>
                <li>맛집 리뷰 작성 및 평가</li>
              </ul>
              
              <div class="footer">
                <p>이 이메일은 자동으로 발송되었습니다. 회신하지 마세요.</p>
                <p>© 2025 BobMap. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ 인증 이메일 발송 성공:', email);
    return true;
  } catch (error) {
    console.error('❌ 이메일 발송 실패:', error);
    throw new Error('이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
};

/**
 * 비밀번호 재설정 이메일 발송
 * @param {string} email - 수신자 이메일
 * @param {string} username - 사용자 이름
 * @param {string} resetToken - 재설정 토큰
 */
const sendPasswordResetEmail = async (email, username, resetToken) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"BobMap" <${process.env.EMAIL_USER || 'noreply@bobmap.com'}>`,
    to: email,
    subject: '[BobMap] 비밀번호 재설정',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            /* 위와 동일한 스타일 */
            body {
              font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <h2>비밀번호 재설정</h2>
          <p>${username}님, 비밀번호 재설정을 요청하셨습니다.</p>
          <p>아래 버튼을 클릭하여 새 비밀번호를 설정하세요:</p>
          <a href="${resetUrl}" class="button">비밀번호 재설정</a>
          <p>이 링크는 1시간 동안 유효합니다.</p>
          <p>요청하지 않으셨다면 이 이메일을 무시하세요.</p>
        </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('비밀번호 재설정 이메일 발송 실패:', error);
    throw new Error('이메일 발송에 실패했습니다.');
  }
};

/**
 * 환영 이메일 발송 (인증 완료 후)
 * @param {string} email - 수신자 이메일
 * @param {string} username - 사용자 이름
 */
const sendWelcomeEmail = async (email, username) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"BobMap" <${process.env.EMAIL_USER || 'noreply@bobmap.com'}>`,
    to: email,
    subject: '[BobMap] 회원가입을 축하합니다! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <h2>🎉 ${username}님, BobMap 가입을 축하합니다!</h2>
          <p>이제 BobMap의 모든 기능을 이용하실 수 있습니다.</p>
          <p>맛있는 여정을 시작해보세요!</p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login">로그인하기</a>
        </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('환영 이메일 발송 실패:', error);
    // 환영 이메일 실패는 critical하지 않으므로 에러를 throw하지 않음
    return false;
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};