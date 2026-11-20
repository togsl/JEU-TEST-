import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const moduleUrls = new Map();

// Dependency order is explicit; the source files remain normal ES modules.
for (const name of ['scenarios', 'simulator', 'view', 'main']) {
  let source = await read(`src/${name}.js`);
  for (const [dependency, url] of moduleUrls) {
    source = source.replaceAll(`'./${dependency}.js'`, `'${url}'`);
  }
  moduleUrls.set(name, `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

const css = await read('styles.css');
const html = (await read('index.html'))
  .replace('<link rel="stylesheet" href="./styles.css">', `<style>\n${css}\n</style>`)
  .replace('src="./src/main.js"', `src="${moduleUrls.get('main')}"`);
await mkdir(new URL('dist/', root), { recursive: true });
await writeFile(new URL('dist/windows-update.html', root), html);
console.log('Version autonome : dist/windows-update.html');
