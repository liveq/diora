const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  sourceDir: path.join(__dirname, '..', 'image-source'),
  targetDir: path.join(__dirname, '..', 'public', 'portfolio'),
  categories: ['search', 'goods', 'apparel', 'pc'],
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 85,
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

async function processImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`  처리 중: ${path.basename(inputPath)}`);
    console.log(`    원본 크기: ${metadata.width}x${metadata.height}`);
    
    await image
      .resize(CONFIG.maxWidth, CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: CONFIG.quality })
      .toFile(outputPath);
    
    const processedMetadata = await sharp(outputPath).metadata();
    console.log(`    처리 후: ${processedMetadata.width}x${processedMetadata.height}`);
    console.log(`    저장 위치: ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error(`  오류 발생: ${error.message}`);
    return false;
  }
}

async function processCategory(category) {
  console.log(`\n📁 ${category.toUpperCase()} 카테고리 처리 시작`);
  console.log('='.repeat(50));
  
  const sourcePath = path.join(CONFIG.sourceDir, category);
  const targetPath = path.join(CONFIG.targetDir, category);
  
  await ensureDirectoryExists(targetPath);
  
  const imageFiles = await getImageFiles(sourcePath);
  
  if (imageFiles.length === 0) {
    console.log(`  이미지가 없습니다. ${sourcePath} 폴더에 이미지를 추가해주세요.`);
    return { category, processed: 0, total: 0 };
  }
  
  console.log(`  발견된 이미지: ${imageFiles.length}개`);
  
  let processedCount = 0;
  for (let i = 0; i < Math.min(imageFiles.length, 6); i++) {
    const inputFile = imageFiles[i];
    const inputPath = path.join(sourcePath, inputFile);
    const outputFileName = `${category}_${i + 1}.jpg`;
    const outputPath = path.join(targetPath, outputFileName);
    
    const success = await processImage(inputPath, outputPath);
    if (success) processedCount++;
  }
  
  if (imageFiles.length > 6) {
    console.log(`\n  ⚠️  주의: ${imageFiles.length - 6}개의 이미지가 무시되었습니다. (카테고리당 최대 6개)`);
  }
  
  return { category, processed: processedCount, total: imageFiles.length };
}

async function main() {
  console.log('🖼️  포트폴리오 이미지 처리 시작');
  console.log('='.repeat(50));
  console.log(`원본 폴더: ${CONFIG.sourceDir}`);
  console.log(`대상 폴더: ${CONFIG.targetDir}`);
  console.log(`최대 크기: ${CONFIG.maxWidth}x${CONFIG.maxHeight}`);
  console.log(`품질: ${CONFIG.quality}%`);
  
  const results = [];
  
  for (const category of CONFIG.categories) {
    const result = await processCategory(category);
    results.push(result);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 처리 결과 요약');
  console.log('='.repeat(50));
  
  let totalProcessed = 0;
  let totalImages = 0;
  
  results.forEach(({ category, processed, total }) => {
    console.log(`  ${category}: ${processed}/${Math.min(total, 6)}개 처리됨`);
    totalProcessed += processed;
    totalImages += Math.min(total, 6);
  });
  
  console.log('='.repeat(50));
  console.log(`✅ 전체: ${totalProcessed}/${totalImages}개 이미지 처리 완료`);
  
  console.log('\n💡 사용 방법:');
  console.log('1. diora-website/image-source/{category}/ 폴더에 이미지를 넣으세요');
  console.log('2. npm run process-images 명령을 실행하세요');
  console.log('3. 처리된 이미지는 public/portfolio/{category}/ 폴더에 저장됩니다');
  console.log('\n📝 참고:');
  console.log('- 각 카테고리당 최대 6개의 이미지만 처리됩니다');
  console.log('- 이미지는 알파벳/숫자 순서로 정렬되어 번호가 매겨집니다');
  console.log('- 지원 형식: JPG, PNG, WebP, GIF, BMP, TIFF');
}

main().catch(console.error);