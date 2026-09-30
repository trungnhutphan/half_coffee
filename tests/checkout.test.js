import assert from 'node:assert/strict';
import test from 'node:test';

import { canPlaceOrder, createDemoOrder } from '../src/checkout.js';

test('rejects checkout when the cart has no priced items', () => {
  assert.equal(canPlaceOrder([], 'cash'), false);
  assert.equal(canPlaceOrder([{ id: 'cara', price: 80000, quantity: 1 }], ''), false);
});

test('creates a deterministic simulated order for a paid cart', () => {
  const order = createDemoOrder(
    [{ id: 'cara', price: 80000, quantity: 2 }],
    'pickup',
    'cash',
    new Date('2026-09-30T10:20:00.000Z'),
  );

  assert.deepEqual(order, {
    code: 'EH-20260930-1020',
    fulfillment: 'pickup',
    paymentMethod: 'cash',
    total: 160000,
    createdAt: '2026-09-30T10:20:00.000Z',
  });
});
