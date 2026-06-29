(() => {
  'use strict';

  // ===== State =====
  let cart = JSON.parse(localStorage.getItem('yf-cart')) || [];
  let favorites = JSON.parse(localStorage.getItem('yf-favorites')) || [];
  let currentFilter = 'all';
  let currentDetailId = null;
  let detailQty = 1;
  let searchKeyword = '';
  let filterPriceMin = '';
  let filterPriceMax = '';

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

  // Product detail modal
  const productDetailOverlay = $('#productDetailOverlay');
  const productDetailClose = $('#productDetailClose');
  const detailImage = $('#detailImage');
  const detailCategory = $('#detailCategory');
  const detailName = $('#detailName');
  const detailPrice = $('#detailPrice');
  const detailDesc = $('#detailDesc');
  const detailQtyEl = $('#detailQty');
  const detailQtyDec = $('#detailQtyDec');
  const detailQtyInc = $('#detailQtyInc');
  const detailAddCart = $('#detailAddCart');
  const recommendGrid = $('#recommendGrid');

  // Wishlist
  const wishlistBtn = $('#wishlistBtn');
  const wishlistCount = $('#wishlistCount');
  const wishlistNav = $('#wishlistNav');
  const wishlistSidebar = $('#wishlistSidebar');
  const wishlistOverlay = $('#wishlistOverlay');
  const wishlistClose = $('#wishlistClose');
  const wishlistItems = $('#wishlistItems');

  // Search & Filter
  const searchInput = $('#searchInput');
  const searchClear = $('#searchClear');
  const priceMinInput = $('#priceMin');
  const priceMaxInput = $('#priceMax');
  const priceFilterBtn = $('#priceFilterBtn');

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

  // ===== Render Products (with search, price filter, favorites) =====
  function renderProducts() {
    if (!productsGrid) return;

    // Apply category filter
    let filtered = currentFilter === 'all'
      ? [...products]
      : products.filter(p => p.category === currentFilter);

    // Apply search filter
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(kw)))
      );
    }

    // Apply price filter
    const min = parseFloat(filterPriceMin);
    const max = parseFloat(filterPriceMax);
    if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
    if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-result">
          <span class="no-result-icon">&#128270;</span>
          <p>未找到相关商品</p>
          <p style="font-size:0.85rem;margin-top:8px;">试试其他关键词或调整筛选条件</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(p => `
      <div class="product-card" data-id="${p.id}">
        <button class="favorite-btn ${favorites.includes(p.id) ? 'active' : ''}" data-id="${p.id}" title="${favorites.includes(p.id) ? '取消收藏' : '收藏'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${favorites.includes(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
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

  // ===== Product Detail Modal =====
  function openDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    currentDetailId = productId;
    detailQty = 1;

    detailImage.src = product.image;
    detailImage.alt = product.name;
    detailCategory.textContent = product.category;
    detailName.textContent = product.name;
    detailPrice.textContent = `¥${product.price.toLocaleString()}`;
    detailDesc.textContent = product.description;
    detailQtyEl.textContent = '1';

    renderRecommendations(product);
    productDetailOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDetail() {
    productDetailOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderRecommendations(currentProduct) {
    if (!recommendGrid) return;
    const sameCategory = products.filter(p =>
      p.category === currentProduct.category && p.id !== currentProduct.id
    );
    if (sameCategory.length === 0) {
      recommendGrid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-light);font-size:0.85rem;text-align:center;padding:12px 0;">暂无同分类商品</p>';
      return;
    }
    recommendGrid.innerHTML = sameCategory.map(p => `
      <div class="recommend-item" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="rec-name">${p.name}</div>
        <div class="rec-price">¥${p.price.toLocaleString()}</div>
      </div>
    `).join('');
  }

  // ===== Favorites / Wishlist =====
  function toggleFavorite(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const idx = favorites.indexOf(productId);
    if (idx > -1) {
      favorites.splice(idx, 1);
      showToast(`已取消收藏「${product.name}」`);
    } else {
      favorites.push(productId);
      showToast(`已收藏「${product.name}」`);
    }
    saveFavorites();
  }

  function saveFavorites() {
    localStorage.setItem('yf-favorites', JSON.stringify(favorites));
    updateWishlistUI();
    renderProducts();
  }

  function updateWishlistUI() {
    wishlistCount.textContent = favorites.length;
  }

  function renderWishlistItems() {
    if (!wishlistItems) return;
    if (favorites.length === 0) {
      wishlistItems.innerHTML = `
        <div class="cart-empty">
          <span class="cart-empty-icon">&#10084;&#65039;</span>
          <p>心愿单还是空的</p>
          <p>收藏喜欢的家具，慢慢挑选吧</p>
        </div>
      `;
      return;
    }

    const items = favorites.map(id => products.find(p => p.id === id)).filter(Boolean);
    wishlistItems.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">¥${item.price.toLocaleString()}</div>
          <div class="cart-item-footer">
            <div class="wishlist-item-actions">
              <button class="btn btn-primary wishlist-add-cart" data-id="${item.id}">加入购物车</button>
              <button class="btn btn-remove wishlist-remove" data-id="${item.id}">移除</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function openWishlist() {
    renderWishlistItems();
    wishlistSidebar.classList.add('open');
    wishlistOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeWishlist() {
    wishlistSidebar.classList.remove('open');
    wishlistOverlay.classList.remove('open');
    document.body.style.overflow = '';
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

  // ===== Product Detail Modal Events =====

  // Open detail on product card click (not on button clicks)
  document.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    // Don't open detail when clicking add-to-cart or favorite button
    if (e.target.closest('.add-cart-btn') || e.target.closest('.favorite-btn')) return;
    const id = Number(card.dataset.id);
    if (id) openDetail(id);
  });

  // Close detail
  productDetailClose?.addEventListener('click', closeDetail);
  productDetailOverlay?.addEventListener('click', e => {
    if (e.target === productDetailOverlay) closeDetail();
  });

  // Detail quantity
  detailQtyDec?.addEventListener('click', () => {
    if (detailQty > 1) {
      detailQty--;
      detailQtyEl.textContent = detailQty;
    }
  });
  detailQtyInc?.addEventListener('click', () => {
    detailQty++;
    detailQtyEl.textContent = detailQty;
  });

  // Detail add to cart
  detailAddCart?.addEventListener('click', () => {
    const product = products.find(p => p.id === currentDetailId);
    if (!product) return;

    const existing = cart.find(item => item.id === currentDetailId);
    if (existing) {
      existing.qty += detailQty;
    } else {
      cart.push({ ...product, qty: detailQty });
    }
    saveCart();
    showToast(`${product.name} x${detailQty} 已加入购物车`);
    closeDetail();
  });

  // Click same-category recommendation
  recommendGrid?.addEventListener('click', e => {
    const item = e.target.closest('.recommend-item');
    if (!item) return;
    const id = Number(item.dataset.id);
    if (id) openDetail(id);
  });

  // Keyboard ESC close detail
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && productDetailOverlay?.classList.contains('open')) {
      closeDetail();
    }
    if (e.key === 'Escape' && checkoutOverlay?.classList.contains('open')) {
      closeCheckout();
    }
  });

  // ===== Wishlist Events =====
  // Favorite toggle
  document.addEventListener('click', e => {
    const btn = e.target.closest('.favorite-btn');
    if (btn) {
      e.stopPropagation();
      toggleFavorite(Number(btn.dataset.id));
    }
  });

  wishlistBtn?.addEventListener('click', openWishlist);
  wishlistNav?.addEventListener('click', e => {
    e.preventDefault();
    openWishlist();
  });
  wishlistOverlay?.addEventListener('click', closeWishlist);
  wishlistClose?.addEventListener('click', closeWishlist);

  // Wishlist item actions
  document.addEventListener('click', e => {
    const addCart = e.target.closest('.wishlist-add-cart');
    if (addCart) {
      const id = Number(addCart.dataset.id);
      addToCart(id);
      return;
    }
    const remove = e.target.closest('.wishlist-remove');
    if (remove) {
      const id = Number(remove.dataset.id);
      const idx = favorites.indexOf(id);
      if (idx > -1) {
        favorites.splice(idx, 1);
        saveFavorites();
        renderWishlistItems();
        showToast('已从心愿单移除');
      }
    }
  });

  // ===== Search & Filter Events =====
  searchInput?.addEventListener('input', () => {
    searchKeyword = searchInput.value;
    searchClear.classList.toggle('visible', searchKeyword.length > 0);
    renderProducts();
  });

  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    searchKeyword = '';
    searchClear.classList.remove('visible');
    renderProducts();
    searchInput.focus();
  });

  function applyPriceFilter() {
    filterPriceMin = priceMinInput.value;
    filterPriceMax = priceMaxInput.value;
    renderProducts();
  }

  priceFilterBtn?.addEventListener('click', applyPriceFilter);

  [priceMinInput, priceMaxInput].forEach(el => {
    el?.addEventListener('keydown', e => {
      if (e.key === 'Enter') applyPriceFilter();
    });
  });

  // ===== Category Filter =====
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
    updateWishlistUI();
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
