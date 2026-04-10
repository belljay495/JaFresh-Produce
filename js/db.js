// ══════════════════════════════════════════════
//  JaFresh Produce — In-Browser Database (localStorage)
// ══════════════════════════════════════════════

const DB = {

    init() {
        // Preserve farmer-uploaded products and orders before any reset
        const currentUser = localStorage.getItem('jf_current_user');
        const savedOrders = localStorage.getItem('jf_orders');
        const savedSubs = localStorage.getItem('jf_subscriptions');

        // Only seed products if none exist yet
        if (!localStorage.getItem('jf_products')) this._seedProducts();
        if (!localStorage.getItem('jf_farmers')) this._seedFarmers();
        if (!localStorage.getItem('jf_users')) this._seedUsers();
        if (!localStorage.getItem('jf_orders')) localStorage.setItem('jf_orders', JSON.stringify([]));
        if (!localStorage.getItem('jf_cart')) localStorage.setItem('jf_cart', JSON.stringify([]));

        // Fix case-sensitive image paths and box images from earlier seed
        const _boxImageMap = {
            12: "images/Family veg box.png",
            13: "images/Couple's fresh box.png",
            14: "images/Fruit box.png",
            15: "images/Soup & Stew Box.png"
        };
        const _prods = JSON.parse(localStorage.getItem('jf_products') || '[]');
        const _fixed = _prods.map(p => {
            if (p.image === 'images/callaloo.webp') p.image = 'images/Callaloo.webp';
            if (p.image === 'images/thyme.jpg') p.image = 'images/Thyme.jpg';
            if (_boxImageMap[p.id] && !p.image) p.image = _boxImageMap[p.id];
            return p;
        });
        // Add box products if they don't exist yet
        const _boxIds = [12, 13, 14, 15];
        const _existingIds = _fixed.map(p => p.id);
        if (!_boxIds.every(id => _existingIds.includes(id))) {
            const _boxProducts = [
                { id: 12, name: "Family Veg Box", category: "boxes", emoji: "📦", image: "images/Family veg box.png", price: 2500, unit: "/box", tag: "Best Value", description: "Our most popular box, perfect for a family of 4. Each weekly Family Veg Box is packed with a curated selection of the freshest seasonal vegetables straight from our partner farms. Includes callaloo, cabbage, pumpkin, escallion, thyme, scotch bonnet, and your choice of one ground provision (yellow yam or sweet potato). Everything you need to cook authentic Jamaican meals all week long. Sourced from at least 3 different verified farms to ensure variety and freshness. Delivered every Wednesday and Saturday island-wide.", farmer_id: 1, stock: 40 },
                { id: 13, name: "Couple's Fresh Box", category: "boxes", emoji: "💚", image: "images/Couple's fresh box.png", price: 1500, unit: "/box", tag: "Perfect for 2", description: "Designed for households of 1–2 people, the Couple's Fresh Box gives you just the right amount of fresh produce without any waste. Each box includes a seasonal mix of 4–5 vegetables, 1–2 fruits, and a bundle of herbs (escallion and thyme). The selection changes weekly based on what our farmers are harvesting, so you always get peak-freshness produce. Great for couples, young professionals, or anyone who wants to eat healthier without overbuying. Delivered twice weekly on Tuesdays and Fridays.", farmer_id: 2, stock: 50 },
                { id: 14, name: "Tropical Fruit Box", category: "boxes", emoji: "🍍", image: "images/Fruit box.png", price: 2000, unit: "/box", tag: "Fruit Lovers", description: "A vibrant box loaded with the freshest tropical fruits Jamaica has to offer. Each Tropical Fruit Box includes a dozen oranges, a ripe pineapple, a hand of bananas, and 2–3 seasonal fruits such as june plums, naseberries, star apples, or mangoes depending on what's in season. All fruits are tree-ripened and harvested within 48 hours of delivery — no cold storage, no preservatives. Perfect for juicing, snacking, fruit salads, or just enjoying the natural sweetness of Jamaican-grown fruit.", farmer_id: 3, stock: 30 },
                { id: 15, name: "Soup & Stew Box", category: "boxes", emoji: "🍲", image: "images/Soup & Stew Box.png", price: 1800, unit: "/box", tag: "Soup Season", description: "Everything you need to make 2–3 big pots of authentic Jamaican soup or stew. The Soup & Stew Box includes pumpkin, yellow yam, sweet potato, cho cho, carrot, escallion, thyme, scotch bonnet, and a small bundle of pimento leaves. Enough ground provisions and seasoning vegetables to make Saturday beef soup, chicken foot soup, or a rich pumpkin cream soup from scratch.", farmer_id: 4, stock: 35 }
            ];
            const _merged = [..._fixed, ..._boxProducts.filter(b => !_existingIds.includes(b.id))];
            localStorage.setItem('jf_products', JSON.stringify(_merged));
        } else {
            localStorage.setItem('jf_products', JSON.stringify(_fixed));
        }

        // Restore preserved data
        if (currentUser) localStorage.setItem('jf_current_user', currentUser);
        if (savedOrders) localStorage.setItem('jf_orders', savedOrders);
        if (savedSubs) localStorage.setItem('jf_subscriptions', savedSubs);
    },

    // Safe init for dashboard pages — never wipes any data
    initData() {
        if (!localStorage.getItem('jf_products')) this._seedProducts();
        if (!localStorage.getItem('jf_farmers')) this._seedFarmers();
        if (!localStorage.getItem('jf_users')) this._seedUsers();
        if (!localStorage.getItem('jf_orders')) localStorage.setItem('jf_orders', JSON.stringify([]));
        if (!localStorage.getItem('jf_cart')) localStorage.setItem('jf_cart', JSON.stringify([]));
    },

    // Call this ONLY when you want to completely reset everything (dev/testing)
    hardReset() {
        localStorage.clear();
        this.init();
        console.log('✅ Database hard reset complete');
    },

    _seedUsers() {
        const users = [
            {
                id: 1001, role: 'customer',
                firstName: 'Keisha', lastName: 'Brown',
                email: 'customer@test.com', phone: '+1-876-555-0001',
                parish: 'Kingston', password: 'dGVzdDEyMw==',
                createdAt: '2026-01-01T00:00:00.000Z', orders: []
            },
            {
                id: 1002, role: 'farmer',
                firstName: 'Delroy', lastName: 'Reid',
                email: 'farmer@test.com', phone: '+1-876-555-0002',
                farmName: 'Reid Family Farm', parish: 'St. Elizabeth',
                bio: 'Third-generation farmer growing provisions on 12 acres.',
                farmer_id: 2, password: 'dGVzdDEyMw==',
                createdAt: '2026-01-01T00:00:00.000Z', orders: []
            }
        ];
        localStorage.setItem('jf_users', JSON.stringify(users));
    },

    _seedProducts() {
        const products = [
            {
                id: 1, name: "Fresh Callaloo Bunch", category: "vegetables", emoji: "🥬",
                image: "images/Callaloo.webp",
                price: 150, unit: "/lb", tag: "Local Fave",
                description: "Callaloo is Jamaica's most beloved leafy green vegetable and a staple of traditional Jamaican cuisine. Our callaloo is freshly harvested from the fertile farms of St. Elizabeth, picked at peak ripeness to ensure maximum flavour and nutritional value. Rich in iron, calcium, and vitamins A and C, callaloo is incredibly versatile — perfect for sautéing with saltfish, steaming as a side dish, or blending into a hearty soup. Each bunch contains enough callaloo to serve a family of four. Harvested fresh every Monday and Thursday morning and delivered within 24 hours of picking.",
                farmer_id: 1, stock: 80
            },
            {
                id: 2, name: "Fresh Cabbage", category: "vegetables", emoji: "🥦",
                image: "images/cabbage.jpg",
                price: 200, unit: "/lb", tag: "Fresh Pick",
                description: "Our farm-fresh cabbage is grown in the cool highlands of Manchester and St. Elizabeth, where the climate produces firm, sweet, and densely packed heads of cabbage. Free from synthetic pesticides, our cabbage is cultivated using traditional Jamaican farming methods passed down through generations. Each head weighs approximately 1–1.5 kg and is harvested at full maturity for the best flavour. Cabbage is a versatile vegetable perfect for coleslaw, steaming, stir-frying, or adding to soups and stews. A nutritious and affordable staple for every Jamaican household, rich in vitamin C, fibre, and antioxidants.",
                farmer_id: 2, stock: 60
            },
            {
                id: 3, name: "Jamaican Pumpkin", category: "vegetables", emoji: "🎃",
                image: "images/pumpkin.jpg",
                price: 180, unit: "/lb", tag: "Soup Season",
                description: "The Jamaican pumpkin is one of the most essential ingredients in traditional Jamaican cooking and a cornerstone of our national dish, pumpkin soup. Our pumpkins are grown on the sun-drenched flatlands of Westmoreland and Clarendon, where the soil and climate create naturally sweet, deep-orange flesh with exceptional flavour. Each kilogram of pumpkin is freshly cut and packaged on the day of delivery. Use it in Saturday soup, pumpkin rice, roasted vegetable medleys, or creamy pumpkin purees. High in beta-carotene, potassium, and vitamin A, Jamaican pumpkin is both delicious and nutritious for the whole family.",
                farmer_id: 4, stock: 55
            },
            {
                id: 4, name: "Scotch Bonnet Peppers", category: "herbs", emoji: "🌶️",
                image: "images/scotch bonnet.jpg",
                price: 250, unit: "/lb", tag: "🔥 Hot Pick",
                description: "No Jamaican kitchen is complete without the iconic scotch bonnet pepper — the heart of our island's bold and vibrant flavour. Our scotch bonnets are grown by small farmers in Clarendon and St. Catherine, where the warm climate intensifies their distinctive fruity heat and complex aroma. Each pack contains 8–10 fresh scotch bonnet peppers in a mix of colours including red, yellow, and orange. Scotch bonnets are essential for jerk seasoning, pepper sauce, escovitch fish, curry goat, and almost every authentic Jamaican dish. Handle with care — these peppers are one of the hottest in the world and pack a serious punch!",
                farmer_id: 4, stock: 90
            },
            {
                id: 5, name: "Escallion", category: "herbs", emoji: "🌿",
                image: "images/escallion.jpg",
                price: 150, unit: "/lb", tag: "Essential",
                description: "Escallion, known elsewhere as green onion or spring onion, is an absolutely essential seasoning herb in Jamaican cooking and arguably the most used herb on the island. Our escallion is freshly harvested from the gardens of St. Elizabeth and Westmoreland, where it grows in rich, well-drained soil. Each bundle contains 10–12 stalks of fresh, crisp escallion with bright green tops and white bulbs. Escallion is indispensable in jerk chicken, rice and peas, stews, soups, and virtually every Jamaican seasoning blend. Rich in vitamins K and C, it adds a mild onion flavour without overpowering your dish. Delivered fresh twice weekly.",
                farmer_id: 1, stock: 100
            },
            {
                id: 6, name: "Fresh Thyme", category: "herbs", emoji: "🌱",
                image: "images/Thyme.jpg",
                price: 100, unit: "/lb", tag: "Aromatic",
                description: "Jamaican thyme is more robust and aromatic than its European counterpart, with a stronger flavour profile that elevates every dish it touches. Our fresh thyme is grown by Miss Hyacinth Brown on her family farm in St. Elizabeth, where it has been cultivated for over 30 years using traditional methods. Each pack contains a generous handful of fresh thyme sprigs, enough to season multiple dishes. Thyme is essential in Jamaican rice and peas, oxtail, brown stew chicken, soups, and any slow-cooked meat dish. It pairs beautifully with escallion and scotch bonnet to create the signature Jamaican seasoning trinity loved across the island.",
                farmer_id: 1, stock: 75
            },
            {
                id: 7, name: "Ginger Root", category: "herbs", emoji: "🫚",
                image: "images/ginger.jpg",
                price: 300, unit: "/lb", tag: "Super Root",
                description: "Jamaica produces some of the finest ginger in the world, and our farm-fresh ginger root is no exception. Grown in the cool, misty hills of St. Thomas and Portland, Jamaican ginger is prized for its intense spiciness, high oil content, and distinctive pungent aroma that sets it apart from imported varieties. Each pack contains firm, fresh ginger root with a thin skin and vibrant yellow flesh. Use it in ginger tea, ginger beer, sorrel drinks, curries, stir-fries, baked goods, and as a natural remedy for nausea and digestion. Rich in gingerol, our ginger has powerful anti-inflammatory and antioxidant properties.",
                farmer_id: 5, stock: 45
            },
            {
                id: 8, name: "Yellow Yam", category: "provisions", emoji: "🍠",
                image: "images/yellow yam.jpg",
                price: 220, unit: "/lb", tag: "Ground Food",
                description: "Yellow yam is the king of Jamaican ground provisions and a beloved staple that has nourished Jamaican families for centuries. Our yellow yam is grown in the rich red clay soils of St. Elizabeth and Manchester by Farmer Delroy Reid, whose family has been cultivating yams for three generations. Each pound of yellow yam features the characteristic firm, starchy flesh and earthy sweetness that makes it perfect for boiling, roasting, or adding to soups. Yellow yam is an excellent source of complex carbohydrates, potassium, and dietary fibre, providing long-lasting energy for your family. A true taste of authentic Jamaican cooking in every bite.",
                farmer_id: 2, stock: 50
            },
            {
                id: 9, name: "Sweet Potato", category: "provisions", emoji: "🥔",
                image: "images/sweet potato.jpg",
                price: 180, unit: "/lb", tag: "Nutritious",
                description: "Jamaican sweet potato is a versatile and nutritious ground provision loved by families across the island for its naturally sweet flavour and vibrant orange or white flesh. Our sweet potatoes are grown on the fertile plains of Clarendon by Junior Thompson, using drip irrigation and sustainable farming practices that produce consistently high-quality tubers. Each pound contains freshly harvested sweet potatoes delivered within 48 hours. Perfect for boiling, roasting, making pudding, adding to soups, or frying as chips. Packed with beta-carotene, vitamin B6, and potassium, sweet potatoes are one of the most nutritious foods you can add to your family's diet.",
                farmer_id: 4, stock: 65
            },
            {
                id: 10, name: "Oranges", category: "fruits", emoji: "🍊",
                image: "images/oranges.jpg",
                price: 900, unit: "/dozen", tag: "Vitamin C",
                description: "Our Jamaican oranges are grown in the lush citrus groves of St. Mary and Portland, where the tropical climate and rich volcanic soil produce fruits with exceptional sweetness and an abundance of juice. Each dozen contains large, tree-ripened oranges bursting with natural vitamin C, folate, and antioxidants. Unlike imported oranges that are picked unripe and treated with preservatives, our oranges are harvested at full ripeness and delivered fresh within 24 hours. Perfect for juicing, eating fresh, adding to fruit salads, or making orange-glazed sauces. These are the real deal — Jamaican grown, naturally sweet, and incredibly refreshing, especially enjoyed as fresh-squeezed juice on a hot Jamaican day.",
                farmer_id: 3, stock: 70
            },
            {
                id: 11, name: "Fresh Pineapple", category: "fruits", emoji: "🍍",
                image: "images/pineapple.jpg",
                price: 600, unit: "/each", tag: "Tropical",
                description: "Our farm-fresh pineapples are grown by Yvette Campbell on her award-winning fruit farm in Portland, where the combination of rich soil, tropical rainfall, and warm sunshine produces pineapples of extraordinary sweetness and flavour. Each pineapple weighs approximately 1.5–2 kg and is harvested at peak ripeness — golden yellow on the outside with intensely sweet, juicy yellow flesh inside. Unlike the acidic imported pineapples found in supermarkets, our locally grown pineapples are naturally sweet with no tartness. Enjoy fresh as a snack, blended into smoothies, grilled as a dessert, or used in jerk marinades, pineapple rum punch, and tropical fruit salads. A true taste of Jamaican paradise.",
                farmer_id: 3, stock: 35
            },
            {
                id: 12, name: "Family Veg Box", category: "boxes", emoji: "📦",
                image: "images/Family veg box.png",
                price: 2500, unit: "/box", tag: "Best Value",
                description: "Our most popular box, perfect for a family of 4. Each weekly Family Veg Box is packed with a curated selection of the freshest seasonal vegetables straight from our partner farms. Includes callaloo, cabbage, pumpkin, escallion, thyme, scotch bonnet, and your choice of one ground provision (yellow yam or sweet potato). Everything you need to cook authentic Jamaican meals all week long. Sourced from at least 3 different verified farms to ensure variety and freshness. Delivered every Wednesday and Saturday island-wide.",
                farmer_id: 1, stock: 40
            },
            {
                id: 13, name: "Couple's Fresh Box", category: "boxes", emoji: "💚",
                image: "images/Couple's fresh box.png",
                price: 1500, unit: "/box", tag: "Perfect for 2",
                description: "Designed for households of 1–2 people, the Couple's Fresh Box gives you just the right amount of fresh produce without any waste. Each box includes a seasonal mix of 4–5 vegetables, 1–2 fruits, and a bundle of herbs (escallion and thyme). The selection changes weekly based on what our farmers are harvesting, so you always get peak-freshness produce. Great for couples, young professionals, or anyone who wants to eat healthier without overbuying. Delivered twice weekly on Tuesdays and Fridays.",
                farmer_id: 2, stock: 50
            },
            {
                id: 14, name: "Tropical Fruit Box", category: "boxes", emoji: "🍍",
                image: "images/Fruit box.png",
                price: 2000, unit: "/box", tag: "Fruit Lovers",
                description: "A vibrant box loaded with the freshest tropical fruits Jamaica has to offer. Each Tropical Fruit Box includes a dozen oranges, a ripe pineapple, a hand of bananas, and 2–3 seasonal fruits such as june plums, naseberries, star apples, or mangoes depending on what's in season. All fruits are tree-ripened and harvested within 48 hours of delivery — no cold storage, no preservatives. Perfect for juicing, snacking, fruit salads, or just enjoying the natural sweetness of Jamaican-grown fruit. Sourced from farms in Portland, St. Mary, and St. Elizabeth.",
                farmer_id: 3, stock: 30
            },
            {
                id: 15, name: "Soup & Stew Box", category: "boxes", emoji: "🍲",
                image: "images/Soup & Stew Box.png",
                price: 1800, unit: "/box", tag: "Soup Season",
                description: "Everything you need to make 2–3 big pots of authentic Jamaican soup or stew. The Soup & Stew Box includes pumpkin, yellow yam, sweet potato, cho cho, carrot, escallion, thyme, scotch bonnet, and a small bundle of pimento leaves. Enough ground provisions and seasoning vegetables to make Saturday beef soup, chicken foot soup, or a rich pumpkin cream soup from scratch. This box celebrates the heart of Jamaican home cooking and is especially popular during the cooler months. Curated by our farmers each week based on fresh availability.",
                farmer_id: 4, stock: 35
            }
        ];
        localStorage.setItem('jf_products', JSON.stringify(products));
    },

    _seedFarmers() {
        const farmers = [
            { id: 1, name: "Hyacinth Brown", location: "St. Elizabeth", emoji: "👩🏾‍🌾", bio: "30 years of farming heritage. Specialises in leafy greens and herbs.", products: ["Callaloo", "Thyme", "Escallion", "Pumpkin"], joined: "2023-01-15", earnings: 245000, farmName: "Brown Family Farm" },
            { id: 2, name: "Delroy Reid", location: "Westmoreland", emoji: "👨🏿‍🌾", bio: "Third-generation farmer growing provisions on 12 acres. Chemical-free farming advocate.", products: ["Yam", "Banana", "Gungo Peas", "Corn"], joined: "2023-02-20", earnings: 312000, farmName: "Reid Provisions" },
            { id: 3, name: "Yvette Campbell", location: "Portland", emoji: "👩🏽‍🌾", bio: "Award-winning fruit farmer. Her pineapples and oranges are island-famous.", products: ["Oranges", "Pineapple", "Citrus", "Papaya"], joined: "2023-03-10", earnings: 189000, farmName: "Campbell Fruit Farm" },
            { id: 4, name: "Junior Thompson", location: "Clarendon", emoji: "👨🏾‍🌾", bio: "Young innovative farmer using drip irrigation for the finest vegetables.", products: ["Pumpkin", "Sweet Potato", "Cabbage", "Peppers"], joined: "2023-05-01", earnings: 276000, farmName: "Thompson Farms" },
            { id: 5, name: "Marcia Williams", location: "St. Andrew", emoji: "👩🏿‍🌾", bio: "Leading organic certified farmer with a 5-acre greenhouse operation.", products: ["Ginger", "Organic Greens", "Herbs", "Microgreens"], joined: "2023-06-15", earnings: 398000, farmName: "Williams Organic" }
        ];
        localStorage.setItem('jf_farmers', JSON.stringify(farmers));
    },

    getProducts(category = 'all') {
        const products = JSON.parse(localStorage.getItem('jf_products') || '[]');
        // Sort: farmer-uploaded (newer ids / timestamp ids) appear first
        const sorted = [...products].sort((a, b) => b.id - a.id);
        if (category === 'all') return sorted;
        return sorted.filter(p => p.category === category);
    },

    getProduct(id) { return this.getProducts().find(p => p.id === parseInt(id)); },

    getFarmerProducts(farmerId) { return this.getProducts().filter(p => p.farmer_id === parseInt(farmerId)); },

    addProduct(data) {
        const products = this.getProducts();
        const newProduct = { id: Date.now(), ...data, tag: 'New', createdAt: new Date().toISOString() };
        products.push(newProduct);
        localStorage.setItem('jf_products', JSON.stringify(products));
        return newProduct;
    },

    updateProduct(id, updates) {
        const products = this.getProducts();
        const idx = products.findIndex(p => p.id === parseInt(id));
        if (idx !== -1) { products[idx] = { ...products[idx], ...updates }; localStorage.setItem('jf_products', JSON.stringify(products)); }
    },

    deleteProduct(id) {
        const products = this.getProducts().filter(p => p.id !== parseInt(id));
        localStorage.setItem('jf_products', JSON.stringify(products));
    },

    searchProducts(query) {
        const q = query.toLowerCase();
        return this.getProducts().filter(p =>
            p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
        );
    },

    getFarmers() { return JSON.parse(localStorage.getItem('jf_farmers') || '[]'); },
    getFarmer(id) { return this.getFarmers().find(f => f.id === parseInt(id)); },

    register(data) {
        const users = JSON.parse(localStorage.getItem('jf_users') || '[]');
        if (users.find(u => u.email === data.email && u.role === data.role))
            return { success: false, message: 'Email already registered.' };
        const newUser = { id: Date.now(), ...data, password: btoa(data.password), createdAt: new Date().toISOString(), orders: [] };
        if (data.role === 'farmer') {
            const farmers = this.getFarmers();
            const newFarmer = { id: Date.now() + 1, name: `${data.firstName} ${data.lastName}`, farmName: data.farmName || `${data.firstName}'s Farm`, location: data.parish || 'Jamaica', emoji: '👨🏾‍🌾', bio: data.bio || 'Partner farmer on JaFresh Produce.', products: [], joined: new Date().toISOString().split('T')[0], earnings: 0 };
            farmers.push(newFarmer);
            localStorage.setItem('jf_farmers', JSON.stringify(farmers));
            newUser.farmer_id = newFarmer.id;
        }
        users.push(newUser);
        localStorage.setItem('jf_users', JSON.stringify(users));
        return { success: true, user: newUser };
    },

    login(email, password, role) {
        const users = JSON.parse(localStorage.getItem('jf_users') || '[]');
        const user = users.find(u => u.email === email && u.role === role);
        if (!user) return { success: false, message: 'No account found with this email.' };
        if (user.password !== btoa(password)) return { success: false, message: 'Incorrect password.' };
        return { success: true, user };
    },

    getCurrentUser() { const d = localStorage.getItem('jf_current_user'); return d ? JSON.parse(d) : null; },
    setCurrentUser(user) { localStorage.setItem('jf_current_user', JSON.stringify(user)); },
    logout() { localStorage.removeItem('jf_current_user'); },

    getCart() { return JSON.parse(localStorage.getItem('jf_cart') || '[]'); },

    addToCart(productId) {
        const cart = this.getCart();
        const product = this.getProduct(parseInt(productId));
        if (!product) { console.warn('Product not found:', productId); return; }
        const existing = cart.find(i => parseInt(i.id) === parseInt(productId));
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: product.id,
                qty: 1,
                name: product.name,
                price: product.price,
                emoji: product.emoji,
                unit: product.unit,
                farmer_id: product.farmer_id  // ← always store farmer_id in cart
            });
        }
        localStorage.setItem('jf_cart', JSON.stringify(cart));
        return cart;
    },

    removeFromCart(productId) { localStorage.setItem('jf_cart', JSON.stringify(this.getCart().filter(i => i.id !== productId))); },

    updateQty(productId, qty) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === productId);
        if (item) item.qty = Math.max(1, qty);
        localStorage.setItem('jf_cart', JSON.stringify(cart));
    },

    clearCart() { localStorage.setItem('jf_cart', JSON.stringify([])); },
    getCartTotal() { return this.getCart().reduce((s, i) => s + i.price * i.qty, 0); },
    getCartCount() { return this.getCart().reduce((s, i) => s + i.qty, 0); },

    placeOrder(orderData) {
        const orders = JSON.parse(localStorage.getItem('jf_orders') || '[]');

        // Use farmer_id already stored in cart — fallback to product lookup
        const cartItems = this.getCart().map(item => {
            if (item.farmer_id) return item; // already has farmer_id ✅
            const product = this.getProduct(parseInt(item.id));
            return { ...item, farmer_id: product ? product.farmer_id : null };
        });

        const newOrder = {
            id: 'JF-' + Date.now(),
            ...orderData,
            items: cartItems,
            total: this.getCartTotal(),
            status: 'Processing',
            date: new Date().toLocaleDateString('en-JM', { day: 'numeric', month: 'short', year: 'numeric' }),
            createdAt: new Date().toISOString()
        };

        console.log('📦 New order placed:', newOrder.id);
        console.log('📦 Items with farmer_id:', cartItems.map(i => ({ name: i.name, farmer_id: i.farmer_id })));

        orders.push(newOrder);
        localStorage.setItem('jf_orders', JSON.stringify(orders));

        // Update user's order history
        const users = JSON.parse(localStorage.getItem('jf_users') || '[]');
        const user = users.find(u => u.id === orderData.userId);
        if (user) {
            user.orders = user.orders || [];
            user.orders.push(newOrder.id);
            localStorage.setItem('jf_users', JSON.stringify(users));
            this.setCurrentUser(user);
        }

        this.clearCart();
        return newOrder;
    },

    getUserOrders(userId) {
        const orders = JSON.parse(localStorage.getItem('jf_orders') || '[]');
        return orders.filter(o => o.userId === userId);
    },

    // ── SUBSCRIPTIONS ─────────────────────────────
    saveSubscription(userId, subData) {
        const subs = JSON.parse(localStorage.getItem('jf_subscriptions') || '{}');
        subs[userId] = subData;
        localStorage.setItem('jf_subscriptions', JSON.stringify(subs));
    },

    getSubscription(userId) {
        const subs = JSON.parse(localStorage.getItem('jf_subscriptions') || '{}');
        return subs[userId] || null;
    },

    cancelSubscription(userId) {
        const subs = JSON.parse(localStorage.getItem('jf_subscriptions') || '{}');
        if (subs[userId]) { subs[userId].status = 'Cancelled'; }
        localStorage.setItem('jf_subscriptions', JSON.stringify(subs));
    },

    updateOrderStatus(orderId, newStatus, farmerId) {
        const orders = JSON.parse(localStorage.getItem('jf_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            order.updatedAt = new Date().toISOString();
            localStorage.setItem('jf_orders', JSON.stringify(orders));
        }
    },

    reduceStockForOrder(orderId, farmerId) {
        const orders = JSON.parse(localStorage.getItem('jf_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (!order || order.stockReduced) return; // prevent double reduction

        const products = JSON.parse(localStorage.getItem('jf_products') || '[]');

        // Only reduce stock for items belonging to this farmer
        order.items?.forEach(item => {
            if (parseInt(item.farmer_id) === parseInt(farmerId)) {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    product.stock = Math.max(0, product.stock - item.qty);
                }
            }
        });

        // Mark order as stock reduced so we don't reduce twice
        order.stockReduced = true;
        localStorage.setItem('jf_products', JSON.stringify(products));
        localStorage.setItem('jf_orders', JSON.stringify(orders));
    },

    getFarmerOrders(farmerId) {
        const orders = JSON.parse(localStorage.getItem('jf_orders') || '[]');
        const fid = String(farmerId); // normalise to string for comparison
        return orders.filter(o =>
            o.items && o.items.some(item => String(item.farmer_id) === fid)
        ).map(o => ({
            ...o,
            farmerItems: o.items.filter(item => String(item.farmer_id) === fid),
            farmerTotal: o.items
                .filter(item => String(item.farmer_id) === fid)
                .reduce((sum, item) => sum + (item.price * item.qty), 0),
            customerName: o.customerName || 'Customer'
        }));
    }
};