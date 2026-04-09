// ══════════════════════════════════════════════
//  JaFresh Produce — EmailJS Notifications
//  Triggers: Registration, Order Confirmation
// ══════════════════════════════════════════════

const EMAIL = {

  // ── YOUR EMAILJS CREDENTIALS ──────────────────
  // Replace these after setting up emailjs.com
  SERVICE_ID: 'YOUR_SERVICE_ID',    // e.g. 'service_abc123'
  PUBLIC_KEY:  'YOUR_PUBLIC_KEY',   // e.g. 'AbcXyz123'

  TEMPLATES: {
    WELCOME: 'template_welcome',
    ORDER:   'template_order',
  },

  // ── INIT ──────────────────────────────────────
  init() {
    if (typeof emailjs !== 'undefined') {
      emailjs.init(this.PUBLIC_KEY);
      console.log('✅ EmailJS ready');
    } else {
      console.warn('⚠️ EmailJS script not loaded');
    }
  },

  // ── 1. WELCOME EMAIL — fires on registration ──
  async sendWelcome(user) {
    try {
      await emailjs.send(this.SERVICE_ID, this.TEMPLATES.WELCOME, {
        to_email:  user.email,
        to_name:   user.firstName,
        from_name: 'JaFresh Produce',
        reply_to:  'jafresh.produce@gmail.com',
        message:   `Hi ${user.firstName}! Welcome to JaFresh Produce — Jamaica's freshest farm-to-door platform. Your account is ready. Browse fresh produce from our partner farmers and enjoy your first delivery within 24 hours of ordering!`,
      });
      console.log('✅ Welcome email sent →', user.email);
    } catch (err) {
      console.error('❌ Welcome email failed:', err);
    }
  },

  // ── 2. ORDER CONFIRMATION — fires on checkout ──
  async sendOrderConfirmation(user, order) {
    try {
      console.log('📧 Sending order email to:', user.email);

      const items = (order.items || [])
          .map(i => `${i.name} x${i.qty} — J$${((i.price || 0) * i.qty).toLocaleString()}`)
          .join('\n');

      await emailjs.send(this.SERVICE_ID, this.TEMPLATES.ORDER, {
        to_email:         String(user.email),
        to_name:          String(user.firstName),
        order_id:         String(order.id),
        order_date:       String(order.date || new Date().toLocaleDateString('en-JM', { day: 'numeric', month: 'short', year: 'numeric' })),
        order_items:      String(items || 'Produce items'),
        order_total:      `J$${(order.total || 0).toLocaleString()}`,
        delivery_address: String(`${order.address || ''}, ${order.parish || ''}`),
        message:          `Your order ${order.id} is confirmed! Our farmers are preparing your fresh produce for delivery within 24-48 hours.`,
      });

      console.log('✅ Order email sent →', user.email);
    } catch (err) {
      console.error('❌ Order email failed:', err);
    }
  },
};