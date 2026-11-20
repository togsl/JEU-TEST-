import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']],
  ...['main', 'view', 'simulator', 'scenarios'].map(name => [`/src/${name}.js`, [`src/${name}.js`, 'text/javascript']])
]);

// Liste explicite des fichiers publics : aucun accès arbitraire au système de fichiers.
const server = createServer(async (request, response) => {
  const file = files.get(new URL(request.url, 'http://localhost').pathname);
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  if (!file) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const [path, type] = file;
    const content = await readFile(new URL(path, import.meta.url));
    response.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(500).end('Internal server error');
  }
});

const port = Number(process.env.PORT ?? 8080);
server.listen(port, '127.0.0.1', () => console.log(`Windows Update Simulator : http://127.0.0.1:${port}`));
