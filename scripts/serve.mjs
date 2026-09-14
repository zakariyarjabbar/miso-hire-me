import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
const compress = promisify(gzip);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../out');
const port = Number(process.env.PORT || 3006);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url || '/', `http://127.0.0.1:${port}`).pathname,
    );
    let target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(403);
      return res.end();
    }
    let info;
    try {
      info = await stat(target);
    } catch {}
    if (info?.isDirectory()) target = path.join(target, 'index.html');
    let content;
    try {
      content = await readFile(target);
    } catch {
      res.statusCode = 404;
      target = path.join(root, '404.html');
      content = await readFile(target);
    }
    res.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Vary', 'Accept-Encoding');
    if (
      /\b(?:gzip)\b/.test(req.headers['accept-encoding'] || '') &&
      /\.(html|js|css|json|txt|svg)$/.test(target)
    ) {
      content = await compress(content);
      res.setHeader('Content-Encoding', 'gzip');
    }
    res.setHeader('Content-Length', content.length);
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
  }
});
server.listen(port, '127.0.0.1', () =>
  console.log(`Miso static preview: http://127.0.0.1:${port}`),
);
