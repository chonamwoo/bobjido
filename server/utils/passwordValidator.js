const zxcvbn = require('zxcvbn');

/**
 * 비밀번호 강도 검증
 * @param {string} password - 검증할 비밀번호
 * @param {string} userId - 사용자 ID (비밀번호와 유사성 체크용)
 * @param {string} email - 이메일 (비밀번호와 유사성 체크용)
 * @returns {object} - 검증 결과
 */
const validatePassword = (password, userId = '', email = '') => {
  const errors = [];
  
  // 기본 길이 체크
  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다');
  }
  
  if (password.length > 128) {
    errors.push('비밀번호는 최대 128자까지 가능합니다');
  }
  
  // 문자 종류 체크
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const charTypeCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (charTypeCount < 3) {
    errors.push('비밀번호는 대문자, 소문자, 숫자, 특수문자 중 최소 3가지를 포함해야 합니다');
  }
  
  // 연속된 문자/숫자 체크
  if (/(.)\1{2,}/.test(password)) {
    errors.push('동일한 문자를 3개 이상 연속으로 사용할 수 없습니다');
  }
  
  // 키보드 패턴 체크
  const keyboardPatterns = [
    'qwerty', 'asdfgh', 'zxcvbn', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
    '123456', '234567', '345678', '456789', '567890',
    'abcdef', 'bcdefg', 'cdefgh', 'defghi', 'efghij'
  ];
  
  const lowerPassword = password.toLowerCase();
  for (const pattern of keyboardPatterns) {
    if (lowerPassword.includes(pattern) || lowerPassword.includes(pattern.split('').reverse().join(''))) {
      errors.push('키보드 패턴이나 연속된 문자/숫자는 사용할 수 없습니다');
      break;
    }
  }
  
  // 아이디/이메일과 유사성 체크
  if (userId && password.toLowerCase().includes(userId.toLowerCase())) {
    errors.push('비밀번호에 아이디를 포함할 수 없습니다');
  }
  
  if (email) {
    const emailUsername = email.split('@')[0];
    if (emailUsername && password.toLowerCase().includes(emailUsername.toLowerCase())) {
      errors.push('비밀번호에 이메일 주소의 일부를 포함할 수 없습니다');
    }
  }
  
  // 흔한 비밀번호 체크
  const commonPasswords = [
    'password', 'Password', '12345678', '123456789', 'qwerty123',
    'admin123', 'letmein', 'welcome', 'monkey', 'dragon',
    'iloveyou', 'password1', 'password123', 'admin', 'root'
  ];
  
  if (commonPasswords.some(common => lowerPassword === common.toLowerCase())) {
    errors.push('너무 흔한 비밀번호는 사용할 수 없습니다');
  }
  
  // zxcvbn을 사용한 강도 측정
  const userInputs = [userId, email].filter(Boolean);
  const strength = zxcvbn(password, userInputs);
  
  // 강도 점수 (0-4)
  let strengthText = '';
  switch (strength.score) {
    case 0:
      strengthText = '매우 약함';
      errors.push('비밀번호가 너무 약합니다. 더 복잡한 비밀번호를 사용하세요');
      break;
    case 1:
      strengthText = '약함';
      errors.push('비밀번호가 약합니다. 더 복잡한 비밀번호를 사용하세요');
      break;
    case 2:
      strengthText = '보통';
      break;
    case 3:
      strengthText = '강함';
      break;
    case 4:
      strengthText = '매우 강함';
      break;
  }
  
  // 추가 피드백
  const feedback = [];
  if (strength.feedback.suggestions.length > 0) {
    feedback.push(...strength.feedback.suggestions);
  }
  
  return {
    isValid: errors.length === 0 && strength.score >= 3, // 강함 이상 허용
    errors,
    strength: {
      score: strength.score,
      text: strengthText,
      crackTime: strength.crack_times_display.offline_slow_hashing_1e4_per_second
    },
    feedback,
    details: {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      length: password.length
    }
  };
};

module.exports = { validatePassword };