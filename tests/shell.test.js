import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';

import { bootstrap } from '../src/app.js';

async function loadIndexDocument() {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  return new JSDOM(html).window.document;
}

test('contains landmarks and live feedback targets for the ordering flow', async () => {
  const document = await loadIndexDocument();

  assert.ok(document.querySelector('main'));
  assert.ok(document.querySelector('#menu-grid'));
  assert.ok(document.querySelector('#cart-button'));
  assert.equal(document.querySelector('#toast')?.getAttribute('aria-live'), 'polite');
});

async function startDemo() {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const runtimeErrors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => runtimeErrors.push(error));
  const dom = new JSDOM(html, { url: 'http://every-half.local/', virtualConsole });
  bootstrap(dom.window.document);
  return { document: dom.window.document, window: dom.window, runtimeErrors };
}

test('updates the cart badge and total after adding a menu product', async () => {
  const { document } = await startDemo();
  document.querySelector('[data-action="show-menu"]').click();
  document.querySelector('[data-product-id="cara-melting"] [data-action="add"]').click();

  assert.equal(document.querySelector('#cart-count').textContent, '1');
  assert.match(document.querySelector('#cart-total').textContent, /80\.000đ/);
});

test('changes views without creating browser runtime errors', async () => {
  const { document, runtimeErrors } = await startDemo();
  document.querySelector('[data-action="show-menu"]').click();

  assert.deepEqual(runtimeErrors, []);
});

test('does not confirm an empty cart and allows Escape to close product options', async () => {
  const { document, window } = await startDemo();
  document.querySelector('#checkout-button').click();
  assert.equal(document.querySelector('#confirmation-view').hidden, true);

  document.querySelector('[data-action="show-menu"]').click();
  document.querySelector('[data-product-id="cara-melting"] [data-action="open-options"]').click();
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));

  assert.equal(document.querySelector('#product-dialog').open, false);
});
