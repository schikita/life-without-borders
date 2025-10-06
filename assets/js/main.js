 // Intersection Observer: плавное появление
        const els = [...document.querySelectorAll('.reveal, .reveal-img')];

        // Set --nav-h dynamically for dropdown placement
        const nav = document.querySelector('.nav');
        const setNavH = () => { document.documentElement.style.setProperty('--nav-h', nav?.offsetHeight + 'px'); };
        setNavH();
        window.addEventListener('resize', setNavH);

        // Burger menu toggle
        const burger = document.getElementById('navBurger');
        burger?.addEventListener('click', () => {
            nav.classList.toggle('is-open');
            const expanded = nav.classList.contains('is-open');
            burger.setAttribute('aria-expanded', String(expanded));
        });
        // Close on link click or ESC
        nav?.querySelectorAll('.nav__menu a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('is-open'); burger?.setAttribute('aria-expanded', 'false'); }));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { nav.classList.remove('is-open'); burger?.setAttribute('aria-expanded', 'false'); } });
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const t = +e.target.dataset.delay || 0;
                    setTimeout(() => e.target.classList.add('is-in'), t);
                    io.unobserve(e.target);
                }
            })
        }, { threshold: 0.1 });
        els.forEach(el => io.observe(el));

        // Utility: скрытая подпись для label
        const style = document.createElement('style');
        style.textContent = `.visually-hidden{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}`;
        document.head.appendChild(style);
        // Subtle parallax for hero media
        const hero = document.querySelector('.hero');
        const media = document.querySelector('.hero__card');
        if (hero && media) {
            hero.addEventListener('mousemove', (e) => {
                const r = hero.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - .5;
                const py = (e.clientY - r.top) / r.height - .5;
                media.style.transform = `translate3d(${px * 8}px, ${py * 6}px, 0)`;
            });
            hero.addEventListener('mouseleave', () => { media.style.transform = 'translate3d(0,0,0)'; });
        }
        // ==== ORBIT SLIDER ====
        const images = [
            { src: 'https://images.unsplash.com/photo-1606166325683-1c1a5f1d1b33?q=80&w=1600&auto=format&fit=crop', alt: 'Тренировка по настольному теннису' },
            { src: 'https://images.unsplash.com/photo-1520975682031-6de9f3b5a02b?q=80&w=1600&auto=format&fit=crop', alt: 'Школьная олимпиада по математике' },
            { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop', alt: 'Волонтёры на городском событии' },
            { src: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop', alt: 'Командная работа в коворкинге' },
            { src: 'https://images.unsplash.com/photo-1511936606692-5b4b2360c5f4?q=80&w=1600&auto=format&fit=crop', alt: 'Планирование дня и заметки' },
            { src: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1600&auto=format&fit=crop', alt: 'Радость от маленьких побед' },
            { src: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop', alt: 'Дорога домой после тренировки' }
        ];

        const track = document.getElementById('orbitTrack');
        const dotsWrap = document.getElementById('orbitDots');
        const prevBtn = document.getElementById('orbitPrev');
        const nextBtn = document.getElementById('orbitNext');

        let active = 0; let timer; const autoplayMs = 3800; const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function build() {
            track.style.setProperty('--count', images.length);
            track.innerHTML = images.map((it, i) =>
                `<figure class="orbit__item" style="--i:${i}">
          <div class="orbit__card"><img class="orbit__img" src="${it.src}" alt="${it.alt}"></div>
        </figure>`
            ).join('');
            dotsWrap.innerHTML = images.map((_, i) => `<button class="orbit__dot" data-i="${i}" aria-label="К слайду ${i + 1}"></button>`).join('');
            update(0);
        }

        function update(delta) {
            active = (active + delta + images.length) % images.length;
            track.style.setProperty('--active', active);
            [...track.children].forEach((el, i) => {
                el.classList.toggle('is-front', i === active);
            });
            [...dotsWrap.children].forEach((d, i) => d.classList.toggle('is-active', i === active));
        }

        function play() { if (reduce) return; stop(); timer = setInterval(() => update(1), autoplayMs) }
        function stop() { if (timer) { clearInterval(timer); timer = null } }

        build(); play();
        prevBtn.addEventListener('click', () => { update(-1); play() });
        nextBtn.addEventListener('click', () => { update(1); play() });
        dotsWrap.addEventListener('click', (e) => { const b = e.target.closest('.orbit__dot'); if (!b) return; active = +b.dataset.i; update(0); play(); })

        // keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { update(-1); play() }
            if (e.key === 'ArrowRight') { update(1); play() }
        });

        // swipe
        let sx = 0, sy = 0; const viewport = track.parentElement;
        viewport.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; viewport.setPointerCapture(e.pointerId); stop(); });
        viewport.addEventListener('pointerup', (e) => {
            const dx = e.clientX - sx, dy = e.clientY - sy;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) { update(dx > 0 ? -1 : 1); }
            play();
        });


        (function(){
  const viewport = document.querySelector('#projects .projects-viewport');
  if(!viewport) return;
  const stage = viewport.querySelector('.projects-stage');
  const cards = [...stage.querySelectorAll('.project-card')];
  if(!cards.length) return;

  const dotsWrap = viewport.querySelector('.pr-dots');
  const prevBtn = viewport.querySelector('.prev');
  const nextBtn = viewport.querySelector('.next');

  let i = 0, timer = null;
  const interval = +(viewport.dataset.interval || 5000);
  const autoplay = viewport.dataset.autoplay !== 'false';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // dots
  dotsWrap.innerHTML = cards.map(()=>'<i></i>').join('');
  const dots = [...dotsWrap.children];

  function show(idx){
    i = (idx + cards.length) % cards.length;
    cards.forEach((c, k)=> c.classList.toggle('is-active', k===i));
    dots.forEach((d, k)=> d.classList.toggle('is-on', k===i));
  }

  function next(){ show(i+1); }
  function prev(){ show(i-1); }

  function play(){
    if(reduce || !autoplay) return;
    stop();
    timer = setInterval(next, interval);
  }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }

  // init
  show(0); play();

  // controls
  nextBtn?.addEventListener('click', ()=>{ next(); play(); });
  prevBtn?.addEventListener('click', ()=>{ prev(); play(); });
  dotsWrap.addEventListener('click', e=>{
    const idx = dots.indexOf(e.target);
    if(idx>-1){ show(idx); play(); }
  });

  // pause on hover/focus (desktop)
  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', play);
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', play);

  // swipe (touch)
  let sx=0, sy=0;
  stage.addEventListener('pointerdown', e=>{ sx=e.clientX; sy=e.clientY; stage.setPointerCapture(e.pointerId); stop(); });
  stage.addEventListener('pointerup', e=>{
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30){ (dx>0? prev: next)(); }
    play();
  });

  // pause when not in viewport
  const io = new IntersectionObserver(([entry])=>{
    if(entry.isIntersecting) play(); else stop();
  }, {threshold:.2});
  io.observe(viewport);
})();
