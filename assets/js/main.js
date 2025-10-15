// === LAZY LOADING ===
const lazyObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const t = +(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('is-in'), t);
      lazyObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-img').forEach(el => lazyObserver.observe(el));

// === LAZY VIDEO ===
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target.querySelector('video');
      const source = video?.querySelector('source[data-src]');
      if (source && !source.src) {
        source.src = source.dataset.src;
        video.load();
        video.play().catch(() => {});
      }
      videoObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('[data-lazy-video]').forEach(section => {
  videoObserver.observe(section);
});

// === NAV ===
const nav = document.querySelector('.nav');
const burger = document.getElementById('navBurger');

const setNavH = () => {
  document.documentElement.style.setProperty('--nav-h', nav?.offsetHeight + 'px');
};
setNavH();
window.addEventListener('resize', setNavH);

burger?.addEventListener('click', () => {
  nav.classList.toggle('is-open');
  const expanded = nav.classList.contains('is-open');
  burger.setAttribute('aria-expanded', String(expanded));
});

nav?.querySelectorAll('.nav__menu a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  })
);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    nav.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  }
});

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// === HERO SLIDESHOW ===
const heroBg = document.getElementById('heroBg');
const heroImages = [
  './assets/img/hero.jpg',
  './assets/img/hero-2.jpg',
  './assets/img/hero-3.jpg',
];

let heroIndex = 0;
heroBg.innerHTML = heroImages.map((src, i) =>
  `<img src="${src}" alt="Hero slide ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" class="${i === 0 ? 'is-active' : ''}">`
).join('');

const heroSlides = heroBg.querySelectorAll('img');
setInterval(() => {
  heroSlides[heroIndex].classList.remove('is-active');
  heroIndex = (heroIndex + 1) % heroSlides.length;
  heroSlides[heroIndex].classList.add('is-active');
}, 8000);

// === GSAP ANIMATIONS ===
document.addEventListener('DOMContentLoaded', () => {
  const animationOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!animationOk) return;

  const tl = gsap.timeline({
    delay: 1.2,
    defaults: {
      transformOrigin: 'right center',
      ease: 'expo.out',
      duration: 1.2,
      stagger: { each: 0.4, from: 'end' }
    }
  });

  tl.set('.fouc--hero', { opacity: 1 })
    .from('.hero__swipe-1', { scaleX: 0 })
    .from('.hero__swipe-2', { scaleX: 0 }, '<')
    .from('.hero__swipe-3', { scaleX: 0 }, '<')
    .from('.hero__swipe-4', { scaleX: 0 }, '<')
    .from('.hero__circle', {
      duration: 0.7,
      transformOrigin: 'center',
      opacity: 0,
      scale: 0.7,
      ease: 'sine.out'
    }, '<');
});

// === ORBIT GALLERY ===
const BASE = './assets/img/orbital/';
const images = [
  { src: BASE + 'o-1.jpg', alt: 'Тренировка по настольному теннису' },
  { src: BASE + 'o-2.jpg', alt: 'Школьная олимпиада по математике' },
  { src: BASE + 'o-3.jpg', alt: 'Волонтёры на городском событии' },
  { src: BASE + 'o-4.jpg', alt: 'Командная работа в коворкинге' },
  { src: BASE + 'o-5.jpg', alt: 'Командная работа в коворкинге' },
];

const track = document.getElementById('orbitTrack');
const dotsWrap = document.getElementById('orbitDots');
const prevBtn = document.getElementById('orbitPrev');
const nextBtn = document.getElementById('orbitNext');

let active = 0;
let timer;
const autoplayMs = 3800;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function build() {
  track.style.setProperty('--count', images.length);
  track.innerHTML = images.map((it, i) =>
    `<figure class="orbit__item" style="--i:${i}">
      <div class="orbit__card"><img class="orbit__img" src="${it.src}" alt="${it.alt}" loading="lazy"></div>
    </figure>`
  ).join('');
  dotsWrap.innerHTML = images.map((_, i) =>
    `<button class="orbit__dot" data-i="${i}" aria-label="К слайду ${i + 1}"></button>`
  ).join('');
  update(0);
}

function update(delta) {
  active = (active + delta + images.length) % images.length;
  track.style.setProperty('--active', active);
  [...track.children].forEach((el, i) => {
    el.classList.toggle('is-front', i === active);
  });
  [...dotsWrap.children].forEach((d, i) =>
    d.classList.toggle('is-active', i === active)
  );
}

function play() {
  if (reduce) return;
  stop();
  timer = setInterval(() => update(1), autoplayMs);
}
function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

build();
play();
prevBtn.addEventListener('click', () => { update(-1); play(); });
nextBtn.addEventListener('click', () => { update(1); play(); });
dotsWrap.addEventListener('click', (e) => {
  const b = e.target.closest('.orbit__dot');
  if (!b) return;
  active = +b.dataset.i;
  update(0);
  play();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { update(-1); play(); }
  if (e.key === 'ArrowRight') { update(1); play(); }
});

let sx = 0, sy = 0;
const viewport = track.parentElement;
viewport.addEventListener('pointerdown', (e) => {
  sx = e.clientX;
  sy = e.clientY;
  viewport.setPointerCapture(e.pointerId);
  stop();
});
viewport.addEventListener('pointerup', (e) => {
  const dx = e.clientX - sx, dy = e.clientY - sy;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
    update(dx > 0 ? -1 : 1);
  }
  play();
});

// === PROJECTS CAROUSEL ===
(function () {
  const viewport = document.querySelector('#projects .projects-viewport');
  if (!viewport) return;
  const stage = viewport.querySelector('.projects-stage');
  const cards = [...stage.querySelectorAll('.project-card')];
  if (!cards.length) return;

  const dotsWrap = viewport.querySelector('.pr-dots');
  const prevBtn = viewport.querySelector('.prev');
  const nextBtn = viewport.querySelector('.next');

  let i = 0, timer = null;
  const interval = +(viewport.dataset.interval || 5000);
  const autoplay = viewport.dataset.autoplay !== 'false';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  dotsWrap.innerHTML = cards.map(() => '<i></i>').join('');
  const dots = [...dotsWrap.children];

  const show = (idx) => {
    i = (idx + cards.length) % cards.length;
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
  };
  const next = () => show(i + 1);
  const prev = () => show(i - 1);
  const play = () => {
    if (reduce || !autoplay) return;
    stop();
    timer = setInterval(next, interval);
  };
  const stop = () => timer && clearInterval(timer);

  show(0);
  play();

  nextBtn?.addEventListener('click', () => { next(); play(); });
  prevBtn?.addEventListener('click', () => { prev(); play(); });
  dotsWrap.addEventListener('click', (e) => {
    const idx = dots.indexOf(e.target);
    if (idx > -1) { show(idx); play(); }
  });

  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', play);
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', play);

  let touchStartX = 0, touchEndX = 0;
  stage.addEventListener('pointerdown', (e) => {
    touchStartX = e.clientX;
    stage.setPointerCapture(e.pointerId);
    stop();
  });
  stage.addEventListener('pointerup', (e) => {
    touchEndX = e.clientX;
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > 30) (dx > 0 ? prev : next)();
    play();
  });

  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stop();
  });
  stage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
    play();
  });

  const io = new IntersectionObserver(([entry]) => entry.isIntersecting ? play() : stop(), { threshold: .2 });
  io.observe(viewport);
})();


// СВАЙП 

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  body.style.overflow = "hidden"; // Блокируем прокрутку пока не свайпнули

  const swipeLock = document.querySelector(".hero__swipe-lock");
  const handle = swipeLock.querySelector(".swipe-handle");
  const track = swipeLock.querySelector(".swipe-track");

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  const maxOffset = track.offsetWidth - handle.offsetWidth - 4; // ограничение справа

  const startDrag = (e) => {
    isDragging = true;
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    handle.style.transition = "none";
  };

  const moveDrag = (e) => {
    if (!isDragging) return;
    currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const deltaX = Math.min(Math.max(currentX - startX, 0), maxOffset);
    handle.style.transform = `translateX(${deltaX}px)`;

    if (deltaX >= maxOffset * 0.95) unlockScroll();
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    handle.style.transition = "transform 0.3s ease";
    handle.style.transform = "translateX(0)";
  };

  const unlockScroll = () => {
    swipeLock.classList.add("swipe-unlocked");
    handle.style.transform = `translateX(${maxOffset}px)`;
    body.style.overflow = "auto"; // Разрешаем прокрутку
    handle.style.cursor = "default";
    handle.removeEventListener("mousedown", startDrag);
    handle.removeEventListener("touchstart", startDrag);
    handle.innerHTML = `<span class="swipe-text">✓ Разблокировано</span>`;
    setTimeout(() => {
      document.querySelector("#interview")?.scrollIntoView({ behavior: "smooth" });
    }, 700);
  };

  // Слушатели событий
  handle.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", endDrag);

  handle.addEventListener("touchstart", startDrag, { passive: true });
  window.addEventListener("touchmove", moveDrag, { passive: true });
  window.addEventListener("touchend", endDrag);
});


// === SCROLL TO TOP ===
const scrollBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  scrollBtn.classList.toggle("visible", window.scrollY > 400);
});
scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));