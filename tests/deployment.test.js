import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const rootUrl = new URL('../', import.meta.url);

test('Vite uses the GitHub Pages repository base path', async () => {
  const config = await readFile(new URL('vite.config.js', rootUrl), 'utf8');

  assert.match(config, /base:\s*['"]\/half_coffee\/['"]/);
});

test('GitHub Actions verifies, builds, and deploys the dist artifact', async () => {
  const workflow = await readFile(new URL('.github/workflows/deploy-pages.yml', rootUrl), 'utf8');

  assert.match(workflow, /branches:\s*\[['"]main['"]\]/);
  assert.match(workflow, /run:\s*npm ci/);
  assert.match(workflow, /run:\s*npm test/);
  assert.match(workflow, /run:\s*npm run build/);
  assert.match(workflow, /actions\/upload-pages-artifact@/);
  assert.match(workflow, /path:\s*dist/);
  assert.match(workflow, /actions\/deploy-pages@/);
});
