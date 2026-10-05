// Данные магазина. Фото: assets/photos (Wikimedia Commons, авторы в assets/photos/CREDITS.md)
(function () {
  var P = function (f) { return 'assets/photos/' + f + '.jpg'; };

  window.CATEGORIES = [
    { id: 'classic', name: 'Классика', photo: P('roses-classic') },
    { id: 'authors', name: 'Авторские', photo: P('roses-gerbera') },
    { id: 'box', name: 'В корзине', photo: P('tulips-pink') },
    { id: 'wild', name: 'Полевые', photo: P('daisy') },
    { id: 'wedding', name: 'Свадебные', photo: P('bridal-white-pink') }
  ];

  // day = букет дня, hit = хит, new = новинка
  window.PRODUCTS = [
    { id: 1, name: 'Авторский букет «Лолита»', cat: 'authors', photo: P('peonies-12'), price: 3000, colors: ['Розовый', 'Белый'], comp: ['Пионы — 9 шт.', 'Эвкалипт — 3 шт.', 'Упаковка — крафт'], hit: 1, rating: 4.9 },
    { id: 2, name: 'Авторский букет «Красотка»', cat: 'authors', photo: P('roses-gerbera'), price: 3000, colors: ['Розовый', 'Персиковый', 'Белый'], comp: ['Роза кустовая — 11 шт.', 'Георгин — 2 шт.', 'Гортензия — 1 шт.', 'Эустома — 3 шт.', 'Ахиллея — 2 шт.', 'Дельфиниум — 2 шт.', 'Рубус — 3 шт.'], hit: 1, day: 1, rating: 4.9 },
    { id: 3, name: 'Букет из диантуса и эвкалипта', cat: 'classic', photo: P('roses-carnation'), price: 3000, colors: ['Красный', 'Белый'], comp: ['Диантус — 11 шт.', 'Роза — 5 шт.', 'Эвкалипт — 3 шт.'], rating: 4.7 },
    { id: 4, name: 'Облачко', cat: 'authors', photo: P('hydrangea-9580'), price: 2800, colors: ['Розовый', 'Зелёный'], comp: ['Гортензия — 3 шт.', 'Гипсофила — 5 шт.'], new: 1, rating: 4.8 },
    { id: 5, name: 'Романтичный намёк', cat: 'authors', photo: P('bridal-white-pink'), price: 3000, colors: ['Розовый', 'Белый'], comp: ['Роза — 15 шт.', 'Стефанотис — 7 шт.', 'Зелень — 5 шт.'], day: 1, rating: 4.8 },
    { id: 6, name: 'Розовые розы', cat: 'classic', photo: P('roses-classic'), price: 3000, colors: ['Розовый'], comp: ['Роза розовая — 25 шт.'], hit: 1, rating: 5.0 },
    { id: 7, name: 'Солнечный день', cat: 'classic', photo: P('roses-dohren'), price: 3200, colors: ['Жёлтый', 'Оранжевый'], comp: ['Роза оранжевая — 9 шт.', 'Гиперикум — 5 шт.', 'Зелень — 5 шт.'], rating: 4.6 },
    { id: 8, name: 'Нежный букет хризантем', cat: 'wild', photo: P('chrysanthemum-purple'), price: 2200, colors: ['Фиолетовый', 'Белый'], comp: ['Хризантема кустовая — 9 шт.'], new: 1, rating: 4.5 },
    { id: 9, name: 'Букет с гортензией и каллами', cat: 'authors', photo: P('hydrangea-calla'), price: 3500, colors: ['Оранжевый', 'Белый', 'Зелёный'], comp: ['Гортензия — 2 шт.', 'Калла — 3 шт.', 'Роза — 5 шт.'], rating: 4.9 },
    { id: 10, name: 'Лилии и розы', cat: 'classic', photo: P('lilies-roses'), price: 3400, colors: ['Белый', 'Розовый'], comp: ['Лилия — 3 шт.', 'Роза белая — 11 шт.'], rating: 4.7 },
    { id: 11, name: 'Весенний микс', cat: 'box', photo: P('tulips-vienna'), price: 2500, colors: ['Разноцветный'], comp: ['Тюльпан микс — 31 шт.'], new: 1, hit: 1, rating: 4.8 },
    { id: 12, name: 'Розовые тюльпаны в корзине', cat: 'box', photo: P('tulips-pink'), price: 2700, colors: ['Розовый'], comp: ['Тюльпан — 25 шт.', 'Корзина плетёная'], rating: 4.8 },
    { id: 13, name: 'Красные тюльпаны', cat: 'box', photo: P('tulips-red'), price: 2600, colors: ['Красный'], comp: ['Тюльпан — 25 шт.', 'Корзина плетёная'], rating: 4.6 },
    { id: 14, name: 'Букет лаванды', cat: 'wild', photo: P('lavender'), price: 1800, colors: ['Фиолетовый'], comp: ['Лаванда — 1 пучок'], rating: 4.7 },
    { id: 15, name: 'Букет ромашек', cat: 'wild', photo: P('daisy'), price: 1900, colors: ['Белый'], comp: ['Ромашка — 25 шт.', 'Гипсофила — 3 шт.'], hit: 1, rating: 4.9 },
    { id: 16, name: 'Солнечное настроение', cat: 'authors', photo: P('birthday'), price: 2400, colors: ['Жёлтый'], comp: ['Гербера — 11 шт.', 'Зелень — 3 шт.'], rating: 4.5 },
    { id: 17, name: 'Букет невесты «Нежность»', cat: 'wedding', photo: P('bridal-unsplash'), price: 4500, colors: ['Розовый', 'Персиковый'], comp: ['Роза — 9 шт.', 'Ранункулюс — 5 шт.', 'Зелень — 5 шт.'], day: 1, rating: 5.0 },
    { id: 18, name: 'Свадебный букет', cat: 'wedding', photo: P('beach-wedding'), price: 5000, colors: ['Белый', 'Сиреневый'], comp: ['Роза — 11 шт.', 'Лизиантус — 5 шт.', 'Эвкалипт — 5 шт.'], new: 1, rating: 4.9 },
    { id: 19, name: 'Пионы нежные', cat: 'classic', photo: P('peonies-01'), price: 3800, colors: ['Розовый'], comp: ['Пион — 11 шт.'], new: 1, rating: 4.8 },
    { id: 20, name: 'Яркий микс', cat: 'authors', photo: P('mixed-12'), price: 3100, colors: ['Красный', 'Жёлтый', 'Розовый'], comp: ['Роза — 7 шт.', 'Гербера — 5 шт.', 'Хризантема — 3 шт.', 'Гладиолус — 3 шт.'], rating: 4.4 },
    { id: 21, name: 'Осенний букет', cat: 'wild', photo: P('chrysanthemum-yellow'), price: 2300, colors: ['Жёлтый', 'Бордовый'], comp: ['Хризантема — 5 шт.', 'Георгин — 3 шт.', 'Зелень — 3 шт.'], rating: 4.6 }
  ];

  window.SIZES = [
    { id: 'M', name: 'Маленький', label: 'M', sm: 30, mult: 1 },
    { id: 'L', name: 'Средний', label: 'L', sm: 50, mult: 1.6 },
    { id: 'XL', name: 'Большой', label: 'XL', sm: 80, mult: 2.4 }
  ];

  window.ADDONS = [
    { id: 'a1', name: 'Конфеты Raffaello', price: 400, icon: '🍬' },
    { id: 'a2', name: 'Плюшевый мишка', price: 1500, icon: '🧸' },
    { id: 'a3', name: 'Ваза стеклянная', price: 900, icon: '🏺' }
  ];

  window.PROMOS = { 'ЯБЛОНЬКА': 1000, 'ВЕСНА': 500 };

  window.SALONS = {
    main: [{ addr: 'ул. Ленина, 20', time: 'с 8:00 до 21:00', phone: '+7 (3812) 660-888', x: 38, y: 62 }],
    branches: [
      { addr: 'ул. 70 лет Октября, 13/4 (ост. Дмитриева)', time: 'Круглосуточно', phone: '+7 (3812) 293-814', x: 20, y: 24 },
      { addr: 'ул. Дианова, 14 (площадь у «АТ-маркет»)', time: 'Круглосуточно', phone: '+7 (3812) 634-018', x: 66, y: 30 },
      { addr: 'ул. 70 лет Октября, 6/2 (ост. Поворотная)', time: 'Круглосуточно', phone: '+7 (3812) 294-230', x: 28, y: 44 },
      { addr: 'ул. Заозерная, 11/1 лит. А (пл. Первомайского рынка)', time: 'Круглосуточно', phone: '+7 (3812) 294-311', x: 74, y: 56 },
      { addr: 'пр-кт Космический, 17 Б (к/т «Космос»)', time: 'Круглосуточно', phone: '+7 (3812) 209-048', x: 56, y: 76 },
      { addr: 'ул. 21-я Амурская, 12/1', time: 'Круглосуточно', phone: '+7 (3812) 209-025', x: 14, y: 70 },
      { addr: 'пр-т Мира, 17 (к/т «Кристалл»)', time: 'Круглосуточно', phone: '+7 (3812) 909-080', x: 82, y: 82 },
      { addr: 'ул. Кирова 9 к.1', time: 'Круглосуточно', phone: '+7 (3812) 209-595', x: 48, y: 14 }
    ],
    plus: [{ addr: 'пр. Мира, 60/7', time: 'Круглосуточно', phone: '+7 913 963-22-13', x: 88, y: 40 }]
  };

  window.REVIEWS = [
    { name: 'Дмитрий Колыханов', date: '08.09.2020', stars: 5, text: 'Замечательные услуги! Индивидуальный подход, очень терпеливо был подобран букет с учётом всех предпочтений. Ценовые категории на любые возможности. Консультанты просто золотце, флористы знают свою работу. Все очень чутко и красиво! Очень быстрая доставка, цветы свежие, стояли больше двух недель.', likes: 45, dislikes: 4, photos: 4 },
    { name: 'Надежда Тим', date: '07.09.2020', stars: 4, text: 'Сделали всё в лучшем виде. Композиции в живую лучше, чем на фото.', likes: 4, dislikes: 0, photos: 0 },
    { name: 'Алена Вахницкая', date: '06.09.2020', stars: 1, text: 'Цветы отстой!', likes: 2, dislikes: 58, photos: 0 }
  ];

  window.ARTICLES = [
    { id: 1, title: 'Опасны ли растения в комнате', text: 'Одно из наиболее частых заблуждений несведущих людей заключается в том, что комнатные растения вредят здоровью, поскольку по ночам забирают кислород.', date: '1 июня 2021 в 10:00', views: 500, photo: P('hydrangea-9580') },
    { id: 2, title: 'Уход за цветами в вазе', text: 'Что сделать, чтобы букет простоял как можно дольше: подрезка стебля, вода, подкормка и место в комнате.', date: '2 июля 2021 в 14:00', views: 320, photo: P('peonies-12') },
    { id: 3, title: 'Как выбрать букет на свадьбу', text: 'Форма, цвет, размер: несколько простых правил, которые помогут подобрать букет невесты.', date: '15 июля 2021 в 11:30', views: 210, photo: P('bridal-white-pink') }
  ];

  window.DELIVERY = {
    city: { name: 'По Омску', desc: 'Доставка в пределах города', price: 350, from: true },
    region: { name: 'По Омской области', desc: 'Доставка в пределах области. +30 ₽/км', price: 380, from: true },
    pickup: { name: 'Самовывоз', desc: 'Забронируй онлайн и получи в магазине по адресу г. Омск, ул. Ленина, д. 20', price: 0 }
  };

  window.productById = function (id) { return window.PRODUCTS.filter(function (p) { return p.id === Number(id); })[0]; };
  window.priceFor = function (p, sizeId) {
    var s = window.SIZES.filter(function (x) { return x.id === sizeId; })[0] || window.SIZES[0];
    return Math.round(p.price * s.mult / 100) * 100;
  };
})();
