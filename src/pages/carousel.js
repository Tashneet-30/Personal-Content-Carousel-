/**
 * ============================================
 * CAROUSEL PAGE — Standalone Carousel Creator
 * AI News Hub · by Tashneet Kaur (@tshntkaur)
 * ============================================
 *
 * Provides two creation flows:
 *   1. Pick from recent news articles → opens carousel editor
 *   2. Write custom content → generates an article object → opens editor
 *
 * Also shows a visual showcase of all available slide templates.
 */

// ── Services ──────────────────────────────────────────────
import { fetchAllNews } from '../services/newsService.js';

// ── Components ────────────────────────────────────────────
import { renderNewsCard } from '../components/newsCard.js';
import { initCarouselEditor } from '../components/carouselEditor.js';

// ── Data ──────────────────────────────────────────────────
import { TEMPLATES, renderTemplatePickerGrid } from '../components/slideTemplates.js';

// ── Utils ─────────────────────────────────────────────────
import { CATEGORIES } from '../data/feedSources.js';

/* ──────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────── */

/**
 * Open the carousel modal pre-loaded with the given article.
 * @param {Object} article
 */
function openCarouselModal(article) {
  initCarouselEditor(article);
  document.getElementById('carousel-modal').style.display = 'flex';
}

/**
 * Build the category <option> list for the custom-content form.
 * Skips the "all" pseudo-category.
 * @returns {string} HTML <option> elements
 */
function categoryOptions() {
  return CATEGORIES.filter((c) => c.id !== 'all')
    .map((c) => `<option value="${c.id}">${c.icon} ${c.label}</option>`)
    .join('');
}

/* ──────────────────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────────────────── */

/**
 * Boot the carousel creation page.
 * Called every time the user navigates to #carousel.
 */
export async function initCarousel() {
  const container = document.querySelector('#page-carousel .page-content');
  if (!container) return;

  /* ── 1. Render page skeleton ──────────────────────────── */
  container.innerHTML = `
    <!-- Section header -->
    <div class="section-header text-center" style="padding-top:var(--space-3xl);">
      <h2>Create Instagram <span class="gradient-text">Carousel</span></h2>
      <p>Turn AI news into scroll-stopping Instagram carousels in seconds.</p>
    </div>

    <!-- ────── Option A: From a news article ────── -->
    <section class="mt-3xl">
      <div class="section-header">
        <h2>📰 From News Article</h2>
        <p>Pick an article below and we'll generate slides for you.</p>
      </div>
      <div id="carousel-news-grid" class="news-grid">
        <!-- filled dynamically -->
        ${Array.from({ length: 6 })
          .map(
            () =>
              '<div class="card skeleton-card skeleton"></div>'
          )
          .join('')}
      </div>
    </section>

    <!-- ────── Option B: Custom content ────── -->
    <section class="mt-3xl">
      <div class="section-header">
        <h2>✍️ Custom Content</h2>
        <p>Write your own content and generate a carousel from scratch.</p>
      </div>

      <div class="glass-card" style="padding:var(--space-xl);max-width:700px;">
        <div class="control-group mb-lg">
          <label for="custom-title">Title</label>
          <input type="text" id="custom-title"
                 placeholder="e.g. 5 AI Trends to Watch in 2026" />
        </div>

        <div class="control-group mb-lg">
          <label for="custom-category">Category</label>
          <select id="custom-category">
            ${categoryOptions()}
          </select>
        </div>

        <div class="control-group mb-lg">
          <label for="custom-content">Content</label>
          <textarea id="custom-content" rows="6"
                    placeholder="Write your carousel content here. Each paragraph can become a separate slide…"></textarea>
        </div>

        <button id="generate-custom" class="btn btn-primary btn-lg w-full">
          🚀 Generate Carousel
        </button>
      </div>
    </section>

    <!-- ────── Template showcase ────── -->
    <section class="mt-3xl">
      <div class="section-header">
        <h2>🎨 Template Showcase</h2>
        <p>Browse all available slide styles — more coming soon!</p>
      </div>
      <div id="template-showcase" class="template-grid" style="max-width:600px;">
        ${renderTemplatePickerGrid()}
      </div>
    </section>`;

  /* ── 2. Fetch recent articles for the mini grid ───────── */
  try {
    const articles = await fetchAllNews();
    const top6 = articles.slice(0, 6);
    const grid = document.getElementById('carousel-news-grid');

    if (grid) {
      grid.innerHTML = top6
        .map((a) => renderNewsCard(a, { compact: true }))
        .join('');

      // Click any card → open carousel modal
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;

        const articleId = card.dataset.id;
        const article = top6.find((a) => String(a.id) === String(articleId));
        if (article) openCarouselModal(article);
      });
    }
  } catch (err) {
    console.error('[Carousel] Could not load articles:', err);
    const grid = document.getElementById('carousel-news-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-icon">⚠️</div>
          <h3>Could not load articles</h3>
          <p>Try refreshing or use the custom content option below.</p>
        </div>`;
    }
  }

  /* ── 3. Custom content form handler ───────────────────── */
  const generateBtn = document.getElementById('generate-custom');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const title = document.getElementById('custom-title')?.value.trim();
      const category = document.getElementById('custom-category')?.value;
      const content = document.getElementById('custom-content')?.value.trim();

      if (!title || !content) {
        if (window.showToast) {
          window.showToast('Please enter a title and content.', 'error');
        }
        return;
      }

      // Build a synthetic article object for the carousel editor
      const customArticle = {
        id: `custom-${Date.now()}`,
        title,
        category,
        excerpt: content.slice(0, 200),
        content,
        source: 'Custom',
        date: new Date().toISOString(),
        url: '',
      };

      openCarouselModal(customArticle);
    });
  }
}
