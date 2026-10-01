import { APP_SCREENS, STORES, VOUCHERS } from './demo-data.js';
import { searchStores } from './demo-state.js';

function publicImageUrl(fileName) {
  if (typeof import.meta.env?.BASE_URL === 'string') return `${import.meta.env.BASE_URL}images/${fileName}`;
  if (typeof document !== 'undefined') return new URL(`./public/images/${fileName}`, document.baseURI).href;
  return new URL(`../public/images/${fileName}`, import.meta.url).href;
}

const APP_IMAGES = {
  logo: publicImageUrl('ka-pods-logo.jpeg'),
  pods: publicImageUrl('ka-pods-pods.jpeg'),
  profile: publicImageUrl('profile-gia-han.jpg'),
};

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5v8a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 0 1 3 19.5z"/>',
  gift: '<path d="M4 10h16v11H4zM2.5 6.5h19V10h-19zM12 6.5V21M12 6.5c-1.4 0-5-.2-5-2.5 0-1.3 1-2 2.1-2 1.8 0 2.9 2.2 2.9 4.5Zm0 0c1.4 0 5-.2 5-2.5 0-1.3-1-2-2.1-2C13.1 2 12 4.2 12 6.5Z"/>',
  ticket: '<path d="M3 7.5A2.5 2.5 0 0 0 5.5 5h13A2.5 2.5 0 0 0 21 7.5v2a2.5 2.5 0 0 0 0 5v2A2.5 2.5 0 0 0 18.5 19h-13A2.5 2.5 0 0 0 3 16.5v-2a2.5 2.5 0 0 0 0-5zM12 7v10"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>',
  user: '<path d="M19 21a7 7 0 0 0-14 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/>',
  spark: '<path d="m12 3 1.3 4.2L17.5 8.5l-4.2 1.3L12 14l-1.3-4.2-4.2-1.3 4.2-1.3zM18.5 14l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};

function icon(name, label = '') {
  return `<svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${label ? `aria-label="${escapeHtml(label)}" role="img"` : 'aria-hidden="true"'}>${ICONS[name] ?? ICONS.spark}</svg>`;
}

function formatPoints(points) {
  return points.toLocaleString('vi-VN');
}

function appHeader(title, subtitle = '') {
  return `
    <header class="app-header">
      <div class="app-brand" aria-label="KA Pods">
        <img src="${APP_IMAGES.logo}" alt="Logo KA Pods" width="447" height="447" />
      </div>
      <span class="app-avatar"><img src="${APP_IMAGES.profile}" alt="Ảnh đại diện của Huỳnh Gia Hân" width="480" height="480" /></span>
    </header>
    <div class="app-title-row">
      <div><h3>${escapeHtml(title)}</h3>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}</div>
    </div>
  `;
}

function rewardButton(state) {
  return `
    <button class="app-primary-action" type="button" data-action="claim-reward" ${state.rewardClaimed ? 'disabled' : ''}>
      ${icon(state.rewardClaimed ? 'check' : 'spark')}
      <span>${state.rewardClaimed ? 'Đã nhận điểm hôm nay' : 'Nhận 120 điểm giặt'}</span>
    </button>
  `;
}

function renderHome(state) {
  return `
    ${appHeader('Chào buổi sáng, Gia Hân', 'Một ngày nhẹ tênh bắt đầu từ đồ sạch.')}
    <section class="points-hero" aria-label="Điểm thành viên">
      <div>
        <p>Điểm KA Fresh</p>
        <strong id="points-balance">${formatPoints(state.points)}</strong>
        <span>Còn ${formatPoints(Math.max(0, 5000 - state.points))} điểm để lên hạng</span>
      </div>
      <div class="points-ring" style="--progress: ${Math.min(100, Math.round((state.points / 5000) * 100))}%"><b>${Math.min(100, Math.round((state.points / 5000) * 100))}%</b></div>
    </section>
    ${rewardButton(state)}
    <div class="app-section-heading"><h4>Lối tắt của bạn</h4><span>Chạm để mở</span></div>
    <div class="quick-grid">
      <button type="button" data-action="navigate-screen" data-screen="vouchers">${icon('ticket')}<span>Ví ưu đãi</span><small>${state.savedVoucherIds.length} đã lưu</small></button>
      <button type="button" data-action="navigate-screen" data-screen="stores">${icon('pin')}<span>Điểm bán</span><small>3 cửa hàng mẫu</small></button>
    </div>
    <article class="wash-tip">
      <div><span>Mẹo nhỏ hôm nay</span><h4>Viên trước, quần áo sau.</h4><p>Đặt viên dưới đáy lồng giúp màng tan đều hơn.</p></div>
      <img src="${APP_IMAGES.pods}" alt="Viên giặt KA Pods xanh trắng" width="522" height="513" />
    </article>
  `;
}

function renderRewards(state) {
  return `
    ${appHeader('Phần thưởng', 'Tích điểm từ mỗi lần giặt cùng KA.')}
    <section class="reward-balance">
      <p>Số dư hiện tại</p>
      <strong id="points-balance">${formatPoints(state.points)}</strong>
      <span>điểm</span>
      <div class="reward-track"><i style="width:${Math.min(100, (state.points / 5000) * 100)}%"></i></div>
      <small>${state.points >= 5000 ? 'Bạn đã mở khóa hạng KA Plus' : `${formatPoints(5000 - state.points)} điểm nữa để lên hạng KA Plus`}</small>
    </section>
    ${rewardButton(state)}
    <div class="app-section-heading"><h4>Đổi quà nổi bật</h4><button type="button" data-action="navigate-screen" data-screen="vouchers">Xem ưu đãi</button></div>
    <div class="reward-list">
      <article><span class="reward-illustration reward-a">${icon('ticket')}</span><div><h4>Giảm 50.000đ</h4><p>Đơn KA Pods từ 299.000đ</p></div><b>2.000 điểm</b></article>
      <article><span class="reward-illustration reward-b">${icon('gift')}</span><div><h4>Túi đựng đồ giặt</h4><p>Quà dành cho hạng KA Plus</p></div><b>3.800 điểm</b></article>
    </div>
  `;
}

function getVisibleVouchers(state) {
  if (state.voucherFilter === 'saved') {
    return VOUCHERS.filter(({ id }) => state.savedVoucherIds.includes(id));
  }
  if (state.voucherFilter === 'available') {
    return VOUCHERS.filter(({ id }) => !state.savedVoucherIds.includes(id));
  }
  return VOUCHERS;
}

function renderVouchers(state) {
  const visibleVouchers = getVisibleVouchers(state);
  const filters = [
    ['all', 'Tất cả'],
    ['available', 'Có thể lưu'],
    ['saved', 'Đã lưu'],
  ];

  return `
    ${appHeader('Ví ưu đãi', `${state.savedVoucherIds.length} ưu đãi đã lưu`) }
    <div class="voucher-filters" role="group" aria-label="Lọc ưu đãi">
      ${filters.map(([id, label]) => `<button type="button" data-action="set-voucher-filter" data-filter="${id}" class="${state.voucherFilter === id ? 'is-active' : ''}" aria-pressed="${state.voucherFilter === id}">${label}</button>`).join('')}
    </div>
    <div class="voucher-list">
      ${visibleVouchers.length ? visibleVouchers.map((voucher) => {
        const saved = state.savedVoucherIds.includes(voucher.id);
        return `
          <article class="voucher-card voucher-${voucher.tone}">
            <div class="voucher-value"><strong>${escapeHtml(voucher.value)}</strong><span>KA Pods</span></div>
            <div class="voucher-content"><h4>${escapeHtml(voucher.title)}</h4><p>${escapeHtml(voucher.detail)}</p><small>Hạn dùng: ${escapeHtml(voucher.expires)}</small></div>
            <button type="button" data-action="redeem-voucher" data-voucher-id="${voucher.id}" ${saved ? 'disabled' : ''}>${saved ? 'Đã lưu' : 'Lưu'}</button>
          </article>
        `;
      }).join('') : `
        <div class="empty-state">${icon('ticket')}<h4>Chưa có ưu đãi đã lưu</h4><p>Chọn “Có thể lưu” để tìm một ưu đãi phù hợp.</p></div>
      `}
    </div>
  `;
}

function renderStores(state) {
  const stores = searchStores(STORES, state.storeQuery);
  return `
    ${appHeader('Điểm bán', 'Tìm KA Pods gần khu vực của bạn.')}
    <form id="store-search-form" class="store-search" data-action="search-stores" role="search">
      ${icon('search')}
      <label class="sr-only" for="store-query">Nhập thành phố hoặc địa chỉ</label>
      <input id="store-query" name="query" type="search" value="${escapeHtml(state.storeQuery)}" placeholder="Tìm thành phố, địa chỉ…" autocomplete="off" />
      <button type="submit">Tìm</button>
    </form>
    <div class="store-summary"><span>${stores.length} điểm bán</span><small>Dữ liệu mô phỏng</small></div>
    <div class="store-list">
      ${stores.length ? stores.map((store, index) => `
        <article class="store-card" data-store-result>
          <span class="store-pin">${index + 1}</span>
          <div><h4>${escapeHtml(store.name)}</h4><p>${escapeHtml(store.address)}</p><span>${escapeHtml(store.city)} · ${escapeHtml(store.hours)}</span></div>
          <strong>${escapeHtml(store.distance)}</strong>
        </article>
      `).join('') : `
        <div class="empty-state">${icon('search')}<h4>Chưa thấy điểm bán phù hợp</h4><p>Thử “Hồ Chí Minh” hoặc “Hà Nội”.</p></div>
      `}
    </div>
  `;
}

function renderAccount(state) {
  return `
    ${appHeader('Tài khoản', 'Thiết lập cho trải nghiệm KA của bạn.')}
    <section class="member-card">
      <span class="member-avatar"><img src="${APP_IMAGES.profile}" alt="Ảnh đại diện của Huỳnh Gia Hân" width="480" height="480" /></span>
      <div><p>Thành viên KA Fresh</p><h4>Huỳnh Gia Hân</h4><span>Mã mô phỏng · KA-04346</span></div>
      ${icon('spark')}
    </section>
    <div class="preference-group">
      <div class="app-section-heading"><h4>Ngôn ngữ</h4><span data-current-language>${state.language === 'vi' ? 'Tiếng Việt' : 'English'}</span></div>
      <div class="language-options" role="group" aria-label="Chọn ngôn ngữ">
        <button type="button" data-action="set-language" data-language="vi" aria-pressed="${state.language === 'vi'}"><span>VI</span><b>Tiếng Việt</b>${state.language === 'vi' ? icon('check') : ''}</button>
        <button type="button" data-action="set-language" data-language="en" aria-pressed="${state.language === 'en'}"><span>EN</span><b>English</b>${state.language === 'en' ? icon('check') : ''}</button>
      </div>
    </div>
    <div class="account-links" aria-label="Tùy chọn tài khoản mô phỏng">
      <button type="button" data-action="show-demo-notice" data-label="Lịch sử nhận điểm"><span>${icon('gift')} Lịch sử nhận điểm</span>${icon('chevron')}</button>
      <button type="button" data-action="show-demo-notice" data-label="Thông tin thành viên"><span>${icon('user')} Thông tin thành viên</span>${icon('chevron')}</button>
    </div>
    <p class="demo-disclaimer">Đây là tài khoản mô phỏng. Không có thông tin cá nhân được lưu.</p>
  `;
}

const SCREEN_RENDERERS = {
  home: renderHome,
  rewards: renderRewards,
  vouchers: renderVouchers,
  stores: renderStores,
  account: renderAccount,
};

export function renderDemo(document, state) {
  const screen = document.querySelector('#phone-screen');
  const navigation = document.querySelector('#app-navigation');
  const renderScreen = SCREEN_RENDERERS[state.activeScreen] ?? SCREEN_RENDERERS.home;

  screen.innerHTML = `<div id="app-panel" role="tabpanel" aria-labelledby="app-tab-${state.activeScreen}" data-screen-panel="${state.activeScreen}">${renderScreen(state)}</div>`;
  navigation.innerHTML = APP_SCREENS.map((item) => {
    const selected = item.id === state.activeScreen;
    return `
      <button id="app-tab-${item.id}" type="button" role="tab" aria-controls="app-panel" aria-selected="${selected}" tabindex="${selected ? '0' : '-1'}" data-action="navigate-screen" data-screen="${item.id}">
        ${icon(item.icon)}<span>${escapeHtml(item.label)}</span>
      </button>
    `;
  }).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
}
