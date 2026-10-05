// Страницы магазина: главная, поиск, каталог, карточка товара, избранное
(function () {
  var page = document.body.getAttribute('data-page');
  var root = document.getElementById('page');
  var qs = new URLSearchParams(location.search);
  var P = window.PRODUCTS;

  var views = {};

  /* ======================= ГЛАВНАЯ ======================= */
  views.home = function () {
    var banners = [
      { cls: '', small: 'Дарим доставку на', b: 'Букет<br>невест', span: 'Период проведения<br>акции с 29.08 по 01.09', img: 'assets/photos/bridal-white-pink.jpg' },
      { cls: 'b2', small: 'Скидка 15% на', b: 'Тюльпаны', span: 'Только до конца<br>недели', img: 'assets/photos/tulips-vienna.jpg' },
      { cls: 'b3', small: 'Каждый день', b: 'Букет дня', span: 'Свежая композиция<br>по специальной цене', img: 'assets/photos/roses-classic.jpg' }
    ];
    var news = ARTICLES.map(function (a) {
      return '<div class="news reveal"><div class="ph"><img src="' + a.photo + '" alt="" loading="lazy"></div><h3>' + esc(a.title) + '</h3><p>' + esc(a.text) + '</p><small>' + a.date + ' · ' + a.views + ' просмотров</small></div>';
    }).join('');
    var skel = '<div class="skel-card"><div class="skel a"></div><div class="skel b"></div><div class="skel c"></div></div>';
    root.innerHTML = brandBar() +
      '<div class="banners" id="banners">' + banners.map(function (b) {
        return '<a class="banner ' + b.cls + '" href="catalog.html?c=all"><div class="bt"><small>' + b.small + '</small><b>' + b.b + '</b><span>' + b.span + '</span></div><img src="' + b.img + '" alt=""></a>';
      }).join('') + '</div><div class="dots" id="dots">' + banners.map(function (_, i) { return '<i class="' + (i ? '' : 'on') + '"></i>'; }).join('') + '</div>' +
      '<section class="section"><h2>Популярные товары</h2><div class="hscroll" id="popular">' + skel + skel + skel + '</div></section>' +
      '<section class="section"><h2>Букеты со скидкой</h2><div class="hscroll" id="sale">' + skel + skel + skel + '</div></section>' +
      '<section class="section"><h2>Статьи и новости</h2><div class="hscroll">' + news + '</div></section>';

    setTimeout(function () {
      var pop = P.filter(function (p) { return p.hit; }).slice(0, 7);
      var sale = P.filter(function (p) { return p.day || p.new || p.rating >= 4.8; }).slice(0, 7).reverse();
      document.getElementById('popular').innerHTML = pop.map(function (p, i) { return productCard(p, 'tile', i * 70); }).join('');
      document.getElementById('sale').innerHTML = sale.map(function (p, i) { return productCard(p, 'tile', i * 70); }).join('');
    }, 550);

    // карусель баннеров: точки и автопрокрутка
    var bn = document.getElementById('banners'), dots = document.querySelectorAll('#dots i'), cur = 0, timer;
    function go(i) { cur = i; var el = bn.children[i]; bn.scrollTo({ left: el.offsetLeft - (bn.clientWidth - el.clientWidth) / 2, behavior: 'smooth' }); }
    bn.addEventListener('scroll', function () {
      var c = bn.scrollLeft + bn.clientWidth / 2, best = 0, bd = 1e9;
      Array.prototype.forEach.call(bn.children, function (el, i) { var d = Math.abs(el.offsetLeft + el.clientWidth / 2 - c); if (d < bd) { bd = d; best = i; } });
      cur = best; dots.forEach(function (d, i) { d.classList.toggle('on', i === best); });
    }, { passive: true });
    function auto() { timer = setInterval(function () { go((cur + 1) % banners.length); }, 4200); }
    ['pointerdown', 'touchstart', 'wheel'].forEach(function (ev) { bn.addEventListener(ev, function () { clearInterval(timer); }, { passive: true }); });
    auto();
  };

  /* ======================= ПОИСК ======================= */
  views.search = function () {
    root.innerHTML = '<div class="searchbar"><div class="field">' + ICON.search + '<input id="q" type="search" placeholder="Найти товар" autocomplete="off" autofocus><button class="clear hidden" id="clr" aria-label="Очистить">×</button></div><button class="cancel" id="cancel">Отменить</button></div><div id="out"></div>';
    var q = document.getElementById('q'), out = document.getElementById('out'), clr = document.getElementById('clr'), t;
    function recent() {
      out.innerHTML = '<div class="recent"><h3>Недавние запросы</h3><div class="chips">' + Store.recent().map(function (r) { return '<button class="chip" data-q="' + esc(r) + '">' + esc(r) + '</button>'; }).join('') + '</div></div>';
    }
    function run(v) {
      var needle = v.trim().toLowerCase();
      if (!needle) { recent(); return; }
      out.innerHTML = '<div class="spinner"></div>';
      clearTimeout(t);
      t = setTimeout(function () {
        var res = P.filter(function (p) { return p.name.toLowerCase().indexOf(needle) >= 0 || p.comp.join(' ').toLowerCase().indexOf(needle) >= 0 || p.colors.join(' ').toLowerCase().indexOf(needle) >= 0; });
        if (!res.length) {
          out.innerHTML = '<div class="empty">' + ICON.sadLens + '<h3>Ничего не найдено</h3><p>Нам жаль, но мы ничего не смогли найти по вашему запросу «' + esc(v) + '»</p></div>';
          return;
        }
        var re = new RegExp('(' + needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
        out.innerHTML = '<div class="sres">' + res.map(function (p, i) {
          return '<a href="product.html?id=' + p.id + '" data-save style="animation-delay:' + i * 35 + 'ms"><img src="' + p.photo + '" alt=""><span>' + esc(p.name).replace(re, '<mark>$1</mark>') + '</span></a>';
        }).join('') + '</div>';
      }, 380);
    }
    q.addEventListener('input', function () { clr.classList.toggle('hidden', !q.value); run(q.value); });
    q.addEventListener('keydown', function (e) { if (e.key === 'Enter' && q.value.trim()) { Store.addRecent(q.value.trim()); q.blur(); } });
    clr.onclick = function () { q.value = ''; clr.classList.add('hidden'); q.focus(); run(''); };
    document.getElementById('cancel').onclick = function () { if (history.length > 1) history.back(); else location.href = 'index.html'; };
    out.addEventListener('click', function (e) {
      var c = e.target.closest('[data-q]'); if (c) { q.value = c.getAttribute('data-q'); clr.classList.remove('hidden'); run(q.value); }
      var l = e.target.closest('[data-save]'); if (l && q.value.trim()) Store.addRecent(q.value.trim());
    });
    if (qs.get('q')) { q.value = qs.get('q'); clr.classList.remove('hidden'); run(q.value); } else recent();
  };

  /* ======================= КАТАЛОГ ======================= */
  views.catalog = function () {
    var state = { cat: qs.get('c') || 'classic', view: 'tile', day: false, hit: false, isNew: false, max: 6000, colors: [], comps: [], size: 'M' };
    var allColors = {}, allComps = {};
    P.forEach(function (p) { p.colors.forEach(function (c) { allColors[c] = 1; }); p.comp.forEach(function (c) { var n = c.split(' — ')[0]; if (!/Упаковка|Корзина/.test(n)) allComps[n] = 1; }); });
    var colorHex = { 'Розовый': '#f4a6c0', 'Белый': '#ffffff', 'Красный': '#d62839', 'Жёлтый': '#f7dc4a', 'Оранжевый': '#f5923e', 'Фиолетовый': '#8a5cc2', 'Зелёный': '#6fbf73', 'Персиковый': '#ffc9a8', 'Сиреневый': '#c9b3e6', 'Бордовый': '#7b1d32', 'Разноцветный': 'linear-gradient(135deg,#f66,#fd6,#6c9,#69f)' };
    var cats = [{ id: 'all', name: 'Все', photo: 'assets/photos/mixed-12.jpg' }].concat(CATEGORIES);

    root.innerHTML = brandBar() + '<div class="cats" id="cats"></div><div class="cat-head"><span id="ctitle"></span><div class="view-toggle"><button id="vList" aria-label="Список">' + ICON.rows + '</button><button id="vTile" class="on" aria-label="Плитка">' + ICON.grid + '</button></div></div><div id="items"></div>';
    var fab = document.createElement('button'); fab.className = 'fab-filter'; fab.innerHTML = ICON.filter + 'Фильтр<span class="badge hidden" id="fcnt"></span>';
    document.querySelector('.app').appendChild(fab);

    function filtered() {
      return P.filter(function (p) {
        if (state.cat !== 'all' && p.cat !== state.cat) return false;
        if (state.day && !p.day) return false; if (state.hit && !p.hit) return false; if (state.isNew && !p.new) return false;
        if (priceFor(p, state.size) > state.max * (state.size === 'M' ? 1 : state.size === 'L' ? 1.6 : 2.4)) return false;
        if (state.colors.length && !state.colors.some(function (c) { return p.colors.indexOf(c) >= 0; })) return false;
        if (state.comps.length && !state.comps.some(function (c) { return p.comp.join('|').indexOf(c) >= 0; })) return false;
        return true;
      });
    }
    function activeCount() { return (state.day ? 1 : 0) + (state.hit ? 1 : 0) + (state.isNew ? 1 : 0) + (state.max < 6000 ? 1 : 0) + (state.colors.length ? 1 : 0) + (state.comps.length ? 1 : 0) + (state.size !== 'M' ? 1 : 0); }
    function drawCats() {
      document.getElementById('cats').innerHTML = cats.map(function (c) { return '<button class="cat' + (c.id === state.cat ? ' on' : '') + '" data-c="' + c.id + '"><div class="ci"><img src="' + c.photo + '" alt=""></div>' + c.name + '</button>'; }).join('');
    }
    function drawItems() {
      var list = filtered(), c = cats.filter(function (x) { return x.id === state.cat; })[0];
      document.getElementById('ctitle').textContent = c.name + ' · ' + list.length;
      var box = document.getElementById('items');
      if (!list.length) { box.innerHTML = '<div class="empty" style="padding-top:60px">' + ICON.sadLens + '<h3>Ничего не нашли</h3><p>Попробуйте изменить фильтры</p><button class="btn outline" id="resetF">Сбросить фильтры</button></div>'; var r = document.getElementById('resetF'); if (r) r.onclick = function () { state.day = state.hit = state.isNew = false; state.max = 6000; state.colors = []; state.comps = []; state.size = 'M'; drawItems(); }; }
      else box.innerHTML = '<div class="' + (state.view === 'tile' ? 'grid2' : 'list') + '">' + list.map(function (p, i) { return productCard(Object.assign({}, p, { price: priceFor(p, state.size) }), state.view, Math.min(i, 8) * 55); }).join('') + '</div>';
      var n = activeCount(), b = document.getElementById('fcnt'); b.textContent = n; b.classList.toggle('hidden', !n);
      document.getElementById('vList').classList.toggle('on', state.view === 'list'); document.getElementById('vTile').classList.toggle('on', state.view === 'tile');
    }
    drawCats(); drawItems();
    document.getElementById('cats').addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (!b) return; state.cat = b.getAttribute('data-c'); drawCats(); drawItems(); });
    document.getElementById('vList').onclick = function () { state.view = 'list'; drawItems(); };
    document.getElementById('vTile').onclick = function () { state.view = 'tile'; drawItems(); };

    // шторка фильтров с вложенными экранами
    var sh = document.createElement('div'); sh.className = 'sheet'; document.body.appendChild(sh);
    var screen = 'root';
    function sw(key, label) { return '<div class="row"><span>' + label + '</span><label class="switch"><input type="checkbox" data-sw="' + key + '"' + (state[key] ? ' checked' : '') + '><i></i></label></div>'; }
    function drawSheet(back) {
      var head = function (title, left, right) { return '<div class="grab"></div><div class="sh-head"><button data-act="' + left[1] + '">' + left[0] + '</button><span>' + title + '</span><button class="r" data-act="reset">' + (right || '') + '</button></div>'; };
      var html;
      if (screen === 'root') {
        html = head('Фильтры', ['Закрыть', 'close'], activeCount() ? 'Сбросить' : '') +
          sw('day', 'Букет дня') + sw('hit', 'Хит') + sw('isNew', 'Новинки') +
          [['price', 'Цена', state.max < 6000 ? 'до ' + rub(state.max) : ''], ['color', 'Цвет', state.colors.join(', ')], ['comp', 'Состав', state.comps.join(', ')], ['size', 'Размер', state.size !== 'M' ? state.size : '']].map(function (r) {
            return '<button class="row" data-go="' + r[0] + '"><span>' + r[1] + '</span><small>' + esc(r[2]) + '</small><span class="chev">' + ICON.chev + '</span></button>';
          }).join('') +
          '<div style="padding:18px 16px 0"><button class="btn" data-act="apply">Показать ' + filtered().length + ' ' + (filtered().length === 1 ? 'букет' : 'букетов') + '</button></div>';
      } else if (screen === 'price') {
        html = head('Цена', ['Назад', 'back'], '') + '<div class="sheet-body"><h4>Максимальная цена за размер M</h4><input class="range" id="rng" type="range" min="1500" max="6000" step="100" value="' + state.max + '"><div class="range-vals"><span>1 500 ₽</span><b id="rv" style="color:var(--ink)">' + rub(state.max) + '</b><span>6 000 ₽</span></div></div>';
      } else if (screen === 'color') {
        html = head('Цвет', ['Назад', 'back'], '') + '<div class="sheet-body"><div class="swatches">' + Object.keys(allColors).map(function (c) { return '<button class="swatch' + (state.colors.indexOf(c) >= 0 ? ' on' : '') + '" data-color="' + c + '"><i style="background:' + colorHex[c] + '"></i>' + c + '</button>'; }).join('') + '</div></div>';
      } else if (screen === 'comp') {
        html = head('Состав', ['Назад', 'back'], '') + '<div class="sheet-body"><div class="chips">' + Object.keys(allComps).sort().map(function (c) { return '<button class="chip' + (state.comps.indexOf(c) >= 0 ? ' on' : '') + '" data-comp="' + c + '">' + c + '</button>'; }).join('') + '</div></div>';
      } else {
        html = head('Размер', ['Назад', 'back'], '') + '<div style="padding-top:8px">' + SIZES.map(function (s) { return '<button class="radio' + (state.size === s.id ? ' on' : '') + '" data-size="' + s.id + '" style="padding:14px 16px;border-bottom:1px solid var(--line)"><i></i><span>' + s.name + ' ' + s.label + ' (' + s.sm + ' см)</span></button>'; }).join('') + '</div>';
      }
      sh.innerHTML = html;
      var inner = sh.firstElementChild; if (inner && back !== undefined) { sh.style.animation = ''; }
    }
    sh.addEventListener('click', function (e) {
      var t = e.target.closest('[data-act],[data-go],[data-color],[data-comp],[data-size]'); if (!t) return;
      var act = t.getAttribute('data-act');
      if (t.hasAttribute('data-go')) { screen = t.getAttribute('data-go'); drawSheet(); }
      else if (act === 'close' || act === 'apply') { Sheet.close(sh); drawItems(); }
      else if (act === 'back') { screen = 'root'; drawSheet(); drawItems(); }
      else if (act === 'reset') { state.day = state.hit = state.isNew = false; state.max = 6000; state.colors = []; state.comps = []; state.size = 'M'; drawSheet(); drawItems(); }
      else if (t.hasAttribute('data-color')) { var c = t.getAttribute('data-color'), i = state.colors.indexOf(c); if (i < 0) state.colors.push(c); else state.colors.splice(i, 1); drawSheet(); }
      else if (t.hasAttribute('data-comp')) { var k = t.getAttribute('data-comp'), j = state.comps.indexOf(k); if (j < 0) state.comps.push(k); else state.comps.splice(j, 1); drawSheet(); }
      else if (t.hasAttribute('data-size')) { state.size = t.getAttribute('data-size'); drawSheet(); }
    });
    sh.addEventListener('change', function (e) { var k = e.target.getAttribute('data-sw'); if (k) { state[k] = e.target.checked; drawSheet(); drawItems(); sh.querySelector('[data-sw="' + k + '"]'); } });
    sh.addEventListener('input', function (e) { if (e.target.id === 'rng') { state.max = Number(e.target.value); document.getElementById('rv').textContent = rub(state.max); } });
    fab.onclick = function () { screen = 'root'; drawSheet(); Sheet.open(sh); };
  };

  /* ======================= ТОВАР ======================= */
  views.product = function () {
    var p = productById(qs.get('id')) || P[0], size = 'M', qty = 1, fav = Store.isFav(p.id);
    var rel = P.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }), more = P.filter(function (x) { return x.id !== p.id; });
    var gal = [p.photo].concat(rel.slice(0, 2).map(function (x) { return x.photo; }), more.slice(5, 6).map(function (x) { return x.photo; }));
    var revs = Store.reviews().concat(REVIEWS);
    var total = REVIEWS.length + Store.reviews().length;
    var bars = [78, 55, 16, 8, 6];
    var rv = revs.slice(0, 3).map(function (r) {
      var ph = ''; for (var i = 0; i < (r.photos || 0); i++) ph += '<img src="' + gal[i % gal.length] + '" alt="">'; if (r.photos) ph += '<i></i><i></i>';
      return '<div class="rcard reveal"><div class="top"><b style="font-weight:400;font-size:17px">' + esc(r.name) + '</b><span>' + r.date + '</span></div>' + stars(r.stars) + '<p>' + esc(r.text) + '</p>' + (ph ? '<div class="photos">' + ph + '</div>' : '') +
        '<div class="votes"><button class="' + (r.likes > 20 ? 'on' : '') + '" data-vote>' + ICON.up + '<span>' + (r.likes || 0) + '</span></button><button>' + ICON.down2 + '<span>' + (r.dislikes || 0) + '</span></button></div></div>';
    }).join('');
    var similar = rel.concat(more).slice(0, 6);

    root.innerHTML =
      '<div class="pgal"><img class="main" id="mainImg" src="' + p.photo + '" alt="' + esc(p.name) + '"><a class="round l" href="javascript:history.back()" aria-label="Назад">' + ICON.down + '</a><a class="round r" id="cartBtn" href="cart.html" aria-label="Корзина">' + ICON.cart + '<span class="badge" id="pbadge"></span></a></div>' +
      '<div class="psheet"><div class="thumbs" id="thumbs">' + gal.map(function (g, i) { return '<button class="' + (i ? '' : 'on') + '" data-i="' + i + '"><img src="' + g + '" alt=""></button>'; }).join('') + '</div>' +
      '<div class="ptitle"><h1>' + esc(p.name) + '</h1><button class="heart' + (fav ? ' on' : '') + '" data-fav="' + p.id + '" aria-label="В избранное">' + ICON.heart + '</button></div>' +
      '<div class="rate-row"><b>' + p.rating.toFixed(1) + '</b>' + stars(Math.round(p.rating)) + '<span>' + total + ' отзывов</span><button class="share" id="share">' + ICON.share + 'Поделиться</button></div>' +
      '<p class="pdesc">Букет, в который вложено много любви. Флористы сделали его из свежих цветов, тщательно продумав состав. Теперь он готов удивить красотой своего получателя!</p>' +
      '<div class="seg" id="seg"><div class="thumb"></div>' + SIZES.map(function (s) { return '<button data-s="' + s.id + '">' + s.name + ' ' + s.label + '<small>' + s.sm + ' см</small></button>'; }).join('') + '</div>' +
      '<div class="dl"><h3>Характеристики</h3><div class="kv"><span>Цвет:</span><span>' + p.colors.join(', ') + '</span><span>Состав букета:</span><div><div id="comp"></div><button class="more" id="moreBtn">Показать ещё ' + ICON.down + '</button></div></div>' +
      '<h3>Доставка по Омску</h3><div class="dots-line"><span>с 8:00 до 21:00</span><span>350 ₽</span></div><div class="dots-line"><span>с 21:00 до 8:00</span><span>500 ₽</span></div>' +
      '<h3 style="display:flex;justify-content:space-between;align-items:baseline;border:0;padding-bottom:4px">' + total + ' отзывов <a href="reviews.html?id=' + p.id + '" style="color:var(--primary);font-size:16px">См. все</a></h3>' +
      '<div class="rsum" id="rsum"><div class="big">' + p.rating.toFixed(1) + '<small>из 5</small></div><div class="bars">' + bars.map(function (b, i) { return '<div><span class="st">' + new Array(5 - i + 1).join('<svg viewBox="0 0 24 24">' + ICON.star.replace(/<\/?svg[^>]*>/g, '') + '</svg>') + '</span><span class="tr"><i data-w="' + b + '"></i></span></div>'; }).join('') + '</div></div>' +
      '<a class="btn outline sm" style="margin:16px 0 4px" href="review-new.html?id=' + p.id + '">' + ICON.edit.replace('<svg', '<svg width="18" height="18"') + 'Написать отзыв</a>' + rv +
      '<a class="link-row" style="padding:12px 0;font-size:16px" href="reviews.html?id=' + p.id + '">Посмотреть все отзывы' + ICON.chev + '</a>' +
      '<h3>С этим товаром ищут</h3><div class="chips" style="padding-bottom:8px">' + ['букетдня', 'розы', 'цветыжизни', 'цветыомск'].map(function (c) { return '<a class="chip" href="search.html?q=' + c.replace('букетдня', 'букет') + '">' + c + '</a>'; }).join('') + '</div></div>' +
      '<h2 class="h2 reveal" style="padding-top:22px">Похожие товары</h2><div class="hscroll reveal">' + similar.map(function (x) { return productCard(x, 'tile'); }).join('') + '</div></div>' +
      '<div class="buybar"><div class="qty"><button id="qm" aria-label="Меньше" disabled>−</button><b id="qn">1</b><button id="qp" aria-label="Больше">+</button></div><button class="btn" id="buy"></button></div>';
    root.classList.add('no-tab', 'has-bar');
    var tb = document.querySelector('.tabbar'); if (tb) tb.remove();

    function renderComp(full) { document.getElementById('comp').innerHTML = (full ? p.comp : p.comp.slice(0, 3)).map(function (c) { return '<div style="margin-bottom:4px">' + esc(c) + '</div>'; }).join(''); }
    renderComp(false);
    var mb = document.getElementById('moreBtn'); if (p.comp.length <= 3) mb.style.display = 'none';
    mb.onclick = function () { var open = mb.classList.toggle('open'); renderComp(open); mb.firstChild.nodeValue = open ? 'Свернуть ' : 'Показать ещё '; };
    var seg = document.getElementById('seg');
    function drawSeg() { var i = SIZES.map(function (s) { return s.id; }).indexOf(size); seg.querySelector('.thumb').style.transform = 'translateX(' + i * 100 + '%)'; Array.prototype.forEach.call(seg.querySelectorAll('button'), function (b) { b.style.color = b.getAttribute('data-s') === size ? 'var(--ink)' : 'var(--gray)'; }); }
    function drawBuy() { var b = document.getElementById('buy'); if (b.getAttribute('data-done')) return; b.innerHTML = 'В корзину за <span class="num-anim" id="bp">' + rub(priceFor(p, size) * qty) + '</span>'; }
    function pulse() { var el = document.getElementById('bp'); if (el) { el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); } }
    seg.onclick = function (e) { var b = e.target.closest('[data-s]'); if (!b) return; size = b.getAttribute('data-s'); drawSeg(); drawBuy(); pulse(); };
    drawSeg(); drawBuy();
    document.getElementById('qp').onclick = function () { qty++; upd(); };
    document.getElementById('qm').onclick = function () { qty = Math.max(1, qty - 1); upd(); };
    function upd() { var n = document.getElementById('qn'); n.textContent = qty; n.classList.remove('tick'); void n.offsetWidth; n.classList.add('tick'); document.getElementById('qm').disabled = qty <= 1; drawBuy(); pulse(); }
    document.getElementById('thumbs').onclick = function (e) {
      var b = e.target.closest('[data-i]'); if (!b) return; var img = document.getElementById('mainImg');
      Array.prototype.forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
      img.style.animation = 'none'; void img.offsetWidth; img.src = gal[b.getAttribute('data-i')]; img.style.animation = 'zoomIn .6s var(--ease) both';
    };
    function badge() { var n = Store.cartCount(), b = document.getElementById('pbadge'); b.textContent = n; b.style.display = n ? '' : 'none'; }
    badge(); document.addEventListener('store', function (e) { if (e.detail === 'cart') { badge(); var b = document.getElementById('pbadge'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } });
    document.getElementById('buy').onclick = function () {
      var b = this;
      if (b.getAttribute('data-done')) { location.href = 'cart.html'; return; }
      Store.addToCart(p.id, size, qty); flyToCart(p.photo, b);
      b.setAttribute('data-done', '1'); b.innerHTML = ICON.check.replace('<svg', '<svg width="22" height="22"') + ' В корзине · Перейти';
    };
    document.getElementById('share').onclick = function () {
      var url = location.href; if (navigator.share) { navigator.share({ title: p.name, url: url }).catch(function () {}); }
      else { try { navigator.clipboard.writeText(url); } catch (e) {} toast('Ссылка скопирована'); }
    };
    root.addEventListener('click', function (e) { var v = e.target.closest('[data-vote]'); if (v) { v.classList.toggle('on'); var sp = v.querySelector('span'); sp.textContent = Number(sp.textContent) + (v.classList.contains('on') ? 1 : -1); } });
    setTimeout(function () { Array.prototype.forEach.call(document.querySelectorAll('.bars .tr i'), function (i) { i.style.width = i.getAttribute('data-w') + '%'; }); }, 500);
  };

  /* ======================= ИЗБРАННОЕ ======================= */
  views.favorites = function () {
    function draw() {
      var list = Store.favs().map(function (id) { return productById(id); }).filter(Boolean);
      root.innerHTML = topBar({ title: 'Избранные товары' }) + (list.length ? '<div class="list" style="padding-top:22px">' + list.map(function (p, i) { return productCard(p, 'list', i * 70); }).join('') + '</div>' :
        '<div class="empty">' + ICON.sadHeart + '<h3>Нет избранного</h3><p>Нажмите на сердечко у понравившегося букета, и он появится здесь</p><a class="btn" href="catalog.html">В каталог</a></div>');
    }
    draw();
    document.addEventListener('favchange', function (e) {
      var card = document.querySelector('.card[href="product.html?id=' + e.detail + '"]');
      if (card) { card.style.transition = 'opacity .35s, transform .35s'; card.style.opacity = '0'; card.style.transform = 'translateX(-30px)'; setTimeout(draw, 360); }
    });
  };

  if (views[page]) views[page]();
  rerender();
})();
