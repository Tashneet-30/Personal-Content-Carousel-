/**
 * ============================================
 * DASHBOARD PAGE — Main News Feed
 * AI News Hub · by Tashneet Kaur (@tshntkaur)
 * ============================================
 *
 * The command center: fetches AI news from multiple sources,
 * renders a filterable / searchable grid of news cards, and
 * provides quick access to carousel creation and article details.
 */

// ── Services ──────────────────────────────────────────────
import { fetchAllNews } from '../services/newsService.js';
import { fetchHNStories } from '../services/hnService.js';

// ── Components ────────────────────────────────────────────
import { renderNewsCard } from '../components/newsCard.js';
import { initCategoryFilter } from '../components/categoryFilter.js';
import { initSearchBar } from '../components/searchBar.js';
import { initCarouselEditor } from '../components/carouselEditor.js';

// ── Data ──────────────────────────────────────────────────
import { CATEGORIES } from '../data/feedSources.js';

// ── Utils ─────────────────────────────────────────────────
import { formatTimeAgo, truncate } from '../utils/helpers.js';
import { initScrollAnimations } from '../utils/animations.js';

/* ──────────────────────────────────────────────────────────
   STATE
   ────────────────────────────────────────────────────────── */

/** @type {Array} All fetched articles (merged from every source) */
let allArticles = [];

/** Currently selected category filter ('all' = show everything) */
let activeCategory = 'all';

/** Current search query string */
let searchQuery = '';

/* ──────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────── */

/**
 * Apply both category and search filters, then return the subset.
 * @returns {Array} Filtered article list
 */
function getFilteredArticles() {
  return allArticles.filter((article) => {
    // Category gate
    const matchesCat =
      activeCategory === 'all' || article.category === activeCategory;

    // Search gate (title + source + excerpt, case-insensitive)
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (article.title || '').toLowerCase().includes(q) ||
      (article.source || '').toLowerCase().includes(q) ||
      (article.excerpt || '').toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });
}

/**
 * Render a set of articles into the news grid container.
 * Shows an empty-state message when there are zero results.
 * @param {Array} articles
 */
function renderGrid(articles) {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  if (articles.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3>No articles found</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>`;
    return;
  }

  grid.innerHTML = articles.map((a) => renderNewsCard(a)).join('');
}

/**
 * Generate skeleton placeholder cards while news is loading.
 * @param {number} count — how many skeleton cards to show
 * @returns {string} HTML string
 */
function skeletonCards(count = 6) {
  return Array.from({ length: count })
    .map(
      () => `
      <div class="card skeleton-card skeleton">
        <div class="skeleton-text skeleton" style="width:40%"></div>
        <div class="skeleton-title skeleton"></div>
        <div class="skeleton-text skeleton" style="width:60%"></div>
        <div class="skeleton-text skeleton"></div>
        <div class="skeleton-text skeleton" style="width:80%"></div>
      </div>`
    )
    .join('');
}

/* ──────────────────────────────────────────────────────────
   MODALS
   ────────────────────────────────────────────────────────── */

/**
 * Open the article-detail modal and populate it with the given article.
 * @param {Object} article
 */
export function openArticleModal(article) {
  const root = document.getElementById('article-detail-root');
  if (!root) return;

  root.innerHTML = `
    <div class="article-detail">
      <span class="card-category cat-${article.category || 'tools'}">
        ${article.category || 'AI'}
      </span>
      <h2>${article.title}</h2>
      <div class="article-meta">
        <span class="source">${article.source || 'Unknown'}</span>
        <span>·</span>
        <span>${article.date ? formatTimeAgo(article.date) : ''}</span>
      </div>
      <div class="article-body">
        <p>${article.excerpt || article.content || 'No content available.'}</p>
        ${article.content ? `<p>${article.content}</p>` : ''}
      </div>
      <div class="article-actions">
        <a href="${article.url || '#'}" target="_blank" rel="noopener"
           class="btn btn-primary btn-sm">Read Original ↗</a>
        <button class="btn btn-secondary btn-sm" id="article-to-carousel">
          📸 Create Carousel
        </button>
      </div>
    </div>`;

  // "Create Carousel" inside the article modal
  const btn = document.getElementById('article-to-carousel');
  if (btn) {
    btn.addEventListener('click', () => {
      document.getElementById('article-modal').style.display = 'none';
      openCarouselModal(article);
    });
  }

  document.getElementById('article-modal').style.display = 'flex';
}

/**
 * Open the carousel-editor modal pre-loaded with article data.
 * @param {Object} article
 */
export function openCarouselModal(article) {
  initCarouselEditor(article);
  document.getElementById('carousel-modal').style.display = 'flex';
}

/* ──────────────────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────────────────── */

/**
 * Boot the dashboard page.
 * Called every time the user navigates to #dashboard.
 */
export async function initDashboard() {
  const container = document.querySelector('#page-dashboard .page-content');
  if (!container) return;

  /* ── 1. Render page structure ─────────────────────────── */
  container.innerHTML = `
    <!-- Hero -->
    <section class="hero" style="padding: var(--space-xl) 0 var(--space-md); text-align: center;">
      <div class="hero-badge">
        <span class="pulse-dot"></span>
        🟢 Live AI News Hub
      </div>
      <h1 style="font-family: var(--font-heading); font-size: clamp(2.2rem, 5vw, var(--fs-4xl)); font-weight: var(--fw-bold); color: var(--text-primary); margin-bottom: var(--space-md);">
        Create scroll-stopping <span class="gradient-text">AI Content</span> in seconds
      </h1>
      
      <!-- Claude-style Today's Topic box -->
      <div class="topic-generator-container glass-card mt-xl" style="max-width: 650px; margin-left: auto; margin-right: auto; padding: var(--space-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-md); background: var(--bg-card); text-align: left;">
        <h3 style="font-size: var(--fs-sm); font-family: var(--font-body); font-weight: var(--fw-semibold); color: var(--text-secondary); margin-bottom: var(--space-sm); text-transform: uppercase; letter-spacing: 0.05em;">
          ✍️ Generate from today's topic
        </h3>
        <div style="display: flex; gap: var(--space-sm);">
          <input type="text" id="today-topic-input" placeholder="e.g. Rise of Autonomous AI Agents, EV Infrastructure in MURBs, ChatGPT vs Claude..." style="flex: 1; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-family: var(--font-body); font-size: var(--fs-sm); outline: none; transition: border-color 0.2s;" />
          <button id="today-topic-btn" class="btn btn-primary" style="padding: 12px 24px; border-radius: var(--radius-md); font-weight: var(--fw-semibold);">
            Generate Carousel 📸
          </button>
        </div>
      </div>

      <div class="hero-stats" style="margin-top: var(--space-xl);">
        <div class="hero-stat">
          <div class="stat-value">15+</div>
          <div class="stat-label">News Sources</div>
        </div>
        <div class="hero-stat">
          <div class="stat-value">8</div>
          <div class="stat-label">Categories</div>
        </div>
        <div class="hero-stat">
          <div class="stat-value">6</div>
          <div class="stat-label">Carousel Templates</div>
        </div>
        <div class="hero-stat">
          <div class="stat-value" id="article-count">—</div>
          <div class="stat-label">Articles Today</div>
        </div>
      </div>
    </section>

    <!-- Toolbar: filters + search -->
    <section class="toolbar mt-2xl">
      <div id="category-filter" class="filter-bar"></div>
      <div id="search-bar"></div>
    </section>

    <!-- News Grid (skeleton while loading) -->
    <div id="news-grid" class="news-grid mt-xl">
      ${skeletonCards(6)}
    </div>`;

  /* ── 2. Fetch news from all sources concurrently ──────── */
  try {
    const [newsArticles, hnStories] = await Promise.all([
      fetchAllNews(),
      fetchHNStories(),
    ]);

    // Merge and sort by date (newest first)
    allArticles = [...newsArticles, ...hnStories].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  } catch (err) {
    console.error('[Dashboard] Failed to fetch news:', err);
    allArticles = [];
  }

  // Update the live article count stat
  const countEl = document.getElementById('article-count');
  if (countEl) countEl.textContent = allArticles.length;

  /* ── 3. Render the news grid ──────────────────────────── */
  renderGrid(getFilteredArticles());

  /* ── 4. Initialize category filter ────────────────────── */
  initCategoryFilter(
    document.getElementById('category-filter'),
    CATEGORIES,
    (category) => {
      activeCategory = category;
      renderGrid(getFilteredArticles());
    }
  );

  /* ── 5. Initialize search bar ─────────────────────────── */
  initSearchBar(document.getElementById('search-bar'), (query) => {
    searchQuery = query;
    renderGrid(getFilteredArticles());
  });

  // -- Today's topic input handler --
  const topicBtn = document.getElementById('today-topic-btn');
  const topicInput = document.getElementById('today-topic-input');

  const handleGenerateFromTopic = () => {
    const topic = topicInput?.value.trim();
    if (!topic) {
      if (window.showToast) window.showToast('Please enter a topic first!', 'error');
      return;
    }

    const syntheticArticle = {
      id: `topic-${Date.now()}`,
      title: topic,
      category: 'agents',
      excerpt: `An overview and key points regarding the topic of: ${topic}.`,
      content: `In this guide, we dive deep into the topic: ${topic}. We will look at why this is trending today, how it works, and how it is applied across different industries. We also explore what the future holds for this domain.`,
      source: 'AI Hub',
      date: new Date().toISOString().split('T')[0],
      url: ''
    };

    openCarouselModal(syntheticArticle);
  };

  if (topicBtn) {
    topicBtn.addEventListener('click', handleGenerateFromTopic);
  }
  if (topicInput) {
    topicInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleGenerateFromTopic();
    });
  }

  /* ── 6. Click delegation on the news grid ─────────────── */
  const grid = document.getElementById('news-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const cardEl = target.closest('.card');
      const articleId = cardEl?.dataset?.id;
      const article = allArticles.find(
        (a) => String(a.id) === String(articleId)
      );

      if (!article) return;

      const action = target.dataset.action;

      if (action === 'create-carousel') {
        openCarouselModal(article);
      } else if (action === 'read-more') {
        openArticleModal(article);
      } else if (action === 'bookmark') {
        target.classList.toggle('bookmarked');
        const icon = target.textContent.trim() === '🔖' ? '📑' : '🔖';
        target.textContent = icon;
        if (window.showToast) {
          window.showToast(
            target.classList.contains('bookmarked')
              ? 'Article bookmarked!'
              : 'Bookmark removed',
            'info'
          );
        }
      }
    });
  }

  /* ── 7. Scroll animations ─────────────────────────────── */
  initScrollAnimations();
}
