// ============================================
// AI NEWS HUB — Carousel Editor Component
// Full-featured slide editor with:
//   - Sidebar thumbnails for slide navigation
//   - Center preview frame with prev/next controls
//   - Right panel: advanced presets, font pairing, alignments,
//     background gradients, textures, progress bars, and hex accent pickers
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

// ---- Advanced editor custom settings ----
let editorSettings = {
  fontPair: 'modern',
  bgType: 'gradient',
  bgValue: 'linear-gradient(160deg, #0f0a2e 0%, #1a0a3e 30%, #0d1b3e 60%, #0a0a1a 100%)',
  pattern: 'glow',
  alignment: 'left',
  progressStyle: 'bar',
  accentColor: '#a78bfa',
  showBranding: true
};

// ---- Accent color presets ----
const ACCENT_COLORS = [
  '#cc5a01', // terracotta (default)
  '#385d8a', // blue
  '#1d7e8a', // cyan
  '#1e704e', // emerald
  '#b45309', // amber
  '#be123c', // rose
  '#a78bfa', // neon violet
  '#d4af37', // gold
];

/**
 * Renders a single sidebar thumbnail for a slide.
 */
function renderThumb(slide, index) {
  const isActive = index === currentSlideIndex ? ' active' : '';
  const label = slide.type === 'cta' ? 'CTA' : (slide.title || `Slide ${index + 1}`);
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
  const colorsHtml = ACCENT_COLORS.map((c) => `
    <span
      class="color-swatch${editorSettings.accentColor === c ? ' active' : ''}"
      data-color="${c}"
      style="background:${c};"
    ></span>
  `).join('');

  // Font Pair options
  const fontPairOptions = [
    { value: 'editorial', label: 'Editorial (Lora + Inter)' },
    { value: 'modern', label: 'Modern (Outfit + Inter)' },
    { value: 'sans', label: 'Minimal Sans (Inter)' },
    { value: 'serif', label: 'Classic Serif (Lora)' },
  ].map(opt => `<option value="${opt.value}" ${editorSettings.fontPair === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('');

  // Alignment options
  const alignOptions = [
    { value: 'left', label: 'Left Aligned' },
    { value: 'center', label: 'Centered' },
    { value: 'right', label: 'Right Aligned' },
  ].map(opt => `<option value="${opt.value}" ${editorSettings.alignment === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('');

  // Pattern options
  const patternOptions = [
    { value: 'none', label: 'None' },
    { value: 'grid', label: 'Grid Overlay' },
    { value: 'dots', label: 'Dots Pattern' },
    { value: 'glow', label: 'Atmospheric Glow' },
  ].map(opt => `<option value="${opt.value}" ${editorSettings.pattern === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('');

  // Progress Bar options
  const progressOptions = [
    { value: 'none', label: 'None' },
    { value: 'bar', label: 'Top Progress Bar' },
    { value: 'dots', label: 'Bottom Progress Dots' },
    { value: 'number', label: 'Page Numbers' },
  ].map(opt => `<option value="${opt.value}" ${editorSettings.progressStyle === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('');

  // Background presets
  const bgPresets = [
    { label: 'Beige (Claude)', value: '#fbfaf7' },
    { label: 'Dark Space', value: '#050510' },
    { label: 'White minimal', value: '#fafafa' },
    { label: 'Royal Gradient', value: 'linear-gradient(160deg, #0f0a2e 0%, #1a0a3e 30%, #0d1b3e 60%, #0a0a1a 100%)' },
    { label: 'Sunset Glow', value: 'linear-gradient(135deg, #cc5a01 0%, #b45309 100%)' },
    { label: 'Ocean Breeze', value: 'linear-gradient(135deg, #385d8a 0%, #1d7e8a 100%)' },
  ];
  
  const isPreset = bgPresets.some(preset => preset.value === editorSettings.bgValue);
  const bgPresetsHtml = bgPresets.map(p => `
    <option value="${p.value}" ${editorSettings.bgValue === p.value ? 'selected' : ''}>${p.label}</option>
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
      <div class="editor-controls" style="max-height: calc(100vh - 220px); overflow-y: auto; padding-right: 8px;">
        <!-- Preset Templates -->
        <div class="control-group">
          <label>Visual Presets</label>
          <div id="template-picker">${templatePickerHtml}</div>
        </div>

        <!-- Typography Settings -->
        <div class="control-group">
          <label for="set-font">Typography Style</label>
          <select id="set-font" class="form-select" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">${fontPairOptions}</select>
        </div>

        <!-- Alignment -->
        <div class="control-group">
          <label for="set-align">Text Alignment</label>
          <select id="set-align" class="form-select" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">${alignOptions}</select>
        </div>

        <!-- Background Settings -->
        <div class="control-group">
          <label for="set-bg-preset">Background Color / Preset</label>
          <select id="set-bg-preset" class="form-select" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
            ${bgPresetsHtml}
            <option value="custom" ${!isPreset ? 'selected' : ''}>Custom CSS Gradient/Solid</option>
          </select>
        </div>

        <div class="control-group" id="custom-bg-wrapper" style="display: ${!isPreset ? 'block' : 'none'};">
          <label for="set-bg-custom">Custom CSS Background</label>
          <input type="text" id="set-bg-custom" class="form-input" value="${escapeHtml(editorSettings.bgValue)}" placeholder="e.g. #ffffff or linear-gradient(135deg, ...)" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px solid var(--border-color);" />
        </div>

        <!-- Pattern Overlays -->
        <div class="control-group">
          <label for="set-pattern">Texture & Pattern Overlay</label>
          <select id="set-pattern" class="form-select" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">${patternOptions}</select>
        </div>

        <!-- Progress Style -->
        <div class="control-group">
          <label for="set-progress">Progress Style</label>
          <select id="set-progress" class="form-select" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">${progressOptions}</select>
        </div>

        <!-- Slide Text Editing -->
        <div class="control-group">
          <label for="edit-title">Active Slide Title</label>
          <textarea id="edit-title" rows="2" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">${escapeHtml(activeSlide.title || '')}</textarea>
        </div>
        <div class="control-group">
          <label for="edit-body">Active Slide Body (or Bullet Points)</label>
          <textarea id="edit-body" rows="5" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px solid var(--border-color);" placeholder="Type one bullet point per line if this is a bullet slide.">${escapeHtml(activeSlide.body || (activeSlide.bullets || []).join('\n'))}</textarea>
        </div>

        <!-- Branding Header/Footer -->
        <div class="control-group" style="display: flex; align-items: center; gap: var(--space-xs); margin-top: var(--space-md); margin-bottom: var(--space-md);">
          <input type="checkbox" id="set-branding" ${editorSettings.showBranding ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;" />
          <label for="set-branding" style="margin:0;cursor:pointer;font-weight:500;">Show Branding (Header & Footer)</label>
        </div>

        <!-- Accent Color and Swatch Picker -->
        <div class="control-group">
          <label>Brand Accent Color</label>
          <div style="display: flex; gap: var(--space-sm); align-items: center;">
            <div class="color-options" id="color-picker" style="flex:1;display:flex;flex-wrap:wrap;gap:6px;">${colorsHtml}</div>
            <input type="color" id="custom-accent-picker" value="${editorSettings.accentColor}" style="width:40px;height:40px;border-radius:var(--radius-sm);border:1px solid var(--border-color);padding:2px;cursor:pointer;" />
          </div>
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
    renderSlidePreview(slide, currentTemplate, frame, editorSettings);
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
 * Syncs the right sidebar selector values to match the current editorSettings object.
 */
function refreshAllControls() {
  updateTemplatePicker();
  
  const fontEl = document.getElementById('set-font');
  const alignEl = document.getElementById('set-align');
  const bgPresetEl = document.getElementById('set-bg-preset');
  const bgCustomEl = document.getElementById('set-bg-custom');
  const customBgWrapper = document.getElementById('custom-bg-wrapper');
  const patternEl = document.getElementById('set-pattern');
  const progressEl = document.getElementById('set-progress');
  const brandingEl = document.getElementById('set-branding');
  const customColorEl = document.getElementById('custom-accent-picker');

  if (fontEl) fontEl.value = editorSettings.fontPair;
  if (alignEl) alignEl.value = editorSettings.alignment;
  if (patternEl) patternEl.value = editorSettings.pattern;
  if (progressEl) progressEl.value = editorSettings.progressStyle;
  if (brandingEl) brandingEl.checked = editorSettings.showBranding;
  if (customColorEl) customColorEl.value = editorSettings.accentColor;

  if (bgPresetEl) {
    const hasPreset = Array.from(bgPresetEl.options).some(opt => opt.value === editorSettings.bgValue);
    if (hasPreset) {
      bgPresetEl.value = editorSettings.bgValue;
      if (customBgWrapper) customBgWrapper.style.display = 'none';
    } else {
      bgPresetEl.value = 'custom';
      if (customBgWrapper) customBgWrapper.style.display = 'block';
    }
  }
  if (bgCustomEl) bgCustomEl.value = editorSettings.bgValue;

  // Re-highlight active accent swatch if any matches
  const colorPicker = document.getElementById('color-picker');
  if (colorPicker) {
    colorPicker.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.classList.toggle('active', swatch.dataset.color === editorSettings.accentColor);
    });
  }

  refreshAll();
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
 */
export function initCarouselEditor(article) {
  // 1. Generate initial slides from the article content
  currentSlides = generateSlidesFromArticle(article);
  currentSlideIndex = 0;
  
  // Set default initial template settings
  currentTemplate = 'nebula';
  const template = TEMPLATES.find(t => t.id === currentTemplate);
  if (template) {
    editorSettings = { ...editorSettings, ...template.settings };
  }

  // 2. Render the editor HTML into the modal root
  const root = document.getElementById('carousel-editor-root');
  if (!root) {
    console.error('Carousel editor root (#carousel-editor-root) not found.');
    return;
  }
  root.innerHTML = renderCarouselEditor(article, currentTemplate);

  // 3. Initial preview render
  updatePreview();

  // ---- Event listeners ----

  // -- Preset Template switching --
  const templatePicker = document.getElementById('template-picker');
  if (templatePicker) {
    templatePicker.addEventListener('click', (e) => {
      const option = e.target.closest('.template-option');
      if (!option) return;
      currentTemplate = option.dataset.templateId;
      
      const matched = TEMPLATES.find(t => t.id === currentTemplate);
      if (matched) {
        editorSettings = {
          ...editorSettings,
          ...matched.settings
        };
      }
      refreshAllControls();
    });
  }

  // -- Typography Pairing --
  const selectFont = document.getElementById('set-font');
  if (selectFont) {
    selectFont.addEventListener('change', (e) => {
      editorSettings.fontPair = e.target.value;
      updatePreview();
    });
  }

  // -- Text Alignment --
  const selectAlign = document.getElementById('set-align');
  if (selectAlign) {
    selectAlign.addEventListener('change', (e) => {
      editorSettings.alignment = e.target.value;
      updatePreview();
    });
  }

  // -- Background Preset / Custom Toggle --
  const selectBgPreset = document.getElementById('set-bg-preset');
  const customBgWrapper = document.getElementById('custom-bg-wrapper');
  const inputBgCustom = document.getElementById('set-bg-custom');

  if (selectBgPreset) {
    selectBgPreset.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'custom') {
        if (customBgWrapper) customBgWrapper.style.display = 'block';
      } else {
        if (customBgWrapper) customBgWrapper.style.display = 'none';
        editorSettings.bgValue = val;
        editorSettings.bgType = val.includes('gradient') ? 'gradient' : 'solid';
        if (inputBgCustom) inputBgCustom.value = val;
        updatePreview();
      }
    });
  }

  if (inputBgCustom) {
    inputBgCustom.addEventListener('input', (e) => {
      editorSettings.bgValue = e.target.value;
      editorSettings.bgType = e.target.value.includes('gradient') ? 'gradient' : 'solid';
      updatePreview();
    });
  }

  // -- Texture Patterns --
  const selectPattern = document.getElementById('set-pattern');
  if (selectPattern) {
    selectPattern.addEventListener('change', (e) => {
      editorSettings.pattern = e.target.value;
      updatePreview();
    });
  }

  // -- Progress Bar Style --
  const selectProgress = document.getElementById('set-progress');
  if (selectProgress) {
    selectProgress.addEventListener('change', (e) => {
      editorSettings.progressStyle = e.target.value;
      updatePreview();
    });
  }

  // -- Branding Toggle --
  const checkBranding = document.getElementById('set-branding');
  if (checkBranding) {
    checkBranding.addEventListener('change', (e) => {
      editorSettings.showBranding = e.target.checked;
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

  // -- Slide dots navigation --
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

      currentSlides.forEach((s, i) => {
        s.slideNumber = i + 1;
        s.totalSlides = currentSlides.length;
      });

      if (currentSlideIndex >= currentSlides.length) {
        currentSlideIndex = currentSlides.length - 1;
      }

      refreshAll();
      showToast('Slide deleted', 'info');
    });
  }

  // -- Color accent swatches --
  const colorPicker = document.getElementById('color-picker');
  const customAccentPicker = document.getElementById('custom-accent-picker');

  if (colorPicker) {
    colorPicker.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;

      colorPicker.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const col = swatch.dataset.color;
      editorSettings.accentColor = col;
      if (customAccentPicker) customAccentPicker.value = col;
      
      // Update accent color for this specific slide (allows multi-color decks!)
      const slide = currentSlides[currentSlideIndex];
      if (slide) {
        slide.accentColor = col;
      }
      updatePreview();
    });
  }

  if (customAccentPicker) {
    customAccentPicker.addEventListener('input', (e) => {
      const col = e.target.value;
      editorSettings.accentColor = col;
      
      // De-highlight swatches since we picked custom
      if (colorPicker) {
        colorPicker.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      }
      
      const slide = currentSlides[currentSlideIndex];
      if (slide) {
        slide.accentColor = col;
      }
      updatePreview();
    });
  }

  // -- Export all slides --
  const btnExport = document.getElementById('btn-export-all');
  if (btnExport) {
    btnExport.addEventListener('click', async () => {
      await exportAllSlides(currentSlides, currentTemplate, editorSettings);
    });
  }

  // -- Save draft --
  const btnSave = document.getElementById('btn-save-draft');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      try {
        const draft = {
          template: currentTemplate,
          settings: editorSettings,
          slides: currentSlides,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('carousel-craft-draft', JSON.stringify(draft));
        showToast('Draft saved locally!', 'success');
      } catch (err) {
        console.error('Save draft failed:', err);
        showToast('Failed to save draft.', 'error');
      }
    });
  }
}
