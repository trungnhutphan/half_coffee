# Every Half Static Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive, static Every Half ordering demo that takes a visitor from browsing drinks to a simulated order confirmation.

**Architecture:** The browser loads a single `index.html` with static CSS and ES modules. Pure modules own catalog filtering, cart calculations, and checkout validation; `app.js` owns DOM rendering and UI events. All catalog and order data is local JavaScript data, so the deployable site needs no server.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript ES modules, Node.js built-in test runner, jsdom (development-only test dependency).

**Spec:** `docs/superpowers/specs/2026-09-30-every-half-static-demo-design.md`

## Global Constraints

- Use only static frontend assets; no API calls, accounts, database, real payment, inventory, email, or admin features.
- Keep cart state in memory for the active browser session; a reload restores the demo state.
- Build mobile-first and retain keyboard focus, Escape-to-close modal behavior, and usable desktop layout.
- Use Vietnamese interface copy and Every Half's cream (`#F6F3EF`), coffee (`#644A38` / `#342217`), purple (`#6C48C5`), and success green (`#16A34A`) palette.
- Do not commit from this workspace: its Git root is `/Users/nhutphan` and contains unrelated user changes.

## Review Focus

- A repeated “Thêm” action for one product must increment its quantity rather than create duplicate order rows.
- A query containing upper-case Vietnamese letters or surrounding whitespace must still filter the catalog sensibly.
- A zero-total cart must not reach the confirmation screen.
- A quantity decrement at one must remove the line without producing a zero or negative quantity.
- Closing the product options dialog with Escape must restore interaction to the underlying page without adding a product.

---

### Task 1: Establish test runner and commerce state modules

**Files:**
- Create: `package.json`
- Create: `src/cart.js`
- Create: `src/catalog.js`
- Create: `src/checkout.js`
- Create: `tests/cart.test.js`
- Create: `tests/catalog.test.js`
- Create: `tests/checkout.test.js`

**Interfaces:**
- Produces `addItem(cart, product)`, `changeQuantity(cart, productId, delta)`, `removeItem(cart, productId)`, and `getCartSummary(cart)` from `src/cart.js`.
- Produces `filterProducts(products, category, query)` from `src/catalog.js`.
- Produces `canPlaceOrder(cart, paymentMethod)` and `createDemoOrder(cart, fulfillment, paymentMethod, now)` from `src/checkout.js`.
- Every function is pure and returns new objects/arrays rather than mutating inputs.

- [ ] **Step 1: Write failing cart-state tests in `tests/cart.test.js`**

```js
test('adds the same product as one line with an increased quantity', () => {
  const once = addItem([], { id: 'cara', name: 'Cara Melting', price: 80000 });
  const twice = addItem(once, { id: 'cara', name: 'Cara Melting', price: 80000 });
  assert.deepEqual(twice, [{ id: 'cara', name: 'Cara Melting', price: 80000, quantity: 2 }]);
});

test('removes a line when quantity changes from one down by one', () => {
  assert.deepEqual(changeQuantity([{ id: 'cara', quantity: 1 }], 'cara', -1), []);
});
```

- [ ] **Step 2: Run cart tests to verify they fail**

Run: `npm test -- tests/cart.test.js`

Expected: FAIL because `src/cart.js` does not exist.

- [ ] **Step 3: Implement pure cart functions in `src/cart.js`**

Use items shaped `{ id: string, name: string, price: number, quantity: number }`. `getCartSummary(cart)` returns `{ itemCount: number, subtotal: number }`, with `itemCount` as the sum of quantities.

- [ ] **Step 4: Run cart tests to verify they pass**

Run: `npm test -- tests/cart.test.js`

Expected: PASS.

- [ ] **Step 5: Write failing catalog and checkout tests**

```js
test('filters by normalized query and selected category', () => {
  const result = filterProducts(products, 'coffee', '  CÀ PHÊ  ');
  assert.deepEqual(result.map((product) => product.id), ['latte']);
});

test('rejects checkout when the cart has no priced items', () => {
  assert.equal(canPlaceOrder([], 'cash'), false);
});
```

- [ ] **Step 6: Run the catalog and checkout tests to verify they fail**

Run: `npm test -- tests/catalog.test.js tests/checkout.test.js`

Expected: FAIL because the catalog and checkout modules do not exist.

- [ ] **Step 7: Implement `filterProducts`, `canPlaceOrder`, and `createDemoOrder`**

Normalize diacritics, whitespace, and case before matching product name/category. `createDemoOrder` returns `{ code: string, fulfillment: 'pickup' | 'delivery', paymentMethod: string, total: number, createdAt: string }`; use the supplied `now` only to generate a deterministic code and timestamp in tests.

- [ ] **Step 8: Run the full state suite**

Run: `npm test`

Expected: PASS with all cart, catalog, and checkout tests green.

### Task 2: Create the responsive Every Half application shell

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `src/data.js`
- Create: `tests/shell.test.js`

**Interfaces:**
- Consumes catalog product shape from `src/catalog.js`.
- Produces `PRODUCTS`, `CATEGORIES`, `STORE`, and `PAYMENT_METHODS` exports from `src/data.js`.
- `index.html` exposes elements identified by: `app`, `main-nav`, `menu-grid`, `cart-button`, `cart-count`, `cart-panel`, `checkout-button`, `product-dialog`, `toast`, and `confirmation-view`.

- [ ] **Step 1: Write a failing structural DOM test in `tests/shell.test.js`**

```js
test('contains landmarks and live feedback targets for the ordering flow', async () => {
  const document = await loadIndexDocument();
  assert.ok(document.querySelector('main'));
  assert.ok(document.querySelector('#menu-grid'));
  assert.ok(document.querySelector('#cart-button'));
  assert.equal(document.querySelector('#toast')?.getAttribute('aria-live'), 'polite');
});
```

- [ ] **Step 2: Run the shell test to verify it fails**

Run: `npm test -- tests/shell.test.js`

Expected: FAIL because `index.html` is absent.

- [ ] **Step 3: Create `src/data.js` and the semantic `index.html` shell**

Provide at least six Vietnamese product records across Cà phê, Trà & trái cây, and Bánh ngọt. Include a header/store switcher, home hero, category tabs, product grid, cart drawer, checkout area, confirmation view, product options dialog, and toast. Load `src/app.js` as a module; do not leave placeholder `href="#"` controls.

- [ ] **Step 4: Create `styles.css`**

Use the five specified colors, responsive grid breakpoints, visible `:focus-visible` states, `prefers-reduced-motion`, and a mobile cart tray/drawer that becomes a side panel on desktop. Keep the design coffee-warm and editorial, with product images as the visual emphasis.

- [ ] **Step 5: Run the shell test to verify it passes**

Run: `npm test -- tests/shell.test.js`

Expected: PASS.

### Task 3: Wire menu, cart, product options, and checkout interactions

**Files:**
- Create: `src/app.js`
- Modify: `index.html`
- Modify: `tests/shell.test.js`

**Interfaces:**
- Consumes `PRODUCTS`, `CATEGORIES`, `STORE`, and `PAYMENT_METHODS` from `src/data.js`.
- Consumes all functions exported by `src/cart.js`, `src/catalog.js`, and `src/checkout.js`.
- Produces `bootstrap(document)` from `src/app.js` for jsdom testing and browser startup.

- [ ] **Step 1: Write failing interaction tests in `tests/shell.test.js`**

```js
test('updates the cart badge and total after adding a menu product', async () => {
  const { document } = await startDemo();
  document.querySelector('[data-product-id="cara-melting"] [data-action="add"]').click();
  assert.equal(document.querySelector('#cart-count').textContent, '1');
  assert.match(document.querySelector('#cart-total').textContent, /80\.000đ/);
});

test('does not confirm an empty cart and allows Escape to close product options', async () => {
  const { document, window } = await startDemo();
  document.querySelector('#checkout-button').click();
  assert.equal(document.querySelector('#confirmation-view').hidden, true);
  document.querySelector('[data-action="open-options"]').click();
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(document.querySelector('#product-dialog').open, false);
});
```

- [ ] **Step 2: Run interaction tests to verify they fail**

Run: `npm test -- tests/shell.test.js`

Expected: FAIL because `src/app.js` does not exist and controls are not wired.

- [ ] **Step 3: Implement `bootstrap(document)` in `src/app.js`**

Render category tabs and products from data. Wire navigation, category/query filter, product options dialog, add actions, cart quantity/remove actions, cart totals, fulfillment and payment radio controls, toast feedback, and order confirmation. Keep all order state in a closure created during `bootstrap`; initial browser startup calls `bootstrap(window.document)` once.

- [ ] **Step 4: Run interaction tests to verify they pass**

Run: `npm test -- tests/shell.test.js`

Expected: PASS.

- [ ] **Step 5: Run the full automated suite**

Run: `npm test`

Expected: PASS with cart, catalog, checkout, and DOM tests green.

### Task 4: Verify the static demo in a browser

**Files:**
- Modify only if verification identifies a real defect: `index.html`, `styles.css`, or `src/app.js`

**Interfaces:**
- Consumes the complete static site from Tasks 1–3.
- Produces verification evidence, not new application features.

- [ ] **Step 1: Start a local static server**

Run: `python3 -m http.server 4173`

Expected: server listens at `http://localhost:4173`.

- [ ] **Step 2: Exercise the primary mobile flow**

At a 390 px viewport: open menu, select a category, search, add an item, change quantity, select pickup and a payment method, confirm the order, then reset to menu. Confirm no console errors.

- [ ] **Step 3: Exercise desktop and keyboard behavior**

At a 1440 px viewport: confirm menu/product grid and cart panel are legible. Tab through primary actions, open product options, press Escape, and verify focus indicators are visible.

- [ ] **Step 4: Run final test suite after any correction**

Run: `npm test`

Expected: PASS.

## Plan self-review

- **Spec coverage:** Tasks 1–3 cover local data, menu, cart, checkout, confirmation, feedback, focus, and Escape behavior. Task 4 covers responsive visual and console checks. Static-host readiness is achieved by the no-build static file layout.
- **Step scan:** Each task has a red/green test path where behavior is introduced; visual CSS work has explicit manual acceptance checks.
- **Type consistency:** Cart items, summary fields, category filters, and checkout order fields use the same names across task interfaces.
- **Review focus:** Each listed risk is exercised in Task 1 or Task 3 tests.
- **Proportion:** The plan defines interfaces and test expectations without prescribing implementation bodies.
