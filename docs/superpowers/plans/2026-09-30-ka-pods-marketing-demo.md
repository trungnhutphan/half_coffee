# KA Pods Marketing Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and privately deploy a responsive KA Pods marketing landing page with a self-contained, interactive mobile-app demonstration.

**Architecture:** Use a Vite-powered static site with semantic HTML, focused CSS modules by section, and dependency-free JavaScript state/render modules. All product, reward, voucher, and store data remains local; the deployable output is a static `dist/` directory configured for Sites.

**Tech Stack:** HTML5, CSS, modern JavaScript ES modules, Vite, Node test runner, JSDOM, OpenAI Sites static hosting.

**Spec:** `docs/superpowers/specs/2026-09-30-ka-pods-marketing-demo-design.md`

## Global Constraints

- The site is Vietnamese-first and must use the approved message: “Giặt sạch. Kháng khuẩn. Gọn trong một viên.”
- No API, database, authentication, payment, real GPS, browser persistence, or backend runtime.
- Use only product-relevant assets from `source/`; never use `source/771870654_1087674896935603_2609919475889399333_n.jpg`.
- Do not invent certifications, test data, partners, or scientific claims beyond the supplied artwork.
- Use exact core colors: Deep navy `#073B78`, KA aqua `#00A9A5`, Fresh green `#72C93D`, Ice blue `#EAF8FC`, Pure white `#FFFFFF`, Signal red `#C91F37`.
- All core controls need a visible keyboard focus state and at least a 44px touch target.
- Respect `prefers-reduced-motion`; non-essential motion must be disabled when requested.
- The production build must be static and publish from `dist/`.

## Review Focus

- Repeated reward claims: a second claim must not increase points or duplicate success feedback; Task 1 pins this in state tests.
- Voucher filters with no matching entries: render a useful empty state without throwing; Task 1 and Task 3 pin this in state and DOM tests.
- Search input containing mixed case, accents, or surrounding whitespace: matching must remain predictable; Task 1 pins normalized store search behavior.
- Missing product image: layout must retain a meaningful text alternative and fallback surface; Task 2 pins required `alt` content and Task 4 implements the visual fallback.
- Keyboard/reduced-motion users: all app tabs remain usable by keyboard and decorative animation is removed; Task 3 pins tab semantics and Task 4 verifies the media query.

---

## File Structure

- `package.json`: project scripts and development dependencies.
- `index.html`: semantic marketing-page structure and app-demo mount point.
- `src/main.js`: browser bootstrap, section navigation, and app-demo event wiring.
- `src/demo-data.js`: immutable rewards, vouchers, stores, and screen metadata.
- `src/demo-state.js`: pure state transitions and selectors for the simulated app.
- `src/demo-render.js`: HTML render functions for the app screens and status messages.
- `src/styles/tokens.css`: palette, typography, spacing, focus, and motion tokens.
- `src/styles/site.css`: landing-page layout and responsive section styling.
- `src/styles/demo.css`: phone shell and simulated-app styling.
- `public/images/`: curated copies of the supplied KA Pods product assets.
- `tests/demo-state.test.js`: pure behavior tests.
- `tests/site-shell.test.js`: static structure, copy, metadata, and asset tests.
- `tests/demo-interactions.test.js`: JSDOM interaction and accessibility tests.
- `.openai/hosting.json`: static Sites deployment configuration for `dist/`.

### Task 1: Static foundation and deterministic demo state

**Files:**
- Create: `package.json`
- Create: `.openai/hosting.json`
- Create: `src/demo-data.js`
- Create: `src/demo-state.js`
- Create: `tests/demo-state.test.js`

**Interfaces:**
- Produces: `createInitialState() -> DemoState`
- Produces: `claimLaundryReward(state: DemoState) -> DemoState`
- Produces: `redeemVoucher(state: DemoState, voucherId: string) -> DemoState`
- Produces: `setVoucherFilter(state: DemoState, filter: 'all'|'available'|'saved') -> DemoState`
- Produces: `searchStores(stores: Store[], query: string) -> Store[]`
- Produces: immutable exports `APP_SCREENS`, `VOUCHERS`, `STORES`, and `REWARD_INCREMENT`

- [ ] **Step 1: Write failing state tests**

Add tests named `initial state exposes five app screens`, `reward can only be claimed once`, `voucher can only be redeemed once`, `empty voucher filter is safe`, and `store search normalizes case accents and whitespace`. Assert an initial balance of `4346`, one reward increment of `120`, stable second actions, and case/accent-insensitive matching for “Hồ Chí Minh”.

- [ ] **Step 2: Run the focused state tests and verify failure**

Run: `npm test -- tests/demo-state.test.js`

Expected: FAIL because the package scripts and state modules do not exist yet.

- [ ] **Step 3: Create the static project configuration**

Define `dev`, `build`, `preview`, and `test` scripts using Vite and `node --test`; add Vite and JSDOM as development dependencies. Configure `.openai/hosting.json` with `static.directory` set to `dist` and no runtime bindings.

- [ ] **Step 4: Install the declared development dependencies**

Run: `npm install`

Expected: npm creates `package-lock.json` and exits `0` without production dependencies.

- [ ] **Step 5: Implement immutable demo data and pure state transitions**

Use plain objects and arrays. Every transition returns a new state; repeated reward and voucher actions return an equivalent unchanged state. Normalize store queries with trimmed lowercase Unicode text and diacritic removal.

- [ ] **Step 6: Run the state tests**

Run: `npm test -- tests/demo-state.test.js`

Expected: all state tests PASS.

- [ ] **Step 7: Commit the foundation**

```bash
git add package.json package-lock.json .openai/hosting.json src/demo-data.js src/demo-state.js tests/demo-state.test.js
git commit -m "feat: add KA Pods demo state foundation"
```

### Task 2: Marketing page structure and curated product assets

**Files:**
- Create: `index.html`
- Create: `tests/site-shell.test.js`
- Create: `public/images/ka-pods-hero.jpeg`
- Create: `public/images/ka-pods-refill.jpeg`
- Create: `public/images/ka-pods-pods.jpeg`
- Create: `public/images/ka-pods-antibacterial.jpeg`
- Create: `public/images/ka-pods-bundle.jpeg`

**Interfaces:**
- Consumes: app screen ids from `APP_SCREENS` through the runtime added in Task 3.
- Produces: landmarks `#top`, `#benefits`, `#how-to`, `#products`, `#proof`, `#app-demo`, and `#site-footer`.
- Produces: the app mount point `#phone-screen`, tablist `#app-navigation`, and live region `#demo-status`.

- [ ] **Step 1: Write failing shell tests**

Parse `index.html` in JSDOM and assert the approved page title/description, one `h1` with the exact central message, all required landmarks, the phone mount point, a polite live region, meaningful image `alt` text, and absence of the excluded personal filename.

- [ ] **Step 2: Run shell tests and verify failure**

Run: `npm test -- tests/site-shell.test.js`

Expected: FAIL because `index.html` and public assets do not exist.

- [ ] **Step 3: Curate the five product assets**

Copy and rename the selected source images without modifying the originals:

- `source/64ae990b-1fc4-4ba3-a4b4-5ee4e2d65311.jpeg` → hero.
- `source/e7880312-8f3c-46fa-b260-f40821f5cc7a.jpeg` → refill.
- `source/046d3966-30c8-4e8d-a1bc-4744132de0a7.jpeg` → pods.
- `source/5488290c-34fa-45cb-8ee1-8267369c0d10.jpeg` → antibacterial proof.
- `source/cbddeb1c-64f7-4737-94ec-1b7a91ec5f9c.jpeg` → bundle.

- [ ] **Step 4: Build the semantic one-page content structure**

Add the approved hero, four benefits, three usage steps, product formats, carefully qualified antibacterial copy, app-demo introduction, and final CTA. All navigation targets must resolve to real section ids; product images require specific Vietnamese alternatives.

- [ ] **Step 5: Run shell tests**

Run: `npm test -- tests/site-shell.test.js`

Expected: all shell tests PASS.

- [ ] **Step 6: Commit the page shell and assets**

```bash
git add index.html public/images tests/site-shell.test.js
git commit -m "feat: add KA Pods marketing story"
```

### Task 3: Interactive phone demo

**Files:**
- Create: `src/demo-render.js`
- Create: `src/main.js`
- Create: `tests/demo-interactions.test.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: all Task 1 state functions and data constants.
- Produces: `renderDemo(document: Document, state: DemoState) -> void`
- Produces: `bootstrap(document: Document) -> { getState: () => DemoState }`
- Produces: click actions `navigate-screen`, `claim-reward`, `redeem-voucher`, `set-voucher-filter`, `search-stores`, and `set-language`.

- [ ] **Step 1: Write failing DOM interaction tests**

Add tests that bootstrap the document and assert: five tabs use `role="tab"` and `aria-selected`; tab clicks switch panels; claiming a reward updates `4346` to `4466` once; redeeming a voucher changes its button to “Đã lưu”; an empty filter renders guidance; normalized store search returns a Hồ Chí Minh location; changing language updates the visible preference; and every completed action updates `#demo-status`.

- [ ] **Step 2: Run interaction tests and verify failure**

Run: `npm test -- tests/demo-interactions.test.js`

Expected: FAIL because rendering and bootstrap modules do not exist.

- [ ] **Step 3: Implement focused screen renderers**

In `src/demo-render.js`, implement one private renderer per screen plus the exported `renderDemo`. Escape user-derived search text before inserting it into markup. Preserve the tablist container between renders so keyboard position is not lost.

- [ ] **Step 4: Wire event delegation and section navigation**

In `src/main.js`, initialize state once, delegate app actions from the phone container, submit store search without page reload, update the live region, and implement smooth in-page navigation that falls back to immediate scrolling under reduced motion.

- [ ] **Step 5: Run interaction and state tests**

Run: `npm test -- tests/demo-state.test.js tests/demo-interactions.test.js`

Expected: all tests PASS with no JSDOM runtime errors.

- [ ] **Step 6: Commit the working app demo**

```bash
git add index.html src/main.js src/demo-render.js tests/demo-interactions.test.js
git commit -m "feat: add interactive KA Pods app demo"
```

### Task 4: Distinctive responsive visual system

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/site.css`
- Create: `src/styles/demo.css`
- Modify: `index.html`
- Modify: `tests/site-shell.test.js`

**Interfaces:**
- Consumes: the landmark and `data-*` hooks established in Tasks 2–3.
- Produces: reusable CSS custom properties for the six approved colors, type scale, radii, spacing, focus ring, phone width, and motion duration.

- [ ] **Step 1: Extend shell tests for stylesheet and accessibility contracts**

Assert all three stylesheets are linked, every app navigation control has an accessible name, images declare width and height, and the CSS sources contain `:focus-visible`, `@media (prefers-reduced-motion: reduce)`, and responsive breakpoints for phone and desktop layouts.

- [ ] **Step 2: Run shell tests and verify failure**

Run: `npm test -- tests/site-shell.test.js`

Expected: FAIL because the visual-system files and image dimensions are missing.

- [ ] **Step 3: Implement design tokens and global behavior**

Define the exact palette, a Vietnamese-capable geometric sans-serif fallback stack, fluid type/space scales, visible focus ring, reduced-motion overrides, selection color, and a broken-image fallback surface.

- [ ] **Step 4: Implement the landing-page composition**

Create the asymmetric hero, organic gel motif, sequenced usage layout, product display, proof section, and desktop/mobile transitions. Avoid a repeated rounded-card grid; spend the strongest depth and shadow only on the phone simulator.

- [ ] **Step 5: Style all five app screens**

Match the supplied KA Pods reference language—clean ice-blue surfaces, navy typography, aqua/green controls—while keeping 44px targets, scroll containment inside the phone, visible selected tabs, empty states, and image fallback behavior.

- [ ] **Step 6: Run tests and production build**

Run: `npm test && npm run build`

Expected: all tests PASS and Vite creates `dist/index.html` plus versioned assets without warnings about missing images.

- [ ] **Step 7: Commit the visual system**

```bash
git add index.html src/styles tests/site-shell.test.js
git commit -m "feat: style responsive KA Pods experience"
```

### Task 5: Final verification and private deployment

**Files:**
- Modify only if verification reveals a scoped defect in files from Tasks 1–4.

**Interfaces:**
- Consumes: the complete static build in `dist/` and `.openai/hosting.json`.
- Produces: a verified private Sites deployment URL.

- [ ] **Step 1: Run the complete automated verification**

Run: `npm test && npm run build`

Expected: every test passes; build exits `0`; `dist/` contains the page, scripts, styles, and all five product images.

- [ ] **Step 2: Run static artifact checks**

Verify that all local `href` and `src` references resolve inside `dist/`, the excluded personal asset is absent, `.openai/hosting.json` points only to `dist`, and no secret or backend binding is declared.

- [ ] **Step 3: Perform the requested presentation-flow QA**

At laptop and mobile viewport sizes, verify hero navigation, all five app screens, one-time reward claim, voucher redemption, empty voucher state, store search, language preference, keyboard focus, and reduced-motion behavior. Confirm no console errors.

- [ ] **Step 4: Fix only defects found by verification and rerun the owning test**

For each defect, add or strengthen the smallest relevant test before the fix, then rerun the complete `npm test && npm run build` gate.

- [ ] **Step 5: Deploy the verified static output privately with Sites**

Publish the current `dist/` using the project’s hosting configuration. Record the resulting private URL and open it once to confirm the deployed page responds successfully.

- [ ] **Step 6: Commit any verification fixes**

```bash
git add <only-files-changed-by-verification>
git commit -m "fix: polish KA Pods presentation flow"
```

Skip this commit when verification required no source changes.
