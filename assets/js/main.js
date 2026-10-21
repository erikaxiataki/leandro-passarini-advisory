document.addEventListener('DOMContentLoaded', () => {
  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.getElementById('mobile-panel');
  if (toggle && panel) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      panel.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 881px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  // Stagger index for grouped reveals
  document.querySelectorAll('.reveal-stagger').forEach(group => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Count-up numbers (final value is already in the HTML for no-JS and search engines)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animateCount(el) {
    if (el.dataset.counted || reduceMotion) return;
    el.dataset.counted = 'true';
    const target = parseFloat(el.dataset.target || '0');
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counts = document.querySelectorAll('.count-up');
  if ('IntersectionObserver' in window && counts.length) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counts.forEach(el => countIo.observe(el));
  }
});
