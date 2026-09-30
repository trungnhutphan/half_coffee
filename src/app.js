import { addItem, changeQuantity, getCartSummary, removeItem } from './cart.js';
import { filterProducts } from './catalog.js';
import { canPlaceOrder, createDemoOrder } from './checkout.js';
import { CATEGORIES, PAYMENT_METHODS, PRODUCTS, STORE } from './data.js';

const formatCurrency = (amount) => `${amount.toLocaleString('vi-VN')}đ`;

export function bootstrap(document) {
  let cart = [];
  let activeCategory = 'all';
  let selectedProduct = null;
  let toastTimer;

  const window = document.defaultView;
  const menuGrid = document.querySelector('#menu-grid');
  const categoryTabs = document.querySelector('#category-tabs');
  const searchInput = document.querySelector('#search-input');
  const cartPanel = document.querySelector('#cart-panel');
  const scrim = document.querySelector('#scrim');
  const cartCount = document.querySelector('#cart-count');
  const inlineCartCount = document.querySelector('#inline-cart-count');
  const inlineCartSummary = document.querySelector('#inline-cart-summary');
  const cartItems = document.querySelector('#cart-items');
  const cartTotal = document.querySelector('#cart-total');
  const checkoutButton = document.querySelector('#checkout-button');
  const paymentOptions = document.querySelector('#payment-options');
  const productDialog = document.querySelector('#product-dialog');
  const dialogTitle = document.querySelector('#dialog-title');
  const dialogDescription = document.querySelector('#dialog-description');
  const dialogAddButton = document.querySelector('#dialog-add-button');
  const toast = document.querySelector('#toast');

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function showView(viewName) {
    document.querySelectorAll('.view').forEach((view) => {
      view.hidden = view.id !== `${viewName}-view`;
    });

    document.querySelectorAll('#main-nav button').forEach((button) => {
      button.classList.toggle(
        'is-active',
        (viewName === 'story' && button.dataset.action === 'scroll-story')
          || button.dataset.action === `show-${viewName}`,
      );
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function setCartOpen(isOpen) {
    cartPanel.classList.toggle('is-open', isOpen);
    cartPanel.setAttribute('aria-hidden', String(!isOpen));
    scrim.hidden = !isOpen;
    document.querySelector('#cart-button').setAttribute('aria-expanded', String(isOpen));
  }

  function renderCategories() {
    categoryTabs.innerHTML = CATEGORIES.map((category) => `
      <button type="button" data-category="${category.id}" class="${category.id === activeCategory ? 'is-active' : ''}">
        ${category.label}
      </button>
    `).join('');
  }

  function renderProducts() {
    const visibleProducts = filterProducts(PRODUCTS, activeCategory, searchInput.value);

    menuGrid.innerHTML = visibleProducts.length
      ? visibleProducts.map((product) => `
        <article class="product-card" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" />
          <span class="product-label">${product.label}</span>
          <div class="product-copy">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-bottom">
              <span class="price">${formatCurrency(product.price)}</span>
              <span>
                <button class="options-button" type="button" data-action="open-options">Tùy chọn</button>
                <button class="add-button" type="button" data-action="add">Thêm</button>
              </span>
            </div>
          </div>
        </article>
      `).join('')
      : '<p class="empty-cart">Chưa tìm thấy món phù hợp. Thử một từ khoá khác nhé.</p>';
  }

  function renderPaymentOptions() {
    paymentOptions.insertAdjacentHTML('beforeend', PAYMENT_METHODS.map((method, index) => `
      <label><input type="radio" name="payment" value="${method.id}" ${index === 0 ? 'checked' : ''} /> ${method.label}</label>
    `).join(''));
  }

  function renderCart() {
    const summary = getCartSummary(cart);
    cartCount.textContent = summary.itemCount;
    inlineCartCount.textContent = summary.itemCount ? `${summary.itemCount} món đã chọn` : 'Chưa có món';
    inlineCartSummary.textContent = summary.itemCount
      ? `Tạm tính ${formatCurrency(summary.subtotal)}.`
      : 'Một ly thơm sẽ bắt đầu từ đây.';
    cartTotal.textContent = formatCurrency(summary.subtotal);
    checkoutButton.disabled = !canPlaceOrder(cart, document.querySelector('input[name="payment"]:checked')?.value);

    cartItems.innerHTML = cart.length
      ? cart.map((item) => `
        <article class="cart-line" data-product-id="${item.id}">
          <div><strong>${item.name}</strong><small>${formatCurrency(item.price)} / món</small>
            <div class="quantity-control"><button type="button" data-action="decrement" aria-label="Bớt một ${item.name}">−</button><span>${item.quantity}</span><button type="button" data-action="increment" aria-label="Thêm một ${item.name}">+</button></div>
          </div>
          <div><strong>${formatCurrency(item.price * item.quantity)}</strong><button class="remove-line" type="button" data-action="remove">Xoá</button></div>
        </article>
      `).join('')
      : '<p class="empty-cart">Giỏ món đang trống. Hãy chọn một thức uống bạn thấy hợp hôm nay.</p>';
  }

  function addProduct(product) {
    cart = addItem(cart, product);
    renderCart();
    showToast(`Đã thêm ${product.name} vào giỏ món.`);
  }

  function openProductDialog(product) {
    selectedProduct = product;
    dialogTitle.textContent = product.name;
    dialogDescription.textContent = product.description;
    document.querySelector('#product-note').value = '';
    if (typeof productDialog.showModal === 'function') {
      productDialog.showModal();
    } else {
      productDialog.open = true;
    }
  }

  function closeProductDialog() {
    if (typeof productDialog.close === 'function') {
      productDialog.close();
    }
    productDialog.open = false;
    selectedProduct = null;
  }

  function placeOrder() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    const fulfillment = document.querySelector('input[name="fulfillment"]:checked')?.value;
    const order = createDemoOrder(cart, fulfillment, paymentMethod, new Date());

    if (!order) {
      showToast('Chọn ít nhất một món trước khi xác nhận đơn.');
      return;
    }

    document.querySelector('#order-code').textContent = order.code;
    document.querySelector('#order-details').textContent = `${order.fulfillment === 'pickup' ? STORE.serviceTime : 'Giao tận nơi (mô phỏng)'} · ${formatCurrency(order.total)}`;
    cart = [];
    renderCart();
    setCartOpen(false);
    showView('confirmation');
  }

  document.addEventListener('click', (event) => {
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;

    const { action } = actionElement.dataset;
    const product = PRODUCTS.find((item) => item.id === actionElement.closest('[data-product-id]')?.dataset.productId);

    if (action === 'show-home') showView('home');
    if (action === 'show-menu') showView('menu');
    if (action === 'scroll-story') showView('story');
    if (action === 'toggle-cart') setCartOpen(!cartPanel.classList.contains('is-open'));
    if (action === 'add' && product) addProduct(product);
    if (action === 'open-options' && product) openProductDialog(product);
    if (action === 'increment' && product) { cart = changeQuantity(cart, product.id, 1); renderCart(); }
    if (action === 'decrement' && product) { cart = changeQuantity(cart, product.id, -1); renderCart(); }
    if (action === 'remove' && product) { cart = removeItem(cart, product.id); renderCart(); }
    if (action === 'checkout') placeOrder();
    if (action === 'start-new-order') showView('menu');
  });

  categoryTabs.addEventListener('click', (event) => {
    const categoryButton = event.target.closest('[data-category]');
    if (!categoryButton) return;
    activeCategory = categoryButton.dataset.category;
    renderCategories();
    renderProducts();
  });
  searchInput.addEventListener('input', renderProducts);
  paymentOptions.addEventListener('change', renderCart);
  dialogAddButton.addEventListener('click', () => {
    if (selectedProduct) addProduct(selectedProduct);
    closeProductDialog();
  });
  productDialog.querySelector('.close-dialog').addEventListener('click', closeProductDialog);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && productDialog.open) closeProductDialog();
  });

  renderCategories();
  renderProducts();
  renderPaymentOptions();
  renderCart();
}

if (typeof window !== 'undefined' && window.document) {
  bootstrap(window.document);
}
