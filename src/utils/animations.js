/**
 * animations.js
 * ─────────────
 * Lightweight animation utilities for the AI News Hub UI.
 * Uses IntersectionObserver for scroll-triggered reveals
 * and requestAnimationFrame for smooth counters / typewriter.
 */

/* ── Scroll-triggered Reveal ────────────────────────────── */

/**
 * Initialise IntersectionObserver-based reveal animations.
 * Any element with the class `.animate-on-scroll` will
 * receive a `.visible` class when it enters the viewport.
 *
 * CSS should define the transition, e.g.:
 *   .animate-on-scroll { opacity: 0; transform: translateY(20px); transition: all 0.5s ease; }
 *   .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
 *
 * @param {object} options  IntersectionObserver options override
 */
export function initScrollAnimations(options = {}) {
  // Guard: only run in browser environments
  if (typeof IntersectionObserver === 'undefined') return;

  const defaultOptions = {
    root: null,            // viewport
    rootMargin: '0px',
    threshold: 0.15,       // trigger when 15% visible
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing after reveal (animate only once)
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);

  // Observe all current `.animate-on-scroll` elements
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });

  // Return observer so callers can observe new elements later
  return observer;
}

/* ── Stagger Children ───────────────────────────────────── */

/**
 * Add staggered animation classes to children of a parent element.
 * Each child gets an incrementally increasing transition-delay via
 * a CSS custom property `--stagger-index`.
 *
 * CSS should use:
 *   .stagger-child { transition-delay: calc(var(--stagger-index, 0) * 50ms); }
 *
 * @param {HTMLElement} parentEl  Parent element whose children to stagger
 * @param {number}      delay     Delay step per child in ms (default 50)
 */
export function staggerChildren(parentEl, delay = 50) {
  if (!parentEl) return;

  const children = parentEl.children;
  Array.from(children).forEach((child, index) => {
    // Set a CSS custom property for the stagger index
    child.style.setProperty('--stagger-index', index);
    // Also set an explicit transition-delay as a convenience
    child.style.transitionDelay = `${index * delay}ms`;
    // Add a class for CSS-based styling
    child.classList.add('stagger-child');
  });
}

/* ── Number Counter Animation ───────────────────────────── */

/**
 * Animate a number counter from 0 to `target` over `duration` ms.
 * Uses requestAnimationFrame for a smooth, eased animation.
 *
 * @param {HTMLElement} el        Element whose textContent to animate
 * @param {number}      target    Target number to count up to
 * @param {number}      duration  Animation duration in ms (default 2000)
 */
export function animateCounter(el, target, duration = 2000) {
  if (!el) return;

  const start = performance.now();
  const isFloat = !Number.isInteger(target);

  function update(now) {
    const elapsed = now - start;
    // Ease-out cubic progress curve
    const rawProgress = Math.min(elapsed / duration, 1);
    const progress = 1 - Math.pow(1 - rawProgress, 3);

    const current = progress * target;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);

    if (rawProgress < 1) {
      requestAnimationFrame(update);
    } else {
      // Ensure we land exactly on the target
      el.textContent = isFloat ? target.toFixed(1) : target;
    }
  }

  requestAnimationFrame(update);
}

/* ── Typewriter Effect ──────────────────────────────────── */

/**
 * Type text character by character into an element.
 * Returns a Promise that resolves when typing is complete.
 *
 * @param   {HTMLElement} el     Target element
 * @param   {string}      text   Text to type
 * @param   {number}      speed  Delay per character in ms (default 50)
 * @returns {Promise<void>}
 */
export function typewriterEffect(el, text, speed = 50) {
  if (!el) return Promise.resolve();

  return new Promise((resolve) => {
    let index = 0;
    el.textContent = '';

    function typeChar() {
      if (index < text.length) {
        el.textContent += text[index];
        index++;
        setTimeout(typeChar, speed);
      } else {
        resolve();
      }
    }

    typeChar();
  });
}
