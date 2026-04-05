// ══════════════════════════════════════════════
//  JaFresh Produce — App Logic
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  DB.init();
  App.init();
});

const App = {

  init() {
    this.renderProducts();
    this.renderFarmers();
    this.updateCartUI();
    this.bindEvents();
    this.checkSession();
    this.animateHeroStats();
  },

  // ── SESSION ───────────────────────────────────
  checkSession() {
    const user = DB.getCurrentUser();
    if (user) this.showLoggedInState(user);
  },

  showLoggedInState(user) {
    document.getElementById('btn-login').style.display = 'none';
    document.getElementById('btn-register').style.display = 'none';
    document.getElementById('btn-dashboard').style.display = 'block';
    document.getElementById('btn-dashboard').textContent = `👤 ${user.firstName}`;
  },

  showLoggedOutState() {
    document.getElementById('btn-login').style.display = 'block';
    document.getElementById('btn-register').style.display = 'block';
    document.getElementById('btn-dashboard').style.display = 'none';
  },

  // ── RENDER PRODUCTS ───────────────────────────
  renderProducts(category = 'all') {
    const grid = document.getElementById('products-grid');
    const products = category === 'search'
      ? DB.searchProducts(document.getElementById('search-input').value)
      : DB.getProducts(category);

    if (products.length === 0) {
      grid.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-light);grid-column:1/-1">No products found.</div>`;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-img">${p.emoji}</div>
        <div class="product-body">
          <div class="product-tag">${p.tag}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.description.substring(0, 90)}...</div>
          <div class="product-footer">
            <div class="product-price">J$${p.price.toLocaleString()} <span>${p.unit}</span></div>
            <button class="btn-add-cart" onclick="App.addToCart(${p.id})">+ Add</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderFarmers() {
    const grid = document.getElementById('farmers-grid');
    const farmers = DB.getFarmers();
    grid.innerHTML = farmers.map(f => `
      <div class="farmer-card">
        <div class="farmer-avatar">${f.emoji}</div>
        <div class="farmer-name">${f.name}</div>
        <div class="farmer-location">📍 ${f.location}</div>
        <div class="farmer-bio">${f.bio}</div>
        <div class="farmer-products">
          ${f.products.map(p => `<span class="farmer-tag">${p}</span>`).join('')}
        </div>
      </div>
    `).join('');
  },

  // ── CART ──────────────────────────────────────
  addToCart(productId) {
    DB.addToCart(productId);
    this.updateCartUI();
    this.renderCartItems();
    this.openCart();
    this.showToast('✅ Added to cart!');
  },

  updateCartUI() {
    const count = DB.getCartCount();
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-count').style.display = count > 0 ? 'flex' : 'none';
  },

  openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('active');
    this.renderCartItems();
  },

  closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
  },

  renderCartItems() {
    const cart = DB.getCart();
    const container = document.getElementById('cart-items');
    const total = DB.getCartTotal();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <p style="font-size:0.8rem;margin-top:0.5rem">Add some fresh produce!</p>
        </div>`;
      document.getElementById('cart-total-amount').textContent = 'J$0';
      return;
    }

    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">J$${item.price.toLocaleString()}${item.unit}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="App.updateQty(${item.id}, ${item.qty - 1})">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="App.updateQty(${item.id}, ${item.qty + 1})">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="App.removeFromCart(${item.id})">🗑</button>
      </div>
    `).join('');

    document.getElementById('cart-total-amount').textContent = `J$${total.toLocaleString()}`;
  },

  removeFromCart(id) {
    DB.removeFromCart(id);
    this.renderCartItems();
    this.updateCartUI();
  },

  updateQty(id, qty) {
    if (qty < 1) { this.removeFromCart(id); return; }
    DB.updateQty(id, qty);
    this.renderCartItems();
    this.updateCartUI();
  },

  // ── CHECKOUT ──────────────────────────────────
  openCheckout() {
    const user = DB.getCurrentUser();
    if (!user) {
      this.showToast('⚠️ Please log in to checkout');
      this.closeCart();
      setTimeout(() => this.openModal('login'), 400);
      return;
    }
    if (DB.getCart().length === 0) {
      this.showToast('Your cart is empty!');
      return;
    }
    this.closeCart();
    document.getElementById('checkout-modal').classList.add('active');
    document.getElementById('checkout-name').value = `${user.firstName} ${user.lastName}`;
    document.getElementById('checkout-email').value = user.email;
    document.getElementById('checkout-total').textContent = `J$${DB.getCartTotal().toLocaleString()}`;
  },

  placeOrder() {
    const user = DB.getCurrentUser();
    const name = document.getElementById('checkout-name').value;
    const address = document.getElementById('checkout-address').value;
    const phone = document.getElementById('checkout-phone').value;
    const parish = document.getElementById('checkout-parish').value;

    if (!name || !address || !phone || !parish) {
      this.showToast('⚠️ Please fill all fields');
      return;
    }

    const order = DB.placeOrder({
      userId: user?.id,
      customerName: name,
      address, phone, parish
    });

    document.getElementById('checkout-modal').classList.remove('active');
    this.updateCartUI();
    this.renderCartItems();

    // show success
    document.getElementById('order-id-display').textContent = order.id;
    document.getElementById('order-success-modal').classList.add('active');
  },

  // ── AUTH ──────────────────────────────────────
  openModal(tab = 'login') {
    document.getElementById('auth-modal').classList.add('active');
    this.switchAuthTab(tab);
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('active');
  },

  switchRole(role) {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-role="${role}"]`).classList.add('active');
    App._currentRole = role;
    // show/hide farmer-only fields
    const farmerFields = document.getElementById('farmer-extra-fields');
    if (farmerFields) farmerFields.style.display = role === 'farmer' ? 'block' : 'none';
  },

  switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
    App._currentTab = tab;
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const role = App._currentRole || 'customer';

    const result = DB.login(email, password, role);
    if (result.success) {
      DB.setCurrentUser(result.user);
      this.closeModal('auth-modal');
      this.showLoggedInState(result.user);
      this.showToast(`🌿 Welcome back, ${result.user.firstName}!`);
    } else {
      this.showToast('❌ ' + result.message);
    }
  },

  handleRegister(e) {
    e.preventDefault();
    const role = App._currentRole || 'customer';
    const data = {
      role,
      firstName: document.getElementById('reg-firstname').value,
      lastName: document.getElementById('reg-lastname').value,
      email: document.getElementById('reg-email').value,
      phone: document.getElementById('reg-phone').value,
      password: document.getElementById('reg-password').value,
      parish: role === 'farmer' ? document.getElementById('reg-parish')?.value : '',
      bio: role === 'farmer' ? document.getElementById('reg-bio')?.value : '',
    };

    if (!data.firstName || !data.email || !data.password) {
      this.showToast('⚠️ Please fill all required fields');
      return;
    }

    const result = DB.register(data);
    if (result.success) {
      DB.setCurrentUser(result.user);
      this.closeModal('auth-modal');
      this.showLoggedInState(result.user);
      this.showToast(`🌱 Welcome to JaFresh Produce, ${data.firstName}!`);
      if (role === 'farmer') {
        setTimeout(() => this.showDashboard(), 500);
      }
    } else {
      this.showToast('❌ ' + result.message);
    }
  },

  handleLogout() {
    DB.logout();
    this.showLoggedOutState();
    this.hideDashboard();
    this.showToast('👋 Logged out successfully');
  },

  // ── DASHBOARD ─────────────────────────────────
  showDashboard() {
    const user = DB.getCurrentUser();
    if (!user) { this.openModal('login'); return; }

    document.getElementById('main-site').classList.add('hidden');
    document.getElementById('dashboard-customer').style.display = 'none';
    document.getElementById('dashboard-farmer').style.display = 'none';

    if (user.role === 'customer') {
      this.renderCustomerDashboard(user);
    } else {
      this.renderFarmerDashboard(user);
    }
  },

  hideDashboard() {
    document.getElementById('main-site').classList.remove('hidden');
    document.getElementById('dashboard-customer').style.display = 'none';
    document.getElementById('dashboard-farmer').style.display = 'none';
  },

  renderCustomerDashboard(user) {
    const orders = DB.getUserOrders(user.id);
    const dash = document.getElementById('dashboard-customer');
    dash.style.display = 'block';

    document.getElementById('cust-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('cust-email').textContent = user.email;
    document.getElementById('cust-orders-count').textContent = orders.length;
    document.getElementById('cust-total-spent').textContent = `J$${orders.reduce((s,o) => s + o.total, 0).toLocaleString()}`;

    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.date}</td>
        <td>${o.items?.[0]?.name || 'Mixed Box'}${o.items?.length > 1 ? ` +${o.items.length-1} more` : ''}</td>
        <td>J$${o.total.toLocaleString()}</td>
        <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
      </tr>
    `).join('');
  },

  renderFarmerDashboard(user) {
    const dash = document.getElementById('dashboard-farmer');
    dash.style.display = 'block';
    const listings = DB.getFarmerListings(user.farmer_id || 1);

    document.getElementById('farmer-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('farmer-parish').textContent = user.parish || 'Jamaica';
    document.getElementById('farmer-listings-count').textContent = listings.length;
    document.getElementById('farmer-earnings').textContent = `J$${(listings.length * 12500).toLocaleString()}`;

    const container = document.getElementById('farmer-listings');
    container.innerHTML = listings.length === 0
      ? `<p style="color:var(--text-light)">No listings yet. Add your first produce!</p>`
      : listings.map(l => `
        <div class="farmer-listing-card">
          <div class="listing-emoji">${l.emoji}</div>
          <div class="listing-info">
            <div class="listing-name">${l.name}</div>
            <div class="listing-stock">Stock: ${l.stock} ${l.unit}s available</div>
          </div>
          <div class="listing-price">J$${l.price}</div>
          <button class="btn-edit" onclick="App.showToast('Edit feature coming soon!')">Edit</button>
        </div>
      `).join('');
  },

  showAddListingModal() {
    document.getElementById('add-listing-modal').classList.add('active');
  },

  addListing(e) {
    e.preventDefault();
    const user = DB.getCurrentUser();
    const data = {
      farmer_id: user.farmer_id || 1,
      name: document.getElementById('listing-name').value,
      emoji: document.getElementById('listing-emoji').value || '🌿',
      price: parseInt(document.getElementById('listing-price').value),
      stock: parseInt(document.getElementById('listing-stock').value),
      unit: document.getElementById('listing-unit').value,
    };
    DB.addListing(data);
    this.closeModal('add-listing-modal');
    this.renderFarmerDashboard(user);
    this.showToast('✅ Listing added successfully!');
    document.getElementById('add-listing-form').reset();
  },

  // ── FILTERS & SEARCH ──────────────────────────
  filterProducts(category, btn) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    this.renderProducts(category);
  },

  handleSearch() {
    const q = document.getElementById('search-input').value;
    if (q.length > 1) this.renderProducts('search');
    else this.renderProducts('all');
  },

  // ── SUBSCRIBE ────────────────────────────────
  subscribePlan(planName) {
    const user = DB.getCurrentUser();
    if (!user) {
      this.showToast('⚠️ Please log in to subscribe');
      this.openModal('login');
      return;
    }
    this.showToast(`🌱 Subscribed to ${planName}! Check your email.`);
  },

  // ── UTILS ─────────────────────────────────────
  showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  },

  animateHeroStats() {
    const targets = { 'stat-farmers': 85, 'stat-customers': 1240, 'stat-parishes': 14 };
    Object.entries(targets).forEach(([id, target]) => {
      const el = document.getElementById(id);
      if (!el) return;
      let count = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count.toLocaleString() + (id === 'stat-parishes' ? '' : '+');
        if (count >= target) clearInterval(timer);
      }, 25);
    });
  },

  // ── EVENT BINDING ─────────────────────────────
  bindEvents() {
    // Cart
    document.getElementById('cart-btn').addEventListener('click', () => this.openCart());
    document.getElementById('cart-close').addEventListener('click', () => this.closeCart());
    document.getElementById('cart-overlay').addEventListener('click', () => this.closeCart());
    document.getElementById('btn-checkout').addEventListener('click', () => this.openCheckout());

    // Auth
    document.getElementById('btn-login').addEventListener('click', () => this.openModal('login'));
    document.getElementById('btn-register').addEventListener('click', () => this.openModal('register'));
    document.getElementById('btn-dashboard').addEventListener('click', () => this.showDashboard());
    document.getElementById('auth-modal').addEventListener('click', e => { if (e.target === e.currentTarget) this.closeModal('auth-modal'); });

    // Role tabs
    document.querySelectorAll('.role-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchRole(tab.dataset.role));
    });

    // Auth tabs (login/register)
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchAuthTab(tab.dataset.tab));
    });

    // Forms
    document.getElementById('login-form').addEventListener('submit', e => this.handleLogin(e));
    document.getElementById('register-form').addEventListener('submit', e => this.handleRegister(e));

    // Search
    document.getElementById('search-input').addEventListener('input', () => this.handleSearch());

    // Checkout
    document.getElementById('checkout-modal').addEventListener('click', e => { if (e.target === e.currentTarget) this.closeModal('checkout-modal'); });
    document.getElementById('btn-place-order').addEventListener('click', () => this.placeOrder());

    // Order success
    document.getElementById('btn-order-done').addEventListener('click', () => {
      this.closeModal('order-success-modal');
    });

    // Add listing
    document.getElementById('add-listing-form').addEventListener('submit', e => this.addListing(e));

    // Scroll animation
    this.initScrollAnimations();
  },

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.step-card, .product-card, .farmer-card, .plan-card, .testimonial-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }
};
