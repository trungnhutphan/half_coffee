import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { JSDOM, VirtualConsole } from 'jsdom';

import { bootstrap } from '../src/main.js';

async function startDemo() {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const runtimeErrors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => runtimeErrors.push(error));
  const dom = new JSDOM(html, { url: 'http://ka-pods.local/', virtualConsole });
  const controller = bootstrap(dom.window.document);

  return { controller, document: dom.window.document, runtimeErrors };
}

function click(document, selector) {
  const element = document.querySelector(selector);
  assert.ok(element, `missing ${selector}`);
  element.click();
  return element;
}

test('five accessible tabs switch the visible app panel', async () => {
  const { document, runtimeErrors } = await startDemo();
  const tabs = [...document.querySelectorAll('#app-navigation [role="tab"]')];

  assert.ok(document.querySelector('script[type="module"][src="/src/main.js"]'));
  assert.equal(tabs.length, 5);
  assert.equal(tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true').length, 1);
  click(document, '[data-action="navigate-screen"][data-screen="rewards"]');
  assert.equal(document.querySelector('[role="tabpanel"]')?.dataset.screenPanel, 'rewards');
  assert.equal(document.querySelector('[data-screen="rewards"]')?.getAttribute('aria-selected'), 'true');
  assert.deepEqual(runtimeErrors, []);
});

test('claiming a laundry reward updates the balance once and announces it', async () => {
  const { controller, document } = await startDemo();

  click(document, '[data-action="claim-reward"]');
  assert.equal(document.querySelector('#points-balance')?.textContent.trim(), '4.466');
  assert.equal(controller.getState().points, 4466);
  assert.equal(document.querySelector('[data-action="claim-reward"]')?.disabled, true);
  assert.match(document.querySelector('#demo-status')?.textContent ?? '', /120 điểm/);
});

test('voucher redemption and empty saved filter have clear states', async () => {
  const firstDemo = await startDemo();
  click(firstDemo.document, '[data-action="navigate-screen"][data-screen="vouchers"]');
  click(firstDemo.document, '[data-action="redeem-voucher"][data-voucher-id="fresh-50"]');

  const savedButton = firstDemo.document.querySelector('[data-voucher-id="fresh-50"]');
  assert.equal(savedButton?.textContent.trim(), 'Đã lưu');
  assert.equal(savedButton?.disabled, true);
  assert.match(firstDemo.document.querySelector('#demo-status')?.textContent ?? '', /Đã lưu voucher/);

  const emptyDemo = await startDemo();
  click(emptyDemo.document, '[data-action="navigate-screen"][data-screen="vouchers"]');
  click(emptyDemo.document, '[data-action="set-voucher-filter"][data-filter="saved"]');
  assert.match(emptyDemo.document.querySelector('.empty-state')?.textContent ?? '', /Chưa có voucher đã lưu/);
});

test('store search accepts unaccented mixed-case input', async () => {
  const { document } = await startDemo();
  click(document, '[data-action="navigate-screen"][data-screen="stores"]');

  const form = document.querySelector('#store-search-form');
  const input = document.querySelector('#store-query');
  input.value = '  HO CHI MINH  ';
  form.dispatchEvent(new document.defaultView.Event('submit', { bubbles: true, cancelable: true }));

  const stores = [...document.querySelectorAll('[data-store-result]')];
  assert.equal(stores.length, 2);
  assert.ok(stores.every((store) => store.textContent.includes('Hồ Chí Minh')));
  assert.match(document.querySelector('#demo-status')?.textContent ?? '', /2 điểm bán/);
});

test('language preference updates visibly and announces the change', async () => {
  const { controller, document } = await startDemo();
  click(document, '[data-action="navigate-screen"][data-screen="account"]');
  click(document, '[data-action="set-language"][data-language="en"]');

  assert.equal(controller.getState().language, 'en');
  assert.equal(document.querySelector('[data-current-language]')?.textContent.trim(), 'English');
  assert.match(document.querySelector('#demo-status')?.textContent ?? '', /English/);
});
