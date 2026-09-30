import assert from 'node:assert/strict';
import test from 'node:test';

import { APP_SCREENS, STORES, VOUCHERS } from '../src/demo-data.js';
import {
  claimLaundryReward,
  createInitialState,
  redeemVoucher,
  searchStores,
  setVoucherFilter,
} from '../src/demo-state.js';

test('initial state exposes five app screens', () => {
  const state = createInitialState();

  assert.equal(APP_SCREENS.length, 5);
  assert.deepEqual(APP_SCREENS.map(({ id }) => id), ['home', 'rewards', 'vouchers', 'stores', 'account']);
  assert.equal(state.activeScreen, 'home');
  assert.equal(state.points, 4346);
});

test('reward can only be claimed once', () => {
  const initial = createInitialState();
  const claimed = claimLaundryReward(initial);
  const claimedAgain = claimLaundryReward(claimed);

  assert.equal(initial.points, 4346);
  assert.equal(claimed.points, 4466);
  assert.equal(claimed.rewardClaimed, true);
  assert.deepEqual(claimedAgain, claimed);
});

test('voucher can only be redeemed once', () => {
  const voucherId = VOUCHERS[0].id;
  const initial = createInitialState();
  const redeemed = redeemVoucher(initial, voucherId);
  const redeemedAgain = redeemVoucher(redeemed, voucherId);

  assert.deepEqual(redeemed.savedVoucherIds, [voucherId]);
  assert.deepEqual(redeemedAgain, redeemed);
  assert.deepEqual(initial.savedVoucherIds, []);
});

test('empty voucher filter is safe', () => {
  const initial = createInitialState();
  const filtered = setVoucherFilter(initial, 'saved');

  assert.equal(filtered.voucherFilter, 'saved');
  assert.deepEqual(filtered.savedVoucherIds, []);
});

test('store search normalizes case accents and whitespace', () => {
  const matches = searchStores(STORES, '  HO CHI MINH  ');

  assert.ok(matches.length > 0);
  assert.ok(matches.every(({ city }) => city === 'Hồ Chí Minh'));
});
