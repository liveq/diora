const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function rotateImages() {
  const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio', 'pc');

  // PC 카테고리 1번 이미지 회전
  const image1Path = path.join(portfolioDir, 'pc_1.jpg');
  const image5Path = path.join(portfolioDir, 'pc_5.jpg');

  try {
    console.log('🔄 PC 카테고리 이미지 회전 시작...');

    // PC_1 이미지 90도 우측 회전
    console.log('  처리 중: pc_1.jpg');
    await sharp(image1Path)
      .rotate(90)
      .toFile(image1Path + '.tmp');
    await fs.rename(image1Path + '.tmp', image1Path);
    console.log('  ✅ pc_1.jpg 회전 완료');

    // PC_5 이미지 90도 우측 회전
    console.log('  처리 중: pc_5.jpg');
    await sharp(image5Path)
      .rotate(90)
      .toFile(image5Path + '.tmp');
    await fs.rename(image5Path + '.tmp', image5Path);
    console.log('  ✅ pc_5.jpg 회전 완료');

    console.log('\n✨ 이미지 회전 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

rotateImages();