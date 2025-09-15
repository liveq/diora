const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function rotateImage2Right() {
  const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio', 'pc');
  const image2Path = path.join(portfolioDir, 'pc_2.jpg');

  try {
    console.log('🔄 PC 카테고리 2번 이미지 우측 회전 시작...');

    // PC_2 이미지 90도 우측 회전
    console.log('  처리 중: pc_2.jpg');
    await sharp(image2Path)
      .rotate(90)  // 우측 90도 회전
      .toFile(image2Path + '.tmp');
    await fs.rename(image2Path + '.tmp', image2Path);
    console.log('  ✅ pc_2.jpg 우측 90도 회전 완료');

    console.log('\n✨ 이미지 회전 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

rotateImage2Right();