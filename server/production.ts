/**
 * Servidor de produção mínimo: arquivos estáticos de `dist/` + POST /api/chat.
 * Uso: GEMINI_API_KEY=... FIREBASE_PROJECT_ID=... node --experimental-strip-types server/production.ts
 * (ou compile/adapte ao seu host). Em `npm run dev` / `preview` o proxy já vem no Vite.
 * Em produção atrás de proxy, defina TRUST_PROXY=true.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { handleChatRequest, isChatApiPath } from './geminiApi.ts';

const PORT = Number(process.env.PORT ?? 4173);
const DIST = join(process.cwd(), 'dist');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  void (async () => {
    if (isChatApiPath(req.url)) {
      await handleChatRequest(req, res);
      return;
    }

    const urlPath = (req.url ?? '/').split('?')[0] || '/';
    const relative =
      urlPath === '/'
        ? 'index.html'
        : urlPath.replace(/^\//, '').replace(/\.\./g, '');
    let filePath = join(DIST, relative);

    try {
      const data = await readFile(filePath);
      const type = MIME[extname(filePath)] ?? 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    } catch {
      try {
        filePath = join(DIST, 'index.html');
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      } catch {
        res.writeHead(404).end('Not found');
      }
    }
  })();
}).listen(PORT, () => {
  console.log(`Life Simple em http://localhost:${PORT}`);
});
