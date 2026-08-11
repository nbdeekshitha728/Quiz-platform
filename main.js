/* ============================================
   QUIZZIFY — Main JavaScript
   Human-centric interactions & quiz logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────── DARK MODE ────────────
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Check saved preference
  const savedTheme = localStorage.getItem('quizzify-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add transition class for smooth theme shift
    body.classList.add('transitioning');
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('quizzify-theme', newTheme);
    
    // Animate the toggle itself
    gsap.fromTo(themeToggle.querySelector(newTheme === 'dark' ? '.moon' : '.sun'), 
      { rotation: -90, opacity: 0, scale: 0 },
      { rotation: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );

    setTimeout(() => body.classList.remove('transitioning'), 600);
  });

  // ──────────── TESTIMONIAL SLIDER ────────────
  gsap.registerPlugin(Draggable);
  
  const slider = document.querySelector('.testimonials__slider');
  const sliderContainer = document.querySelector('.testimonials__slider-container');
  
  if (slider && sliderContainer) {
    Draggable.create(slider, {
      type: 'x',
      edgeResistance: 0.65,
      bounds: sliderContainer,
      inertia: true,
      onDragStart: function() {
        gsap.to(this.target, { scale: 0.98, duration: 0.3 });
      },
      onDragEnd: function() {
        gsap.to(this.target, { scale: 1, duration: 0.3 });
      }
    });

    // Auto-scroll hint
    gsap.from(slider, {
      x: 100,
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sliderContainer,
        start: 'top 80%'
      }
    });
  }

  // ──────────── GSAP ANIMATIONS ────────────
  gsap.registerPlugin(ScrollTrigger);

  // Hero Animations
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
  heroTl.from('.nav', { y: -100, opacity: 0, duration: 1 })
        .from('.hero__badge', { y: 20, opacity: 0 }, '-=0.6')
        .from('.hero__title', { y: 40, opacity: 0, stagger: 0.1 }, '-=0.8')
        .from('.hero__subtitle', { y: 30, opacity: 0 }, '-=0.8')
        .from('.hero__actions', { y: 30, opacity: 0 }, '-=0.8')
        .from('.hero__visual', { scale: 0.9, opacity: 0, duration: 1.5 }, '-=1')
        .from('.hero__float', { y: 40, opacity: 0, stagger: 0.2 }, '-=1');

  // Scroll Parallax for Blobs
  gsap.to('.blob--1', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: 150, x: -50
  });
  gsap.to('.blob--2', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: -100, x: 80
  });

  // Reveal Animations on Scroll
  const sectionsToReveal = ['.features__header', '.feature-card', '.step-card', '.quiz-demo__info', '.quiz-panel', '.testimonial-card', '.cta-section .container'];
  
  sectionsToReveal.forEach(selector => {
    gsap.from(selector, {
      scrollTrigger: {
        trigger: selector,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });
  });

  // ──────────── MAGNETIC BUTTONS ────────────
  const magneticBtns = document.querySelectorAll('.btn, .nav__cta, .cta__submit');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });

  // ──────────── COUNTER ANIMATION (using GSAP) ────────────
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(c => {
    const target = parseInt(c.getAttribute('data-count'), 10);
    ScrollTrigger.create({
      trigger: c,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(c, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          onUpdate: function() {
            c.innerText = formatNumber(Math.floor(this.targets()[0].innerText)) + (target === 96 ? '%' : '+');
          }
        });
      }
    });
  });

  function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
    return n.toString();
  }

  // ──────────── CUSTOM CURSOR ────────────
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;

  if (window.matchMedia('(pointer: fine)').matches && dot && ring) {
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1 });
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.3 });
    });

    const hoverTargets = document.querySelectorAll('a, button, .hero__card-option, .quiz-option, input');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  // ──────────── NAVIGATION ────────────
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ──────────── artisanal wobble ────────────
  gsap.to('.handwritten', {
    rotate: 2,
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: 'sine.inOut'
  });
  const heroOptions = document.querySelectorAll('.hero__card-option');
  let heroAnswered = false;

  heroOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      if (heroAnswered) return;
      heroAnswered = true;

      const isCorrect = opt.getAttribute('data-answer') === 'correct';
      opt.classList.add(isCorrect ? 'correct' : 'wrong');

      if (!isCorrect) {
        heroOptions.forEach(o => {
          if (o.getAttribute('data-answer') === 'correct') o.classList.add('correct');
        });
      }

      setTimeout(() => {
        heroOptions.forEach(o => o.classList.remove('correct', 'wrong', 'selected'));
        heroAnswered = false;
      }, 3000);
    });
  });

  // ──────────── INTERACTIVE QUIZ ────────────
  const quizData = [
    { question: "Which planet is known as the 'Red Planet'?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
    { question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"], correct: 2 },
    { question: "What is the chemical symbol for water?", options: ["CO2", "H2O", "NaCl", "O2"], correct: 1 },
    { question: "In which year did humans first land on the Moon?", options: ["1965", "1969", "1972", "1959"], correct: 1 },
  ];

  let currentQ = 0, score = 0, answered = false;

  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizProgress = document.getElementById('quizProgress');
  const quizStep = document.getElementById('quizStep');
  const quizScore = document.getElementById('quizScore');
  const quizNext = document.getElementById('quizNext');
  const quizQuestionArea = document.getElementById('quizQuestionArea');
  const quizFooter = document.getElementById('quizFooter');
  const quizResult = document.getElementById('quizResult');
  const resultEmoji = document.getElementById('resultEmoji');
  const resultTitle = document.getElementById('resultTitle');
  const resultScore = document.getElementById('resultScore');
  const resultBarFill = document.getElementById('resultBarFill');
  const quizRestart = document.getElementById('quizRestart');

  function loadQuestion() {
    answered = false;
    quizNext.classList.remove('show');

    const q = quizData[currentQ];
    quizQuestion.textContent = q.question;
    quizStep.textContent = `${currentQ + 1} / ${quizData.length}`;
    quizProgress.style.width = `${((currentQ + 1) / quizData.length) * 100}%`;
    quizScore.textContent = score;

    quizOptions.innerHTML = '';
    q.options.forEach((opt, i) => {
      const div = document.createElement('div');
      div.className = 'quiz-option';
      div.innerHTML = `<span class="quiz-option__marker">${['A','B','C','D'][i]}</span> ${opt}`;
      div.addEventListener('click', () => selectAnswer(i, div));
      quizOptions.appendChild(div);
    });
  }

  function selectAnswer(index, el) {
    if (answered) return;
    answered = true;

    const q = quizData[currentQ];
    const allOpts = quizOptions.querySelectorAll('.quiz-option');

    if (index === q.correct) {
      el.classList.add('correct');
      score++;
      quizScore.textContent = score;
      createConfetti(el);
    } else {
      el.classList.add('wrong');
      allOpts[q.correct].classList.add('correct');
    }

    allOpts.forEach(o => o.classList.add('disabled'));

    if (currentQ < quizData.length - 1) {
      quizNext.classList.add('show');
    } else {
      setTimeout(showResults, 1200);
    }
  }

  quizNext.addEventListener('click', () => {
    currentQ++;
    loadQuestion();
  });

  function showResults() {
    quizQuestionArea.style.display = 'none';
    quizFooter.style.display = 'none';
    quizResult.classList.add('show');

    const pct = Math.round((score / quizData.length) * 100);
    resultScore.textContent = `${score} / ${quizData.length} (${pct}%)`;

    const outcomes = [
      { p: 80, e: '🎉', t: 'Brilliant!' },
      { p: 60, e: '😊', t: 'Great Job!' },
      { p: 40, e: '💪', t: 'Not Bad!' },
      { p: 0, e: '📚', t: 'Keep Practicing!' }
    ];
    const res = outcomes.find(o => pct >= o.p);
    resultEmoji.textContent = res.e;
    resultTitle.textContent = res.t;

    setTimeout(() => { resultBarFill.style.width = pct + '%'; }, 300);
  }

  quizRestart.addEventListener('click', () => {
    currentQ = 0; score = 0; answered = false;
    quizQuestionArea.style.display = '';
    quizFooter.style.display = '';
    quizResult.classList.remove('show');
    resultBarFill.style.width = '0%';
    loadQuestion();
  });

  loadQuestion();

  // ──────────── MINI CONFETTI ────────────
  function createConfetti(anchor) {
    const rect = anchor.getBoundingClientRect();
    const colors = ['#dd963a', '#cf5f3b', '#6b7c4e', '#e4ad5c', '#5a9e6f'];
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: ${4 + Math.random() * 6}px; height: ${4 + Math.random() * 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${rect.left + rect.width / 2}px; top: ${rect.top + rect.height / 2}px;
        pointer-events: none; z-index: 1000; opacity: 1;
      `;
      document.body.appendChild(particle);
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 160,
        y: -100 - Math.random() * 100,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 0.8 + Math.random() * 0.7,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }

  // ──────────── REGISTRATION FORM ────────────
  document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    if (!name) return;
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = `Welcome aboard, ${name}! 🎉`;
    toast.classList.add('show');
    e.target.reset();
    setTimeout(() => toast.classList.remove('show'), 4000);
  });

  // ──────────── BACK TO TOP ────────────
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ──────────── RIPPLE EFFECT ────────────
  document.querySelectorAll('.btn, .nav__cta, .cta__submit, .quiz-panel__next, .quiz-result__restart').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ──────────── TILT EFFECT ON FEATURE CARDS ────────────
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(600px) translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

});
