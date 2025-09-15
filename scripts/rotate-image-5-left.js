const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function rotateImage5Left() {
  const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio', 'pc');
  const image5Path = path.join(portfolioDir, 'pc_5.jpg');

  try {
    console.log('🔄 PC 카테고리 5번 이미지 좌측 회전 시작...');

    // PC_5 이미지 90도 좌측 회전 (270도 우측 회전과 동일)
    console.log('  처리 중: pc_5.jpg');
    await sharp(image5Path)
      .rotate(270)  // 좌측 90도 = 우측 270도
      .toFile(image5Path + '.tmp');
    await fs.rename(image5Path + '.tmp', image5Path);
    console.log('  ✅ pc_5.jpg 좌측 90도 회전 완료');

    console.log('\n✨ 이미지 회전 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

rotateImage5Left();