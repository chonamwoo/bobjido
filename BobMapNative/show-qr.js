const qrcode = require('qrcode-terminal');

// Expo 앱 URL
const expoUrl = 'exp://172.20.10.4:19000';

console.log('\n========================================');
console.log('🚀 BobMap Native - Expo QR Code');
console.log('========================================\n');
console.log('📱 Expo Go 앱에서 아래 QR 코드를 스캔하세요:\n');

// QR 코드 생성 및 표시
qrcode.generate(expoUrl, { small: false }, function(qr) {
    console.log(qr);
});

console.log('\n또는 수동으로 URL 입력:');
console.log(`📍 ${expoUrl}`);
console.log('\n========================================');
console.log('💡 팁:');
console.log('- 컴퓨터와 폰이 같은 Wi-Fi에 연결되어 있어야 합니다');
console.log('- VPN이 켜져 있다면 끄세요');
console.log('- 문제가 있다면 npx expo start --tunnel 시도');
console.log('========================================\n');