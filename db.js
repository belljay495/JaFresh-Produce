// ══════════════════════════════════════════════
//  JaFresh Produce — In-Browser Database (localStorage)
//  Simulates a real backend database using localStorage
// ══════════════════════════════════════════════

const DB = {

  // ── INIT ──────────────────────────────────────
  init() {
    if (!localStorage.getItem('gp_products')) this._seedProducts();
    if (!localStorage.getItem('gp_farmers'))  this._seedFarmers();
    if (!localStorage.getItem('gp_users'))    localStorage.setItem('gp_users', JSON.stringify([]));
    if (!localStorage.getItem('gp_orders'))   localStorage.setItem('gp_orders', JSON.stringify([]));
    if (!localStorage.getItem('gp_cart'))     localStorage.setItem('gp_cart', JSON.stringify([]));
    if (!localStorage.getItem('gp_listings')) this._seedListings();
  },

  // ── PRODUCTS ──────────────────────────────────
  _seedProducts() {
    const products = [
      { id: 1, name: "Weekly Veggie Box – Small", category: "boxes", emoji: "🥬", price: 1500, unit: "/week", tag: "Best Seller", description: "A curated mix of 6–8 seasonal vegetables freshly harvested from our partner farms across St. Elizabeth and Westmoreland. Includes callaloo, cho cho, pumpkin, escallion, thyme, and more. Enough for a family of 2.", farmer_id: 1, stock: 50 },
      { id: 2, name: "Weekly Veggie Box – Large", category: "boxes", emoji: "🥦", price: 2800, unit: "/week", tag: "Family Size", description: "Our large family veggie box contains 12–14 varieties of fresh vegetables sourced from multiple farms. Perfect for a family of 4–6. Includes seasonal greens, root vegetables, herbs, and exotic island produce.", farmer_id: 2, stock: 35 },
      { id: 3, name: "Fresh Fruit Box", category: "boxes", emoji: "🍎", price: 2200, unit: "/week", tag: "Tropical", description: "A vibrant selection of 8 fresh tropical fruits including mango, pineapple, watermelon, papaya, june plum, otaheite apple, and guinep (in season). All sourced from small farmers in Portland and St. Mary.", farmer_id: 3, stock: 40 },
      { id: 4, name: "Herb & Seasoning Bundle", category: "herbs", emoji: "🌿", price: 800, unit: "/week", tag: "Cook's Choice", description: "Fresh Jamaican herbs and seasonings harvested weekly. Includes thyme, escallion, scotch bonnet, pimento, ginger, garlic, and fresh bay leaves. The perfect complement to any Jamaican kitchen.", farmer_id: 1, stock: 60 },
      { id: 5, name: "Root Vegetables Box", category: "vegetables", emoji: "🥕", price: 1800, unit: "/week", tag: "Hearty", description: "A wholesome box of ground provisions and root vegetables: yam, dasheen, cocoa (taro), sweet potato, Irish potato, and cassava. All grown in the fertile hills of St. Elizabeth.", farmer_id: 4, stock: 45 },
      { id: 6, name: "Grain & Provision Box", category: "provisions", emoji: "🌽", price: 1600, unit: "/week", tag: "Staples", description: "Essential Jamaican staples including gungo peas, red peas, yellow yam, corn, breadfruit, and green bananas. Sourced from certified local farmers. Great for traditional Jamaican cooking.", farmer_id: 2, stock: 30 },
      { id: 7, name: "Salad Lovers Box", category: "vegetables", emoji: "🥗", price: 1400, unit: "/week", tag: "Health First", description: "For the health-conscious Jamaican! Crisp lettuce, cherry tomatoes, cucumbers, carrots, radishes, and seasonal salad greens. Washed and ready to use. Sourced from greenhouse farms in St. Andrew.", farmer_id: 5, stock: 25 },
      { id: 8, name: "Tomatoes & Peppers Pack", category: "vegetables", emoji: "🍅", price: 950, unit: "/week", tag: "Spice It Up", description: "A fiery and flavourful pack of fresh tomatoes, sweet peppers, scotch bonnet peppers, and pimento. All varieties grown naturally without harmful pesticides on farms in Clarendon.", farmer_id: 4, stock: 55 },
      { id: 9, name: "Premium Organic Box", category: "boxes", emoji: "🌱", price: 3500, unit: "/week", tag: "Organic", description: "Our flagship box featuring 100% certified organic produce from verified farms. Every item is grown without synthetic fertilizers or pesticides. Includes rare heirloom varieties and exotic island vegetables.", farmer_id: 5, stock: 20 },
      { id: 10, name: "Citrus & Juice Box", category: "fruits", emoji: "🍊", price: 1700, unit: "/week", tag: "Refreshing", description: "Packed with Jamaican citrus fruits perfect for juicing: oranges, grapefruit, ugli fruit, limes, and naseberry. Freshly picked and delivered within 24 hours of harvest from farms in St. Thomas.", farmer_id: 3, stock: 38 },
      { id: 11, name: "Gift a Box", category: "gifts", emoji: "🎁", price: 3000, unit: "/box", tag: "Gift", description: "Send a loved one the gift of fresh Jamaican produce. We'll arrange a beautiful selection box and deliver it to any address island-wide. Includes a handwritten card from our farmers.", farmer_id: 1, stock: 99 },
      { id: 12, name: "Bi-Weekly Callaloo Bundle", category: "vegetables", emoji: "🌿", price: 700, unit: "/2 weeks", tag: "Local Fave", description: "Jamaica's favourite leafy green! Fresh callaloo bundles from St. Elizabeth farms, harvested twice a week. Rich in iron and perfect for traditional callaloo dishes, stews, and scrambled eggs.", farmer_id: 2, stock: 80 }
    ];
    localStorage.setItem('gp_products', JSON.stringify(products));
  },

  _seedFarmers() {
    const farmers = [
      { id: 1, name: "Miss Hyacinth Brown", location: "St. Elizabeth", emoji: "👩🏾‍🌾", bio: "30 years of farming heritage passed down from her grandmother. Specialises in leafy greens and herbs using traditional Jamaican methods.", products: ["Callaloo", "Thyme", "Escallion", "Pumpkin"], joined: "2023-01-15", earnings: 245000 },
      { id: 2, name: "Farmer Delroy Reid", location: "Westmoreland", emoji: "👨🏿‍🌾", bio: "Third-generation farmer growing provisions and ground produce on 12 acres of fertile land. Proud supporter of chemical-free farming.", products: ["Yam", "Banana", "Gungo Peas", "Corn"], joined: "2023-02-20", earnings: 312000 },
      { id: 3, name: "Yvette Campbell", location: "Portland", emoji: "👩🏽‍🌾", bio: "Award-winning fruit farmer known for her exceptional tropical fruit cultivation. Her mango and pineapple varieties are island-famous.", products: ["Mango", "Pineapple", "Citrus", "Papaya"], joined: "2023-03-10", earnings: 189000 },
      { id: 4, name: "Junior Thompson", location: "Clarendon", emoji: "👨🏾‍🌾", bio: "Young innovative farmer using drip irrigation and soil management techniques. Produces some of the finest tomatoes and root vegetables in Jamaica.", products: ["Tomatoes", "Sweet Potato", "Cassava", "Peppers"], joined: "2023-05-01", earnings: 276000 },
      { id: 5, name: "Sister Marcia Williams", location: "St. Andrew", emoji: "👩🏿‍🌾", bio: "Jamaica's leading organic certified farmer with a 5-acre greenhouse operation. Her produce reaches top restaurants across Kingston.", products: ["Lettuce", "Organic Greens", "Rare Herbs", "Microgreens"], joined: "2023-06-15", earnings: 398000 }
    ];
    localStorage.setItem('gp_farmers', JSON.stringify(farmers));
  },

  _seedListings() {
    // default listings tied to farmer accounts
    const listings = [
      { id: 1, farmer_id: 1, name: "Fresh Callaloo Bunch", emoji: "🌿", price: 300, stock: 40, unit: "bunch", status: "active" },
      { id: 2, farmer_id: 1, name: "Herb Bundle", emoji: "🌱", price: 250, stock: 25, unit: "pack", status: "active" },
      { id: 3, farmer_id: 2, name: "Yellow Yam (2lb)", emoji: "🍠", price: 450, stock: 60, unit: "pack", status: "active" },
    ];
    localStorage.setItem('gp_listings', JSON.stringify(listings));
  },

  // ── GETTERS ───────────────────────────────────
  getProducts(category = 'all') {
    const products = JSON.parse(localStorage.getItem('gp_products') || '[]');
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
  },

  getProduct(id) {
    return this.getProducts().find(p => p.id === parseInt(id));
  },

  getFarmers() {
    return JSON.parse(localStorage.getItem('gp_farmers') || '[]');
  },

  getFarmer(id) {
    return this.getFarmers().find(f => f.id === parseInt(id));
  },

  // ── AUTH ──────────────────────────────────────
  register(data) {
    const users = JSON.parse(localStorage.getItem('gp_users') || '[]');
    const exists = users.find(u => u.email === data.email);
    if (exists) return { success: false, message: 'Email already registered.' };

    const newUser = {
      id: Date.now(),
      ...data,
      password: btoa(data.password), // basic encoding (not secure, demo only)
      createdAt: new Date().toISOString(),
      orders: [],
    };
    // If farmer, link to farmer profile
    if (data.role === 'farmer') {
      const farmers = this.getFarmers();
      const farmerProfile = {
        id: farmers.length + 1,
        name: `${data.firstName} ${data.lastName}`,
        location: data.parish || 'Jamaica',
        emoji: '👨🏾‍🌾',
        bio: data.bio || 'New partner farmer.',
        products: [],
        joined: new Date().toISOString().split('T')[0],
        earnings: 0
      };
      farmers.push(farmerProfile);
      localStorage.setItem('gp_farmers', JSON.stringify(farmers));
      newUser.farmer_id = farmerProfile.id;
    }
    users.push(newUser);
    localStorage.setItem('gp_users', JSON.stringify(users));
    return { success: true, user: newUser };
  },

  login(email, password, role) {
    const users = JSON.parse(localStorage.getItem('gp_users') || '[]');
    const user = users.find(u => u.email === email && u.role === role);
    if (!user) return { success: false, message: 'No account found with this email and role.' };
    if (user.password !== btoa(password)) return { success: false, message: 'Incorrect password.' };
    return { success: true, user };
  },

  getCurrentUser() {
    const data = sessionStorage.getItem('gp_current_user');
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user) {
    sessionStorage.setItem('gp_current_user', JSON.stringify(user));
  },

  logout() {
    sessionStorage.removeItem('gp_current_user');
  },

  // ── CART ──────────────────────────────────────
  getCart() {
    return JSON.parse(localStorage.getItem('gp_cart') || '[]');
  },

  addToCart(productId) {
    const cart = this.getCart();
    const product = this.getProduct(productId);
    if (!product) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: productId, qty: 1, name: product.name, price: product.price, emoji: product.emoji, unit: product.unit });
    }
    localStorage.setItem('gp_cart', JSON.stringify(cart));
    return cart;
  },

  removeFromCart(productId) {
    let cart = this.getCart().filter(i => i.id !== productId);
    localStorage.setItem('gp_cart', JSON.stringify(cart));
    return cart;
  },

  updateQty(productId, qty) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
    }
    localStorage.setItem('gp_cart', JSON.stringify(cart));
    return cart;
  },

  clearCart() {
    localStorage.setItem('gp_cart', JSON.stringify([]));
  },

  getCartTotal() {
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCartCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  // ── ORDERS ────────────────────────────────────
  placeOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('gp_orders') || '[]');
    const newOrder = {
      id: 'GP-' + Date.now(),
      ...orderData,
      items: this.getCart(),
      total: this.getCartTotal(),
      status: 'Processing',
      date: new Date().toLocaleDateString('en-JM', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('gp_orders', JSON.stringify(orders));

    // update user orders
    const users = JSON.parse(localStorage.getItem('gp_users') || '[]');
    const user = users.find(u => u.id === orderData.userId);
    if (user) {
      user.orders = user.orders || [];
      user.orders.push(newOrder.id);
      localStorage.setItem('gp_users', JSON.stringify(users));
      this.setCurrentUser(user);
    }
    this.clearCart();
    return newOrder;
  },

  getUserOrders(userId) {
    const orders = JSON.parse(localStorage.getItem('gp_orders') || '[]');
    const demoOrders = [
      { id: 'GP-001', date: '1 Apr 2026', total: 2800, status: 'Delivered', items: [{ name: 'Weekly Veggie Box – Large' }] },
      { id: 'GP-002', date: '24 Mar 2026', total: 1500, status: 'Delivered', items: [{ name: 'Weekly Veggie Box – Small' }] },
      { id: 'GP-003', date: '17 Mar 2026', total: 3200, status: 'Processing', items: [{ name: 'Premium Organic Box' }] },
    ];
    const userOrders = orders.filter(o => o.userId === userId);
    return [...demoOrders, ...userOrders];
  },

  // ── FARMER LISTINGS ───────────────────────────
  getFarmerListings(farmerId) {
    const listings = JSON.parse(localStorage.getItem('gp_listings') || '[]');
    return listings.filter(l => l.farmer_id === parseInt(farmerId));
  },

  addListing(data) {
    const listings = JSON.parse(localStorage.getItem('gp_listings') || '[]');
    const newListing = { id: Date.now(), ...data, status: 'active' };
    listings.push(newListing);
    localStorage.setItem('gp_listings', JSON.stringify(listings));
    return newListing;
  },

  searchProducts(query) {
    const q = query.toLowerCase();
    return this.getProducts().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
};
