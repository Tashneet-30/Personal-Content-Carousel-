// ============================================
// AI NEWS HUB — Category Filter Component
// Renders a horizontal filter bar of category tags
// and manages active-state toggling with a callback.
// ============================================

import { escapeHtml } from '../utils/helpers.js';

/**
 * Renders the category filter bar HTML.
 *
 * @param {Array<{id: string, label: string, emoji?: string}>} categories
 *   Array of category objects. The first item should typically be
 *   { id: 'all', label: 'All', emoji: '🔥' } for the "show all" option.
 * @param {string} activeCategory - The currently active category id (default 'all')
 * @returns {string} HTML string for the filter bar
 */
export function renderCategoryFilter(categories, activeCategory = 'all') {
  const tags = categories
    .map(cat => {
      const isActive = cat.id === activeCategory ? ' active' : '';
      const emoji = cat.emoji ? `<span>${cat.emoji}</span> ` : '';
      return `
        <button
          class="filter-tag${isActive}"
          data-category="${escapeHtml(cat.id)}"
        >
          ${emoji}${escapeHtml(cat.label)}
        </button>
      `;
    })
    .join('');

  return `<div class="filter-bar">${tags}</div>`;
}

/**
 * Attaches click listeners to .filter-tag buttons using event delegation.
 * Toggles the .active class and invokes the callback with the selected
 * category id whenever a filter tag is clicked.
 *
 * @param {Function} onCategoryChange - Callback receiving the new category id string
 */
export function initCategoryFilter(onCategoryChange) {
  // Use event delegation on the filter bar container
  document.addEventListener('click', (e) => {
    const tag = e.target.closest('.filter-tag');
    if (!tag) return;

    const filterBar = tag.closest('.filter-bar');
    if (!filterBar) return;

    // Remove .active from all siblings within the same filter bar
    filterBar.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));

    // Activate the clicked tag
    tag.classList.add('active');

    // Notify the parent via callback
    const categoryId = tag.getAttribute('data-category');
    if (typeof onCategoryChange === 'function') {
      onCategoryChange(categoryId);
    }
  });
}
