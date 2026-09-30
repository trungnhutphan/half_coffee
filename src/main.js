import { APP_SCREENS, VOUCHERS } from './demo-data.js';
import { claimLaundryReward, createInitialState, redeemVoucher, setVoucherFilter } from './demo-state.js';
import { renderDemo } from './demo-render.js';

export function bootstrap(document) {
  let state = createInitialState();
  const phone = document.querySelector('.phone');
  const status = document.querySelector('#demo-status');

  const announce = (message) => {
    status.textContent = '';
    status.textContent = message;
  };

  const update = (nextState, message) => {
    state = nextState;
    renderDemo(document, state);
    if (message) announce(message);
  };

  renderDemo(document, state);

  phone.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    const { action } = trigger.dataset;

    if (action === 'navigate-screen') {
      const screenExists = APP_SCREENS.some(({ id }) => id === trigger.dataset.screen);
      if (screenExists) update({ ...state, activeScreen: trigger.dataset.screen }, `Đã mở ${trigger.textContent.trim()}.`);
    }

    if (action === 'claim-reward') {
      const nextState = claimLaundryReward(state);
      if (nextState !== state) update(nextState, 'Đã nhận 120 điểm cho lần giặt hôm nay.');
    }

    if (action === 'redeem-voucher') {
      const nextState = redeemVoucher(state, trigger.dataset.voucherId);
      const voucher = VOUCHERS.find(({ id }) => id === trigger.dataset.voucherId);
      if (nextState !== state) update(nextState, `Đã lưu voucher ${voucher?.value ?? ''}.`);
    }

    if (action === 'set-voucher-filter') {
      update(setVoucherFilter(state, trigger.dataset.filter), `Đã đổi bộ lọc voucher sang ${trigger.textContent.trim()}.`);
    }

    if (action === 'set-language') {
      const language = trigger.dataset.language === 'en' ? 'en' : 'vi';
      update({ ...state, language }, language === 'en' ? 'Language changed to English.' : 'Đã đổi ngôn ngữ sang Tiếng Việt.');
    }
  });

  phone.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-action="search-stores"]');
    if (!form) return;

    event.preventDefault();
    const query = new document.defaultView.FormData(form).get('query')?.toString() ?? '';
    const nextState = { ...state, storeQuery: query };
    update(nextState);
    const count = document.querySelectorAll('[data-store-result]').length;
    announce(count ? `Tìm thấy ${count} điểm bán.` : 'Chưa tìm thấy điểm bán phù hợp.');
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    const reducedMotion = document.defaultView.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });

  return { getState: () => state };
}

if (typeof document !== 'undefined') {
  bootstrap(document);
}
