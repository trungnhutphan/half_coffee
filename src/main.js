import { APP_SCREENS, VOUCHERS } from './demo-data.js';
import { claimLaundryReward, createInitialState, redeemVoucher, setVoucherFilter } from './demo-state.js';
import { renderDemo } from './demo-render.js';

export function bootstrap(document) {
  let state = createInitialState();
  const phone = document.querySelector('.phone');
  const status = document.querySelector('#demo-status');
  const appPortal = document.querySelector('#app-demo');
  const portalToolbar = document.querySelector('.app-portal-toolbar');
  const closeAppButton = document.querySelector('[data-action="close-app"]');
  const backgroundElements = [
    document.querySelector('.site-header'),
    document.querySelector('.site-footer'),
    ...[...document.querySelector('main').children].filter((section) => section !== appPortal),
  ].filter(Boolean);
  let appReturnFocus = null;

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

  const setAppMode = (open, trigger = null) => {
    document.body.classList.toggle('app-mode', open);
    portalToolbar.hidden = !open;
    backgroundElements.forEach((element) => {
      if (open) element.setAttribute('inert', '');
      else element.removeAttribute('inert');
    });

    if (open) {
      appReturnFocus = trigger;
      appPortal.setAttribute('role', 'dialog');
      appPortal.setAttribute('aria-modal', 'true');
      closeAppButton.focus();
      announce('Đã mở ứng dụng KA Pods.');
      return;
    }

    appPortal.removeAttribute('role');
    appPortal.removeAttribute('aria-modal');
    appReturnFocus?.focus();
    announce('Đã quay lại trang giới thiệu.');
  };

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
      if (nextState !== state) update(nextState, `Đã lưu ưu đãi ${voucher?.value ?? ''}.`);
    }

    if (action === 'set-voucher-filter') {
      update(setVoucherFilter(state, trigger.dataset.filter), `Đã đổi bộ lọc ưu đãi sang ${trigger.textContent.trim()}.`);
    }

    if (action === 'set-language') {
      const language = trigger.dataset.language === 'en' ? 'en' : 'vi';
      update({ ...state, language }, language === 'en' ? 'Language changed to English.' : 'Đã đổi ngôn ngữ sang Tiếng Việt.');
    }

    if (action === 'show-demo-notice') {
      announce(`${trigger.dataset.label} là nội dung minh họa trong bản mô phỏng.`);
    }
  });

  phone.addEventListener('keydown', (event) => {
    const tab = event.target.closest('[role="tab"][data-screen]');
    if (!tab || !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = APP_SCREENS.findIndex(({ id }) => id === tab.dataset.screen);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % APP_SCREENS.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + APP_SCREENS.length) % APP_SCREENS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = APP_SCREENS.length - 1;

    const nextScreen = APP_SCREENS[nextIndex];
    update({ ...state, activeScreen: nextScreen.id }, `Đã mở ${nextScreen.label}.`);
    document.querySelector(`[role="tab"][data-screen="${nextScreen.id}"]`)?.focus();
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
    const appModeTrigger = event.target.closest('[data-action="open-app"], [data-action="close-app"]');
    if (appModeTrigger) {
      const shouldOpen = appModeTrigger.dataset.action === 'open-app';
      setAppMode(shouldOpen, shouldOpen ? appModeTrigger : null);
      return;
    }

    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    const reducedMotion = document.defaultView.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const behavior = reducedMotion ? 'auto' : 'smooth';
    if (link.getAttribute('href') === '#top' && typeof document.defaultView.scrollTo === 'function') {
      document.defaultView.scrollTo({ top: 0, behavior });
      return;
    }
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior, block: 'start' });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !document.body.classList.contains('app-mode')) return;
    event.preventDefault();
    setAppMode(false);
  });

  registerWebMcpTools(document, {
    claimReward() {
      const nextState = claimLaundryReward(state);
      if (nextState === state) return { status: 'already_claimed', points: state.points };
      update(nextState, 'Đã nhận 120 điểm cho lần giặt hôm nay.');
      return { status: 'claimed', points: state.points };
    },
    saveVoucher(voucherId) {
      if (!VOUCHERS.some(({ id }) => id === voucherId)) {
        throw new TypeError('voucherId must identify an available voucher');
      }
      const nextState = redeemVoucher(state, voucherId);
      if (nextState === state) return { status: 'already_saved', voucherId };
      update({ ...nextState, activeScreen: 'vouchers' }, `Đã lưu ưu đãi ${voucherId}.`);
      return { status: 'saved', voucherId };
    },
    searchStoreLocations(query) {
      if (typeof query !== 'string' || query.trim().length === 0 || query.length > 80) {
        throw new TypeError('query must be a non-empty string up to 80 characters');
      }
      const normalizedQuery = query.trim();
      update({ ...state, activeScreen: 'stores', storeQuery: normalizedQuery });
      const count = document.querySelectorAll('[data-store-result]').length;
      announce(count ? `Tìm thấy ${count} điểm bán.` : 'Chưa tìm thấy điểm bán phù hợp.');
      return { count, query: normalizedQuery };
    },
  });

  return {
    getState: () => state,
    isAppMode: () => document.body.classList.contains('app-mode'),
  };
}

function registerWebMcpTools(document, actions) {
  const context = document.modelContext;
  if (!context?.registerTool) return;

  const tools = [
    {
      name: 'claim_laundry_reward',
      title: 'Nhận điểm giặt',
      description: 'Complete the visible KA Pods demo action that claims today\'s laundry reward once.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async () => actions.claimReward(),
    },
    {
      name: 'save_voucher',
      title: 'Lưu ưu đãi',
      description: 'Save one available KA Pods voucher and show it in the visible voucher wallet.',
      inputSchema: {
        type: 'object',
        properties: { voucherId: { type: 'string', enum: VOUCHERS.map(({ id }) => id) } },
        required: ['voucherId'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (input) => actions.saveVoucher(input?.voucherId),
    },
    {
      name: 'search_store_locations',
      title: 'Tìm điểm bán',
      description: 'Search the demo KA Pods store list and show matching locations in the visible app.',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string', minLength: 1, maxLength: 80 } },
        required: ['query'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: async (input) => actions.searchStoreLocations(input?.query),
    },
  ];

  tools.forEach((tool) => {
    try {
      void Promise.resolve(context.registerTool(tool)).catch((error) => {
        console.warn(`Unable to register WebMCP tool ${tool.name}`, error);
      });
    } catch (error) {
      console.warn(`Unable to register WebMCP tool ${tool.name}`, error);
    }
  });
}

if (typeof document !== 'undefined') {
  bootstrap(document);
}
