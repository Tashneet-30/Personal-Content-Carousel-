/**
 * helpers.js
 * ──────────
 * General-purpose utility functions used across the app.
 * Pure functions with no side effects (except debounce).
 */

/* ── Date Formatting ────────────────────────────────────── */

/**
 * Format a date string into a human-friendly format.
 * @param   {string} dateStr  ISO date string or any Date-parseable string
 * @returns {string}          e.g. "Jul 10, 2026"
 */
export function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return original if invalid
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Return a relative time string (e.g. "2 hours ago", "3 days ago").
 * @param   {string} dateStr  ISO date string
 * @returns {string}
 */
export function timeAgo(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = Date.now();
    const diffMs = now - date.getTime();

    // Handle future dates gracefully
    if (diffMs < 0) return 'just now';

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  } catch {
    return dateStr;
  }
}

/* ── String Utilities ───────────────────────────────────── */

/**
 * Truncate a string to `maxLen` characters, adding an ellipsis if trimmed.
 * @param   {string} str
 * @param   {number} maxLen  Maximum length (default 120)
 * @returns {string}
 */
export function truncate(str, maxLen = 120) {
  if (!str || str.length <= maxLen) return str || '';
  return str.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Convert a string to a URL-safe slug.
 * @param   {string} str
 * @returns {string}          e.g. "Hello World!" → "hello-world"
 */
export function slugify(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // Remove non-word chars (except spaces & hyphens)
    .replace(/[\s_]+/g, '-')    // Replace spaces / underscores with hyphens
    .replace(/-+/g, '-')        // Collapse consecutive hyphens
    .replace(/^-|-$/g, '');     // Trim leading / trailing hyphens
}

/**
 * Generate a short, reasonably unique ID.
 * Uses a timestamp base-36 + random suffix.
 * @returns {string}  e.g. "lx3f9k2a7"
 */
export function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${timestamp}${random}`;
}

/* ── Function Utilities ─────────────────────────────────── */

/**
 * Debounce a function — delays invocation until `delay` ms
 * have passed since the last call.
 * @param   {Function} fn
 * @param   {number}   delay  Milliseconds (default 300)
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timerId = null;

  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ── HTML Utilities ─────────────────────────────────────── */

/**
 * Escape HTML special characters to prevent XSS.
 * @param   {string} str  Raw string
 * @returns {string}      Escaped string safe for innerHTML
 */
export function escapeHtml(str) {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Strip all HTML tags from a string, returning plain text.
 * @param   {string} html  HTML string
 * @returns {string}       Plain text
 */
export function stripHtml(html) {
  if (!html) return '';
  // Use DOMParser for accurate tag stripping (browser env)
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    } catch {
      // Fall through to regex fallback
    }
  }
  // Regex fallback (Node / edge cases)
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Format time ago alias.
 */
export function formatTimeAgo(dateStr) {
  return timeAgo(dateStr);
}

/**
 * Show toast notification (delegates to global window.showToast).
 */
export function showToast(message, type = 'info') {
  if (window.showToast) {
    window.showToast(message, type);
  } else {
    console.log(`[Toast ${type}] ${message}`);
  }
}

