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

async function startWebMcpDemo() {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'http://ka-pods.local/' });
  const tools = [];
  Object.defineProperty(dom.window.document, 'modelContext', {
    value: { registerTool: (tool) => tools.push(tool) },
    configurable: true,
  });
  const controller = bootstrap(dom.window.document);
  return { controller, document: dom.window.document, tools };
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

  assert.ok(document.querySelector('script[type="module"][src="./src/main.js"]'));
  assert.equal(tabs.length, 5);
  assert.equal(tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true').length, 1);
  click(document, '[data-action="navigate-screen"][data-screen="rewards"]');
  assert.equal(document.querySelector('[role="tabpanel"]')?.dataset.screenPanel, 'rewards');
  assert.equal(document.querySelector('[data-screen="rewards"]')?.getAttribute('aria-selected'), 'true');
  assert.deepEqual(runtimeErrors, []);
});

test('app gateway opens a focused phone experience and returns to marketing', async () => {
  const { document } = await startDemo();
  const window = document.defaultView;
  const openButton = document.querySelector('[data-action="open-app"]');
  const portal = document.querySelector('#app-demo');
  const portalToolbar = document.querySelector('.app-portal-toolbar');
  const closeButton = document.querySelector('[data-action="close-app"]');

  openButton.click();

  assert.equal(document.body.classList.contains('app-mode'), true);
  assert.equal(portal.getAttribute('role'), 'dialog');
  assert.equal(portal.getAttribute('aria-modal'), 'true');
  assert.equal(portalToolbar.hidden, false);
  assert.equal(document.activeElement, closeButton);
  assert.ok(document.querySelector('.site-header').hasAttribute('inert'));

  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

  assert.equal(document.body.classList.contains('app-mode'), false);
  assert.equal(portal.hasAttribute('role'), false);
  assert.equal(portalToolbar.hidden, true);
  assert.equal(document.activeElement, openButton);
  assert.equal(document.querySelector('.site-header').hasAttribute('inert'), false);
});

test('app tabs support arrow Home and End keyboard navigation', async () => {
  const { document } = await startDemo();
  const window = document.defaultView;
  const homeTab = document.querySelector('[data-screen="home"]');

  homeTab.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(document.querySelector('[role="tabpanel"]')?.dataset.screenPanel, 'rewards');
  assert.equal(document.activeElement?.dataset.screen, 'rewards');

  document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  assert.equal(document.querySelector('[role="tabpanel"]')?.dataset.screenPanel, 'account');
  assert.equal(document.activeElement?.dataset.screen, 'account');
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
  assert.match(firstDemo.document.querySelector('#demo-status')?.textContent ?? '', /Đã lưu ưu đãi/);

  const emptyDemo = await startDemo();
  click(emptyDemo.document, '[data-action="navigate-screen"][data-screen="vouchers"]');
  click(emptyDemo.document, '[data-action="set-voucher-filter"][data-filter="saved"]');
  assert.match(emptyDemo.document.querySelector('.empty-state')?.textContent ?? '', /Chưa có ưu đãi đã lưu/);
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

test('account demo options provide visible feedback instead of dead buttons', async () => {
  const { document } = await startDemo();
  click(document, '[data-action="navigate-screen"][data-screen="account"]');
  assert.equal(document.querySelector('.member-avatar img')?.getAttribute('src')?.includes('profile-an.jpg'), true);
  click(document, '[data-action="show-demo-notice"]');

  assert.match(document.querySelector('#demo-status')?.textContent ?? '', /Lịch sử nhận điểm/);
  assert.match(document.querySelector('#demo-status')?.textContent ?? '', /bản mô phỏng/);
});

test('reward costs are labelled as points instead of currency', async () => {
  const { document } = await startDemo();
  click(document, '[data-action="navigate-screen"][data-screen="rewards"]');

  assert.deepEqual(
    [...document.querySelectorAll('.reward-list b')].map((cost) => cost.textContent.trim()),
    ['2.000 điểm', '3.800 điểm'],
  );
});

test('WebMCP tools reuse visible reward voucher and store journeys', async () => {
  const { controller, document, tools } = await startWebMcpDemo();

  assert.deepEqual(tools.map(({ name }) => name), [
    'claim_laundry_reward',
    'save_voucher',
    'search_store_locations',
  ]);

  const claimResult = await tools[0].execute({});
  assert.deepEqual(claimResult, { status: 'claimed', points: 4466 });
  assert.equal(document.querySelector('#points-balance')?.textContent.trim(), '4.466');

  const saveResult = await tools[1].execute({ voucherId: 'fresh-50' });
  assert.deepEqual(saveResult, { status: 'saved', voucherId: 'fresh-50' });
  assert.equal(document.querySelector('[data-voucher-id="fresh-50"]')?.textContent.trim(), 'Đã lưu');

  const storeResult = await tools[2].execute({ query: 'ho chi minh' });
  assert.deepEqual(storeResult, { count: 2, query: 'ho chi minh' });
  assert.equal(document.querySelectorAll('[data-store-result]').length, 2);

  const beforeInvalid = controller.getState();
  await assert.rejects(() => tools[1].execute({ voucherId: 'missing' }), /voucherId/);
  assert.deepEqual(controller.getState(), beforeInvalid);
});

test('top links scroll to the absolute page top around the sticky header', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'http://ka-pods.local/' });
  let scrollOptions;
  dom.window.scrollTo = (options) => { scrollOptions = options; };
  bootstrap(dom.window.document);

  dom.window.document.querySelector('.site-footer a[href="#top"]').click();

  assert.deepEqual(scrollOptions, { top: 0, behavior: 'smooth' });
});
