/* ==========================================
   WakandianShield — CV Portfolio
   script.js
   ========================================== */

(function () {
  'use strict';

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hide default cursor
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });

  // ==========================================
  // NOISE CANVAS
  // ==========================================
  const canvas = document.getElementById('noiseCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let noiseFrame = 0;
  function generateNoise() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    // Only update every 3 frames for performance
    if (noiseFrame % 3 === 0) {
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    noiseFrame++;
    requestAnimationFrame(generateNoise);
  }
  generateNoise();

  // ==========================================
  // SCROLL REVEAL
  // ==========================================
  function addRevealClasses() {
    const elements = document.querySelectorAll('.section-header, .about-lead, .about-body, .about-stats, .skill-group, .project-card, .contact-content, .stat');
    elements.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
    });
  }
  addRevealClasses();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1200;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + '+';
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-num[data-target]');
        counters.forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) counterObserver.observe(statsSection);

  // ==========================================
  // ACTIVE NAV LINK
  // ==========================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ==========================================
  // SMOOTH SCROLL + NAV
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================
  // NAV BACKGROUND ON SCROLL
  // ==========================================
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(8, 12, 15, 0.98)';
    } else {
      nav.style.background = 'linear-gradient(to bottom, rgba(8, 12, 15, 0.95), transparent)';
    }
  }, { passive: true });

  // ==========================================
  // HERO PARALLAX
  // ==========================================
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
      heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 1.5;
    }
  }, { passive: true });

  // ==========================================
  // SKILL ITEMS — STAGGER REVEAL
  // ==========================================
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-10px)';
    item.style.transition = `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms`;
  });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.skill-item');
        items.forEach(item => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-group').forEach(g => skillObserver.observe(g));

  // ==========================================
  // PROJECT CARDS — TILT EFFECT
  // ==========================================
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });

  // ==========================================
  // GLITCH TEXT EFFECT ON HERO NAME
  // ==========================================
  const heroLines = document.querySelectorAll('.hero-name .line');
  heroLines.forEach(line => {
    line.addEventListener('mouseenter', () => {
      line.style.animation = 'glitch 0.3s steps(2) forwards';
    });
    line.addEventListener('animationend', () => {
      line.style.animation = '';
    });
  });

  // Inject glitch keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitch {
      0%   { text-shadow: none; }
      20%  { text-shadow: 3px 0 0 rgba(0,229,255,0.6), -3px 0 0 rgba(124,58,237,0.6); }
      40%  { text-shadow: -3px 0 0 rgba(0,229,255,0.6), 3px 0 0 rgba(124,58,237,0.6); transform: skewX(2deg); }
      60%  { text-shadow: 2px 0 0 rgba(0,229,255,0.4), -2px 0 0 rgba(124,58,237,0.4); transform: skewX(-1deg); }
      80%  { text-shadow: -1px 0 0 rgba(0,229,255,0.3); transform: none; }
      100% { text-shadow: none; }
    }
  `;
  document.head.appendChild(style);

  console.log('%cWakandianShield — Full Stack Developer', 'color: #00e5ff; font-size: 14px; font-weight: bold;');
  console.log('%chttps://github.com/WakandianShield', 'color: #6b7d8f; font-size: 11px;');

})();