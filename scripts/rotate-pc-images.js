const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function rotateImages() {
  const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio');

  // 회전할 이미지 목록
  const imagesToRotate = [
    {
      thumbnailJpg: path.join(portfolioDir, 'thumbnails', 'pc', 'pc_1.jpg'),
      thumbnailWebp: path.join(portfolioDir, 'thumbnails', 'pc', 'pc_1.webp'),
      fullJpg: path.join(portfolioDir, 'full', 'pc', 'pc_1.jpg'),
      fullWebp: path.join(portfolioDir, 'full', 'pc', 'pc_1.webp')
    },
    {
      thumbnailJpg: path.join(portfolioDir, 'thumbnails', 'pc', 'pc_2.jpg'),
      thumbnailWebp: path.join(portfolioDir, 'thumbnails', 'pc', 'pc_2.webp'),
      fullJpg: path.join(portfolioDir, 'full', 'pc', 'pc_2.jpg'),
      fullWebp: path.join(portfolioDir, 'full', 'pc', 'pc_2.webp')
    }
  ];

  console.log('🔄 PC 이미지 회전 시작...');
  console.log('==================================================');

  for (let i = 0; i < imagesToRotate.length; i++) {
    const images = imagesToRotate[i];
    console.log(`\n📸 PC_${i + 1} 이미지 처리 중...`);

    for (const [type, imagePath] of Object.entries(images)) {
      try {
        // 이미지 존재 확인
        await fs.access(imagePath);

        // 임시 파일로 백업
        const tempPath = imagePath + '.temp';
        await fs.copyFile(imagePath, tempPath);

        // 90도 시계방향 회전
        await sharp(tempPath)
          .rotate(90)
          .toFile(imagePath);

        // 임시 파일 삭제
        await fs.unlink(tempPath);

        console.log(`  ✅ ${type} 회전 완료`);
      } catch (error) {
        console.error(`  ❌ ${type} 회전 실패:`, error.message);
      }
    }
  }

  console.log('\n==================================================');
  console.log('✅ PC 이미지 회전 완료!');
}

rotateImages().catch(console.error);