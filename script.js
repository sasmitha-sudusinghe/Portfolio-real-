/* ============================================================
   SASMITHA SUDUSINGHE — PORTFOLIO JAVASCRIPT
   Features: Particle BG, Theme Toggle, Typewriter, Scroll Anims,
             Skill Bars, Nav Active State, Mobile Menu, Form
   ============================================================ */

'use strict';

// ================================================================
// 1. THEME TOGGLE
// ================================================================
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

function getStoredTheme() {
  return localStorage.getItem('portfolio-theme') || 'light';
}

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

// Init theme
applyTheme(getStoredTheme());

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
  // Reinit particles on theme change for colour adaptation
  setTimeout(initParticles, 50);
});

themeToggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    themeToggle.click();
  }
});

// ================================================================
// 2. PARTICLE BACKGROUND
// ================================================================
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const isDark = htmlEl.getAttribute('data-theme') === 'dark';
  const particleColor = isDark ? 'rgba(26, 115, 232, 0.5)' : 'rgba(26, 115, 232, 0.25)';
  const lineColor = isDark ? 'rgba(26, 115, 232, 0.15)' : 'rgba(26, 115, 232, 0.08)';

  const PARTICLE_COUNT = Math.min(60, Math.floor(window.innerWidth / 20));
  const MAX_DIST = 130;

  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2.5 + 1,
  }));

  let animId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = (1 - dist / MAX_DIST) * 1.2;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Clean up previous animation if reinitialised
  if (window._particleAnimId) cancelAnimationFrame(window._particleAnimId);
  draw();
  window._particleAnimId = animId;
}

initParticles();

window.addEventListener('resize', () => {
  const canvas = document.getElementById('particle-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ================================================================
// 3. TYPEWRITER EFFECT
// ================================================================
const phrases = [
  'Building scalable backends with TypeScript...',
  'Shipping full-stack products that matter...',
  'Turning ideas into deployed applications...',
  'Learning. Building. Shipping. Repeat.',
  'Open to freelance & collaborations...',
];

let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function typewrite() {
  const phrase = phrases[phraseIdx];

  if (isDeleting) {
    typewriterEl.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typewriterEl.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 45 : 80;

  if (!isDeleting && charIdx === phrase.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typewrite, delay);
}

typewrite();

// ================================================================
// 4. MOBILE HAMBURGER MENU
// ================================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
});

// Close on link click
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ================================================================
// 5. ACTIVE NAV LINK ON SCROLL
// ================================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`#nav-${id}`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ================================================================
// 6. SCROLL-TO-TOP BUTTON
// ================================================================
const scrollTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================================================================
// 7. INTERSECTION OBSERVER — SCROLL ANIMATIONS
// ================================================================
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

// General [data-animate] elements
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

// Timeline items
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 150);
      timelineObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(el => timelineObserver.observe(el));

// Project cards with stagger
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
      projectObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.project-card').forEach(el => projectObserver.observe(el));

// ================================================================
// 8. SKILL BAR ANIMATION
// ================================================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate bars inside this card
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const targetWidth = bar.getAttribute('data-width') + '%';
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// Tech badges observer
const badgesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      badgesObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.tech-badges').forEach(el => badgesObserver.observe(el));

// ================================================================
// 9. CONTACT FORM HANDLING
// ================================================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('contact-submit');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !subject || !message) {
    setFormStatus('Please fill in all fields.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFormStatus('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate submission (replace with actual API/EmailJS integration)
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

  await new Promise(r => setTimeout(r, 1500));

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
  setFormStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
  contactForm.reset();

  setTimeout(() => {
    formStatus.textContent = '';
    formStatus.className = 'form-note';
  }, 5000);
});

function setFormStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = `form-note ${type}`;
}

// ================================================================
// 10. SMOOTH SECTION ENTRANCE — HERO ON LOAD
// ================================================================
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-content-col > *').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  // Profile image entrance
  const profileWrapper = document.querySelector('.profile-ring-wrapper');
  if (profileWrapper) {
    profileWrapper.style.opacity = '0';
    profileWrapper.style.transform = 'scale(0.85)';
    profileWrapper.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.2s';
    requestAnimationFrame(() => {
      profileWrapper.style.opacity = '1';
      profileWrapper.style.transform = 'scale(1)';
    });
  }
});

// ================================================================
// 11. NAVBAR COMPACT ON SCROLL
// ================================================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const navContainer = navbar.querySelector('.nav-container');
  if (window.scrollY > 60) {
    navContainer.style.padding = '7px 20px';
  } else {
    navContainer.style.padding = '10px 24px';
  }
}, { passive: true });
