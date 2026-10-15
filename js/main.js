// ===== Мобильное меню (на весь экран) =====
(function () {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;
  const toggle = (open) => {
    burger.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  burger.addEventListener('click', () => toggle(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
})();

// ===== Шапка темнеет после начала прокрутки =====
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 40);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// ===== Аккордеон «Услуги и цены» =====
(function () {
  const items = document.querySelectorAll('.accordion .acc-item');
  if (!items.length) return;
  items.forEach((item) => {
    const head = item.querySelector('.acc-head');
    head.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
})();

// ===== Плавное появление блоков при прокрутке =====
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const selector = [
    '.section-title', '.eyebrow', '.prices-hint', '.section-head p',
    '.why-card', '.service-tile', '.offer-card', '.review-card', '.reviews-head',
    '.about-photo', '.about-text > *', '.gallery-thumb', '.gallery-insta',
    '.mood-photo', '.strip-photo', '.team-card', '.acc-item', '.cta-band p', '.cta-band .cta-pair',
  ].join(',');
  const els = Array.from(document.querySelectorAll(selector)).filter((el) => !el.closest('.hero'));
  // Соседи в одной сетке появляются лесенкой
  els.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((s) => els.includes(s));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i, 5) * 0.09}s`);
    el.classList.add('reveal');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach((el) => io.observe(el));
})();

// ===== Карусель «Мастера» =====
(function () {
  const track = document.getElementById('teamTrack');
  if (!track) return;

  const prev = document.getElementById('teamPrev');
  const next = document.getElementById('teamNext');
  const dotsBox = document.getElementById('teamDots');
  const cards = Array.from(track.children);

  function perView() {
    if (window.innerWidth <= 520) return 1;
    if (window.innerWidth <= 900) return 2;
    return 4;
  }

  let index = 0;

  function maxIndex() {
    return Math.max(0, cards.length - perView());
  }

  function buildDots() {
    dotsBox.innerHTML = '';
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Слайд ${i + 1}`);
      b.addEventListener('click', () => go(i));
      dotsBox.appendChild(b);
    }
  }

  function update() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * step}px)`;
    Array.from(dotsBox.children).forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function go(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    update();
  }

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      index = Math.min(index, maxIndex());
      buildDots();
      update();
    }, 150);
  });

  buildDots();
  update();
})();
