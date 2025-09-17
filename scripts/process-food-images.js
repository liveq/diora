const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../image-source/food');
const OUTPUT_DIR = path.join(__dirname, '../public/portfolio/food');

// 김치 이미지 처리
async function processKimchiImages() {
  const kimchiDir = path.join(SOURCE_DIR, 'kimchi');
  const kimchiFiles = fs.readdirSync(kimchiDir);

  console.log(`Processing ${kimchiFiles.length} kimchi images...`);

  for (let i = 0; i < kimchiFiles.length; i++) {
    const inputPath = path.join(kimchiDir, kimchiFiles[i]);
    const outputName = `kimchi_${i + 1}`;

    // 썸네일 생성 (400x400)
    await sharp(inputPath)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 100 })
      .toFile(path.join(OUTPUT_DIR, 'thumbnail', `${outputName}.webp`));

    // 풀샷 생성 (800x800)
    await sharp(inputPath)
      .resize(800, 800, { fit: 'cover' })
      .webp({ quality: 100 })
      .toFile(path.join(OUTPUT_DIR, 'full', `${outputName}.webp`));

    console.log(`✅ Processed: ${outputName}`);
  }
}

// 공장 이미지 처리
async function processFactoryImages() {
  const factoryDir = path.join(SOURCE_DIR, 'factory/factory');
  const factoryFiles = fs.readdirSync(factoryDir);

  console.log(`Processing ${factoryFiles.length} factory images...`);

  for (let i = 0; i < factoryFiles.length; i++) {
    const inputPath = path.join(factoryDir, factoryFiles[i]);
    const outputName = `factory_${i + 1}`;

    // 썸네일 생성 (400x400)
    await sharp(inputPath)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 100 })
      .toFile(path.join(OUTPUT_DIR, 'thumbnail', `${outputName}.webp`));

    // 풀샷 생성 (800x800)
    await sharp(inputPath)
      .resize(800, 800, { fit: 'cover' })
      .webp({ quality: 100 })
      .toFile(path.join(OUTPUT_DIR, 'full', `${outputName}.webp`));

    console.log(`✅ Processed: ${outputName}`);
  }
}

// 메인 함수
async function processAllImages() {
  try {
    console.log('🚀 Starting image processing for Food Portfolio...\n');

    // 김치 이미지 처리
    await processKimchiImages();
    console.log('\n');

    // 공장 이미지 처리
    await processFactoryImages();

    console.log('\n✨ All images processed successfully!');
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('❌ Error processing images:', error);
  }
}

// 실행
processAllImages();