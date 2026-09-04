/**
 * Otimiza imagens estáticas em public/ com sharp.
 * - Produtos: WebP max 800px (retina do card ~400px)
 * - Hero: WebP 1920w + 960w
 * - OG icon: PNG comprimido
 *
 * Uso: npm run optimize:images
 * Fontes: PNG/JPG existentes; gera WebP e remove PNG pesados de public/img.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const imgDir = path.join(publicDir, "img");

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function fileSize(filePath) {
  try {
    return (await fs.stat(filePath)).size;
  } catch {
    return 0;
  }
}

async function optimizeProducts() {
  const entries = await fs.readdir(imgDir);
  const sources = entries.filter((f) => /\.(png|jpe?g)$/i.test(f));
  let before = 0;
  let after = 0;

  for (const file of sources) {
    const srcPath = path.join(imgDir, file);
    const base = file.replace(/\.(png|jpe?g)$/i, "");
    const outPath = path.join(imgDir, `${base}.webp`);
    const srcBytes = await fileSize(srcPath);
    before += srcBytes;

    await sharp(srcPath)
      .rotate()
      .resize({ width: 800, height: 1000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(outPath);

    const outBytes = await fileSize(outPath);
    after += outBytes;
    await fs.unlink(srcPath);
    console.log(`  ${file} → ${base}.webp  ${kb(srcBytes)} → ${kb(outBytes)}`);
  }

  return { count: sources.length, before, after };
}

async function optimizeHero() {
  const src = path.join(publicDir, "background-hero.jpg");
  const srcBytes = await fileSize(src);
  if (!srcBytes) {
    console.warn("  (hero fonte ausente, pulando)");
    return { before: 0, after: 0 };
  }

  const input = sharp(await fs.readFile(src)).rotate();
  const outLg = path.join(publicDir, "background-hero.webp");
  const outSm = path.join(publicDir, "background-hero-sm.webp");

  await input
    .clone()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile(outLg);

  await input
    .clone()
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 70, effort: 6 })
    .toFile(outSm);

  // JPG leve de fallback (<picture>)
  const jpgBuffer = await input
    .clone()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  await fs.writeFile(src, jpgBuffer);

  const after =
    (await fileSize(outLg)) + (await fileSize(outSm)) + (await fileSize(src));
  console.log(
    `  hero  ${kb(srcBytes)} → webp lg/sm + jpg  ${kb(await fileSize(outLg))} / ${kb(await fileSize(outSm))} / ${kb(await fileSize(src))}`
  );
  return { before: srcBytes, after };
}

async function optimizeOgIcon() {
  const src = path.join(publicDir, "icon2.png");
  const srcBytes = await fileSize(src);
  if (!srcBytes) return { before: 0, after: 0 };

  const tmp = src + ".tmp";
  await sharp(src)
    .resize({ width: 512, height: 512, fit: "cover" })
    .png({ compressionLevel: 9, palette: true })
    .toFile(tmp);
  await fs.rename(tmp, src);
  const after = await fileSize(src);
  console.log(`  icon2.png  ${kb(srcBytes)} → ${kb(after)}`);
  return { before: srcBytes, after };
}

async function main() {
  console.log("Otimizando imagens…\nProdutos:");
  const products = await optimizeProducts();
  console.log("\nHero:");
  const hero = await optimizeHero();
  console.log("\nOG:");
  const og = await optimizeOgIcon();

  const before = products.before + hero.before + og.before;
  const after = products.after + hero.after + og.after;
  console.log(
    `\nTotal: ${products.count} produtos + hero + og — ${kb(before)} → ${kb(after)} (−${(((before - after) / before) * 100).toFixed(0)}%)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
