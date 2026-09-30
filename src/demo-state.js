import { APP_SCREENS, REWARD_INCREMENT, VOUCHERS } from './demo-data.js';

const VOUCHER_FILTERS = new Set(['all', 'available', 'saved']);

export function createInitialState() {
  return {
    activeScreen: APP_SCREENS[0].id,
    points: 4346,
    rewardClaimed: false,
    savedVoucherIds: [],
    voucherFilter: 'all',
    storeQuery: '',
    language: 'vi',
  };
}

export function claimLaundryReward(state) {
  if (state.rewardClaimed) return state;

  return {
    ...state,
    points: state.points + REWARD_INCREMENT,
    rewardClaimed: true,
  };
}

export function redeemVoucher(state, voucherId) {
  const voucherExists = VOUCHERS.some(({ id }) => id === voucherId);
  if (!voucherExists || state.savedVoucherIds.includes(voucherId)) return state;

  return {
    ...state,
    savedVoucherIds: [...state.savedVoucherIds, voucherId],
  };
}

export function setVoucherFilter(state, filter) {
  if (!VOUCHER_FILTERS.has(filter) || state.voucherFilter === filter) return state;

  return {
    ...state,
    voucherFilter: filter,
  };
}

export function searchStores(stores, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [...stores];

  return stores.filter((store) => normalizeSearchText(
    `${store.name} ${store.address} ${store.city}`,
  ).includes(normalizedQuery));
}

function normalizeSearchText(value) {
  return String(value)
    .trim()
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}
