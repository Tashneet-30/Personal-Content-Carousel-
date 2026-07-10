// ============================================
// AI NEWS HUB — Navbar Component
// Handles navigation, active-link highlighting,
// hash-based routing, and mobile menu toggling.
// ============================================

/**
 * Initializes the navbar:
 *  - Highlights the active nav link based on the current URL hash
 *  - Listens for hashchange to update the active state
 *  - Toggles the mobile menu open/close via the hamburger button
 *  - Manages page visibility (shows the correct .page section)
 */
export function initNavbar() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const allPages = document.querySelectorAll('.page');

  // ---- Helper: update active link & visible page ----
  function setActivePage(hash) {
    // Fallback to 'dashboard' if hash is empty or just '#'
    const pageId = hash.replace('#', '') || 'dashboard';

    // Update nav link active states
    allNavLinks.forEach(link => {
      const linkPage = link.getAttribute('data-page');
      if (linkPage === pageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Show the matching page section, hide others
    allPages.forEach(page => {
      if (page.id === `page-${pageId}`) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Scroll to top on page change for a smooth UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---- Hash-based routing ----
  // Set initial active state from the current hash
  setActivePage(window.location.hash);

  // React to hash changes (back/forward, link clicks)
  window.addEventListener('hashchange', () => {
    setActivePage(window.location.hash);

    // Close mobile menu on navigation (if open)
    if (mobileToggle && navLinks) {
      mobileToggle.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  // ---- Smooth nav-link clicks ----
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // The href already has the hash — let the browser handle it,
      // but close the mobile menu immediately.
      if (mobileToggle && navLinks) {
        mobileToggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  });

  // ---- Mobile menu toggle ----
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }
}
