// ============================================
// AI NEWS HUB — Carousel Editor Component
// Full-featured slide editor with:
//   - Sidebar thumbnails for slide navigation
//   - Center preview frame with prev/next controls
//   - Right panel: template picker, text editing, colors
//   - Bottom bar: export & save actions
// ============================================

import {
  TEMPLATES,
  renderSlide,
  generateSlidesFromArticle,
  renderTemplatePickerGrid,
} from './slideTemplates.js';
import { renderSlidePreview, renderSlideDots } from './carouselPreview.js';
import { exportAllSlides } from './exportEngine.js';
import { escapeHtml, showToast } from '../utils/helpers.js';

// ---- Internal editor state ----
let currentSlides = [];
let currentSlideIndex = 0;
let currentTemplate = 'nebula';

// ---- Accent color options ----
const ACCENT_COLORS = [
  '#8b5cf6', // violet (default)
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#6366f1', // indigo
  '#d4af37', // gold
];

/**
 * Renders a single sidebar thumbnail for a slide.
 * @param {Object} slide - Slide data
 * @param {number} index - Slide index (zero-based)
 * @returns {string} HTML for the thumbnail
 */
function renderThumb(slide, index) {
  const isActive = index === currentSlideIndex ? ' active' : '';
  const label = slide.type === 'cta' ? 'CTA' : (slide.title || `Slide ${index + 1}`);
  // Truncate label for thumb display
  const shortLabel = label.length > 18 ? label.slice(0, 16) + '…' : label;

  return `
    <div class="slide-thumb${isActive}" data-slide-index="${index}">
      <span class="thumb-number">${index + 1}</span>
      <span style="font-size:10px;padding:0 6px;text-align:center;word-break:break-word;">
        ${escapeHtml(shortLabel)}
      </span>
    </div>
  `;
}

/**
 * Renders the full carousel editor HTML layout.
 *
 * @param {Object} article - The source article object
 * @param {string} templateId - Initial template id (default 'nebula')
 * @returns {string} Complete editor HTML
 */
export function renderCarouselEditor(article, templateId = 'nebula') {
  currentTemplate = templateId;

  // Build sidebar thumbnails
  const thumbsHtml = currentSlides
    .map((slide, i) => renderThumb(slide, i))
    .join('');

  // Current slide data for the text editor
  const activeSlide = currentSlides[currentSlideIndex] || {};

  // Slide dots
  const dotsHtml = renderSlideDots(currentSlides.length, currentSlideIndex);

  // Template picker grid
  const templatePickerHtml = renderTemplatePickerGrid();

  // Color swatches
  const colorsHtml = ACCENT_COLORS.map((c, i) => `
    <span
      class="color-swatch${i === 0 ? ' active' : ''}"
      data-color="${c}"
      style="background:${c};"
    ></span>
  `).join('');

  return `
    <div class="carousel-editor">
      <!-- === Left sidebar: thumbnails === -->
      <div class="editor-sidebar">
        <h3>Slides</h3>
        <div id="slide-thumbs" class="flex flex-col gap-sm">
          ${thumbsHtml}
        </div>
        <div class="flex gap-sm mt-md">
          <button class="btn btn-sm btn-secondary w-full" id="btn-add-slide">+ Add Slide</button>
          <button class="btn btn-sm btn-ghost w-full" id="btn-delete-slide">🗑 Delete</button>
        </div>
      </div>

      <!-- === Center: preview === -->
      <div class="editor-preview">
        <div>
          <div class="preview-frame" id="preview-frame"></div>
          <div class="slide-nav">
            <button class="slide-nav-btn" id="btn-prev-slide">◀</button>
            <div id="slide-dots-container">${dotsHtml}</div>
            <button class="slide-nav-btn" id="btn-next-slide">▶</button>
          </div>
        </div>
      </div>

      <!-- === Right panel: controls === -->
      <div class="editor-controls">
        <!-- Template picker -->
        <div class="control-group">
          <label>Template</label>
          <div id="template-picker">${templatePickerHtml}</div>
        </div>

        <!-- Slide text editors -->
        <div class="control-group">
          <label>Slide Title</label>
          <textarea id="edit-title" rows="2">${escapeHtml(activeSlide.title || '')}</textarea>
        </div>
        <div class="control-group">
          <label>Slide Body</label>
          <textarea id="edit-body" rows="5">${escapeHtml(activeSlide.body || (activeSlide.bullets || []).join('\n'))}</textarea>
        </div>

        <!-- Color accent -->
        <div class="control-group">
          <label>Accent Color</label>
          <div class="color-options" id="color-picker">${colorsHtml}</div>
        </div>
      </div>
    </div>

    <!-- === Bottom action bar === -->
    <div class="editor-actions-bar">
      <button class="btn btn-secondary" id="btn-save-draft">💾 Save Draft</button>
      <button class="btn btn-primary" id="btn-export-all">📦 Export All Slides</button>
    </div>
  `;
}

// ---- Internal UI update helpers ----

/**
 * Re-renders the preview frame with the current slide and template.
 */
function updatePreview() {
  const frame = document.getElementById('preview-frame');
  const slide = currentSlides[currentSlideIndex];
  if (frame && slide) {
    renderSlidePreview(slide, currentTemplate, frame);
  }
}

/**
 * Re-renders the sidebar thumbnails and marks the active one.
 */
function updateThumbs() {
  const container = document.getElementById('slide-thumbs');
  if (!container) return;
  container.innerHTML = currentSlides
    .map((slide, i) => renderThumb(slide, i))
    .join('');
}

/**
 * Re-renders the slide dots to reflect the current active index.
 */
function updateDots() {
  const container = document.getElementById('slide-dots-container');
  if (!container) return;
  container.innerHTML = renderSlideDots(currentSlides.length, currentSlideIndex);
}

/**
 * Updates the right-panel text editors with the current slide's data.
 */
function updateEditorFields() {
  const slide = currentSlides[currentSlideIndex];
  if (!slide) return;

  const titleEl = document.getElementById('edit-title');
  const bodyEl = document.getElementById('edit-body');

  if (titleEl) titleEl.value = slide.title || '';
  if (bodyEl) {
    // For bullet slides, show bullets as newline-separated text
    if (slide.type === 'bullets' && Array.isArray(slide.bullets)) {
      bodyEl.value = slide.bullets.join('\n');
    } else {
      bodyEl.value = slide.body || '';
    }
  }
}

/**
 * Refreshes all UI panels after any state change.
 */
function refreshAll() {
  updateThumbs();
  updateDots();
  updatePreview();
  updateEditorFields();
}

/**
 * Updates the active template highlight in the picker grid.
 */
function updateTemplatePicker() {
  const picker = document.getElementById('template-picker');
  if (!picker) return;
  picker.querySelectorAll('.template-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.templateId === currentTemplate);
  });
}

// ---- Main initializer ----

/**
 * Initializes the carousel editor for a given article.
 * Generates slides, renders the editor, and wires up all event listeners.
 *
 * @param {Object} article - Article data used to generate initial slides
 */
export function initCarouselEditor(article) {
  // 1. Generate initial slides from the article content
  currentSlides = generateSlidesFromArticle(article);
  currentSlideIndex = 0;
  currentTemplate = 'nebula';

  // 2. Render the editor HTML into the modal root
  const root = document.getElementById('carousel-editor-root');
  if (!root) {
    console.error('Carousel editor root (#carousel-editor-root) not found.');
    return;
  }
  root.innerHTML = renderCarouselEditor(article, currentTemplate);

  // 3. Initial preview render
  updatePreview();

  // ---- Event listeners (delegated where possible) ----

  // -- Template switching --
  const templatePicker = document.getElementById('template-picker');
  if (templatePicker) {
    templatePicker.addEventListener('click', (e) => {
      const option = e.target.closest('.template-option');
      if (!option) return;
      currentTemplate = option.dataset.templateId;
      updateTemplatePicker();
      updatePreview();
    });
  }

  // -- Sidebar thumbnail clicks --
  const thumbsContainer = document.getElementById('slide-thumbs');
  if (thumbsContainer) {
    thumbsContainer.addEventListener('click', (e) => {
      const thumb = e.target.closest('.slide-thumb');
      if (!thumb) return;
      currentSlideIndex = parseInt(thumb.dataset.slideIndex, 10);
      refreshAll();
    });
  }

  // -- Prev / Next navigation --
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        refreshAll();
      }
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentSlideIndex < currentSlides.length - 1) {
        currentSlideIndex++;
        refreshAll();
      }
    });
  }

  // -- Slide dots navigation (delegated) --
  const dotsContainer = document.getElementById('slide-dots-container');
  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.slide-dot');
      if (!dot) return;
      currentSlideIndex = parseInt(dot.dataset.slideIndex, 10);
      refreshAll();
    });
  }

  // -- Text editing: title --
  const editTitle = document.getElementById('edit-title');
  if (editTitle) {
    editTitle.addEventListener('input', (e) => {
      const slide = currentSlides[currentSlideIndex];
      if (slide) {
        slide.title = e.target.value;
        updatePreview();
        updateThumbs();
      }
    });
  }

  // -- Text editing: body --
  const editBody = document.getElementById('edit-body');
  if (editBody) {
    editBody.addEventListener('input', (e) => {
      const slide = currentSlides[currentSlideIndex];
      if (!slide) return;

      if (slide.type === 'bullets') {
        // Parse newline-separated text into bullet array
        slide.bullets = e.target.value.split('\n').filter(line => line.trim());
      } else {
        slide.body = e.target.value;
      }
      updatePreview();
    });
  }

  // -- Add slide --
  const btnAdd = document.getElementById('btn-add-slide');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      const newSlide = {
        type: 'content',
        category: currentSlides[0]?.category || 'AI',
        title: 'New Slide',
        body: 'Add your content here…',
        slideNumber: currentSlides.length + 1,
        totalSlides: currentSlides.length + 1,
        handle: '@tshntkaur',
      };
      currentSlides.push(newSlide);

      // Update totalSlides on all existing slides
      currentSlides.forEach((s, i) => {
        s.slideNumber = i + 1;
        s.totalSlides = currentSlides.length;
      });

      currentSlideIndex = currentSlides.length - 1;
      refreshAll();
      showToast('Slide added', 'success');
    });
  }

  // -- Delete slide --
  const btnDelete = document.getElementById('btn-delete-slide');
  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      if (currentSlides.length <= 1) {
        showToast('Cannot delete the last slide.', 'error');
        return;
      }
      currentSlides.splice(currentSlideIndex, 1);

      // Re-index slide numbers
      currentSlides.forEach((s, i) => {
        s.slideNumber = i + 1;
        s.totalSlides = currentSlides.length;
      });

      // Adjust index if it's now out of range
      if (currentSlideIndex >= currentSlides.length) {
        currentSlideIndex = currentSlides.length - 1;
      }

      refreshAll();
      showToast('Slide deleted', 'info');
    });
  }

  // -- Color accent picker --
  const colorPicker = document.getElementById('color-picker');
  if (colorPicker) {
    colorPicker.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;

      // Toggle active state
      colorPicker.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      // NOTE: Accent color customization would require injecting dynamic
      // CSS variables into the slide. For now we store it on the slide data.
      const slide = currentSlides[currentSlideIndex];
      if (slide) {
        slide.accentColor = swatch.dataset.color;
      }
      showToast(`Accent color updated`, 'info');
    });
  }

  // -- Export all slides --
  const btnExport = document.getElementById('btn-export-all');
  if (btnExport) {
    btnExport.addEventListener('click', async () => {
      await exportAllSlides(currentSlides, currentTemplate);
    });
  }

  // -- Save draft --
  const btnSave = document.getElementById('btn-save-draft');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      try {
        const draft = {
          template: currentTemplate,
          slides: currentSlides,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('carousel-draft', JSON.stringify(draft));
        showToast('Draft saved locally!', 'success');
      } catch (err) {
        console.error('Save draft failed:', err);
        showToast('Failed to save draft.', 'error');
      }
    });
  }
}
