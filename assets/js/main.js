// === Intersection Observer для анимации элементов ===
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = +(el.dataset.delay || 0);
        setTimeout(() => el.classList.add("is-visible"), delay);
        obs.unobserve(el);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
);

// Следим за ключевыми элементами
document
  .querySelectorAll(
    ".headline, .text-block, .hashtags, .kitel, .man, .medals, .decor-bottom-left"
  )
  .forEach((el) => observer.observe(el));

// Lazy загрузка изображений
document.querySelectorAll("img[data-src]").forEach((img) => {
  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        entry.target.removeAttribute("data-src");
        obs.unobserve(entry.target);
      }
    });
  });
  imgObserver.observe(img);
});


document
  .querySelectorAll(".reveal, .reveal-img")
  .forEach((el) => lazyObserver.observe(el));

// === LAZY VIDEO ===
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const video = entry.target.querySelector("video");
        const source = video?.querySelector("source[data-src]");
        if (source && !source.src) {
          source.src = source.dataset.src;
          video.load();
          video.play().catch(() => {});
        }
        videoObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll("[data-lazy-video]").forEach((section) => {
  videoObserver.observe(section);
});

// === NAV ===
const nav = document.querySelector(".nav");
const burger = document.getElementById("navBurger");

const setNavH = () => {
  document.documentElement.style.setProperty(
    "--nav-h",
    nav?.offsetHeight + "px"
  );
};
setNavH();
window.addEventListener("resize", setNavH);

burger?.addEventListener("click", () => {
  nav.classList.toggle("is-open");
  const expanded = nav.classList.contains("is-open");
  burger.setAttribute("aria-expanded", String(expanded));
});

nav?.querySelectorAll(".nav__menu a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  })
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    nav.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener(
  "scroll",
  () => {
    nav?.classList.toggle("scrolled", window.scrollY > 50);
  },
  { passive: true }
);

// === HERO SLIDESHOW ===
const heroBg = document.getElementById("heroBg");

const heroImagesDesktop = [
  "./assets/img/hero.jpg",
  "./assets/img/hero-2.jpg",
  "./assets/img/hero-3.jpg",
];

const heroImagesMobile = [
  "./assets/img/hero-mobile.jpg",
  "./assets/img/hero-2-mobile.jpg",
  "./assets/img/hero-3-mobile.jpg",
];

// Порог ширины экрана, ниже которого считаем устройство мобильным
const MOBILE_BREAKPOINT = 768;

function getHeroImages() {
  return window.innerWidth <= MOBILE_BREAKPOINT
    ? heroImagesMobile
    : heroImagesDesktop;
}

let heroIndex = 0;
let heroSlides = [];

function renderHeroSlides() {
  const heroImages = getHeroImages();
  heroBg.innerHTML = heroImages
    .map(
      (src, i) =>
        `<img 
          src="${src}" 
          alt="Hero slide ${i + 1}" 
          loading="${i === 0 ? "eager" : "lazy"}" 
          class="${i === 0 ? "is-active" : ""}">
        `
    )
    .join("");
  heroSlides = heroBg.querySelectorAll("img");
  heroIndex = 0;
}

// Первичная отрисовка
renderHeroSlides();

// Смена слайда каждые 8 секунд
setInterval(() => {
  heroSlides[heroIndex].classList.remove("is-active");
  heroIndex = (heroIndex + 1) % heroSlides.length;
  heroSlides[heroIndex].classList.add("is-active");
}, 8000);

// При изменении размера окна (например, поворот телефона)
window.addEventListener("resize", () => {
  const currentSet =
    heroSlides[0]?.src.includes("mobile") && window.innerWidth > MOBILE_BREAKPOINT;
  const switchedToMobile =
    !heroSlides[0]?.src.includes("mobile") && window.innerWidth <= MOBILE_BREAKPOINT;

  if (currentSet || switchedToMobile) {
    renderHeroSlides();
  }
});


// === ПРОРИСОВКА ПОСТРОЧНОЙ АНИМАЦИИ ===
document.addEventListener("DOMContentLoaded", () => {
  const videoSection = document.querySelector(".video-section");
  const captionLines = document.querySelectorAll(".caption-line");

  if (!videoSection) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionCenter =
            entry.boundingClientRect.top +
            entry.boundingClientRect.height / 2;
          const viewportCenter = window.innerHeight / 2;

          // Проверяем: центр секции близок к центру экрана (±100px)
          if (Math.abs(sectionCenter - viewportCenter) < 100) {
            captionLines.forEach((line, index) => {
              setTimeout(() => line.classList.add("active"), index * 1500);
            });
            observer.unobserve(videoSection); // чтобы не повторялось
          }
        }
      });
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "0px",
    }
  );

  observer.observe(videoSection);
});


/* STORY REABILITATION */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".simple-section");
  if (!section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("active");
        observer.unobserve(section); // однократно
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
});





// --------------------------------------


// === GSAP ANIMATIONS ===
document.addEventListener("DOMContentLoaded", () => {
  const animationOk = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  ).matches;
  if (!animationOk) return;

  // Целевой блок, который должен войти в фокус
  const heroSection = document.querySelector(".split-hero");
  if (!heroSection) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // === Запускаем анимацию GSAP ===
        const tl = gsap.timeline({
          delay: 0.3,
          defaults: {
            transformOrigin: "right center",
            ease: "expo.out",
            duration: 1.2,
            stagger: { each: 0.4, from: "end" },
          },
        });

        tl.set(".fouc--hero", { opacity: 1 })
          .from(".hero__swipe-1", { scaleX: 0 })
          .from(".hero__swipe-2", { scaleX: 0 }, "<")
          .from(".hero__swipe-3", { scaleX: 0 }, "<")
          .from(".hero__swipe-4", { scaleX: 0 }, "<")
          .from(
            ".hero__circle",
            {
              duration: 0.7,
              transformOrigin: "center",
              opacity: 0,
              scale: 0.7,
              ease: "sine.out",
            },
            "<"
          );

        // Чтобы сработало только один раз
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 }); // 30% блока в фокусе — достаточно

  observer.observe(heroSection);
});


// === ORBIT GALLERY ===
const BASE = "./assets/img/orbital/";
const images = [
  { src: BASE + "o-1.jpg", alt: "Тренировка по настольному теннису" },
  { src: BASE + "o-2.jpg", alt: "Школьная олимпиада по математике" },
  { src: BASE + "o-3.jpg", alt: "Волонтёры на городском событии" },
  { src: BASE + "o-4.jpg", alt: "Командная работа в коворкинге" },
  { src: BASE + "o-5.jpg", alt: "Командная работа в коворкинге" },
];

const track = document.getElementById("orbitTrack");
const dotsWrap = document.getElementById("orbitDots");
const prevBtn = document.getElementById("orbitPrev");
const nextBtn = document.getElementById("orbitNext");

let active = 0;
let timer;
const autoplayMs = 3800;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function build() {
  track.style.setProperty("--count", images.length);
  track.innerHTML = images
    .map(
      (it, i) =>
        `<figure class="orbit__item" style="--i:${i}">
      <div class="orbit__card"><img class="orbit__img" src="${it.src}" alt="${it.alt}" loading="lazy"></div>
    </figure>`
    )
    .join("");
  dotsWrap.innerHTML = images
    .map(
      (_, i) =>
        `<button class="orbit__dot" data-i="${i}" aria-label="К слайду ${i + 1}"></button>`
    )
    .join("");
  update(0);
}

function update(delta) {
  active = (active + delta + images.length) % images.length;
  track.style.setProperty("--active", active);
  [...track.children].forEach((el, i) => {
    el.classList.toggle("is-front", i === active);
  });
  [...dotsWrap.children].forEach((d, i) =>
    d.classList.toggle("is-active", i === active)
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

prevBtn.addEventListener("click", () => {
  update(-1);
  play();
});
nextBtn.addEventListener("click", () => {
  update(1);
  play();
});
dotsWrap.addEventListener("click", (e) => {
  const b = e.target.closest(".orbit__dot");
  if (!b) return;
  active = +b.dataset.i;
  update(0);
  play();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    update(-1);
    play();
  }
  if (e.key === "ArrowRight") {
    update(1);
    play();
  }
});

let sx = 0,
  sy = 0;
const viewport = track.parentElement;
viewport.addEventListener("pointerdown", (e) => {
  sx = e.clientX;
  sy = e.clientY;
  viewport.setPointerCapture(e.pointerId);
  stop();
});
viewport.addEventListener("pointerup", (e) => {
  const dx = e.clientX - sx,
    dy = e.clientY - sy;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
    update(dx > 0 ? -1 : 1);
  }
  play();
});

// === PROJECTS CAROUSEL ===
(function () {
  const viewport = document.querySelector("#projects .projects-viewport");
  if (!viewport) return;
  const stage = viewport.querySelector(".projects-stage");
  const cards = [...stage.querySelectorAll(".project-card")];
  if (!cards.length) return;

  const dotsWrap = viewport.querySelector(".pr-dots");
  const prevBtn = viewport.querySelector(".prev");
  const nextBtn = viewport.querySelector(".next");

  let i = 0,
    timer = null;
  const interval = +(viewport.dataset.interval || 5000);
  const autoplay = viewport.dataset.autoplay !== "false";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  dotsWrap.innerHTML = cards.map(() => "<i></i>").join("");
  const dots = [...dotsWrap.children];

  const show = (idx) => {
    i = (idx + cards.length) % cards.length;
    cards.forEach((c, k) => c.classList.toggle("is-active", k === i));
    dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
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

  nextBtn?.addEventListener("click", () => {
    next();
    play();
  });
  prevBtn?.addEventListener("click", () => {
    prev();
    play();
  });
  dotsWrap.addEventListener("click", (e) => {
    const idx = dots.indexOf(e.target);
    if (idx > -1) {
      show(idx);
      play();
    }
  });

  viewport.addEventListener("mouseenter", stop);
  viewport.addEventListener("mouseleave", play);
  viewport.addEventListener("focusin", stop);
  viewport.addEventListener("focusout", play);

  let touchStartX = 0,
    touchEndX = 0;
  stage.addEventListener("pointerdown", (e) => {
    touchStartX = e.clientX;
    stage.setPointerCapture(e.pointerId);
    stop();
  });
  stage.addEventListener("pointerup", (e) => {
    touchEndX = e.clientX;
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > 30) (dx > 0 ? prev : next)();
    play();
  });

  stage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stop();
  });
  stage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > 40) dx > 0 ? prev() : next();
    play();
  });

  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? play() : stop()),
    { threshold: 0.2 }
  );
  io.observe(viewport);
})();

// СВАЙП

// СВАЙП
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  body.style.overflow = "hidden"; // блокируем прокрутку до разблокировки

  const swipeLock = document.querySelector(".hero__swipe-lock");
  const swipeHandle = swipeLock?.querySelector(".swipe-handle");
  const swipeTrack = swipeLock?.querySelector(".swipe-track");

  if (!swipeLock || !swipeHandle || !swipeTrack) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let maxOffset = 0;

  function calcMaxOffset() {
    // считать, когда элемент видим и имеет размеры
    maxOffset = swipeTrack.offsetWidth - swipeHandle.offsetWidth - 4;
    if (maxOffset < 0) maxOffset = 0;
  }

  function startDrag(e) {
    isDragging = true;
    calcMaxOffset();
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    swipeHandle.style.transition = "none";
  }

  function moveDrag(e) {
    if (!isDragging) return;
    // запретим естественный скролл, чтобы жест был “чистым”
    if (e.cancelable) e.preventDefault();

    currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const dx = Math.min(Math.max(currentX - startX, 0), maxOffset);
    swipeHandle.style.transform = `translateX(${dx}px)`;

    if (dx >= maxOffset * 0.95) unlockScroll();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    swipeHandle.style.transition = "transform 0.3s ease";
    swipeHandle.style.transform = "translateX(0)";
  }

function unlockScroll() {
  swipeLock.classList.add("swipe-unlocked");
  swipeHandle.classList.add("unlocked");
  body.style.overflow = "auto";
  swipeHandle.style.cursor = "default";

  // Вычисляем финальную позицию с отступом 5px влево
  const finalOffset = maxOffset - 5;
  swipeHandle.style.transition = "transform 0.4s ease";
  swipeHandle.style.transform = `translateX(${finalOffset}px)`;

  // Удаляем слушатели, чтобы больше не двигался
  swipeHandle.removeEventListener("mousedown", startDrag);
  window.removeEventListener("mousemove", moveDrag, { capture: false });
  window.removeEventListener("mouseup", endDrag, { capture: false });

  swipeHandle.removeEventListener("touchstart", startDrag);
  window.removeEventListener("touchmove", moveDrag, { passive: false });
  window.removeEventListener("touchend", endDrag);

  // Галочка вместо иконки
  swipeHandle.innerHTML = `
    <span class="swipe-text">✓</span>
  `;

  setTimeout(() => {
    document
      .querySelector("#interview")
      ?.scrollIntoView({ behavior: "smooth" });
  }, 700);
}


  // слушатели — после объявлений функций
  swipeHandle.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag, { capture: false });
  window.addEventListener("mouseup", endDrag, { capture: false });

  swipeHandle.addEventListener("touchstart", startDrag); // no passive
  window.addEventListener("touchmove", moveDrag, { passive: false }); // важно!
  window.addEventListener("touchend", endDrag);
});


// Появление анимации дыма в фокусе 
document.addEventListener("DOMContentLoaded", () => {
  const quotes = document.querySelectorAll(".smoke-block");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target); // анимация только один раз
      }
    });
  }, {
    threshold: 0.2, // блок виден на 20%
  });

  quotes.forEach(q => observer.observe(q));
});


document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  // Гарантируем, что кнопка — прямой ребёнок body (важно для position:fixed)
  if (btn.parentElement !== document.body) document.body.appendChild(btn);

  function pickContainer() {
    // если страница прокручивается окном — берём window
    const doc = document.documentElement;
    const winDelta = doc.scrollHeight - doc.clientHeight;
    let best = window, bestDelta = winDelta;

    // ищем самый "длинный" вертикально прокручиваемый контейнер
    document.querySelectorAll('body *').forEach(el => {
      const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(cs.overflowY)) return;
      const delta = el.scrollHeight - el.clientHeight;
      if (delta > bestDelta + 50) { best = el; bestDelta = delta; }
    });
    return best;
  }

  let container = pickContainer();

  const getY = () =>
    container === window
      ? (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
      : container.scrollTop;

  const update = () => {
    if (getY() > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };

  const onScrollTarget = () => (container === window ? window : container);

  const bind = () => onScrollTarget().addEventListener('scroll', update, { passive: true });
  const unbind = () => onScrollTarget().removeEventListener('scroll', update);

  bind();
  window.addEventListener('resize', update);
  window.addEventListener('load', update);

  new MutationObserver(() => {
    const next = pickContainer();
    if (next !== container) { unbind(); container = next; bind(); update(); }
  }).observe(document.body, { attributes: true, attributeFilter: ['class','style'] });

  btn.addEventListener('click', () => {
    (container === window ? window : container).scrollTo({ top: 0, behavior: 'smooth' });
  });

  update();
});



