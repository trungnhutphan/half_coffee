import assert from 'node:assert/strict';
import test from 'node:test';

import { filterProducts } from '../src/catalog.js';

const products = [
  { id: 'latte', name: 'Cà phê Latte', category: 'coffee' },
  { id: 'matcha', name: 'Matcha Cloud', category: 'tea' },
];

test('filters by normalized query and selected category', () => {
  const result = filterProducts(products, 'coffee', '  CÀ PHÊ  ');

  assert.deepEqual(result.map((product) => product.id), ['latte']);
});

test('returns every category when category is all', () => {
  assert.deepEqual(filterProducts(products, 'all', '').map((product) => product.id), ['latte', 'matcha']);
});
