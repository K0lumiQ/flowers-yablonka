// Хранилище: корзина, избранное, пользователь, заказы. Всё в localStorage, с запасным вариантом в памяти.
(function () {
  var mem = {};
  function read(key, def) {
    try { var v = localStorage.getItem('yab_' + key); return v ? JSON.parse(v) : def; }
    catch (e) { return key in mem ? mem[key] : def; }
  }
  function write(key, val) {
    mem[key] = val;
    try { localStorage.setItem('yab_' + key, JSON.stringify(val)); } catch (e) {}
    document.dispatchEvent(new CustomEvent('store', { detail: key }));
  }

  var Store = {
    // ---- корзина ----
    cart: function () { return read('cart', null) || this.seed(); },
    seed: function () {
      // первый запуск: в корзине два букета, как в макете
      var c = [{ pid: 2, size: 'M', qty: 1 }, { pid: 1, size: 'M', qty: 1 }];
      write('cart', c);
      return c;
    },
    setCart: function (c) { write('cart', c); },
    addToCart: function (pid, size, qty) {
      var c = this.cart(), f = c.filter(function (i) { return i.pid === pid && i.size === size; })[0];
      if (f) f.qty += qty || 1; else c.push({ pid: pid, size: size, qty: qty || 1 });
      this.setCart(c);
    },
    setQty: function (pid, size, qty) {
      var c = this.cart();
      c.forEach(function (i) { if (i.pid === pid && i.size === size) i.qty = qty; });
      this.setCart(c.filter(function (i) { return i.qty > 0; }));
    },
    removeFromCart: function (pid, size) {
      this.setCart(this.cart().filter(function (i) { return !(i.pid === pid && i.size === size); }));
    },
    clearCart: function () { write('cart', []); write('addons', []); write('promo', null); },
    cartCount: function () { return this.cart().reduce(function (s, i) { return s + i.qty; }, 0); },
    addons: function () { return read('addons', []); },
    toggleAddon: function (id) {
      var a = this.addons(), i = a.indexOf(id);
      if (i < 0) a.push(id); else a.splice(i, 1);
      write('addons', a);
      return i < 0;
    },
    promo: function () { return read('promo', null); },
    setPromo: function (code) { write('promo', code); },
    totals: function () {
      var goods = 0, self = this;
      this.cart().forEach(function (i) { goods += window.priceFor(window.productById(i.pid), i.size) * i.qty; });
      this.addons().forEach(function (id) {
        var a = window.ADDONS.filter(function (x) { return x.id === id; })[0];
        if (a) goods += a.price;
      });
      var disc = self.promo() ? Math.min(window.PROMOS[self.promo()] || 0, goods) : 0;
      return { goods: goods, discount: disc, total: goods - disc };
    },

    // ---- избранное ----
    favs: function () { return read('favs', [1, 2, 3, 4]); },
    isFav: function (id) { return this.favs().indexOf(id) >= 0; },
    toggleFav: function (id) {
      var f = this.favs(), i = f.indexOf(id);
      if (i < 0) f.push(id); else f.splice(i, 1);
      write('favs', f);
      return i < 0;
    },

    // ---- пользователь ----
    user: function () { return read('user', null); },
    setUser: function (u) { write('user', u); },
    logout: function () { write('user', null); },

    // ---- заказы ----
    orders: function () { return read('orders', []); },
    addOrder: function (o) { var l = this.orders(); l.unshift(o); write('orders', l); },
    updateOrder: function (id, patch) {
      var l = this.orders();
      l.forEach(function (o) { if (o.id === id) for (var k in patch) o[k] = patch[k]; });
      write('orders', l);
    },
    order: function (id) { return this.orders().filter(function (o) { return o.id === id; })[0]; },
    lastOrderId: function () { return read('lastOrder', null); },
    setLastOrder: function (id) { write('lastOrder', id); },

    // ---- адреса, отзывы, уведомления, недавний поиск ----
    addresses: function () { return read('addresses', [{ title: 'Домашний', text: 'г. Горячий ключ, ул. Ленина, д. 10, кв. 88, 3 подъезд, 8 этаж, домофон 88, 607223' }]); },
    setAddresses: function (a) { write('addresses', a); },
    reviews: function () { return read('reviews', []); },
    addReview: function (r) { var l = this.reviews(); l.unshift(r); write('reviews', l); },
    notif: function () { return read('notif', { orders: true, promo: true, news: false }); },
    setNotif: function (n) { write('notif', n); },
    recent: function () { return read('recent', ['Букет невесты', 'Пионы', 'Тюльпаны']); },
    addRecent: function (q) {
      var r = this.recent().filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); });
      r.unshift(q); write('recent', r.slice(0, 6));
    },
    reset: function () { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('yab_') === 0) localStorage.removeItem(k); }); } catch (e) {} mem = {}; }
  };
  window.Store = Store;
})();
