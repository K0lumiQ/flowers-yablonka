// Аккаунт: профиль, вход, разделы профиля, салоны, отзывы
(function () {
  var page = document.body.getAttribute('data-page');
  var root = document.getElementById('page');
  var qs = new URLSearchParams(location.search);
  var views = {};

  var heroSvg = '<svg viewBox="0 0 430 250" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' +
    '<defs><radialGradient id="r1" cx="50%" cy="45%"><stop offset="0" stop-color="#f7a9c4"/><stop offset=".6" stop-color="#f7c9d8"/><stop offset="1" stop-color="#fde8ef"/></radialGradient><radialGradient id="r2" cx="50%" cy="45%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#efe3df"/></radialGradient></defs>' +
    '<g opacity=".95"><circle cx="70" cy="40" r="62" fill="url(#r1)"/><circle cx="70" cy="40" r="38" fill="none" stroke="#f08fb0" stroke-width="3" opacity=".6"/><circle cx="70" cy="40" r="18" fill="none" stroke="#f08fb0" stroke-width="3" opacity=".6"/>' +
    '<circle cx="215" cy="30" r="70" fill="url(#r1)"/><circle cx="215" cy="30" r="44" fill="none" stroke="#f08fb0" stroke-width="3" opacity=".6"/><circle cx="215" cy="30" r="20" fill="none" stroke="#f08fb0" stroke-width="3" opacity=".6"/>' +
    '<circle cx="150" cy="105" r="58" fill="url(#r2)"/><circle cx="150" cy="105" r="34" fill="none" stroke="#d9c4bd" stroke-width="3" opacity=".7"/>' +
    '<circle cx="330" cy="75" r="58" fill="url(#r1)"/><circle cx="330" cy="75" r="34" fill="none" stroke="#f08fb0" stroke-width="3" opacity=".6"/><circle cx="330" cy="75" r="14" fill="#f08fb0" opacity=".5"/>' +
    '<ellipse cx="260" cy="150" rx="26" ry="14" fill="#cdb7a7" opacity=".7" transform="rotate(30 260 150)"/><ellipse cx="380" cy="150" rx="22" ry="12" fill="#cdb7a7" opacity=".7" transform="rotate(-25 380 150)"/><ellipse cx="22" cy="130" rx="22" ry="11" fill="#d8c8bb" opacity=".7" transform="rotate(20 22 130)"/></g></svg>';

  /* ======================= ПРОФИЛЬ ======================= */
  views.profile = function () {
    var u = Store.user();
    if (!u) {
      root.innerHTML = '<div class="login-hero">' + heroSvg + '</div><div class="login-copy"><h1>Войдите в аккаунт</h1><p>Оформляйте заказы гораздо быстрее<br>и отслеживайте статус заказа</p></div>' +
        '<div class="btn-stack"><a class="btn" href="login.html?m=phone">По номеру телефона</a><a class="btn outline" href="login.html?m=email">По электронной почте</a></div>' +
        '<div class="or">или</div><div class="socials"><button data-soc="Вконтакте"><i>VK</i>Вконтакте</button><button data-soc="Google"><i>G</i>Google</button><button data-soc="Facebook"><i>f</i>Facebook</button></div>';
      root.addEventListener('click', function (e) { var b = e.target.closest('[data-soc]'); if (!b) return; Store.setUser({ name: 'Дмитрий', phone: '+7 999 121-64-45', email: 'dmitry@example.com' }); toast('Вход через ' + b.getAttribute('data-soc') + ' (демо)'); setTimeout(function () { location.reload(); }, 700); });
      return;
    }
    var items = [['box', 'Мои заказы', 'orders'], ['pin', 'Мои адреса', 'addresses'], ['bell', 'Настройка уведомлений', 'notifications'], ['ruble', 'Валюта RUB', 'currency'], ['lang', 'Русский язык', 'language'], ['home', 'О компании', 'company'], ['file', 'Правовые документы', 'docs'], ['info', 'О приложении', 'about']];
    root.innerHTML = topBar({ title: 'Профиль' }) + '<div class="prof-head"><div><h2>' + esc(u.name) + '</h2><p>' + esc(u.phone || u.email) + '</p></div><a class="gear" href="account.html?s=settings" aria-label="Настройки">' + ICON.gear.replace('<svg', '<svg width="22" height="22"') + '</a></div>' +
      '<nav class="menu">' + items.map(function (i, k) { return '<a href="account.html?s=' + i[2] + '" style="animation:slideRow .45s var(--ease) ' + k * 45 + 'ms both"><span class="i">' + ICON[i[0]].replace('<svg', '<svg class="i"') + '</span>' + i[1] + ICON.chev.replace('<svg', '<svg class="c"') + '</a>'; }).join('') + '</nav>';
    Array.prototype.forEach.call(document.querySelectorAll('.menu a > .i'), function (s) { s.outerHTML = s.innerHTML; });
  };

  /* ======================= ВХОД ======================= */
  views.login = function () {
    var mode = qs.get('m') || 'phone', phone = '';
    function shell(inner, title) { root.innerHTML = topBar({ title: title || '', back: true, close: 'profile.html' }) + '<div class="login-form step">' + inner + '</div>'; }
    function phoneScr() {
      shell('<h1>Введите номер телефона</h1><p>Мы отправим СМС с кодом подтверждения</p><input class="input" id="ph" inputmode="tel" value="+7 " placeholder="+7 (___) ___-__-__"><div id="e"></div><div style="margin-top:22px"><button class="btn" id="go">Получить код</button></div><p class="hint" style="padding:14px 0 0">Нажимая «Получить код», вы соглашаетесь с <a href="account.html?s=docs">условиями использования</a></p>');
      var ph = document.getElementById('ph'); ph.focus();
      ph.addEventListener('input', function () { var d = ph.value.replace(/\D/g, '').replace(/^[78]/, '').slice(0, 10), o = '+7 '; if (d.length) o += '(' + d.slice(0, 3); if (d.length >= 3) o += ') ' + d.slice(3, 6); if (d.length >= 6) o += '-' + d.slice(6, 8); if (d.length >= 8) o += '-' + d.slice(8, 10); ph.value = o; });
      document.getElementById('go').onclick = function () { if (ph.value.replace(/\D/g, '').length < 11) { ph.classList.remove('err'); void ph.offsetWidth; ph.classList.add('err'); document.getElementById('e').innerHTML = '<div class="err-t">Введите номер телефона полностью</div>'; return; } phone = ph.value; codeScr(); };
    }
    function codeScr() {
      shell('<h1>Введите код из СМС</h1><p>Код отправлен на ' + esc(phone) + '</p><div class="code-row">' + [0, 1, 2, 3].map(function () { return '<input maxlength="1" inputmode="numeric" autocomplete="one-time-code">'; }).join('') + '</div><div id="e" style="text-align:center"></div><div class="resend" id="rs">Отправить код повторно через <b id="sec">30</b> с</div><p class="hint" style="text-align:center;padding-top:20px">В демо подойдёт любой код из 4 цифр</p>');
      var ins = Array.prototype.slice.call(document.querySelectorAll('.code-row input')); ins[0].focus();
      ins.forEach(function (el, i) {
        el.addEventListener('input', function () { el.value = el.value.replace(/\D/g, ''); el.classList.toggle('filled', !!el.value); if (el.value && ins[i + 1]) ins[i + 1].focus(); if (ins.every(function (x) { return x.value; })) done(); });
        el.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !el.value && ins[i - 1]) { ins[i - 1].focus(); } });
      });
      var s = 30, tm = setInterval(function () { s--; var el = document.getElementById('sec'); if (!el) { clearInterval(tm); return; } if (s <= 0) { clearInterval(tm); document.getElementById('rs').innerHTML = '<b style="cursor:pointer" id="again">Отправить код ещё раз</b>'; document.getElementById('again').onclick = function () { toast('Код отправлен повторно'); codeScr(); }; } else el.textContent = s; }, 1000);
      function done() { document.getElementById('e').innerHTML = '<div class="spinner" style="margin:10px auto"></div>'; setTimeout(function () { Store.setUser({ name: 'Дмитрий', phone: phone, email: 'dmitry@example.com' }); location.href = 'profile.html'; }, 900); }
    }
    function emailScr() {
      shell('<h1>Вход по электронной почте</h1><p>Введите почту и пароль от аккаунта</p><label class="field-l" style="padding:0"><span>Электронная почта</span><input class="input" id="em" type="email" placeholder="name@example.com"></label><label class="field-l" style="padding:0"><span>Пароль</span><input class="input" id="pw" type="password" placeholder="Введите пароль"></label><div id="e"></div><div style="margin:12px 0 0"><button class="more" id="forgot">Забыли пароль?</button></div><div style="margin-top:22px"><button class="btn" id="go">Войти</button></div><p class="hint" style="padding:14px 0 0">Демо: подойдёт любая почта и пароль от 4 символов</p>');
      document.getElementById('forgot').onclick = forgotScr;
      document.getElementById('go').onclick = function () {
        var em = document.getElementById('em'), pw = document.getElementById('pw'), bad = false;
        [[em, !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)], [pw, pw.value.length < 4]].forEach(function (p) { p[0].classList.remove('err'); if (p[1]) { void p[0].offsetWidth; p[0].classList.add('err'); bad = true; } });
        if (bad) { document.getElementById('e').innerHTML = '<div class="err-t">Проверьте почту и пароль</div>'; return; }
        var b = this; b.disabled = true; b.innerHTML = '<span class="spin"></span>Входим…';
        setTimeout(function () { Store.setUser({ name: 'Дмитрий', phone: '+7 999 121-64-45', email: em.value }); location.href = 'profile.html'; }, 1000);
      };
    }
    function forgotScr() {
      shell('<h1>Восстановление пароля</h1><p>Введите почту, мы отправим ссылку для создания нового пароля</p><label class="field-l" style="padding:0"><span>Электронная почта</span><input class="input" id="em" type="email" placeholder="name@example.com"></label><div id="e"></div><div style="margin-top:22px"><button class="btn" id="go">Отправить ссылку</button></div>');
      document.getElementById('go').onclick = function () {
        var em = document.getElementById('em'); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)) { em.classList.remove('err'); void em.offsetWidth; em.classList.add('err'); document.getElementById('e').innerHTML = '<div class="err-t">Проверьте адрес почты</div>'; return; }
        shell('<div class="result"><svg class="checkmark ok" viewBox="0 0 80 80"><circle cx="40" cy="40" r="35"/><path d="M26 41l10 10 19-21"/></svg><h1>Письмо отправлено</h1><p>Проверьте почту ' + esc(em.value) + ' и перейдите по ссылке в письме</p></div><div class="btn-stack"><button class="btn outline" id="toLogin">Вернуться ко входу</button></div>');
        document.getElementById('toLogin').onclick = emailScr;
      };
    }
    if (mode === 'email') emailScr(); else if (mode === 'forgot') forgotScr(); else phoneScr();
    root.classList.add('no-tab');
  };

  /* ======================= РАЗДЕЛЫ ПРОФИЛЯ ======================= */
  views.account = function () {
    var s = qs.get('s') || 'orders', u = Store.user();
    var fmt = function (ts) { return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }); };
    var titles = { orders: 'Мои заказы', addresses: 'Мои адреса', notifications: 'Уведомления', currency: 'Валюта', language: 'Язык', company: 'О компании', docs: 'Правовые документы', about: 'О приложении', settings: 'Настройки профиля' };
    root.classList.add('no-tab');
    function top(r) { return topBar({ title: titles[s] || 'Профиль', back: 'profile.html', right: r }); }
    var R = {
      orders: function () {
        var o = Store.orders();
        root.innerHTML = top() + (o.length ? o.map(function (x, i) { return '<a class="oitem" href="order.html?id=' + x.id + '" style="animation:slideRow .45s var(--ease) ' + i * 60 + 'ms both"><div class="r"><b style="font-weight:500">Заказ №' + x.id + '</b><span class="st' + (x.paid ? ' ok' : '') + '">' + (x.paid ? 'Оплачен' : 'Не оплачен') + '</span></div><small>' + fmt(x.date) + '</small><div class="r" style="margin-top:8px"><span>' + x.items.length + ' ' + (x.items.length === 1 ? 'букет' : 'букета') + '</span><b style="font-weight:500">' + rub(x.total) + '</b></div></a>'; }).join('') :
          '<div class="empty">' + ICON.sadBag + '<h3>Заказов пока нет</h3><p>Оформите первый заказ, и он появится здесь</p><a class="btn" href="catalog.html">В каталог</a></div>');
      },
      addresses: function () {
        function draw() {
          var a = Store.addresses();
          root.innerHTML = top() + (a.length ? a.map(function (x, i) { return '<div class="addr" style="animation:slideRow .4s var(--ease) ' + i * 60 + 'ms both"><div><b>' + esc(x.title) + '</b><span>' + esc(x.text) + '</span></div><button data-rm="' + i + '">Удалить</button></div>'; }).join('') : '<div class="empty" style="padding-top:12vh">' + ICON.sadLens + '<h3>Адресов нет</h3><p>Добавьте адрес, чтобы оформлять заказ быстрее</p></div>') +
            '<div class="field-l" style="margin-top:20px"><span>Название</span><input class="input" id="at" placeholder="Например, Работа"></div><div class="field-l"><span>Адрес</span><input class="input" id="ax" placeholder="Город, улица, дом, квартира"></div><div class="btn-stack" style="margin-top:18px"><button class="btn" id="aadd">Добавить адрес</button></div>';
        }
        draw();
        root.onclick = function (e) {
          var rm = e.target.closest('[data-rm]'); if (rm) { var a = Store.addresses(); a.splice(Number(rm.getAttribute('data-rm')), 1); Store.setAddresses(a); draw(); return; }
          if (e.target.closest('#aadd')) { var t = document.getElementById('at'), x = document.getElementById('ax'); if (!x.value.trim()) { x.classList.remove('err'); void x.offsetWidth; x.classList.add('err'); return; } var a2 = Store.addresses(); a2.push({ title: t.value.trim() || 'Адрес', text: x.value.trim() }); Store.setAddresses(a2); draw(); toast('Адрес добавлен'); }
        };
      },
      notifications: function () {
        var n = Store.notif(), rows = [['orders', 'Статус заказа'], ['promo', 'Акции и скидки'], ['news', 'Статьи и новости']];
        root.innerHTML = top() + rows.map(function (r) { return '<div class="row"><span>' + r[1] + '</span><label class="switch"><input type="checkbox" data-n="' + r[0] + '"' + (n[r[0]] ? ' checked' : '') + '><i></i></label></div>'; }).join('');
        root.onchange = function (e) { var k = e.target.getAttribute('data-n'); if (k) { n[k] = e.target.checked; Store.setNotif(n); } };
      },
      currency: function () { radios([['RUB', 'Российский рубль, ₽', true], ['USD', 'Доллар США, $', false], ['EUR', 'Евро, €', false]], 'Пока доступны только рубли'); },
      language: function () { radios([['ru', 'Русский', true], ['en', 'English', false]], 'Другие языки скоро появятся'); },
      company: function () { root.innerHTML = top() + '<div class="about-p"><h3>Цветы у яблоньки</h3>Цветочная сеть в Омске: авторские и классические букеты, композиции в корзинах и коробках, свадебная флористика. Центральный салон на ул. Ленина, 20 и восемь филиалов по городу. Собираем букеты из свежих цветов и доставляем по Омску и области.<h3>Как мы работаем</h3>Мы присылаем фото готового букета до доставки, поэтому вы заранее видите, что получит адресат. Цветы стоят дольше, потому что каждый день приходят свежие поставки.<p style="margin-top:16px"><a class="btn outline" href="salons.html">Наши салоны</a></p></div>'; },
      docs: function () { root.innerHTML = top() + '<div class="menu legal-list">' + ['Условия доставки и оплаты заказов', 'Правила пользования торговой площадкой', 'Политика конфиденциальности', 'Публичная оферта'].map(function (d) { return '<a href="#" data-doc>' + d + ICON.chev.replace('<svg', '<svg class="c"') + '</a>'; }).join('') + '</div><div class="demo-note">Это учебный проект по вёрстке: настоящих документов здесь нет.</div>'; root.onclick = function (e) { if (e.target.closest('[data-doc]')) { e.preventDefault(); toast('Это демо, документ не загружается'); } }; },
      about: function () { root.innerHTML = top() + '<div class="about-p" style="text-align:center;padding-top:40px"><div class="logo" style="margin-bottom:20px">' + ICON.logo + '<span><i>•</i>Цветы у яблоньки<i>•</i></span></div>Версия 1.0 (учебная вёрстка)<br>Макет: Figma, 105 экранов<br>Вёрстка: HTML, CSS, JS без фреймворков<br><br><button class="btn outline sm" id="rst" style="width:auto">Сбросить демо-данные</button></div>'; document.getElementById('rst').onclick = function () { Store.reset(); toast('Данные сброшены'); setTimeout(function () { location.href = 'index.html'; }, 700); }; },
      settings: function () {
        u = u || {}; root.innerHTML = top() + '<label class="field-l"><span>Имя</span><input class="input" id="sn" value="' + esc(u.name || '') + '"></label><label class="field-l"><span>Телефон</span><input class="input" id="sp" value="' + esc(u.phone || '') + '" inputmode="tel"></label><label class="field-l"><span>Электронная почта</span><input class="input" id="se" value="' + esc(u.email || '') + '" inputmode="email"></label><label class="field-l"><span>Новый пароль</span><input class="input" id="spw" type="password" placeholder="Оставьте пустым, если не меняете"></label><div class="btn-stack" style="margin-top:22px"><button class="btn" id="ssave">Сохранить</button><button class="btn outline" id="sout">Выйти из аккаунта</button></div>';
        document.getElementById('ssave').onclick = function () { var n = document.getElementById('sn'); if (!n.value.trim()) { n.classList.remove('err'); void n.offsetWidth; n.classList.add('err'); return; } Store.setUser({ name: n.value.trim(), phone: document.getElementById('sp').value, email: document.getElementById('se').value }); toast('Сохранено'); };
        document.getElementById('sout').onclick = function () { Store.logout(); location.href = 'profile.html'; };
      }
    };
    function radios(list, note) {
      root.innerHTML = top() + list.map(function (r) { return '<button class="radio' + (r[2] ? ' on' : '') + '" data-r style="padding:16px;border-bottom:1px solid var(--line)"><i></i><span>' + r[1] + '</span></button>'; }).join('') + '<p class="hint">' + note + '</p>';
      root.onclick = function (e) { var b = e.target.closest('[data-r]'); if (!b) return; if (!b.classList.contains('on')) toast(note); };
    }
    (R[s] || R.orders)();
  };

  /* ======================= САЛОНЫ ======================= */
  views.salons = function () {
    root.classList.add('no-tab');
    var all = SALONS.main.map(function (x) { return Object.assign({ t: 'main' }, x); }).concat(SALONS.branches.map(function (x) { return Object.assign({ t: 'br' }, x); }), SALONS.plus.map(function (x) { return Object.assign({ t: 'plus' }, x); }));
    var tab = 'map';
    function list(arr) { return arr.map(function (s, i) { return '<div class="sal" style="animation-delay:' + i * 40 + 'ms"><b>' + esc(s.addr) + '</b><div>' + ICON.clock + s.time + '</div><div>' + ICON.phone + '<a href="tel:' + s.phone.replace(/[^\d+]/g, '') + '">' + s.phone + '</a></div></div>'; }).join(''); }
    var mapSvg = '<svg class="bg" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><rect width="400" height="600" fill="#f4f2ec"/>' +
      '<path d="M-10 420C80 400 120 330 190 300S320 220 300 120 330 -20 330 -20L410 -20 410 40C400 120 410 180 360 260S250 400 180 430 60 520 -10 540Z" fill="#c4dff5"/>' +
      '<g fill="#dfeccd"><rect x="20" y="30" width="110" height="130" rx="14"/><rect x="250" y="470" width="120" height="90" rx="14"/><rect x="30" y="470" width="90" height="100" rx="14"/></g>' +
      '<g stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"><path d="M0 200L400 260M70 0L190 600M250 0L340 600M0 480L400 430M130 330L400 380"/></g>' +
      '<g stroke="#f7d98a" stroke-width="6" fill="none" stroke-linecap="round"><path d="M0 330L400 120M150 0L260 600"/></g>' +
      '<g fill="#8a8a9a" font-size="10" font-family="sans-serif" opacity=".8"><text x="20" y="190" transform="rotate(8 20 190)">ул. Гагарина</text><text x="190" y="520" transform="rotate(-6 190 520)">ул. Чкалова</text><text x="230" y="90" transform="rotate(-20 230 90)">р. Омь</text><text x="260" y="330">Думская ул.</text></g></svg>';
    function draw() {
      root.innerHTML = topBar({ title: 'Салоны', back: true }) + '<div class="sal-seg"><div class="seg2" style="margin:0"><div class="thumb" style="transform:translateX(' + (tab === 'map' ? 0 : 100) + '%)"></div><button data-t="map">На карте</button><button data-t="list">Списком</button></div></div>' +
        (tab === 'map' ? '<div class="map">' + mapSvg + all.map(function (s, i) { return '<button class="pin' + (s.t === 'plus' ? ' plus' : '') + '" data-i="' + i + '" style="left:' + s.x + '%;top:' + s.y + '%;animation-delay:' + i * 70 + 'ms" aria-label="' + esc(s.addr) + '">' + (s.t === 'plus' ? '+' : ICON.home) + '</button>'; }).join('') + '<div class="me" style="left:72%;top:68%"></div><div class="pin-card" id="pc"></div></div>' :
          '<div class="sal-h">Центральный салон</div>' + list(SALONS.main) + '<div class="sal-h">Филиалы</div>' + list(SALONS.branches) + '<div class="sal-h">Филиалы PLUS</div>' + list(SALONS.plus));
    }
    draw();
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-t]'); if (t) { tab = t.getAttribute('data-t'); draw(); return; }
      var p = e.target.closest('.pin'); if (p) {
        var s = all[Number(p.getAttribute('data-i'))], pc = document.getElementById('pc');
        Array.prototype.forEach.call(document.querySelectorAll('.pin'), function (x) { x.classList.toggle('on', x === p); });
        pc.classList.remove('open'); setTimeout(function () { pc.innerHTML = '<b>' + esc(s.addr) + '</b><span>' + s.time + '</span><span><a href="tel:' + s.phone.replace(/[^\d+]/g, '') + '" style="color:var(--primary)">' + s.phone + '</a></span>'; pc.classList.add('open'); }, 120);
      }
    });
  };

  /* ======================= ОТЗЫВЫ ======================= */
  views.reviews = function () {
    root.classList.add('no-tab', 'has-bar');
    var id = qs.get('id') || 2, p = productById(id) || PRODUCTS[0], all = Store.reviews().concat(REVIEWS);
    var cards = all.map(function (r, i) {
      var ph = ''; for (var k = 0; k < (r.photos || 0); k++) ph += '<img src="' + p.photo + '" alt="">'; if (r.photos) ph += '<i></i><i></i>';
      return '<div class="rcard" style="animation:slideRow .5s var(--ease) ' + i * 80 + 'ms both"><div class="top"><b style="font-weight:400;font-size:17px">' + esc(r.name) + '</b><span>' + r.date + '</span></div>' + stars(r.stars) + '<p>' + esc(r.text) + '</p>' + (ph ? '<div class="photos">' + ph + '</div>' : '') + '<div class="votes"><button data-vote>' + ICON.up + '<span>' + (r.likes || 0) + '</span></button><button>' + ICON.down2 + '<span>' + (r.dislikes || 0) + '</span></button></div></div>';
    }).join('');
    var bars = [78, 55, 16, 8, 6];
    root.innerHTML = topBar({ title: 'Отзывы', back: 'product.html?id=' + p.id }) + '<div style="padding:22px 16px 0"><div class="rsum"><div class="big">' + p.rating.toFixed(1) + '<small>из 5</small></div><div class="bars">' + bars.map(function (b, i) { return '<div><span class="st">' + new Array(5 - i + 1).join('<svg viewBox="0 0 24 24">' + ICON.star.replace(/<\/?svg[^>]*>/g, '') + '</svg>') + '</span><span class="tr"><i data-w="' + b + '"></i></span></div>'; }).join('') + '</div></div>' + cards + '</div>' +
      '<div class="buybar"><a class="btn" href="review-new.html?id=' + p.id + '">' + ICON.edit.replace('<svg', '<svg width="20" height="20"') + 'Написать отзыв</a></div>';
    setTimeout(function () { Array.prototype.forEach.call(document.querySelectorAll('.bars .tr i'), function (i) { i.style.width = i.getAttribute('data-w') + '%'; }); }, 400);
    root.addEventListener('click', function (e) { var v = e.target.closest('[data-vote]'); if (v) { v.classList.toggle('on'); var sp = v.querySelector('span'); sp.textContent = Number(sp.textContent) + (v.classList.contains('on') ? 1 : -1); } });
    if (qs.get('added')) setTimeout(function () { toast('Спасибо! Ваш отзыв опубликован'); }, 500);
  };

  views.reviewNew = function () {
    root.classList.add('no-tab', 'has-bar');
    var id = qs.get('id') || 2, p = productById(id) || PRODUCTS[0], rating = 0, photos = 0, u = Store.user();
    root.innerHTML = topBar({ title: 'Новый отзыв', back: 'product.html?id=' + p.id }) +
      '<div style="display:flex;gap:14px;align-items:center;padding:20px 16px 0"><img src="' + p.photo + '" alt="" style="width:64px;height:64px;border-radius:16px;object-fit:cover"><b style="font-weight:400;font-size:18px">' + esc(p.name) + '</b></div>' +
      '<div class="star-input" id="si">' + [1, 2, 3, 4, 5].map(function (i) { return '<button data-s="' + i + '" aria-label="' + i + '">' + ICON.star + '</button>'; }).join('') + '</div><div style="text-align:center;color:var(--gray);font-size:15px;min-height:22px" id="sl">Оцените букет</div>' +
      '<label class="field-l"><span>Ваш отзыв</span><textarea class="textarea" id="rt" maxlength="500" placeholder="Расскажите, что вам понравилось"></textarea><div class="counter" id="rc">0/500</div></label>' +
      '<div class="field-l"><span>Фото</span><div class="photos" id="ph" style="display:flex;gap:10px"><button class="thumbs-add" id="addPh" style="width:64px;height:64px;border-radius:16px;background:var(--surface);display:grid;place-items:center;color:var(--primary);font-size:28px">+</button></div></div>' +
      '<div class="buybar"><button class="btn" id="send">Отправить отзыв</button></div>';
    var labels = ['Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];
    document.getElementById('si').onclick = function (e) {
      var b = e.target.closest('[data-s]'); if (!b) return; rating = Number(b.getAttribute('data-s'));
      Array.prototype.forEach.call(this.children, function (x, i) { x.classList.toggle('on', i < rating); x.classList.remove('pop'); if (i < rating) { void x.offsetWidth; x.style.animationDelay = i * 50 + 'ms'; x.classList.add('pop'); } });
      document.getElementById('sl').textContent = labels[rating - 1];
    };
    document.getElementById('rt').oninput = function () { document.getElementById('rc').textContent = this.value.length + '/500'; };
    document.getElementById('addPh').onclick = function () {
      if (photos >= 3) { toast('Можно добавить до 3 фото'); return; }
      var im = document.createElement('img'); im.src = p.photo; im.style.cssText = 'width:64px;height:64px;border-radius:16px;object-fit:cover;animation:pop .35s var(--spring)'; this.before(im); photos++;
    };
    document.getElementById('send').onclick = function () {
      var t = document.getElementById('rt');
      if (!rating) { toast('Поставьте оценку'); var si = document.getElementById('si'); si.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
      if (t.value.trim().length < 3) { t.classList.remove('err'); void t.offsetWidth; t.classList.add('err'); return; }
      var d = new Date(), dd = String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
      Store.addReview({ name: u && u.name ? u.name : 'Гость', date: dd, stars: rating, text: t.value.trim(), likes: 0, dislikes: 0, photos: photos });
      location.href = 'reviews.html?id=' + p.id + '&added=1';
    };
  };

  if (views[page]) views[page]();
  rerender();
})();
