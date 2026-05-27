(() => {
  'use strict';

  // ===== State =====
  let cart = JSON.parse(localStorage.getItem('yf-cart')) || [];
  let currentFilter = 'all';

  // ===== DOM refs =====
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const productsGrid = $('#productsGrid');
  const categoriesGrid = $('#categoriesGrid');
  const cartItems = $('#cartItems');
  const cartCount = $('#cartCount');
  const totalPrice = $('#totalPrice');
  const cartSidebar = $('#cartSidebar');
  const cartOverlay = $('#cartOverlay');
  const checkoutOverlay = $('#checkoutOverlay');
  const toast = $('#toast');
  const mainNav = $('#mainNav');
  const menuToggle = $('#menuToggle');

  // ===== Render Categories =====
  function renderCategories() {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = categories.map(cat => `
      <div class="category-card" data-category="${cat.name}">
        <img src="${cat.image}" alt="${cat.name}" loading="lazy">
        <div class="cat-overlay"></div>
        <span class="cat-label">${cat.name}</span>
      </div>
    `).join('');

    categoriesGrid.addEventListener('click', e => {
      const card = e.target.closest('.category-card');
      if (!card) return;
      const cat = card.dataset.category;
      // Switch filter
      currentFilter = cat;
      $$('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.category === cat));
      renderProducts();
      $('#products').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== Render Products =====
  function renderProducts() {
    if (!productsGrid) return;
    const filtered = currentFilter === 'all'
      ? products
      : products.filter(p => p.category === currentFilter);

    if (filtered.length === 0) {
      productsGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-light)">暂无相关商品</p>';
      return;
    }

    productsGrid.innerHTML = filtered.map(p => `
      <div class="product-card" data-id="${p.id}">
        <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-category">${p.category}</div>
          <div class="product-footer">
            <span class="product-price">¥${p.price.toLocaleString()}</span>
            <button class="add-cart-btn" data-id="${p.id}" title="加入购物车">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ===== Cart =====
  function saveCart() {
    localStorage.setItem('yf-cart', JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
    showToast(`${product.name} 已加入购物车`);
    openCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
  }

  function updateQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      renderCartItems();
    }
  }

  function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function getItemCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function renderCartItems() {
    if (!cartItems) return;

    const { cartFooter } = window; // already referenced below

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <span class="cart-empty-icon">&#128722;</span>
          <p>购物车是空的</p>
          <p>快去选购心仪的家具吧</p>
        </div>
      `;
      return;
    }

    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">¥${item.price.toLocaleString()}</div>
          <div class="cart-item-footer">
            <div class="quantity-control">
              <button class="qty-dec" data-id="${item.id}">−</button>
              <span class="qty">${item.qty}</span>
              <button class="qty-inc" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">删除</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function updateCartUI() {
    cartCount.textContent = getItemCount();
    totalPrice.textContent = `¥${getTotal().toLocaleString()}`;
    renderCartItems();
  }

  function openCart() {
    cartSidebar?.classList.add('open');
    cartOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar?.classList.remove('open');
    cartOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ===== Toast =====
  let toastTimer;

  function showToast(msg) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ===== Checkout =====
  function openCheckout() {
    if (cart.length === 0) {
      showToast('购物车是空的，请先添加商品');
      return;
    }
    closeCart();
    document.getElementById('orderCount').textContent = getItemCount();
    document.getElementById('orderTotal').textContent = `¥${getTotal().toLocaleString()}`;
    checkoutOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    checkoutOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ===== Event Listeners =====

  // Product filter
  document.querySelector('.filter-bar')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    currentFilter = btn.dataset.category;
    $$('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderProducts();
  });

  // Add to cart (delegated)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-cart-btn');
    if (btn) {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id));
      return;
    }

    // Quantity controls
    const dec = e.target.closest('.qty-dec');
    if (dec) { updateQty(Number(dec.dataset.id), -1); return; }
    const inc = e.target.closest('.qty-inc');
    if (inc) { updateQty(Number(inc.dataset.id), 1); return; }

    // Remove from cart
    const rm = e.target.closest('.cart-item-remove');
    if (rm) { removeFromCart(Number(rm.dataset.id)); return; }
  });

  // Cart toggle
  $('#cartBtn')?.addEventListener('click', openCart);
  cartOverlay?.addEventListener('click', closeCart);
  $('#cartClose')?.addEventListener('click', closeCart);

  // Checkout
  $('#checkoutBtn')?.addEventListener('click', openCheckout);
  $('#checkoutClose')?.addEventListener('click', closeCheckout);
  checkoutOverlay?.addEventListener('click', e => {
    if (e.target === checkoutOverlay) closeCheckout();
  });

  // Checkout form submit
  $('#checkoutForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name: $('#name').value,
      phone: $('#phone').value,
      address: $('#address').value,
      note: $('#note').value,
      items: cart,
      total: getTotal()
    };
    console.log('Order submitted:', data);
    showToast('下单成功！感谢您的购买 ❤');
    cart = [];
    saveCart();
    closeCheckout();
    $('#checkoutForm').reset();
  });

  // Mobile menu toggle
  menuToggle?.addEventListener('click', () => {
    mainNav?.classList.toggle('open');
  });

  // Close mobile nav on link click
  mainNav?.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link')) {
      mainNav.classList.remove('open');
    }
  });

  // Header scroll effect + active nav
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const header = document.querySelector('.header');
        header?.classList.toggle('scrolled', window.scrollY > 50);

        // Update active nav link
        const sections = $$('section[id]');
        let activeId = 'home';
        sections.forEach(s => {
          const top = s.offsetTop - 200;
          if (window.scrollY >= top) activeId = s.id;
        });
        $$('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // ===== Number Animation =====
  function animateNumbers() {
    const nums = $$('.stat-num');
    nums.forEach(el => {
      const target = Number(el.dataset.target);
      const duration = 1500;
      const step = Math.ceil(target / 60);
      let current = 0;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(interval);
        } else {
          el.textContent = current;
        }
      }, duration / 60);
    });
  }

  // Intersection Observer for stats animation
  const aboutSection = document.querySelector('.about');
  if (aboutSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(aboutSection);
  }

  // ===== Init =====
  function init() {
    renderCategories();
    renderProducts();
    updateCartUI();
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
