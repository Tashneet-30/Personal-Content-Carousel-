// ============================================
// AI NEWS HUB — News Card Component
// Renders individual article cards, the news grid,
// and skeleton loading placeholders.
// ============================================

import { escapeHtml } from '../utils/helpers.js';

// ---- Category → CSS class mapping ----
const CATEGORY_CLASS_MAP = {
  agents: 'cat-agents',
  llms: 'cat-llms',
  vision: 'cat-vision',
  startups: 'cat-startups',
  tools: 'cat-tools',
  learning: 'cat-learning',
  research: 'cat-research',
  industry: 'cat-industry',
  news: 'cat-llms', // "news" falls back to the LLMs color
};

/**
 * Returns the CSS class for a given category string.
 * Falls back to 'cat-llms' for unknown categories.
 * @param {string} category
 * @returns {string} CSS class name
 */
function getCategoryClass(category) {
  const key = (category || '').toLowerCase().trim();
  return CATEGORY_CLASS_MAP[key] || 'cat-llms';
}

/**
 * Renders a single news card HTML string.
 *
 * @param {Object} article
 * @param {string} article.id - Unique article identifier
 * @param {string} article.title - Headline
 * @param {string} article.category - Category slug (e.g. 'agents', 'llms')
 * @param {string} article.source - Publishing source name
 * @param {string} article.date - Human-readable date string
 * @param {string} article.excerpt - Short summary / excerpt
 * @param {string} [article.readTime] - Estimated read time (e.g. '4 min read')
 * @returns {string} HTML string
 */
export function renderNewsCard(article) {
  const catClass = getCategoryClass(article.category);
  const categoryLabel = escapeHtml(article.category || 'News');
  const title = escapeHtml(article.title || 'Untitled');
  const source = escapeHtml(article.source || 'Unknown');
  const date = escapeHtml(article.date || '');
  const readTime = escapeHtml(article.readTime || '3 min read');
  const excerpt = escapeHtml(article.excerpt || '');

  return `
    <article class="card news-card" data-id="${escapeHtml(article.id)}" data-article-id="${escapeHtml(article.id)}">
      <!-- Category badge -->
      <span class="card-category ${catClass}">${categoryLabel}</span>

      <!-- Title -->
      <h3 class="card-title">${title}</h3>

      <!-- Meta: source · date · read time -->
      <div class="card-meta">
        <span class="source">${source}</span>
        <span>·</span>
        <span>${date}</span>
        <span>·</span>
        <span>${readTime}</span>
      </div>

      <!-- Excerpt -->
      <p class="card-excerpt">${excerpt}</p>

      <!-- Action buttons -->
      <div class="card-actions">
        <button class="btn btn-sm btn-primary" data-article-id="${escapeHtml(article.id)}" data-action="create-carousel">
          📸 Create Carousel
        </button>
        <button class="btn btn-sm btn-ghost" data-article-id="${escapeHtml(article.id)}" data-action="read-more">
          Read More
        </button>
        <button
          class="btn btn-sm btn-ghost"
          data-article-id="${escapeHtml(article.id)}"
          data-action="bookmark"
          aria-label="Bookmark article"
          style="margin-left:auto;"
        >
          🔖
        </button>
      </div>
    </article>
  `;
}

/**
 * Renders the full news grid for an array of articles.
 * @param {Object[]} articles - Array of article objects
 * @returns {string} HTML string wrapped in .news-grid
 */
export function renderNewsGrid(articles) {
  if (!articles || articles.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No articles found</h3>
        <p>Try adjusting your search or category filters.</p>
      </div>
    `;
  }

  const cards = articles.map(a => renderNewsCard(a)).join('');
  return `<div class="news-grid">${cards}</div>`;
}

/**
 * Renders skeleton loading placeholders while articles are being fetched.
 * @param {number} count - Number of skeleton cards to render (default 6)
 * @returns {string} HTML string with skeleton cards inside .news-grid
 */
export function renderSkeletonGrid(count = 6) {
  const skeletons = Array.from({ length: count }, () => `
    <div class="card news-card">
      <div class="skeleton skeleton-text" style="width:90px;height:22px;border-radius:9999px;"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text" style="width:60%;"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width:85%;"></div>
      <div class="skeleton skeleton-text" style="width:40%;margin-top:auto;"></div>
    </div>
  `).join('');

  return `<div class="news-grid">${skeletons}</div>`;
}
