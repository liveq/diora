const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function rotateImages() {
  const directories = [
    path.join(__dirname, '..', 'public', 'portfolio', 'full', 'pc'),
    path.join(__dirname, '..', 'public', 'portfolio', 'thumbnails', 'pc')
  ];

  for (const dir of directories) {
    console.log(`\n처리 중: ${dir}`);

    // JPG 파일 회전
    for (const num of ['1', '2']) {
      const jpgPath = path.join(dir, `pc_${num}.jpg`);
      const webpPath = path.join(dir, `pc_${num}.webp`);
      const tempJpgPath = path.join(dir, `pc_${num}_temp.jpg`);
      const tempWebpPath = path.join(dir, `pc_${num}_temp.webp`);

      try {
        // JPG 회전
        console.log(`  회전 중: pc_${num}.jpg`);
        await sharp(jpgPath)
          .rotate(90)
          .toFile(tempJpgPath);
        await fs.unlink(jpgPath);
        await fs.rename(tempJpgPath, jpgPath);
        console.log(`    ✅ pc_${num}.jpg 회전 완료`);

        // WebP 회전
        console.log(`  회전 중: pc_${num}.webp`);
        await sharp(webpPath)
          .rotate(90)
          .toFile(tempWebpPath);
        await fs.unlink(webpPath);
        await fs.rename(tempWebpPath, webpPath);
        console.log(`    ✅ pc_${num}.webp 회전 완료`);

      } catch (error) {
        console.error(`    ❌ 오류 발생: ${error.message}`);
      }
    }
  }

  console.log('\n✅ PC 이미지 1, 2번 회전 완료!');
}

rotateImages().catch(console.error);