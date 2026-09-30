import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addItem,
  changeQuantity,
  getCartSummary,
  removeItem,
} from '../src/cart.js';

test('adds the same product as one line with an increased quantity', () => {
  const product = { id: 'cara', name: 'Cara Melting', price: 80000 };
  const once = addItem([], product);
  const twice = addItem(once, product);

  assert.deepEqual(twice, [
    { id: 'cara', name: 'Cara Melting', price: 80000, quantity: 2 },
  ]);
});

test('removes a line when quantity changes from one down by one', () => {
  assert.deepEqual(
    changeQuantity([{ id: 'cara', name: 'Cara Melting', price: 80000, quantity: 1 }], 'cara', -1),
    [],
  );
});

test('calculates total quantities and subtotal without changing the cart', () => {
  const cart = [
    { id: 'cara', name: 'Cara Melting', price: 80000, quantity: 2 },
    { id: 'matcha', name: 'Matcha Cloud', price: 90000, quantity: 1 },
  ];

  assert.deepEqual(getCartSummary(cart), { itemCount: 3, subtotal: 250000 });
  assert.deepEqual(removeItem(cart, 'cara'), [cart[1]]);
});
