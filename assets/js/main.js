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

// === SLIDESHOW BACKGROUND (Story Contrast Section) ===
document.addEventListener("DOMContentLoaded", () => {
  const slideshowSection = document.querySelector(".story-contrast.slideshow");
  if (!slideshowSection) return;
  
  const slides = slideshowSection.querySelectorAll(".slide");
  if (!slides.length) return;
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideInterval = 8000; // 8 секунд на слайд
  
  // Функция смены слайда
  function changeSlide() {
    // Скрываем текущий слайд
    slides[currentSlide].style.opacity = "0";
    
    // Переходим к следующему слайду
    currentSlide = (currentSlide + 1) % totalSlides;
    
    // Показываем новый слайд
    slides[currentSlide].style.opacity = "1";
  }
  
  // Показываем первый слайд
  slides[0].style.opacity = "1";
  
  // Запускаем автоматическую смену слайдов
  setInterval(changeSlide, slideInterval);
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
            observer.unobserve(videoSection);
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

// === GSAP ANIMATIONS ===
document.addEventListener("DOMContentLoaded", () => {
  const animationOk = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  ).matches;
  if (!animationOk || typeof gsap === 'undefined') return;

  const heroSection = document.querySelector(".split-hero");
  if (!heroSection) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
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

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(heroSection);
});

// === ORBIT GALLERY - ОСНОВНОЙ СЛАЙДЕР ===
       class Carousel3D {
            constructor(options = {}) {
                this.track = document.getElementById(options.trackId || 'orbitTrack');
                this.dotsContainer = document.getElementById(options.dotsId || 'orbitDots');
                this.prevBtn = document.getElementById(options.prevBtnId || 'orbitPrev');
                this.nextBtn = document.getElementById(options.nextBtnId || 'orbitNext');
                
                this.images = options.images || [
                    { src: 'https://picsum.photos/800/600?random=1', alt: 'Фото 1' },
                    { src: 'https://picsum.photos/800/600?random=2', alt: 'Фото 2' },
                    { src: 'https://picsum.photos/800/600?random=3', alt: 'Фото 3' },
                    { src: 'https://picsum.photos/800/600?random=4', alt: 'Фото 4' },
                    { src: 'https://picsum.photos/800/600?random=5', alt: 'Фото 5' },
                    { src: 'https://picsum.photos/800/600?random=6', alt: 'Фото 6' },
                    { src: 'https://picsum.photos/800/600?random=7', alt: 'Фото 7' }
                ];
                
                this.currentIndex = 0;
                this.isAnimating = false;
                this.autoplayInterval = null;
                this.autoplayDelay = options.autoplayDelay || 4000;
                this.enableAutoplay = options.autoplay !== false;
                
                this.init();
            }
            
            init() {
                this.createSlides();
                this.createDots();
                this.updatePositions();
                this.bindEvents();
                
                if (this.enableAutoplay) {
                    this.startAutoplay();
                }
            }
            
            createSlides() {
                this.track.innerHTML = this.images.map((img, index) => `
                    <div class="orbit__item" data-index="${index}">
                        <div class="orbit__card">
                            <img class="orbit__img" src="${img.src}" alt="${img.alt}" loading="lazy">
                        </div>
                    </div>
                `).join('');
                
                this.slides = this.track.querySelectorAll('.orbit__item');
            }
            
            createDots() {
                this.dotsContainer.innerHTML = this.images.map((_, index) => `
                    <button class="orbit__dot" data-index="${index}" aria-label="Слайд ${index + 1}"></button>
                `).join('');
                
                this.dots = this.dotsContainer.querySelectorAll('.orbit__dot');
            }
            
            updatePositions() {
                const radius = 320; // Радиус карусели
                const angleStep = (Math.PI * 2) / this.slides.length;
                
                this.slides.forEach((slide, index) => {
                    const angle = angleStep * (index - this.currentIndex);
                    const x = Math.sin(angle) * radius;
                    const z = Math.cos(angle) * radius - radius;
                    const rotateY = angle * (180 / Math.PI);
                    
                    slide.style.transform = `
                        translateX(${x}px) 
                        translateZ(${z}px) 
                        rotateY(${rotateY}deg)
                    `;
                    
                    slide.classList.toggle('active', index === this.currentIndex);
                    
                    // Управление z-index для правильного наложения
                    slide.style.zIndex = z > -radius ? Math.round((z + radius) * 10) : 0;
                });
                
                // Обновляем точки
                this.dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }
            
            goTo(index) {
                if (this.isAnimating) return;
                
                this.isAnimating = true;
                this.currentIndex = (index + this.slides.length) % this.slides.length;
                this.updatePositions();
                
                setTimeout(() => {
                    this.isAnimating = false;
                }, 800);
            }
            
            next() {
                this.goTo(this.currentIndex + 1);
            }
            
            prev() {
                this.goTo(this.currentIndex - 1);
            }
            
            startAutoplay() {
                this.stopAutoplay();
                this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
            }
            
            stopAutoplay() {
                if (this.autoplayInterval) {
                    clearInterval(this.autoplayInterval);
                    this.autoplayInterval = null;
                }
            }
            
            bindEvents() {
                // Кнопки навигации
                this.prevBtn?.addEventListener('click', () => {
                    this.prev();
                    this.startAutoplay();
                });
                
                this.nextBtn?.addEventListener('click', () => {
                    this.next();
                    this.startAutoplay();
                });
                
                // Точки навигации
                this.dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        this.goTo(index);
                        this.startAutoplay();
                    });
                });
                
                // Клавиатура
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') {
                        this.prev();
                        this.startAutoplay();
                    } else if (e.key === 'ArrowRight') {
                        this.next();
                        this.startAutoplay();
                    }
                });
                
                // Пауза при наведении
                this.track.addEventListener('mouseenter', () => this.stopAutoplay());
                this.track.addEventListener('mouseleave', () => {
                    if (this.enableAutoplay) this.startAutoplay();
                });
                
                // Свайп
                let startX = 0;
                let endX = 0;
                
                this.track.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    this.stopAutoplay();
                });
                
                this.track.addEventListener('touchmove', (e) => {
                    endX = e.touches[0].clientX;
                });
                
                this.track.addEventListener('touchend', () => {
                    const diff = startX - endX;
                    
                    if (Math.abs(diff) > 50) {
                        if (diff > 0) {
                            this.next();
                        } else {
                            this.prev();
                        }
                    }
                    
                    if (this.enableAutoplay) this.startAutoplay();
                });
            }
        }
        
        // Инициализация карусели
        document.addEventListener('DOMContentLoaded', () => {
            const carousel = new Carousel3D({
                images: [
                    { src: './assets/img/orbital/o-1.jpg', alt: 'Фото 1' },
                    { src: './assets/img/orbital/o-2.jpg', alt: 'Фото 2' },
                    { src: './assets/img/orbital/o-3.jpg', alt: 'Фото 3' },
                    { src: './assets/img/orbital/o-4.jpg', alt: 'Фото 4' },
                    { src: './assets/img/orbital/o-5.jpg', alt: 'Фото 5' },
                  
                  
                ],
                autoplay: true,
                autoplayDelay: 4000
            });
        });

// === PROJECTS CAROUSEL - ВТОРОЙ СЛАЙДЕР ===
document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.querySelector(".projects-viewport");
  if (!viewport) return;
  
  const stage = viewport.querySelector(".projects-stage");
  const cards = [...stage.querySelectorAll(".project-card")];
  if (!cards.length) return;

  const dotsWrap = viewport.querySelector(".pr-dots");
  const prevBtn = viewport.querySelector(".pr-btn.prev");
  const nextBtn = viewport.querySelector(".pr-btn.next");

  let i = 0;
  let timer = null;
  const interval = +(viewport.dataset.interval || 5000);
  const autoplay = viewport.dataset.autoplay !== "false";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Создаем точки навигации
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

  // Инициализация
  show(0);
  play();

  // Обработчики событий
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

  // Пауза при наведении
  viewport.addEventListener("mouseenter", stop);
  viewport.addEventListener("mouseleave", play);
  viewport.addEventListener("focusin", stop);
  viewport.addEventListener("focusout", play);

  // Свайп для проектов
  let touchStartX = 0;
  let touchEndX = 0;
  
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

  // Остановка/запуск при видимости
  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? play() : stop()),
    { threshold: 0.2 }
  );
  io.observe(viewport);
});

// === Появление анимации дыма в фокусе ===
document.addEventListener("DOMContentLoaded", () => {
  const quotes = document.querySelectorAll(".smoke-block");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
  });

  quotes.forEach(q => observer.observe(q));
});

// === SCROLL TO TOP BUTTON ===
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  if (btn.parentElement !== document.body) document.body.appendChild(btn);

  function pickContainer() {
    const doc = document.documentElement;
    const winDelta = doc.scrollHeight - doc.clientHeight;
    let best = window, bestDelta = winDelta;

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