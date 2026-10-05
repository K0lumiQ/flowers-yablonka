// Общая «оболочка»: иконки, таб-бар, шапки, тосты, шторки, анимации. Подключается на каждой странице после data.js и store.js.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  window.$ = $; window.$$ = $$;

  window.rub = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; };
  window.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- иконки ---------- */
  var s = function (body, vb) { return '<svg viewBox="' + (vb || '0 0 24 24') + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>'; };
  var petal = function (a) { return '<path d="M12 12C8.6 11.2 7 8.6 8 6.2c.9-2 3.2-2.4 4-1.2.8-1.2 3-.8 4 1.2 1 2.4-.6 5-4 5.8z" transform="rotate(' + a + ' 12 12) scale(.9) translate(1.3 1.3)"/>'; };
  window.ICON = {
    home: s(petal(0) + petal(72) + petal(144) + petal(216) + petal(288)),
    catalog: s('<path d="M3 6h7M3 12h5M3 18h7"/><circle cx="15" cy="12" r="5"/><path d="m19 16 3 3"/>'),
    cart: s('<path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
    heart: s('<path d="M12 20s-7.5-4.6-8.9-9.4C2.2 7.4 4.3 5 7 5c1.9 0 3.5 1.1 5 3 1.5-1.9 3.1-3 5-3 2.7 0 4.8 2.4 3.9 5.6C19.5 15.400 12 20 12 20z"/>'),
    user: s('<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="10" r="3.3"/><path d="M5.800 18.500c1.600-2.600 3.700-3.800 6.200-3.800s4.600 1.200 6.200 3.800"/>'),
    pin: s('<path d="M12 21s-6.500-6-6.500-11a6.500 6.500 0 0 1 13 0c0 5-6.500 11-6.500 11z"/><circle cx="12" cy="10" r="2.400"/>'),
    search: s('<circle cx="11" cy="11" r="6.500"/><path d="m20 20-4.400-4.400"/>'),
    back: s('<path d="M15 5l-7 7 7 7"/>'),
    backArrow: s('<path d="M20 12H5M11 5l-7 7 7 7"/>'),
    close: s('<path d="M6 6l12 12M18 6 6 18"/>'),
    chev: s('<path d="m9 5 7 7-7 7"/>'),
    down: s('<path d="m5 9 7 7 7-7"/>'),
    trash: s('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.500l2.900 6.100 6.600.8-4.900 4.600 1.300 6.600L12 17.300l-5.900 3.300 1.300-6.600L2.500 9.400l6.600-.8z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.8 5v5.200l4 2.400-.8 1.300-4.800-2.900V7z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.600 10.800a15 15 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.25c1.100.37 2.300.57 3.600.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.300.2 2.500.57 3.600a1 1 0 0 1-.25 1z"/></svg>',
    cal: s('<rect x="3.500" y="5" width="17" height="15" rx="2.500"/><path d="M3.500 10h17M8 3v4M16 3v4"/>'),
    filter: s('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
    grid: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
    rows: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/></svg>',
    share: s('<path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'),
    check: s('<path d="m5 12.500 4.500 4.500L19 7"/>'),
    edit: s('<path d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4"/>'),
    up: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 21h4V9H2v12zm20-11a2 2 0 0 0-2-2h-6.300l1-4.600v-.3a1.500 1.500 0 0 0-.4-1L13.200 1 6.600 7.600A2 2 0 0 0 6 9v10a2 2 0 0 0 2 2h9a2 2 0 0 0 1.800-1.200l3-7A2 2 0 0 0 22 12v-2z"/></svg>',
    down2: '<svg viewBox="0 0 24 24" fill="currentColor" style="transform:scaleY(-1)"><path d="M2 21h4V9H2v12zm20-11a2 2 0 0 0-2-2h-6.300l1-4.600v-.3a1.500 1.500 0 0 0-.4-1L13.200 1 6.600 7.600A2 2 0 0 0 6 9v10a2 2 0 0 0 2 2h9a2 2 0 0 0 1.800-1.200l3-7A2 2 0 0 0 22 12v-2z"/></svg>',
    box: s('<path d="M3 7.500 12 3l9 4.500v9L12 21l-9-4.500v-9zM3 7.500l9 4.500 9-4.500M12 12v9"/>'),
    bell: s('<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4l2-2zM10 21h4"/>'),
    ruble: s('<path d="M8 21V4h5.500a4 4 0 0 1 0 8H6M6 16h9"/>'),
    lang: s('<path d="M3 5h9M7.500 3v2M5 5c1 4 3 7 6 9M11 5c-1 4-3 7-7 9M13 21l4.500-11L22 21M14.500 17.500h6"/>'),
    file: s('<path d="M6 3h8l5 5v13H6V3zM14 3v5h5"/>'),
    info: s('<circle cx="12" cy="12" r="9.500"/><path d="M12 11v6M12 7.500v.1"/>'),
    gear: s('<path d="M12 2.500 20 7v10l-8 4.500L4 17V7l8-4.500z"/><circle cx="12" cy="12" r="3"/>'),
    card: s('<rect x="3" y="5.500" width="18" height="13" rx="3"/><path d="M3 10h18M15 15h3"/>', '0 0 24 24'),
    wallet: s('<path d="M4 7.500A2.500 2.500 0 0 1 6.500 5H18v3M4 7.500V18a2 2 0 0 0 2 2h13V8H6.500A2.500 2.500 0 0 1 4 7.500z"/><circle cx="16" cy="14" r="1" fill="currentColor"/>'),
    lens: s('<circle cx="11" cy="11" r="7"/><path d="m21 21-5-5"/>'),
    sadBag: '<svg viewBox="0 0 96 96"><path d="M30 34h36l5 48H25l5-48z" fill="currentColor"/><path d="M38 34v-5a10 10 0 0 1 20 0v5" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="40" cy="56" r="3" fill="#777"/><circle cx="56" cy="56" r="3" fill="#777"/><path d="M42 70c0-8 12-8 12 0" fill="none" stroke="#777" stroke-width="3" stroke-linecap="round"/></svg>',
    sadLens: '<svg viewBox="0 0 96 96"><circle cx="42" cy="42" r="28" fill="none" stroke="currentColor" stroke-width="9"/><path d="m64 64 20 20" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><circle cx="34" cy="38" r="3" fill="#777"/><circle cx="50" cy="38" r="3" fill="#777"/><path d="M33 52c6-3 12-3 18 0" fill="none" stroke="#777" stroke-width="3" stroke-linecap="round"/></svg>',
    sadHeart: '<svg viewBox="0 0 96 96"><path d="M48 80S16 60 14 38C13 24 26 16 36 20c5 2 9 6 12 11 3-5 7-9 12-11 10-4 23 4 22 18-2 22-34 42-34 42z" fill="currentColor"/><circle cx="38" cy="44" r="3" fill="#777"/><circle cx="58" cy="44" r="3" fill="#777"/><path d="M40 60c5-5 11-5 16 0" fill="none" stroke="#777" stroke-width="3" stroke-linecap="round"/></svg>',
    faceid: s('<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 9v2M15 9v2M12 9v4h-1M9 16c1.700 1.300 4.300 1.300 6 0"/>'),
    sideBtn: s('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M21 9h-4M19 7l-2 2 2 2"/>'),
    logo: '<svg viewBox="0 0 80 40" fill="none" stroke="currentColor" stroke-width="1.300" stroke-linecap="round"><path d="M40 22c-6-1-10-6-8-10s7-4 8-1c1-3 7-3 8 1s-2 9-8 10z"/><path d="M33 20c-5-1-9 2-8 6M47 20c5-1 9 2 8 6"/><path d="M36 14c2-2 5-2 8 0M38 18c2 1 4 1 6 0M40 26c-3 3-8 4-12 3M40 26c3 3 8 4 12 3"/><path d="M22 14c3-4 7-3 9 0M49 14c2-3 6-4 9 0"/><circle cx="27" cy="11" r="3.500"/><circle cx="53" cy="11" r="3.500"/></svg>'
  };
  // странные дробные значения в путях выше нужны только для плавности линий; сброс лишних нулей не требуется

  /* ---------- шаблоны ---------- */
  window.brandBar = function () {
    return '<header class="brandbar"><a class="icon-btn" href="salons.html" aria-label="Салоны">' + ICON.pin + '</a>' +
      '<a class="logo" href="index.html" aria-label="Цветы у яблоньки">' + ICON.logo + '<span><i>•</i>Цветы у яблоньки<i>•</i></span></a>' +
      '<a class="icon-btn" href="search.html" aria-label="Поиск">' + ICON.search + '</a></header>';
  };
  window.topBar = function (o) {
    var l = o.back ? '<a class="icon-btn" href="' + (o.back === true ? 'javascript:history.back()' : o.back) + '" aria-label="Назад">' + ICON.backArrow + '</a>' : '<span></span>';
    var r = o.close ? '<a class="icon-btn" href="' + o.close + '" aria-label="Закрыть">' + ICON.close + '</a>' : (o.right || '<span></span>');
    return '<div class="topbar">' + l + '<div class="t">' + esc(o.title) + (o.sub ? '<span class="sub">' + esc(o.sub) + '</span>' : '') + '</div>' + r + '</div>';
  };
  window.stars = function (n) {
    var h = '<span class="stars">';
    for (var i = 1; i <= 5; i++) h += '<span class="' + (i <= n ? '' : 'off') + '" style="display:inline-flex">' + ICON.star.replace('<svg', '<svg style="width:14px;height:14px"') + '</span>';
    return h + '</span>';
  };

  window.productCard = function (p, mode, delay) {
    var tag = p.day ? 'Букет дня' : p.new ? 'Новинка' : p.hit ? 'Хит' : '';
    var fav = Store.isFav(p.id);
    var heart = '<button class="heart' + (fav ? ' on' : '') + '" data-fav="' + p.id + '" aria-label="В избранное">' + ICON.heart + '</button>';
    var st = delay != null ? ' style="animation:slideRow .5s var(--ease) ' + delay + 'ms both"' : '';
    if (mode === 'list') {
      return '<a class="card" href="product.html?id=' + p.id + '"' + st + '><div class="ph"><img src="' + p.photo + '" alt="' + esc(p.name) + '" loading="lazy">' + heart + (tag ? '<span class="tag">' + tag + '</span>' : '') + '</div>' +
        '<div><h3 class="nm">' + esc(p.name) + '</h3><p class="comp">' + esc(p.comp.slice(0, 5).map(function (c) { return c.split(' — ')[0]; }).join(', ')) + '</p><span class="price-pill">от ' + rub(p.price) + '</span></div></a>';
    }
    return '<a class="card" href="product.html?id=' + p.id + '"' + st + '><div class="ph"><img src="' + p.photo + '" alt="' + esc(p.name) + '" loading="lazy">' + heart + (tag ? '<span class="tag">' + tag + '</span>' : '') + '</div>' +
      '<h3 class="nm">' + esc(p.name) + '</h3><span class="price-pill">от ' + rub(p.price) + '</span></a>';
  };

  /* ---------- таб-бар ---------- */
  function buildTabs() {
    var body = document.body, active = body.getAttribute('data-tab');
    if (body.hasAttribute('data-notab')) return;
    var tabs = [['home', 'Главная', 'index.html'], ['catalog', 'Каталог', 'catalog.html'], ['cart', 'Корзина', 'cart.html'], ['fav', 'Избранное', 'favorites.html'], ['profile', 'Профиль', 'profile.html']];
    var icons = { home: ICON.home, catalog: ICON.catalog, cart: ICON.cart, fav: ICON.heart, profile: ICON.user };
    var nav = document.createElement('nav');
    nav.className = 'tabbar';
    nav.innerHTML = tabs.map(function (t) {
      return '<a class="tab' + (t[0] === active ? ' active' : '') + '" href="' + t[2] + '">' + icons[t[0]] + '<span>' + t[1] + '</span>' + (t[0] === 'cart' ? '<span class="badge" id="cartBadge"></span>' : '') + '</a>';
    }).join('');
    $('.app').appendChild(nav);
    updateBadge(true);
  }
  var lastCount = null;
  function updateBadge(first) {
    var b = $('#cartBadge'); if (!b) return;
    var n = Store.cartCount();
    b.textContent = n; b.style.display = n ? '' : 'none';
    if (!first && lastCount !== null && n > lastCount) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    lastCount = n;
  }
  document.addEventListener('store', function (e) { if (e.detail === 'cart') updateBadge(); });

  /* ---------- тост ---------- */
  var toastT;
  window.toast = function (msg) {
    var t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; void t.offsetWidth; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200);
  };

  /* ---------- шторка ---------- */
  window.Sheet = {
    open: function (el) {
      var ov = $('.overlay');
      if (!ov) { ov = document.createElement('div'); ov.className = 'overlay'; document.body.appendChild(ov); }
      ov.onclick = function () { Sheet.close(el); };
      requestAnimationFrame(function () { ov.classList.add('open'); el.classList.add('open'); });
    },
    close: function (el) {
      var ov = $('.overlay'); if (ov) ov.classList.remove('open');
      el.classList.remove('open');
    }
  };

  /* ---------- полёт товара в корзину ---------- */
  window.flyToCart = function (src, fromEl) {
    var to = $('.tab[href="cart.html"] svg') || $('#cartBtn'); if (!to || !fromEl) return;
    var a = fromEl.getBoundingClientRect(), b = to.getBoundingClientRect();
    var img = document.createElement('img'); img.src = src; img.className = 'fly';
    img.style.left = a.left + a.width / 2 - 28 + 'px'; img.style.top = a.top + a.height / 2 - 28 + 'px';
    document.body.appendChild(img);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    img.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * .6 + 'px,' + (dy * .6 - 90) + 'px) scale(.8)', opacity: 1, offset: .5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.2)', opacity: .3 }],
      { duration: 800, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () { img.remove(); };
  };

  /* ---------- конфетти ---------- */
  window.confetti = function () {
    var box = document.createElement('div'); box.className = 'confetti';
    var cols = ['#cf225d', '#f7a8c4', '#f7dc7f', '#bcd0f5', '#2db69b', '#fff0f5'];
    for (var i = 0; i < 46; i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % cols.length];
      p.style.animationDuration = 1.8 + Math.random() * 1.6 + 's'; p.style.animationDelay = Math.random() * .5 + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(p);
    }
    document.body.appendChild(box); setTimeout(function () { box.remove(); }, 4200);
  };

  /* ---------- плавное появление ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  window.observeReveal = function (root) {
    $$('.reveal:not(.in)', root).forEach(function (el, i) {
      if (!io) { el.classList.add('in'); return; }
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms'; io.observe(el);
    });
  };

  /* ---------- общие обработчики ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.btn');
    if (b && !b.disabled) {
      var r = document.createElement('span'), rect = b.getBoundingClientRect(), d = Math.max(rect.width, rect.height);
      r.className = 'ripple'; r.style.width = r.style.height = d + 'px';
      r.style.left = e.clientX - rect.left - d / 2 + 'px'; r.style.top = e.clientY - rect.top - d / 2 + 'px';
      b.appendChild(r); setTimeout(function () { r.remove(); }, 650);
    }
    var h = e.target.closest('[data-fav]');
    if (h) {
      e.preventDefault(); e.stopPropagation();
      var id = Number(h.getAttribute('data-fav')), on = Store.toggleFav(id);
      $$('[data-fav="' + id + '"]').forEach(function (x) { x.classList.toggle('on', on); });
      toast(on ? 'Добавлено в избранное' : 'Убрано из избранного');
      document.dispatchEvent(new CustomEvent('favchange', { detail: id }));
    }
  }, true);

  document.addEventListener('DOMContentLoaded', function () {
    buildTabs();
    // анимируем появление блоков после того, как страничный скрипт их отрисовал
    setTimeout(function () { observeReveal(document); }, 30);
  });
  window.rerender = function () { setTimeout(function () { observeReveal(document); }, 30); };
})();
