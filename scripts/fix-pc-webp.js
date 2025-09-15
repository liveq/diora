const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function fixPCWebP() {
  const directories = [
    {
      dir: path.join(__dirname, '..', 'public', 'portfolio', 'full', 'pc'),
      quality: 90
    },
    {
      dir: path.join(__dirname, '..', 'public', 'portfolio', 'thumbnails', 'pc'),
      quality: 90
    }
  ];

  for (const { dir, quality } of directories) {
    console.log(`\n처리 중: ${dir}`);

    for (const num of ['1', '2']) {
      const jpgPath = path.join(dir, `pc_${num}.jpg`);
      const webpPath = path.join(dir, `pc_${num}.webp`);

      try {
        // 기존 WebP 삭제 시도
        try {
          await fs.unlink(webpPath);
          console.log(`  ✅ 기존 pc_${num}.webp 삭제됨`);
        } catch (e) {
          console.log(`  ⚠️ pc_${num}.webp 삭제 실패 (이미 없거나 잠김)`);
        }

        // 회전된 JPG에서 새로운 WebP 생성
        console.log(`  생성 중: pc_${num}.webp (회전된 JPG에서)`);
        await sharp(jpgPath)
          .webp({ quality: quality })
          .toFile(webpPath);

        console.log(`    ✅ pc_${num}.webp 생성 완료`);

      } catch (error) {
        console.error(`    ❌ 오류 발생: ${error.message}`);
      }
    }
  }

  console.log('\n✅ PC 이미지 1, 2번 WebP 재생성 완료!');
}

fixPCWebP().catch(console.error);