/**
 * ============================================
 * MAIN.JS — App Entry Point & SPA Router
 * AI News Hub · by Tashneet Kaur (@tshntkaur)
 * ============================================
 *
 * Responsibilities:
 *   1. Import global styles
 *   2. Hash-based SPA router (dashboard | carousel | explore | profile)
 *   3. Modal management (carousel editor + article detail)
 *   4. Global toast notifications
 *   5. Global carousel-open helper
 */

// ── Styles ────────────────────────────────────────────────
import '../style.css';

// ── Pages ─────────────────────────────────────────────────
import { initDashboard } from './pages/dashboard.js';
import { initCarousel } from './pages/carousel.js';
import { initExplore } from './pages/explore.js';
import { initProfile } from './pages/profile.js';

// ── Components ────────────────────────────────────────────
import { initNavbar } from './components/navbar.js';
import { initCarouselEditor } from './components/carouselEditor.js';

/* ──────────────────────────────────────────────────────────
   ROUTE TABLE
   ────────────────────────────────────────────────────────── */

const ROUTES = {
  dashboard: initDashboard,
  carousel:  initCarousel,
  explore:   initExplore,
  profile:   initProfile,
};

/* ──────────────────────────────────────────────────────────
   ROUTER
   ────────────────────────────────────────────────────────── */

/**
 * Navigate to a given page by:
 *   • toggling `.active` on `.page` sections
 *   • updating nav-link highlights
 *   • calling the page's init function
 *   • scrolling to top
 *
 * @param {string} page — route key (e.g. 'dashboard')
 */
function navigateTo(page) {
  // Fallback to dashboard if the route is unknown
  if (!ROUTES[page]) page = 'dashboard';

  // ── Toggle page visibility ──────────────────────────────
  document.querySelectorAll('.page').forEach((el) => el.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // ── Update nav-link active states ───────────────────────
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // ── Call the page initializer ───────────────────────────
  ROUTES[page]();

  // ── Scroll to top ───────────────────────────────────────
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ──────────────────────────────────────────────────────────
   HASH → PAGE EXTRACTION
   ────────────────────────────────────────────────────────── */

/**
 * Parse the current URL hash into a page key.
 * Strips leading '#' and query-params (e.g. "#dashboard?cat=agents" → "dashboard").
 * @returns {string}
 */
function getPageFromHash() {
  const raw = window.location.hash.replace(/^#/, '').split('?')[0];
  return raw || 'dashboard';
}

/* ──────────────────────────────────────────────────────────
   TOAST NOTIFICATIONS
   ────────────────────────────────────────────────────────── */

/**
 * Show a small toast notification in the bottom-right corner.
 * Auto-removes after 3 seconds.
 *
 * @param {string} message — display text
 * @param {'info'|'success'|'error'} type — visual style
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { info: 'ℹ️', success: '✅', error: '❌' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span> ${message}`;

  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ──────────────────────────────────────────────────────────
   GLOBAL CAROUSEL OPENER
   ────────────────────────────────────────────────────────── */

/**
 * Open the carousel editor modal from anywhere in the app.
 * @param {Object} article — article data to pre-load
 */
export function openCarouselModalGlobal(article) {
  initCarouselEditor(article);
  document.getElementById('carousel-modal').style.display = 'flex';
}

/* ──────────────────────────────────────────────────────────
   EXPOSE GLOBALS (so any module can call them without importing)
   ────────────────────────────────────────────────────────── */

window.showToast = showToast;
window.openCarouselModalGlobal = openCarouselModalGlobal;

/* ──────────────────────────────────────────────────────────
   BOOTSTRAP
   ────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // ── Init navbar (mobile toggle, etc.) ───────────────────
  initNavbar();

  // ── Initial route ───────────────────────────────────────
  const initialPage = getPageFromHash();
  navigateTo(initialPage);

  // ── Hash-change listener ────────────────────────────────
  window.addEventListener('hashchange', () => {
    navigateTo(getPageFromHash());
  });

  // ── Modal close buttons ─────────────────────────────────
  const carouselCloseBtn = document.getElementById('modal-close');
  const articleCloseBtn  = document.getElementById('article-modal-close');

  if (carouselCloseBtn) {
    carouselCloseBtn.addEventListener('click', () => {
      document.getElementById('carousel-modal').style.display = 'none';
    });
  }

  if (articleCloseBtn) {
    articleCloseBtn.addEventListener('click', () => {
      document.getElementById('article-modal').style.display = 'none';
    });
  }

  // ── Close modals on overlay click (not content click) ───
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      // Only close when clicking the overlay itself, not its children
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  });
});
