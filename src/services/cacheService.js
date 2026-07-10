/**
 * cacheService.js
 * ───────────────
 * localStorage-backed cache with TTL expiry.
 * Also manages bookmarked articles and carousel drafts.
 *
 * Storage keys:
 *   anhi_cache_{key}      — generic cached data with expiry
 *   anhi_bookmarks        — saved / bookmarked articles
 *   anhi_carousel_drafts  — carousel generator drafts
 */

const PREFIX = 'anhi_';

/* ── Generic Cache ──────────────────────────────────────── */

/**
 * Retrieve a cached value.
 * Returns `null` if the key doesn't exist or has expired.
 */
function get(key) {
  try {
    const raw = localStorage.getItem(`${PREFIX}cache_${key}`);
    if (!raw) return null;

    const { data, expiresAt } = JSON.parse(raw);

    // Check TTL expiry
    if (expiresAt && Date.now() > expiresAt) {
      remove(key);
      return null;
    }

    return data;
  } catch (err) {
    console.warn(`[cacheService] Failed to read key "${key}":`, err);
    return null;
  }
}

/**
 * Store a value with an optional time-to-live.
 * @param {string}  key         Cache key
 * @param {*}       data        Serialisable data
 * @param {number}  ttlMinutes  Time-to-live in minutes (default 60)
 */
function set(key, data, ttlMinutes = 60) {
  try {
    const entry = {
      data,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    };
    localStorage.setItem(`${PREFIX}cache_${key}`, JSON.stringify(entry));
  } catch (err) {
    console.warn(`[cacheService] Failed to write key "${key}":`, err);
  }
}

/**
 * Remove a cached value.
 */
function remove(key) {
  try {
    localStorage.removeItem(`${PREFIX}cache_${key}`);
  } catch (err) {
    console.warn(`[cacheService] Failed to remove key "${key}":`, err);
  }
}

/* ── Bookmarks ──────────────────────────────────────────── */

const BOOKMARKS_KEY = `${PREFIX}bookmarks`;

/**
 * Get all bookmarked articles.
 * @returns {Array} Array of article objects
 */
function getBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Add an article to bookmarks (no duplicates).
 * @param {object} article  The article object to bookmark
 */
function addBookmark(article) {
  const bookmarks = getBookmarks();
  // Prevent duplicates based on id
  if (bookmarks.some((b) => b.id === article.id)) return;
  bookmarks.unshift(article);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

/**
 * Remove an article from bookmarks by id.
 * @param {string} articleId
 */
function removeBookmark(articleId) {
  const bookmarks = getBookmarks().filter((b) => b.id !== articleId);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

/* ── Carousel Drafts ────────────────────────────────────── */

const DRAFTS_KEY = `${PREFIX}carousel_drafts`;

/**
 * Get all saved carousel drafts.
 * @returns {Array} Array of draft objects
 */
function getCarouselDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save a carousel draft (upsert by id).
 * @param {object} draft  Draft object with an `id` property
 */
function saveCarouselDraft(draft) {
  const drafts = getCarouselDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);

  if (idx !== -1) {
    // Update existing draft
    drafts[idx] = { ...drafts[idx], ...draft, updatedAt: Date.now() };
  } else {
    // Insert new draft
    drafts.unshift({ ...draft, createdAt: Date.now(), updatedAt: Date.now() });
  }

  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

/**
 * Delete a carousel draft by id.
 * @param {string} draftId
 */
function deleteCarouselDraft(draftId) {
  const drafts = getCarouselDrafts().filter((d) => d.id !== draftId);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

/* ── Public API ─────────────────────────────────────────── */

export const cacheService = {
  get,
  set,
  remove,
  getBookmarks,
  addBookmark,
  removeBookmark,
  getCarouselDrafts,
  saveCarouselDraft,
  deleteCarouselDraft,
};

export default cacheService;
