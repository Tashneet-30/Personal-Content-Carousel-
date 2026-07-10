// ============================================
// AI NEWS HUB — Search Bar Component
// Renders a search input with icon and provides
// debounced search-as-you-type functionality.
// ============================================

import { debounce } from '../utils/helpers.js';

/**
 * Returns the HTML string for the search bar.
 *
 * @param {string} placeholder - Placeholder text for the input field
 * @returns {string} HTML string for the search container
 */
export function renderSearchBar(placeholder = 'Search AI news...') {
  return `
    <div class="search-container">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        class="search-input"
        id="search-input"
        placeholder="${placeholder}"
        autocomplete="off"
        spellcheck="false"
      />
    </div>
  `;
}

/**
 * Attaches a debounced input listener to the search input.
 * Calls `onSearch(query)` 300ms after the user stops typing.
 *
 * @param {Function} onSearch - Callback receiving the trimmed query string
 */
export function initSearchBar(onSearch) {
  const input = document.getElementById('search-input');
  if (!input) return;

  // Create a debounced handler to avoid firing on every keystroke
  const debouncedSearch = debounce((query) => {
    if (typeof onSearch === 'function') {
      onSearch(query);
    }
  }, 300);

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    debouncedSearch(query);
  });
}
