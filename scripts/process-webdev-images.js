const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const CONFIG = {
  sourceDir: path.join(__dirname, '..', 'image-source'),
  outputDir: path.join(__dirname, '..', 'public', 'portfolio'),
  thumbnailSize: 400,
  fullSize: 800,
  quality: 100,
  webpQuality: 95,
  supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff']
};

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function getImageFiles(categoryPath) {
  try {
    const files = await fs.readdir(categoryPath);
    return files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return CONFIG.supportedFormats.includes(ext);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch (error) {
    console.log(`카테고리 폴더 ${categoryPath}가 비어있거나 존재하지 않습니다.`);
    return [];
  }
}

async function processImage(inputPath, category, index) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`  처리 중: ${path.basename(inputPath)}`);
    console.log(`    원본 크기: ${metadata.width}x${metadata.height}`);

    // 썸네일 경로
    const thumbnailDir = path.join(CONFIG.outputDir, 'thumbnails', category);
    const fullDir = path.join(CONFIG.outputDir, 'full', category);

    await ensureDirectoryExists(thumbnailDir);
    await ensureDirectoryExists(fullDir);

    const baseName = `${category}_${index}`;

    // 1. 썸네일 생성 (400x400, JPG & WebP) - 가로 압축하여 꽉 채우기
    await image
      .resize(CONFIG.thumbnailSize, CONFIG.thumbnailSize, {
        fit: 'fill'
      })
      .jpeg({ quality: CONFIG.quality })
      .toFile(path.join(thumbnailDir, `${baseName}.jpg`));

    await sharp(inputPath)
      .resize(CONFIG.thumbnailSize, CONFIG.thumbnailSize, {
        fit: 'fill'
      })
      .webp({ quality: CONFIG.webpQuality })
      .toFile(path.join(thumbnailDir, `${baseName}.webp`));

    // 2. 풀사이즈 생성 (최대 800px, JPG & WebP) - 원본 비율 유지
    await sharp(inputPath)
      .resize(CONFIG.fullSize, CONFIG.fullSize, {
        fit: 'inside'
      })
      .jpeg({ quality: CONFIG.quality })
      .toFile(path.join(fullDir, `${baseName}.jpg`));

    await sharp(inputPath)
      .resize(CONFIG.fullSize, CONFIG.fullSize, {
        fit: 'inside'
      })
      .webp({ quality: CONFIG.webpQuality })
      .toFile(path.join(fullDir, `${baseName}.webp`));

    console.log(`    ✅ 썸네일: ${CONFIG.thumbnailSize}x${CONFIG.thumbnailSize} (JPG & WebP)`);
    console.log(`    ✅ 풀사이즈: 최대 ${CONFIG.fullSize}px (원본 비율 유지, JPG & WebP)`);

    return true;
  } catch (error) {
    console.error(`이미지 처리 실패: ${inputPath}`, error);
    return false;
  }
}

async function processCategory(category) {
  console.log(`\n📁 ${category.toUpperCase()} 카테고리 처리 시작`);
  console.log('==================================================');

  const categoryPath = path.join(CONFIG.sourceDir, category);
  const imageFiles = await getImageFiles(categoryPath);

  if (imageFiles.length === 0) {
    console.log('  이미지 파일이 없습니다.');
    return { total: 0, processed: 0 };
  }

  console.log(`  발견된 이미지: ${imageFiles.length}개`);

  let processedCount = 0;
  const maxImages = 6; // 카테고리당 최대 6개 이미지

  for (let i = 0; i < Math.min(imageFiles.length, maxImages); i++) {
    const imagePath = path.join(categoryPath, imageFiles[i]);
    const success = await processImage(imagePath, category, i + 1);
    if (success) processedCount++;
  }

  return { total: Math.min(imageFiles.length, maxImages), processed: processedCount };
}

async function main() {
  console.log('🖼️  웹개발 포트폴리오 이미지 처리 시작 (썸네일 + 풀사이즈 + WebP)');
  console.log('==================================================');
  console.log(`원본 폴더: ${CONFIG.sourceDir}`);
  console.log(`대상 폴더: ${CONFIG.outputDir}`);
  console.log(`썸네일 크기: ${CONFIG.thumbnailSize}x${CONFIG.thumbnailSize}`);
  console.log(`풀사이즈 크기: ${CONFIG.fullSize}x${CONFIG.fullSize}`);
  console.log(`JPG 품질: ${CONFIG.quality}%`);
  console.log(`WebP 품질: ${CONFIG.webpQuality}%`);

  // 출력 디렉토리 생성
  await ensureDirectoryExists(CONFIG.outputDir);
  await ensureDirectoryExists(path.join(CONFIG.outputDir, 'thumbnails'));
  await ensureDirectoryExists(path.join(CONFIG.outputDir, 'full'));

  const result = await processCategory('web');

  console.log('\n==================================================');
  console.log('📊 처리 결과 요약');
  console.log('==================================================');
  console.log(`  web: ${result.processed}/${result.total}개 처리됨`);
  console.log('==================================================');
  console.log(`✅ 전체: ${result.processed}/${result.total}개 이미지 처리 완료`);
  console.log('\n💡 생성된 파일:');
  console.log('  - thumbnails/web/ : 400x400 썸네일 (정사각형 강제, JPG & WebP)');
  console.log('  - full/web/ : 최대 800px 풀사이즈 (원본 비율 유지, JPG & WebP)');
}

main().catch(console.error);
