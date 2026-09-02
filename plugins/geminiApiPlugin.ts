import type { Plugin, Connect } from 'vite';
import { handleChatRequest, isChatApiPath } from '../server/geminiApi.ts';

function geminiMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (!isChatApiPath(req.url)) {
      next();
      return;
    }
    void handleChatRequest(req, res).catch((error: unknown) => {
      console.error(error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Erro interno' }));
      }
    });
  };
}

/** Expõe POST /api/chat no Vite (dev + preview) sem expor a chave Gemini ao browser. */
export function geminiApiPlugin(): Plugin {
  return {
    name: 'life-simple-gemini-api',
    configureServer(server) {
      server.middlewares.use(geminiMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(geminiMiddleware());
    },
  };
}
