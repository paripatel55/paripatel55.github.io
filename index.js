// ===== PARTICLE CANVAS BACKGROUND =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 60;
const colors = [
  'rgba(139, 92, 246, 0.4)',
  'rgba(236, 72, 153, 0.3)',
  'rgba(59, 130, 246, 0.35)',
  'rgba(245, 158, 11, 0.25)'
];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

let mouseX = 0;
let mouseY = 0;

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // Draw connections between nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // Mouse interaction - particles gently repel from cursor
    const dxMouse = p.x - mouseX;
    const dyMouse = p.y - mouseY;
    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
    if (distMouse < 120) {
      const force = (120 - distMouse) / 120 * 0.3;
      p.vx += (dxMouse / distMouse) * force;
      p.vy += (dyMouse / distMouse) * force;
    }

    // Dampen velocity
    p.vx *= 0.99;
    p.vy *= 0.99;
  });

  requestAnimationFrame(drawParticles);
}

drawParticles();

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursor-glow');
let glowVisible = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';

  if (!glowVisible) {
    cursorGlow.classList.add('visible');
    glowVisible = true;
  }
});

document.addEventListener('mouseleave', () => {
  cursorGlow.classList.remove('visible');
  glowVisible = false;
});

// ===== SCROLL-TRIGGERED REVEAL ANIMATIONS =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  navbar.classList.toggle('nav--scrolled', currentScrollY > 50);

  // Hide navbar on scroll down, show on scroll up
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  navbar.style.transition = 'transform 0.3s ease, background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease';
  lastScrollY = currentScrollY;
});

// ===== MOBILE HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('nav__link--active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('nav__link--active');
    }
  });
});

// ===== PARALLAX ON HERO IMAGE =====
const heroImage = document.querySelector('.hero__image-wrapper');
if (heroImage) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  });
}

// ===== TILT EFFECT ON EXPERIENCE CARDS =====
document.querySelectorAll('.exp-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== EXPERIENCE CARD CAROUSEL DOT SYNC =====
const expTrack = document.getElementById('exp-track');
const expDots = document.querySelectorAll('.exp-dot');

if (expTrack && expDots.length) {
  // Update dots on scroll
  expTrack.addEventListener('scroll', () => {
    const scrollLeft = expTrack.scrollLeft;
    const cardWidth = expTrack.querySelector('.exp-card').offsetWidth + 24; // gap
    const activeIndex = Math.round(scrollLeft / cardWidth);

    expDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  });

  // Click dots to scroll
  expDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      const cardWidth = expTrack.querySelector('.exp-card').offsetWidth + 24;
      expTrack.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    });
  });
}

// ===== TILT ON HIGHLIGHT CARDS =====
document.querySelectorAll('.highlight-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) perspective(600px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== TYPED EFFECT FOR HERO LABEL =====
const heroLabel = document.querySelector('.hero__label');
if (heroLabel) {
  const text = heroLabel.textContent;
  heroLabel.textContent = '';
  heroLabel.style.opacity = '1';
  heroLabel.style.animation = 'none';
  let i = 0;
  const typeInterval = setInterval(() => {
    heroLabel.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(typeInterval);
      // Add blinking cursor after typing
      heroLabel.classList.add('typed-done');
    }
  }, 60);
}

// ===== SMOOTH SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
});

// ===== MAGNETIC EFFECT ON BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounter(el, target) {
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step = target / 40;
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 30);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      if (target) animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ===== GALLERY IMAGE TILT =====
document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `translateY(-4px) perspective(600px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});
