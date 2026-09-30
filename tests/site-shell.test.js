import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { JSDOM } from 'jsdom';

import { bootstrap } from '../src/main.js';

const rootUrl = new URL('../', import.meta.url);
const indexUrl = new URL('index.html', rootUrl);

async function loadDocument() {
  assert.ok(existsSync(indexUrl), 'index.html must exist');
  const html = await readFile(indexUrl, 'utf8');
  return { html, document: new JSDOM(html).window.document };
}

test('page metadata and hero identify the KA Pods product', async () => {
  const { document } = await loadDocument();

  assert.equal(document.title, 'KA Pods — Viên giặt 4 trong 1');
  assert.match(document.querySelector('meta[name="description"]')?.content ?? '', /viên giặt KA Pods/i);
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.querySelector('h1')?.textContent.trim(), 'Giặt sạch. Kháng khuẩn. Gọn trong một viên.');
});

test('marketing story exposes every required landmark and app mount', async () => {
  const { document } = await loadDocument();
  const requiredIds = ['top', 'benefits', 'how-to', 'products', 'proof', 'app-demo', 'site-footer'];

  requiredIds.forEach((id) => assert.ok(document.getElementById(id), `missing #${id}`));
  assert.ok(document.querySelector('main'));
  assert.ok(document.querySelector('#phone-screen'));
  assert.equal(document.querySelector('#app-navigation')?.getAttribute('role'), 'tablist');
  assert.equal(document.querySelector('#demo-status')?.getAttribute('aria-live'), 'polite');
});

test('product imagery has meaningful alternatives and deployable files', async () => {
  const { document } = await loadDocument();
  const productImages = [...document.querySelectorAll('img[src^="/images/"]')];

  assert.ok(productImages.length >= 5);
  productImages.forEach((image) => {
    assert.ok(image.alt.trim().length >= 12, `${image.src} needs a specific Vietnamese alt`);
    const assetUrl = new URL(`public${image.getAttribute('src')}`, rootUrl);
    assert.ok(existsSync(assetUrl), `${fileURLToPath(assetUrl)} must exist`);
  });
});

test('internal navigation resolves and the excluded personal image never ships', async () => {
  const { html, document } = await loadDocument();
  const excludedFile = '771870654_1087674896935603_2609919475889399333_n.jpg';

  assert.ok(!html.includes(excludedFile));
  assert.ok(!existsSync(new URL(`public/images/${excludedFile}`, rootUrl)));
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    assert.ok(document.querySelector(link.getAttribute('href')), `${link.getAttribute('href')} must resolve`);
  });

  const publicFiles = readFileSync(indexUrl, 'utf8');
  assert.ok(!publicFiles.includes('TODO'));
});

test('visual system links styles and preserves accessible media contracts', async () => {
  const { document } = await loadDocument();
  const stylesheetHrefs = [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.getAttribute('href'));

  assert.deepEqual(stylesheetHrefs, [
    '/src/styles/tokens.css',
    '/src/styles/site.css',
    '/src/styles/demo.css',
  ]);
  document.querySelectorAll('img').forEach((image) => {
    assert.ok(Number(image.getAttribute('width')) > 0, `${image.src} needs width`);
    assert.ok(Number(image.getAttribute('height')) > 0, `${image.src} needs height`);
  });

  bootstrap(document);
  document.querySelectorAll('#app-navigation [role="tab"]').forEach((tab) => {
    assert.ok(tab.textContent.trim().length > 0, 'app tab needs an accessible name');
  });
});

test('CSS includes focus, reduced-motion, phone and desktop behavior', async () => {
  const cssFiles = ['tokens.css', 'site.css', 'demo.css'];
  cssFiles.forEach((file) => assert.ok(existsSync(new URL(`src/styles/${file}`, rootUrl)), `${file} must exist`));
  const css = (await Promise.all(cssFiles.map((file) => readFile(new URL(`src/styles/${file}`, rootUrl), 'utf8')))).join('\n');

  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*47\.99rem\)/);
  assert.match(css, /@media\s*\(min-width:\s*64rem\)/);
});
