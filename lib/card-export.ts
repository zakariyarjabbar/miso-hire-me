import { getService } from './content';
import type { OfferRecord } from './offers';
let fontsReady: Promise<void> | undefined;
async function fonts() {
  fontsReady ??= (async () => {
    const display = new FontFace('Miso Display', 'url(/fonts/bricolage.woff2)', {
      weight: '200 800',
    });
    const body = new FontFace('Miso Body', 'url(/fonts/hanken.woff2)', { weight: '100 900' });
    const loaded = await Promise.all([display.load(), body.load()]);
    loaded.forEach((font) => document.fonts.add(font));
    await document.fonts.ready;
  })().catch((error) => {
    fontsReady = undefined;
    throw error;
  });
  return fontsReady;
}
function fitLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  maxLines: number,
  size: number,
  minSize: number,
) {
  const wrap = (fontSize: number) => {
    ctx.font = `700 ${fontSize}px "Miso Display"`;
    const lines: string[] = [];
    let line = '';
    for (const word of text.trim().split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= width) {
        line = next;
        continue;
      }
      if (line) {
        lines.push(line);
        line = '';
      }
      for (const char of Array.from(word)) {
        if (ctx.measureText(line + char).width > width && line) {
          lines.push(line);
          line = char;
        } else line += char;
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  let lines = wrap(size);
  while (lines.length > maxLines && size > minSize) {
    size -= 2;
    lines = wrap(size);
  }
  return { lines, size };
}
export async function renderCard(record: OfferRecord): Promise<Blob> {
  if (record.status !== 'accepted' || !record.acceptedTerms)
    throw new Error('A souvenir is available after an offer is accepted.');
  await fonts();
  const photo = new Image();
  photo.src = '/images/hero.webp';
  await photo.decode();
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser could not create the card image.');
  const input = record.acceptedTerms;
  ctx.fillStyle = '#BEDCED';
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = '#24231F';
  ctx.font = '800 68px "Miso Display"';
  ctx.fillText('miso.', 65, 107);
  ctx.font = '500 23px "Miso Body"';
  ctx.fillText('FREELANCE CAT', 264, 102);
  ctx.font = '750 99px "Miso Display"';
  ctx.fillText('I hired Miso.', 60, 239);
  ctx.font = '500 26px "Miso Body"';
  ctx.fillText('An excellent fictional business decision.', 65, 291);
  const ratio = photo.width / photo.height;
  const height = 600;
  ctx.drawImage(photo, 570, 307, height * ratio, height);
  ctx.fillStyle = '#F6E7A7';
  ctx.save();
  ctx.translate(205, 465);
  ctx.rotate(-0.11);
  ctx.beginPath();
  ctx.arc(0, 0, 122, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#24231F';
  ctx.textAlign = 'center';
  ctx.font = '700 24px "Miso Display"';
  ctx.fillText('TERMS', 0, -13);
  ctx.fillText('ACCEPTED', 0, 20);
  ctx.font = '400 18px "Miso Body"';
  ctx.fillText('I was very persuasive.', 0, 55);
  ctx.restore();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFCF4';
  ctx.fillRect(40, 875, 1000, 435);
  ctx.fillStyle = '#24231F';
  ctx.font = '500 20px "Miso Body"';
  ctx.fillText('MY NEW FICTIONAL COLLEAGUE', 70, 922);
  const name = fitLines(ctx, input.displayName, 920, 2, 52, 24);
  ctx.font = `700 ${name.size}px "Miso Display"`;
  name.lines.forEach((line, i) => ctx.fillText(line, 70, 982 + i * (name.size + 8)));
  const lineY = 1103;
  ctx.strokeStyle = '#C8C6B9';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, lineY);
  ctx.lineTo(1010, lineY);
  ctx.stroke();
  ctx.font = '500 18px "Miso Body"';
  ctx.fillText('MY ROLE', 70, 1140);
  ctx.fillText('AGREED COMPENSATION', 650, 1140);
  ctx.font = '700 28px "Miso Display"';
  ctx.fillText(getService(input.serviceId).name, 70, 1180);
  ctx.fillText(`${input.treats} imaginary treats`, 650, 1180);
  ctx.font = '500 17px "Miso Body"';
  ctx.fillText(`REF ${record.id}`, 70, 1232);
  ctx.fillStyle = '#59584E';
  ctx.font = '400 16px "Miso Body"';
  ctx.fillText('Fictional demo · No animal booked. No money or treats change paws.', 70, 1276);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('This browser could not export the PNG.')),
      'image/png',
    ),
  );
}
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
