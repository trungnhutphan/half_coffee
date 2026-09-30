import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';

async function createStyledPage() {
  const [html, css] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);
  const page = html.replace('<link rel="stylesheet" href="styles.css" />', `<style>${css}</style>`);
  return new JSDOM(page).window;
}

test('keeps Vietnamese display text clear of adjacent lines and glyph collisions', async () => {
  const window = await createStyledPage();
  const heading = window.getComputedStyle(window.document.querySelector('#home-title'));
  const kicker = window.getComputedStyle(window.document.querySelector('.season-note'));

  assert.ok(Number.parseFloat(heading.lineHeight) >= 1.05, `line-height was ${heading.lineHeight}`);
  assert.ok(Number.parseFloat(heading.letterSpacing) >= -0.04, `letter-spacing was ${heading.letterSpacing}`);
  assert.equal(kicker.textTransform, 'none');
});

test('stacks narrow menu controls and lets product actions wrap without overlap', async () => {
  const window = await createStyledPage();
  const document = window.document;

  document.querySelector('#menu-grid').innerHTML = `
    <article class="product-card">
      <div class="product-copy">
        <h3>Trà đào hoa nhài</h3>
        <div class="product-bottom">
          <span class="price">70.000đ</span>
          <span><button class="options-button">Tùy chọn</button><button class="add-button">Thêm</button></span>
        </div>
      </div>
    </article>
  `;

  assert.equal(window.getComputedStyle(document.querySelector('.menu-heading')).flexDirection, 'column');
  assert.equal(window.getComputedStyle(document.querySelector('.product-grid')).gridTemplateColumns, '1fr');
  assert.equal(window.getComputedStyle(document.querySelector('.product-bottom')).flexWrap, 'wrap');
  assert.equal(window.getComputedStyle(document.querySelector('.product-bottom > span:last-child')).display, 'flex');
  assert.equal(window.getComputedStyle(document.querySelector('.cart-trigger')).whiteSpace, 'nowrap');
});

test('keeps Vietnamese interface copy as valid normalized UTF-8 text', async () => {
  const files = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/data.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/app.js', import.meta.url), 'utf8'),
  ]);
  const interfaceCopy = files.join('\n');

  assert.equal(interfaceCopy, interfaceCopy.normalize('NFC'));
  assert.doesNotMatch(interfaceCopy, /Ã.|Â.|â€|�/u);
});
