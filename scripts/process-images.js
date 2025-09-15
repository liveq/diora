const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const CONFIG = {
  sourceDir: path.join(__dirname, '..', 'image-source'),
  outputDir: path.join(__dirname, '..', 'public', 'portfolio'),
  thumbnailSize: 400,
  fullSize: 800,
  quality: 75,
  webpQuality: 80,
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

    // 1. 썸네일 생성 (400x400, JPG & WebP)
    await image
      .resize(CONFIG.thumbnailSize, CONFIG.thumbnailSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: CONFIG.quality })
      .toFile(path.join(thumbnailDir, `${baseName}.jpg`));

    await sharp(inputPath)
      .resize(CONFIG.thumbnailSize, CONFIG.thumbnailSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: CONFIG.webpQuality })
      .toFile(path.join(thumbnailDir, `${baseName}.webp`));

    // 2. 풀사이즈 생성 (800x800, JPG & WebP)
    await sharp(inputPath)
      .resize(CONFIG.fullSize, CONFIG.fullSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: CONFIG.quality })
      .toFile(path.join(fullDir, `${baseName}.jpg`));

    await sharp(inputPath)
      .resize(CONFIG.fullSize, CONFIG.fullSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: CONFIG.webpQuality })
      .toFile(path.join(fullDir, `${baseName}.webp`));

    console.log(`    ✅ 썸네일: ${CONFIG.thumbnailSize}x${CONFIG.thumbnailSize} (JPG & WebP)`);
    console.log(`    ✅ 풀사이즈: ${CONFIG.fullSize}x${CONFIG.fullSize} (JPG & WebP)`);

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

async function cleanOldFiles() {
  console.log('\n🧹 기존 파일 정리 중...');

  // 기존 카테고리별 폴더 삭제
  const categories = ['search', 'goods', 'apparel', 'pc'];
  for (const category of categories) {
    const oldPath = path.join(CONFIG.outputDir, category);
    try {
      await fs.rmdir(oldPath, { recursive: true });
      console.log(`  ✅ 기존 ${category} 폴더 삭제됨`);
    } catch (error) {
      // 폴더가 없으면 무시
    }
  }
}

async function main() {
  console.log('🖼️  포트폴리오 이미지 처리 시작 (썸네일 + 풀사이즈 + WebP)');
  console.log('==================================================');
  console.log(`원본 폴더: ${CONFIG.sourceDir}`);
  console.log(`대상 폴더: ${CONFIG.outputDir}`);
  console.log(`썸네일 크기: ${CONFIG.thumbnailSize}x${CONFIG.thumbnailSize}`);
  console.log(`풀사이즈 크기: ${CONFIG.fullSize}x${CONFIG.fullSize}`);
  console.log(`JPG 품질: ${CONFIG.quality}%`);
  console.log(`WebP 품질: ${CONFIG.webpQuality}%`);

  // 기존 파일 정리
  await cleanOldFiles();

  // 출력 디렉토리 생성
  await ensureDirectoryExists(CONFIG.outputDir);
  await ensureDirectoryExists(path.join(CONFIG.outputDir, 'thumbnails'));
  await ensureDirectoryExists(path.join(CONFIG.outputDir, 'full'));

  const categories = ['search', 'goods', 'apparel', 'pc'];
  const results = {};

  for (const category of categories) {
    results[category] = await processCategory(category);
  }

  console.log('\n==================================================');
  console.log('📊 처리 결과 요약');
  console.log('==================================================');

  for (const [category, result] of Object.entries(results)) {
    console.log(`  ${category}: ${result.processed}/${result.total}개 처리됨`);
  }

  const totalProcessed = Object.values(results).reduce((sum, r) => sum + r.processed, 0);
  const totalFiles = Object.values(results).reduce((sum, r) => sum + r.total, 0);

  console.log('==================================================');
  console.log(`✅ 전체: ${totalProcessed}/${totalFiles}개 이미지 처리 완료`);
  console.log('\n💡 생성된 파일:');
  console.log('  - thumbnails/{category}/ : 400x400 썸네일 (JPG & WebP)');
  console.log('  - full/{category}/ : 800x800 풀사이즈 (JPG & WebP)');
}

main().catch(console.error);