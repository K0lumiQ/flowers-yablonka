// Страницы заказа: корзина, оформление (3 шага), результат, страница заказа
(function () {
  var page = document.body.getAttribute('data-page');
  var root = document.getElementById('page');
  var qs = new URLSearchParams(location.search);
  var views = {};

  var plural = function (n, a, b, c) { var m = n % 10, h = n % 100; return h > 10 && h < 15 ? c : m === 1 ? a : m > 1 && m < 5 ? b : c; };
  var sizeInfo = function (id) { var s = SIZES.filter(function (x) { return x.id === id; })[0]; return s.name + ' ' + s.label + ' (' + s.sm + ' см)'; };
  var compShort = function (p) { return p.comp.map(function (c) { return c.split(' — ')[0]; }).join(', '); };

  function animateNumber(el, to) {
    var from = Number((el.getAttribute('data-v') || to)), t0 = performance.now(), d = 450;
    el.setAttribute('data-v', to);
    (function step(t) { var k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = rub(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); })(t0);
  }

  /* ======================= КОРЗИНА ======================= */
  views.cart = function () {
    var promoOpen = false;
    function draw() {
      var cart = Store.cart(), t = Store.totals(), count = cart.reduce(function (s, i) { return s + i.qty; }, 0);
      if (!cart.length) {
        root.innerHTML = topBar({ title: 'Корзина' }) + '<div class="empty">' + ICON.sadBag + '<h3>Ой, пусто</h3><p>Ваша корзина пуста, откройте «Каталог» и выберите понравившийся товар</p><a class="btn" href="catalog.html">В каталог</a></div>';
        return;
      }
      var items = cart.map(function (i, k) {
        var p = productById(i.pid), pr = priceFor(p, i.size);
        return '<div class="citem" data-k="' + i.pid + '|' + i.size + '" style="animation-delay:' + k * 70 + 'ms"><div class="del" data-del>' + ICON.trash + 'Удалить</div>' +
          '<div class="in"><a href="product.html?id=' + p.id + '"><img src="' + p.photo + '" alt=""></a><div><h3>' + esc(p.name) + '</h3><div class="sz">' + sizeInfo(i.size) + '</div><div class="cp">' + esc(compShort(p)) + '</div>' +
          '<div class="bt"><div class="qty sm"><button data-q="-1" ' + (i.qty <= 1 ? '' : '') + ' aria-label="Меньше">−</button><b>' + i.qty + '</b><button data-q="1" aria-label="Больше">+</button></div><span class="pr">' + rub(pr * i.qty) + '</span></div></div></div></div>';
      }).join('');
      var promo = Store.promo();
      var promoBlock = promo ? '<div class="promo-on"><div>Промокод<small>Ваша скидка ' + rub(t.discount) + '</small></div><button class="x" data-promo-off aria-label="Убрать промокод">×</button></div>' :
        '<button class="link-row" id="promoToggle"><span>Применить промокод</span>' + ICON.chev + '</button>' + (promoOpen ? '<div class="promo-form"><input class="input" id="promoIn" placeholder="Введите промокод" autocapitalize="characters"><button class="btn sm" id="promoGo" style="width:auto">Применить</button></div><div class="promo-msg" id="promoMsg">Подсказка для демо: ЯБЛОНЬКА</div>' : '');
      var addons = '<h2 class="h2" style="font-size:22px;padding-top:12px">Добавить к заказу?</h2><div class="addons">' + ADDONS.map(function (a) {
        var on = Store.addons().indexOf(a.id) >= 0;
        return '<button class="addon' + (on ? ' added' : '') + '" data-addon="' + a.id + '"><span class="ic">' + a.icon + '</span><span><div class="nm">' + a.name + '</div><span class="price-pill">' + (on ? '✓ ' : '') + rub(a.price) + '</span></span></button>';
      }).join('') + '</div>';
      root.innerHTML = topBar({ title: 'Корзина' }) + '<h1 class="cart-title">' + count + ' ' + plural(count, 'товар', 'товара', 'товаров') + ' на <span id="tt1">' + rub(t.goods) + '</span></h1>' + items + promoBlock + addons;
      var bar = document.querySelector('.cartbar'); if (!bar) { bar = document.createElement('div'); bar.className = 'cartbar'; document.querySelector('.app').appendChild(bar); }
      bar.innerHTML = '<a class="btn" href="checkout.html">Оформить заказ на <span class="num-anim" id="ct" data-v="' + t.total + '">' + rub(t.total) + '</span></a>';
      root.classList.add('has-bar');
      bindSwipe();
    }
    function bindSwipe() {
      Array.prototype.forEach.call(document.querySelectorAll('.citem'), function (row) {
        var inn = row.querySelector('.in'), x0 = null, dx = 0;
        inn.addEventListener('pointerdown', function (e) { if (e.target.closest('button,a')) return; x0 = e.clientX; dx = 0; inn.style.transition = 'none'; inn.setPointerCapture(e.pointerId); });
        inn.addEventListener('pointermove', function (e) { if (x0 === null) return; dx = Math.min(0, Math.max(-100, e.clientX - x0 + (inn.classList.contains('open') ? -100 : 0))); inn.style.transform = 'translateX(' + dx + 'px)'; });
        function end() { if (x0 === null) return; x0 = null; inn.style.transition = ''; var open = dx < -50; inn.classList.toggle('open', open); inn.style.transform = open ? 'translateX(-100px)' : ''; }
        inn.addEventListener('pointerup', end); inn.addEventListener('pointercancel', end);
      });
    }
    draw();
    root.addEventListener('click', function (e) {
      var row = e.target.closest('.citem'), k = row && row.getAttribute('data-k').split('|');
      var q = e.target.closest('[data-q]');
      if (q && row) {
        var item = Store.cart().filter(function (i) { return i.pid === Number(k[0]) && i.size === k[1]; })[0], n = item.qty + Number(q.getAttribute('data-q'));
        if (n < 1) { removeRow(row, k); return; }
        Store.setQty(Number(k[0]), k[1], n); refreshRow(row, item.pid, item.size, n); return;
      }
      if (e.target.closest('[data-del]') && row) { removeRow(row, k); return; }
      var ad = e.target.closest('[data-addon]');
      if (ad) { var on = Store.toggleAddon(ad.getAttribute('data-addon')); ad.classList.toggle('added', on); var pp = ad.querySelector('.price-pill'); pp.textContent = (on ? '✓ ' : '') + rub(ADDONS.filter(function (a) { return a.id === ad.getAttribute('data-addon'); })[0].price); refreshTotals(); toast(on ? 'Добавлено к заказу' : 'Убрано из заказа'); return; }
      if (e.target.closest('#promoToggle')) { promoOpen = !promoOpen; draw(); var i = document.getElementById('promoIn'); if (i) i.focus(); return; }
      if (e.target.closest('[data-promo-off]')) { Store.setPromo(null); draw(); return; }
      if (e.target.closest('#promoGo')) {
        var inp = document.getElementById('promoIn'), code = inp.value.trim().toUpperCase(), msg = document.getElementById('promoMsg');
        if (PROMOS[code]) { Store.setPromo(code); promoOpen = false; draw(); toast('Промокод применён'); }
        else { inp.classList.remove('err'); void inp.offsetWidth; inp.classList.add('err'); msg.className = 'promo-msg'; msg.textContent = 'Промокод не найден'; }
      }
    });
    function refreshRow(row, pid, size, n) {
      row.querySelector('.qty b').textContent = n; row.querySelector('.qty b').classList.remove('tick'); void row.querySelector('.qty b').offsetWidth; row.querySelector('.qty b').classList.add('tick');
      row.querySelector('.pr').textContent = rub(priceFor(productById(pid), size) * n); refreshTotals();
    }
    function refreshTotals() {
      var t = Store.totals(), c = Store.cartCount(), h = document.querySelector('.cart-title');
      if (h) h.firstChild.nodeValue = c + ' ' + plural(c, 'товар', 'товара', 'товаров') + ' на ';
      var a = document.getElementById('tt1'); if (a) animateNumber(a, t.goods);
      var b = document.getElementById('ct'); if (b) animateNumber(b, t.total);
      var s = document.querySelector('.promo-on small'); if (s) s.textContent = 'Ваша скидка ' + rub(t.discount);
    }
    function removeRow(row, k) {
      row.classList.add('out'); Store.removeFromCart(Number(k[0]), k[1]);
      setTimeout(function () { if (!Store.cart().length) { var b = document.querySelector('.cartbar'); if (b) b.remove(); root.classList.remove('has-bar'); draw(); } else { row.remove(); refreshTotals(); } }, 380);
    }
  };

  /* ======================= ОФОРМЛЕНИЕ ======================= */
  views.checkout = function () {
    if (!Store.cart().length) { location.replace('cart.html'); return; }
    var user = Store.user() || {};
    var d = new Date(); d.setDate(d.getDate() + 1);
    var iso = function (x) { return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
    var S = {
      step: 1, back: false, delivery: 'city', contactless: false, useSaved: true, street: 'г. Горячий ключ, ул. Ленина, д. 10', flat: '88', zip: '607223', porch: '3', floor: '8', intercom: '88', comment: '',
      date: iso(d), mode: 'range', slot: 'day', from: '09:00', to: '12:00', exact: '09:00',
      who: 'me', name: user.name || 'Сергей', phone: user.phone || '+7 (950) 793-23-22', email: user.email || 'novikov@artsurf.pro', card: false, pay: 'apple'
    };
    var saved = Store.addresses()[0];
    function fmtDate(v) { var x = new Date(v + 'T12:00'); return x.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, function (c) { return c.toUpperCase(); }); }
    function fmtShort(v) { var x = new Date(v + 'T12:00'); return x.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' }); }
    function isHoliday() { var x = new Date(S.date + 'T12:00').getDay(); return x === 0 || x === 6; }
    function delivery() {
      var lines = [], total = 0;
      if (S.delivery === 'pickup') return { total: 0, lines: [] };
      var base = S.slot === 'day' ? 350 : 600;
      if (S.delivery === 'region') { lines.push(['За пределами Омска (20 км)', 600]); total += 600; }
      else { lines.push([S.slot === 'day' ? 'Днём (09:00–21:00)' : 'Ночью (21:00–09:00)', base]); total += base; }
      if (S.mode === 'exact') { lines.push(['Точно ко времени', 100]); total += 100; }
      if (isHoliday()) { lines.push(['Праздничный день', 100]); total += 100; }
      return { total: total, lines: lines };
    }
    function totals() { var t = Store.totals(), dl = delivery(), sum = t.total + dl.total, fee = Math.round(sum * 0.01); return { goods: t.goods, discount: t.discount, dl: dl, sum: sum + fee, fee: fee, base: sum }; }

    var arr = ICON.cal;
    function head() {
      var back = S.step > 1 ? '<button class="icon-btn" id="bk" aria-label="Назад">' + ICON.backArrow + '</button>' : '<span></span>';
      return '<div class="topbar" style="grid-template-columns:56px 1fr 56px">' + back + '<div class="t">Оформление заказа<span class="sub">Шаг ' + S.step + ' из 3</span></div><a class="icon-btn" href="cart.html" aria-label="Закрыть">' + ICON.close + '</a></div><div class="progress"><i style="width:' + S.step / 3 * 100 + '%"></i></div>';
    }
    function inp(id, label, val, extra) { return '<label class="field-l"><span>' + label + '</span><input class="input" id="' + id + '" value="' + esc(val) + '" ' + (extra || '') + '></label>'; }
    function step1() {
      var opts = Object.keys(DELIVERY).map(function (k) {
        var o = DELIVERY[k];
        return '<button class="opt' + (S.delivery === k ? ' on' : '') + '" data-d="' + k + '"><div class="t"><span>' + o.name + '</span><em>' + (o.from ? 'от ' : '') + rub(o.price) + '</em></div><div class="d">' + o.desc + '</div></button>';
      }).join('');
      var addr = S.delivery === 'pickup' ? '<div class="hint" style="padding-top:14px;font-size:16px;color:var(--ink)">Заберите заказ по адресу: г. Омск, ул. Ленина, д. 20. Мы пришлём сообщение, когда букет будет готов.</div>' :
        '<div class="sw-row" style="padding-top:12px"><span style="flex:1"><b>Адрес доставки</b></span><button class="text-btn" id="pick" style="color:var(--primary)">Выбрать</button></div>' +
        (S.useSaved ? '<div class="block"><div class="vl" style="margin-top:6px;font-size:18px">' + saved.title + '</div><div class="lb" style="font-size:15px">' + esc(saved.text) + '</div><button id="resetAddr" style="color:var(--primary);margin-top:8px">Сбросить</button></div>' :
          inp('street', 'Город, улица, дом', S.street) + '<div class="cols2" style="margin-top:0">' + inp('flat', 'Квартира/офис', S.flat) + inp('zip', 'Индекс', S.zip, 'inputmode="numeric"') + '</div><div class="cols3">' + inp('porch', 'Подъезд', S.porch) + inp('floor', 'Этаж', S.floor) + inp('intercom', 'Домофон', S.intercom) + '</div>') +
        '<label class="field-l"><span>Комментарий курьеру</span><textarea class="textarea" id="comment" maxlength="400" placeholder="Например, позвоните перед доставкой">' + esc(S.comment) + '</textarea><div class="counter" id="cc">' + S.comment.length + '/400</div></label>';
      var time = S.delivery === 'pickup' ? '' : '<div class="div"></div><h2 class="h2">Дата и время доставки</h2><label class="field-l" style="margin-top:0"><span>Дата доставки</span></label><div class="date-wrap"><input class="input" type="date" id="date" min="' + iso(new Date()) + '" value="' + S.date + '">' + arr + '</div>' +
        '<div style="margin-top:12px"><button class="radio' + (S.mode === 'range' ? ' on' : '') + '" data-m="range"><i></i>В выбранный интервал</button><button class="radio' + (S.mode === 'exact' ? ' on' : '') + '" data-m="exact"><i></i><span>Точно ко времени <em>+100 ₽</em></span></button></div>' +
        '<div class="tslots"><button class="a' + (S.slot === 'day' ? '' : ' off') + '" data-sl="day">09:00-21:00</button><button class="b' + (S.slot === 'night' ? '' : ' off') + '" data-sl="night">21:00-09:00</button></div>' +
        '<div class="tprice"><div>' + (350 + (S.mode === 'exact' ? 100 : 0)) + ' ₽<small>по праздникам ' + (450 + (S.mode === 'exact' ? 100 : 0)) + ' ₽</small></div><div>' + (600 + (S.mode === 'exact' ? 100 : 0)) + ' ₽<small>по праздникам ' + (700 + (S.mode === 'exact' ? 100 : 0)) + ' ₽</small></div></div>' +
        (S.mode === 'range' ? '<div class="trow"><input class="input" type="time" id="tf" value="' + S.from + '"><span>–</span><input class="input" type="time" id="tt" value="' + S.to + '"></div>' : '<div class="trow"><input class="input" type="time" id="te" value="' + S.exact + '"></div>');
      return '<div class="step' + (S.back ? ' back' : '') + '"><h2 class="h2">Способ получения</h2>' + opts +
        '<div class="sw-row"><label class="switch"><input type="checkbox" id="cl"' + (S.contactless ? ' checked' : '') + '><i></i></label><span><b>Бесконтактная доставка</b><small>Курьер оставит заказ у двери, отойдет на расстояние не менее трех метров и сообщит о доставке по телефону.</small></span></div>' +
        '<div class="div"></div>' + addr + time + '<p class="legal">Вы можете подробнее ознакомиться об <a href="account.html?s=docs">условиях доставки и оплаты заказов</a></p><div class="btn-stack" style="margin-top:16px"><button class="btn" id="next">Продолжить</button></div></div>';
    }
    function step2() {
      var pays = [['apple', 'Apple Pay', 'Комиссия 1%', '<span style="font-size:13px;font-weight:600;border:1.5px solid #000;border-radius:5px;padding:3px 6px">Apple Pay</span>'], ['card', 'Картой онлайн', 'Комиссия 1%', ICON.card], ['cardin', 'Картой при получении', 'Доставка не будет бесконтактной. Комиссия 1%', ICON.card], ['cash', 'Наличными при получении', 'Доставка не будет бесконтактной', ICON.wallet]];
      return '<div class="step' + (S.back ? ' back' : '') + '"><h2 class="h2">Получатель</h2><div class="seg2" id="who"><div class="thumb" style="transform:translateX(' + (S.who === 'me' ? 0 : 100) + '%)"></div><button data-w="me">Получу я</button><button data-w="other">Другой получатель</button></div>' +
        inp('name', S.who === 'me' ? 'Имя' : 'Имя получателя', S.name) + '<div id="e-name"></div>' + inp('phone', S.who === 'me' ? 'Ваш телефон' : 'Телефон получателя', S.phone, 'inputmode="tel"') + '<div id="e-phone"></div>' + inp('email', 'Электронная почта', S.email, 'inputmode="email"') + '<div id="e-email"></div>' +
        '<p class="hint">На неё отправим фото до доставки и кассовый чек об оплате</p>' +
        '<div class="sw-row" style="align-items:center"><label class="switch"><input type="checkbox" id="card"' + (S.card ? ' checked' : '') + '><i></i></label><span style="font-size:18px">Добавить открытку (бесплатно)</span></div>' +
        '<div class="div"></div><h2 class="h2">Способ оплаты</h2>' + pays.map(function (p) { return '<button class="opt' + (S.pay === p[0] ? ' on' : '') + '" data-p="' + p[0] + '"><div class="t"><span>' + p[1] + '</span></div><div class="d">' + p[2] + '</div><span class="ico">' + p[3] + '</span></button>'; }).join('') +
        '<div class="btn-stack" style="margin-top:22px"><button class="btn" id="next">Продолжить</button></div></div>';
    }
    function step3() {
      var t = totals(), cart = Store.cart(), payName = { apple: 'Apple Pay', card: 'Картой онлайн', cardin: 'Картой при получении', cash: 'Наличными при получении' }[S.pay];
      var items = cart.map(function (i) { var p = productById(i.pid); return '<div class="oi"><img src="' + p.photo + '" alt=""><div><h4>' + esc(p.name) + '</h4><small>' + sizeInfo(i.size) + '<br>' + esc(compShort(p)) + '</small><div class="pp">' + rub(priceFor(p, i.size)) + '<span>x ' + i.qty + '</span></div></div></div>'; }).join('');
      var timeTxt = S.delivery === 'pickup' ? 'Самовывоз, ул. Ленина, д. 20' : fmtDate(S.date) + ' к ' + (S.mode === 'exact' ? S.exact : S.from + '–' + S.to);
      var addrTxt = S.delivery === 'pickup' ? 'г. Омск, ул. Ленина, д. 20' : (S.useSaved ? saved.text : S.street + ', кв. ' + S.flat + ', ' + S.porch + ' подъезд, ' + S.floor + ' этаж, домофон ' + S.intercom + ', ' + S.zip);
      var lines = t.dl.lines.map(function (l) { return '<div class="sum-row sub"><span>' + l[0] + '</span><span>' + rub(l[1]) + '</span></div>'; }).join('');
      var cta = S.pay === 'apple' ? '<button class="btn black" id="pay"><span style="font-size:24px;font-weight:600">Apple Pay</span></button>' : S.pay === 'card' ? '<button class="btn" id="pay">Оплатить ' + rub(t.sum) + '</button>' : '<button class="btn" id="pay">Оформить заказ</button>';
      return '<div class="step' + (S.back ? ' back' : '') + '"><div class="block"><h3>Состав заказа</h3>' + items + '</div><div class="div"></div>' +
        '<div class="block"><h3>Получатель</h3><div class="lb">Имя получателя</div><div class="vl">' + esc(S.name) + '</div><div class="lb">Телефон получателя</div><div class="vl">' + esc(S.phone) + '</div><div class="lb">Электронная почта</div><div class="vl">' + esc(S.email) + '</div>' + (S.card ? '<div class="lb">Открытка</div><div class="vl">Добавлена, бесплатно</div>' : '') + '</div><div class="div"></div>' +
        '<div class="block"><h3>Доставка</h3><div class="lb">Адрес доставки</div><div class="vl">' + esc(addrTxt) + '</div>' + (S.comment ? '<div class="lb">Комментарий курьеру</div><div class="vl">' + esc(S.comment) + '</div>' : '') + '<div class="lb">Дата доставки</div><div class="vl">' + timeTxt + '</div></div><div class="div"></div>' +
        '<div class="block"><h3>Способ оплаты</h3><div class="pm">' + (S.pay === 'apple' ? '<span style="font-size:13px;font-weight:600;border:1.5px solid #000;border-radius:5px;padding:3px 6px">Apple Pay</span>' : S.pay === 'cash' ? ICON.wallet : ICON.card) + '<div><div class="vl" style="margin:0">' + payName + '</div><div class="lb" style="margin:0">' + (S.pay === 'cash' ? 'Доставка не будет бесконтактной' : 'Комиссия 1%') + '</div></div></div></div><div class="div"></div>' +
        '<div class="block"><h3>Сумма к оплате</h3><div class="sum-row"><span>Товары (' + Store.cartCount() + ')</span><span>' + rub(t.goods) + '</span></div>' + (t.discount ? '<div class="sum-row free"><span>Промокод</span><span>−' + rub(t.discount) + '</span></div>' : '') + '<div class="sum-row free"><span>Открытка</span><span>' + (S.card ? 'бесплатно' : '—') + '</span></div>' +
        '<div class="sum-row"><span>Доставка</span><span>' + rub(t.dl.total) + '</span></div>' + lines + '<div class="sum-total"><span>Итого</span><span>' + rub(t.sum) + '</span></div><div class="sum-fee"><span>Комиссия 1%</span><span>' + rub(t.fee) + '</span></div></div>' +
        '<div class="btn-stack" style="margin-top:22px">' + cta + '</div><p class="legal">Нажимая «Оплатить», вы соглашаетесь с условиями <a href="account.html?s=docs">Правил пользования торговой площадкой</a><br><br>Если вы откажетесь от покупки, для возврата денег вам придется обратиться в магазин.</p></div>';
    }

    function render() {
      root.innerHTML = head() + (S.step === 1 ? step1() : S.step === 2 ? step2() : step3());
      root.classList.add('no-tab'); bind(); window.scrollTo(0, 0);
    }
    function goto(n) { S.back = n < S.step; S.step = n; render(); }
    function bind() {
      var q = function (id) { return document.getElementById(id); };
      if (q('bk')) q('bk').onclick = function () { goto(S.step - 1); };
      if (S.step === 1) {
        root.onclick = function (e) {
          var t = e.target.closest('[data-d],[data-m],[data-sl],#resetAddr,#pick,#next'); if (!t) return;
          if (t.hasAttribute('data-d')) { S.delivery = t.getAttribute('data-d'); sync(); render(); }
          else if (t.hasAttribute('data-m')) { S.mode = t.getAttribute('data-m'); sync(); render(); }
          else if (t.hasAttribute('data-sl')) { S.slot = t.getAttribute('data-sl'); sync(); render(); }
          else if (t.id === 'resetAddr' || t.id === 'pick') { S.useSaved = !S.useSaved; sync(); render(); }
          else if (t.id === 'next') { sync(); if (S.delivery !== 'pickup' && !S.useSaved && !S.street.trim()) { var s = q('street'); s.classList.add('err'); s.focus(); toast('Укажите адрес доставки'); return; } goto(2); }
        };
        if (q('comment')) q('comment').oninput = function () { q('cc').textContent = this.value.length + '/400'; };
      } else if (S.step === 2) {
        root.onclick = function (e) {
          var t = e.target.closest('[data-w],[data-p],#next'); if (!t) return;
          if (t.hasAttribute('data-w')) { sync(); S.who = t.getAttribute('data-w'); if (S.who === 'other') { S.name = ''; S.phone = ''; } else { S.name = user.name || 'Сергей'; S.phone = user.phone || '+7 (950) 793-23-22'; } render(); }
          else if (t.hasAttribute('data-p')) { sync(); S.pay = t.getAttribute('data-p'); render(); }
          else if (t.id === 'next') { sync(); if (validate()) goto(3); }
        };
      } else {
        root.onclick = function (e) { if (e.target.closest('#pay')) pay(e.target.closest('#pay')); };
      }
    }
    function sync() {
      var g = function (id) { var el = document.getElementById(id); return el ? el.value : null; };
      if (S.step === 1) {
        ['street', 'flat', 'zip', 'porch', 'floor', 'intercom', 'comment', 'date'].forEach(function (k) { var v = g(k); if (v !== null) S[k] = v; });
        var cl = document.getElementById('cl'); if (cl) S.contactless = cl.checked;
        if (g('tf')) { S.from = g('tf'); S.to = g('tt'); } if (g('te')) S.exact = g('te');
      } else if (S.step === 2) {
        ['name', 'phone', 'email'].forEach(function (k) { var v = g(k); if (v !== null) S[k] = v; });
        var c = document.getElementById('card'); if (c) S.card = c.checked;
      }
    }
    function validate() {
      var ok = true, set = function (id, bad, msg) { var el = document.getElementById(id), e = document.getElementById('e-' + id); e.innerHTML = bad ? '<div class="err-t" style="padding:4px 16px 0">' + msg + '</div>' : ''; el.classList.remove('err'); if (bad) { void el.offsetWidth; el.classList.add('err'); ok = false; } };
      set('name', !S.name.trim(), 'Введите имя');
      set('phone', S.phone.replace(/\D/g, '').length < 10, 'Введите номер телефона полностью');
      set('email', !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(S.email), 'Проверьте адрес почты');
      return ok;
    }

    /* ---- оплата ---- */
    function makeOrder(paid) {
      var t = totals(), n = 94551 + Store.orders().length;
      var o = { id: n, date: Date.now(), items: Store.cart().slice(), addons: Store.addons().slice(), promo: Store.promo(), who: S.name, phone: S.phone, email: S.email, card: S.card,
        delivery: S.delivery, address: S.delivery === 'pickup' ? 'г. Омск, ул. Ленина, д. 20' : (S.useSaved ? saved.text : S.street + ', кв. ' + S.flat + ', ' + S.porch + ' подъезд, ' + S.floor + ' этаж, домофон ' + S.intercom + ', ' + S.zip),
        comment: S.comment, when: S.delivery === 'pickup' ? 'Самовывоз' : fmtDate(S.date) + ' к ' + (S.mode === 'exact' ? S.exact : S.from), pay: S.pay, goods: t.goods, discount: t.discount, dl: t.dl, fee: t.fee, total: t.sum, paid: paid };
      Store.addOrder(o); Store.setLastOrder(n); Store.clearCart(); return n;
    }
    function pay(btn) {
      sync();
      if (S.pay === 'apple') {
        var ap = document.createElement('div'); ap.className = 'applepay'; var t = totals();
        ap.innerHTML = '<div class="ah"><span>Apple Pay</span><button id="apx">Отменить</button></div><div class="ar"><div style="color:#777">АВТОРСКИЙ БУКЕТ<br>«ЛОЛИТА»</div><span>' + String(t.sum).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',00 ₽</span></div><div class="ar" style="padding-top:0"><div>ОПЛАТА: ЯБЛОНЬКА</div><b>' + String(t.sum).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',00 ₽</b></div><div class="face" id="af">' + ICON.sideBtn + '</div><div class="tx" id="at">Подтвердите боковой кнопкой</div>';
        document.body.appendChild(ap); var ov = document.querySelector('.overlay') || (function () { var o = document.createElement('div'); o.className = 'overlay'; document.body.appendChild(o); return o; })();
        requestAnimationFrame(function () { ov.classList.add('open'); ap.classList.add('open'); });
        var done = false;
        document.getElementById('apx').onclick = function () { if (done) return; ap.classList.remove('open'); ov.classList.remove('open'); setTimeout(function () { ap.remove(); }, 450); };
        setTimeout(function () { var af = document.getElementById('af'); if (!af) return; done = true; af.innerHTML = '<svg viewBox="0 0 52 52" width="56" height="56" class="checkmark ok"><circle cx="26" cy="26" r="23"/><path d="M15 27l8 8 14-16"/></svg>'; document.getElementById('at').textContent = 'Готово'; setTimeout(function () { var id = makeOrder(true); location.href = 'order-success.html?id=' + id + '&r=ok'; }, 900); }, 2300);
        return;
      }
      btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Оплата…';
      setTimeout(function () {
        var failFirst = S.pay === 'card', id = makeOrder(!failFirst);
        location.href = 'order-success.html?id=' + id + '&r=' + (failFirst ? 'error' : 'ok');
      }, 1400);
    }
    render();
  };

  /* ======================= детали заказа ======================= */
  function orderBlocks(o) {
    var items = o.items.map(function (i) { var p = productById(i.pid); return '<div class="oi"><img src="' + p.photo + '" alt=""><div><h4>' + esc(p.name) + '</h4><small>' + sizeInfo(i.size) + '<br>' + esc(compShort(p)) + '</small><div class="pp">' + rub(priceFor(p, i.size)) + '<span>x ' + i.qty + '</span></div></div></div>'; }).join('');
    var pn = { apple: 'Apple Pay', card: 'Картой онлайн', cardin: 'Картой при получении', cash: 'Наличными при получении' }[o.pay];
    var lines = o.dl.lines.map(function (l) { return '<div class="sum-row sub"><span>' + l[0] + '</span><span>' + rub(l[1]) + '</span></div>'; }).join('');
    return '<div class="block"><h3>Состав заказа</h3>' + items + '</div><div class="div"></div>' +
      '<div class="block"><h3>Получатель</h3><div class="lb">Имя получателя</div><div class="vl">' + esc(o.who) + '</div><div class="lb">Телефон получателя</div><div class="vl">' + esc(o.phone) + '</div><div class="lb">Электронная почта</div><div class="vl">' + esc(o.email) + '</div></div><div class="div"></div>' +
      '<div class="block"><h3>Доставка</h3><div class="lb">Адрес доставки</div><div class="vl">' + esc(o.address) + '</div>' + (o.comment ? '<div class="lb">Комментарий курьеру</div><div class="vl">' + esc(o.comment) + '</div>' : '') + '<div class="lb">Дата доставки</div><div class="vl">' + o.when + '</div></div><div class="div"></div>' +
      '<div class="block"><h3>Способ оплаты</h3><div class="pm">' + (o.pay === 'apple' ? '<span style="font-size:13px;font-weight:600;border:1.5px solid #000;border-radius:5px;padding:3px 6px">Apple Pay</span>' : o.pay === 'cash' ? ICON.wallet : ICON.card) + '<div><div class="vl" style="margin:0">' + pn + '</div><div class="lb" style="margin:0">Комиссия 1%</div></div></div></div><div class="div"></div>' +
      '<div class="block"><h3>Сумма к оплате</h3><div class="sum-row"><span>Товары</span><span>' + rub(o.goods) + '</span></div>' + (o.discount ? '<div class="sum-row free"><span>Промокод</span><span>−' + rub(o.discount) + '</span></div>' : '') + '<div class="sum-row"><span>Доставка</span><span>' + rub(o.dl.total) + '</span></div>' + lines + '<div class="sum-total"><span>Итого</span><span>' + rub(o.total) + '</span></div><div class="sum-fee"><span>Комиссия 1%</span><span>' + rub(o.fee) + '</span></div></div>';
  }

  /* ======================= РЕЗУЛЬТАТ ======================= */
  views.success = function () {
    var id = Number(qs.get('id')) || Store.lastOrderId(), o = Store.order(id), ok = qs.get('r') !== 'error';
    if (!o) { root.innerHTML = topBar({ title: 'Спасибо!', close: 'index.html' }) + '<div class="empty"><h3>Заказ не найден</h3><a class="btn" href="catalog.html">В каталог</a></div>'; return; }
    root.classList.add('no-tab');
    var okMark = '<svg class="checkmark ok" viewBox="0 0 80 80"><circle cx="40" cy="40" r="35"/><path d="M26 41l10 10 19-21"/></svg>';
    var waitMark = '<svg class="checkmark" viewBox="0 0 80 80"><circle cx="40" cy="40" r="35"/><path d="M40 22v19l12 8"/></svg>';
    root.innerHTML = topBar({ title: 'Спасибо!', close: 'index.html' }) +
      (ok ? '<div class="result">' + okMark + '<h1>Заказ №' + o.id + ' оформлен</h1><p>Вы можете следить за выполнением своего заказа в Персональном разделе приложения</p></div><div class="btn-stack"><a class="btn outline" href="order.html?id=' + o.id + '">Отслеживать заказ</a></div>' :
        '<div class="result">' + waitMark + '<h1>Заказ №' + o.id + ' оформлен,<br>но не оплачен</h1><p>Будьте внимательны: заказ отменится через 30 минут, если оплата не поступит</p></div><div class="btn-stack"><button class="btn" id="retry">Попробовать ещё раз</button><a class="btn outline" href="order.html?id=' + o.id + '">Оплатить другим способом</a></div>') +
      '<div class="div" style="margin-top:24px"></div>' + orderBlocks(o) +
      (ok ? '' : '<div class="btn-stack" style="margin-top:22px"><button class="btn" id="retry2">Попробовать ещё раз</button></div>');
    if (ok) confetti();
    function retry(b) { b.disabled = true; b.innerHTML = '<span class="spin"></span>Оплата…'; setTimeout(function () { Store.updateOrder(o.id, { paid: true }); location.href = 'order-success.html?id=' + o.id + '&r=ok'; }, 1300); }
    ['retry', 'retry2'].forEach(function (i) { var b = document.getElementById(i); if (b) b.onclick = function () { retry(b); }; });
  };

  /* ======================= СТРАНИЦА ЗАКАЗА ======================= */
  views.order = function () {
    var id = Number(qs.get('id')) || Store.lastOrderId(), o = Store.order(id);
    root.classList.add('no-tab');
    if (!o) { root.innerHTML = topBar({ title: 'Заказ', back: 'profile.html' }) + '<div class="empty"><h3>Заказ не найден</h3><a class="btn" href="catalog.html">В каталог</a></div>'; return; }
    function draw() {
      o = Store.order(id);
      var step = o.paid ? 2 : 1, sp = function (done) { return '<span class="sp' + (done ? ' done' : '') + '">' + ICON.check.replace('stroke-width="1.7"', 'stroke-width="2.2"') + '</span>'; };
      var ln = function (done) { return '<span class="ln" data-done="' + (done ? 1 : 0) + '"><i></i></span>'; };
      root.innerHTML = topBar({ title: 'Заказ №' + o.id, back: 'profile.html' }) +
        '<div class="stepper">' + sp(step >= 1) + ln(step >= 2) + sp(step >= 2) + ln(false) + sp(false) + ln(false) + sp(false) + '</div>' +
        (o.paid ? '<div class="result" style="text-align:left"><h1 style="font-size:24px;margin:8px 0">Заказ оплачен</h1><p style="margin:0">Флористы уже собирают ваш букет. Мы пришлём фото перед доставкой.</p></div>' :
          '<div class="result" style="text-align:left"><h1 style="font-size:24px;margin:8px 0">Ещё не оплачен</h1><p style="margin-bottom:14px">Оплатите и мы начнём его собирать</p><button class="btn sm" id="payNow" style="width:auto">Оплатить заказ</button></div>') +
        '<div class="div"></div>' + orderBlocks(o) + (o.paid ? '' : '<div class="btn-stack" style="margin-top:22px"><button class="btn" id="payNow2">Оплатить заказ</button></div>');
      setTimeout(function () { Array.prototype.forEach.call(document.querySelectorAll('.stepper .ln[data-done="1"]'), function (l) { l.classList.add('done'); }); }, 50);
      ['payNow', 'payNow2'].forEach(function (i) { var b = document.getElementById(i); if (b) b.onclick = function () { b.disabled = true; b.innerHTML = '<span class="spin"></span>Оплата…'; setTimeout(function () { Store.updateOrder(o.id, { paid: true }); draw(); confetti(); toast('Заказ оплачен'); }, 1200); }; });
    }
    draw();
  };

  if (views[page]) views[page]();
  rerender();
})();
