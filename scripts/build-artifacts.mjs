import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await sharp(path.join(root, 'public/images/hero.webp'))
  .resize(480, 720)
  .webp({ quality: 80 })
  .toFile(path.join(root, 'public/images/hero-mobile.webp'));
GlobalFonts.registerFromPath(path.join(root, 'public/fonts/bricolage.woff2'), 'Bricolage');
GlobalFonts.registerFromPath(path.join(root, 'public/fonts/hanken.woff2'), 'Hanken');
await mkdir(path.join(root, 'public/social'), { recursive: true });
const palette = {
  sky: '#BEDCED',
  butter: '#F6E7A7',
  paper: '#FFFCF4',
  ink: '#24231F',
  red: '#B52F1D',
};
const covers = [
  {
    name: 'home',
    lines: ['Hire me.', "I'm very employable."],
    image: 'hero',
    background: 'sky',
    cutout: true,
  },
  {
    name: 'laptop-warming',
    lines: ['The Laptop', 'Warming Initiative'],
    image: 'laptop-scene',
    background: 'sky',
  },
  {
    name: 'box-04',
    lines: ['Box 04:', 'Quality Assurance'],
    image: 'box-inspection',
    background: 'butter',
  },
  {
    name: 'sofa-occupancy',
    lines: ['The Sofa', 'Occupancy Project'],
    image: 'sofa-scene',
    background: 'paper',
  },
  {
    name: 'resume',
    lines: ['The résumé.', 'References from furniture.'],
    image: 'hero',
    background: 'butter',
    cutout: true,
  },
];
for (const cover of covers) {
  const canvas = createCanvas(1200, 630),
    ctx = canvas.getContext('2d');
  ctx.fillStyle = palette[cover.background];
  ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = palette.ink;
  ctx.font = '800 44px Bricolage';
  ctx.fillText('miso.', 50, 68);
  ctx.font = '500 15px Hanken';
  ctx.fillText('FREELANCE CAT', 175, 63);
  ctx.textAlign = 'center';
  cover.lines.forEach((line, i) => {
    let size = i === 1 && cover.name === 'resume' ? 43 : 68;
    ctx.font = `700 ${size}px Bricolage`;
    while (ctx.measureText(line).width > 550 && size > 20) {
      size--;
      ctx.font = `700 ${size}px Bricolage`;
    }
    ctx.fillStyle = i === 1 ? palette.red : palette.ink;
    ctx.fillText(line, 600, 145 + i * 77);
  });
  const img = await loadImage(await readFile(path.join(root, `public/images/${cover.image}.webp`)));
  if (cover.cutout) {
    ctx.fillStyle = palette[cover.background === 'butter' ? 'sky' : 'butter'];
    ctx.beginPath();
    ctx.ellipse(600, 484, 205, 137, 0, 0, Math.PI * 2);
    ctx.fill();
    const height = 366;
    const width = (height * img.width) / img.height;
    ctx.drawImage(img, 600 - width / 2, 255, width, height);
  } else {
    const w = 484,
      h = 310,
      x = 358,
      y = 267;
    ctx.fillStyle = palette.paper;
    ctx.fillRect(x - 9, y - 9, w + 18, h + 18);
    const ratio = Math.max(w / img.width, h / img.height),
      sw = w / ratio,
      sh = h / ratio;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = palette.ink;
  ctx.font = '500 17px Hanken';
  ctx.fillText('A VERY PERSONAL', 50, 543);
  ctx.fillText('PORTFOLIO.', 50, 568);
  ctx.textAlign = 'right';
  ctx.font = '400 15px Hanken';
  ctx.fillText('Fictional cat.', 1150, 543);
  ctx.fillText('Considerable confidence.', 1150, 568);
  await writeFile(path.join(root, `public/social/${cover.name}.png`), canvas.toBuffer('image/png'));
}
console.log('Generated 5 local 1200 × 630 social covers using bundled fonts and Miso photography.');
