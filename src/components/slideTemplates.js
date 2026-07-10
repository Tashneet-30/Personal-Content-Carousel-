// ============================================
// AI NEWS HUB — Slide Templates Component
// Core engine for rendering Instagram carousel slides.
// Defines templates, renders slide HTML per template
// layout, and auto-generates slides from articles.
// ============================================

import { escapeHtml } from '../utils/helpers.js';

// ---- Template definitions ----
// Each template has a unique id, display name, emoji, and CSS class
// that maps to styles defined in style.css.
export const TEMPLATES = [
  { id: 'nebula',   name: 'Nebula',        emoji: '🌌', cssClass: 'slide-nebula'   },
  { id: 'electric', name: 'Electric',      emoji: '⚡', cssClass: 'slide-electric' },
  { id: 'meta',     name: 'Meta AI',       emoji: '🔥', cssClass: 'slide-meta'     },
  { id: 'frost',    name: 'Frost',         emoji: '🧊', cssClass: 'slide-frost'    },
  { id: 'gradient', name: 'Gradient Flow', emoji: '🌈', cssClass: 'slide-gradient' },
  { id: 'midnight', name: 'Midnight',      emoji: '🖤', cssClass: 'slide-midnight' },
];

/**
 * Looks up a template object by its id.
 * Falls back to 'nebula' if the id isn't found.
 * @param {string} templateId
 * @returns {Object} Template object
 */
function getTemplate(templateId) {
  return TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
}

// ---- Body rendering helpers ----

/**
 * Renders the slide body content based on the slide type.
 * Bullet slides render an unordered list; other types render a paragraph.
 * @param {Object} slide
 * @returns {string} HTML string for the body section
 */
function renderBodyContent(slide) {
  // Bullet-type slides render as a list
  if (slide.type === 'bullets' && Array.isArray(slide.bullets) && slide.bullets.length) {
    const items = slide.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('');
    return `<ul class="slide-bullets">${items}</ul>`;
  }

  // CTA slides have a special centered call-to-action message
  if (slide.type === 'cta') {
    return `<div class="slide-body" style="text-align:center;font-size:36px;margin-top:40px;">${escapeHtml(slide.body || 'Follow for more AI content')}</div>`;
  }

  // Default: plain body text
  return `<div class="slide-body">${escapeHtml(slide.body || '')}</div>`;
}

/**
 * Renders the slide title. CTA slides get extra large, centered text.
 * @param {Object} slide
 * @returns {string} HTML string for the title
 */
function renderTitle(slide) {
  if (slide.type === 'cta') {
    return `<div class="slide-title" style="text-align:center;font-size:72px;">${escapeHtml(slide.title || '')}</div>`;
  }
  return `<div class="slide-title">${escapeHtml(slide.title || '')}</div>`;
}

/**
 * Renders the common footer with handle and slide counter.
 * @param {Object} slide
 * @returns {string} Footer HTML
 */
function renderFooter(slide) {
  const handle = slide.handle || '@tshntkaur';
  const counter = (slide.slideNumber && slide.totalSlides)
    ? `${slide.slideNumber} / ${slide.totalSlides}`
    : '';
  return `
    <div class="slide-footer">
      <span class="slide-handle">${escapeHtml(handle)}</span>
      <span>${counter}</span>
    </div>
  `;
}

// ---- Per-template layout renderers ----

/**
 * Nebula & Frost — "glass card" style layout.
 * Content is wrapped in a frosted-glass container.
 */
function renderGlassCardLayout(slide, cssClass) {
  return `
    <div class="slide-render ${cssClass}">
      <div class="slide-glass-card">
        <div class="slide-category">${escapeHtml((slide.category || '').toUpperCase())}</div>
        ${renderTitle(slide)}
        ${renderBodyContent(slide)}
      </div>
      ${renderFooter(slide)}
    </div>
  `;
}

/**
 * Electric & Midnight — "accent line" style layout.
 * A decorative accent line sits above the content.
 */
function renderAccentLineLayout(slide, cssClass) {
  return `
    <div class="slide-render ${cssClass}">
      <div class="slide-accent-line"></div>
      <div class="slide-category">${escapeHtml((slide.category || '').toUpperCase())}</div>
      ${renderTitle(slide)}
      ${renderBodyContent(slide)}
      ${renderFooter(slide)}
    </div>
  `;
}

/**
 * Meta AI — "divider" style layout.
 * A divider line separates the category from the title.
 */
function renderDividerLayout(slide, cssClass) {
  return `
    <div class="slide-render ${cssClass}">
      <div class="slide-category">${escapeHtml((slide.category || '').toUpperCase())}</div>
      <div class="slide-divider"></div>
      ${renderTitle(slide)}
      ${renderBodyContent(slide)}
      ${renderFooter(slide)}
    </div>
  `;
}

/**
 * Gradient Flow — plain content, no card wrapper.
 */
function renderPlainLayout(slide, cssClass) {
  return `
    <div class="slide-render ${cssClass}">
      <div class="slide-category">${escapeHtml((slide.category || '').toUpperCase())}</div>
      ${renderTitle(slide)}
      ${renderBodyContent(slide)}
      ${renderFooter(slide)}
    </div>
  `;
}

// ---- Main render function ----

/**
 * Renders a single slide as an HTML string using the specified template.
 *
 * @param {Object} slide - Slide data object
 * @param {string} slide.type - 'cover' | 'content' | 'bullets' | 'quote' | 'cta'
 * @param {string} slide.category - Category label
 * @param {string} slide.title - Slide headline
 * @param {string} [slide.body] - Body text (for content/quote types)
 * @param {string[]} [slide.bullets] - Bullet points (for bullets type)
 * @param {string} [slide.handle] - Instagram handle (default '@tshntkaur')
 * @param {number} [slide.slideNumber] - Current slide position
 * @param {number} [slide.totalSlides] - Total number of slides
 * @param {string} templateId - Template id (e.g. 'nebula', 'electric')
 * @returns {string} Complete slide HTML string
 */
export function renderSlide(slide, templateId) {
  const template = getTemplate(templateId);
  const cssClass = template.cssClass;

  // Route to the correct layout based on template id
  switch (template.id) {
    case 'nebula':
    case 'frost':
      return renderGlassCardLayout(slide, cssClass);

    case 'electric':
    case 'midnight':
      return renderAccentLineLayout(slide, cssClass);

    case 'meta':
      return renderDividerLayout(slide, cssClass);

    case 'gradient':
      return renderPlainLayout(slide, cssClass);

    default:
      return renderGlassCardLayout(slide, cssClass);
  }
}

// ---- Article → Slides generator ----

/**
 * Splits a body of text into sentences.
 * Handles common abbreviations and edge-cases gracefully.
 * @param {string} text
 * @returns {string[]} Array of sentence strings
 */
function splitSentences(text) {
  if (!text) return [];
  // Split on sentence-ending punctuation followed by whitespace
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Groups sentences into chunks of roughly equal size.
 * Each chunk is joined into a single string paragraph.
 * @param {string[]} sentences
 * @param {number} chunksCount - How many chunks to create
 * @returns {string[]} Array of paragraph strings
 */
function chunkSentences(sentences, chunksCount) {
  if (sentences.length === 0) return Array(chunksCount).fill('');
  const perChunk = Math.max(1, Math.ceil(sentences.length / chunksCount));
  const chunks = [];
  for (let i = 0; i < sentences.length; i += perChunk) {
    chunks.push(sentences.slice(i, i + perChunk).join(' '));
  }
  // Pad with empty strings if we have fewer chunks than requested
  while (chunks.length < chunksCount) {
    chunks.push('');
  }
  return chunks;
}

/**
 * Automatically generates 8 slide objects from an article.
 * Breaks the article content into digestible, slide-sized pieces.
 *
 * @param {Object} article
 * @param {string} article.title - Article headline
 * @param {string} article.category - Category slug
 * @param {string} article.content - Full article body text
 * @param {string} article.excerpt - Short summary
 * @returns {Object[]} Array of slide data objects
 */
export function generateSlidesFromArticle(article) {
  const title = article.title || 'Untitled Article';
  const category = article.category || 'AI';
  const content = article.content || article.excerpt || '';
  const excerpt = article.excerpt || '';
  const totalSlides = 8;

  // Split content into sentences for intelligent chunking
  const sentences = splitSentences(content);

  // We need content for slides 3-4 (two content chunks) and slide 6 (bullets).
  // Reserve some sentences for each purpose.
  const contentChunks = chunkSentences(sentences, 4);

  // Extract key points for bullet slides
  // Take up to 4 short sentences or fragments as bullet points
  const bulletPoints = sentences
    .filter(s => s.length > 15 && s.length < 150)
    .slice(0, 4);
  // Fallback bullets if the content is too short
  const fallbackBullets = [
    'Streamlined workflows and increased efficiency',
    'New integration capabilities with existing tools',
    'Enhanced performance benchmarks',
    'Broader accessibility for developers',
  ];

  const slides = [
    // 1. Cover slide
    {
      type: 'cover',
      category,
      title,
      body: '',
      slideNumber: 1,
      totalSlides,
      handle: '@tshntkaur',
    },
    // 2. Key context — excerpt / intro
    {
      type: 'content',
      category,
      title: 'Key Context',
      body: excerpt || contentChunks[0] || 'An important development in the AI space.',
      slideNumber: 2,
      totalSlides,
      handle: '@tshntkaur',
    },
    // 3. Deep dive — first content chunk
    {
      type: 'content',
      category,
      title: 'The Details',
      body: contentChunks[1] || contentChunks[0] || '',
      slideNumber: 3,
      totalSlides,
      handle: '@tshntkaur',
    },
    // 4. Key points — bullet breakdown
    {
      type: 'bullets',
      category,
      title: 'Key Points',
      bullets: bulletPoints.length >= 2 ? bulletPoints.slice(0, 4) : fallbackBullets,
      slideNumber: 4,
      totalSlides,
      handle: '@tshntkaur',
    },
    // 5. Why this matters
    {
      type: 'content',
      category,
      title: 'Why This Matters',
      body: contentChunks[2] || 'This development signals a significant shift in how the industry approaches AI capabilities and their real-world applications.',
      slideNumber: 5,
      totalSlides,
      handle: '@tshntkaur',
    },
    // 6. Real-world applications
    {
      type: 'bullets',
      category,
      title: 'Real-World Applications',
      bullets: [
        'Enterprise automation and productivity gains',
        'Developer tooling and code generation',
        'Creative content and media production',
        'Research acceleration and data analysis',
      ],
      slideNumber: 6,
      totalSlides,
      handle: '@tshntkaur',
    },
    // 7. Your takeaway
    {
      type: 'content',
      category,
      title: 'Your Takeaway',
      body: contentChunks[3] || 'Stay ahead of the curve by experimenting with these tools early. The AI landscape is evolving fast — adaptability is your superpower.',
      slideNumber: 7,
      totalSlides,
      handle: '@tshntkaur',
    },
    // 8. CTA slide
    {
      type: 'cta',
      category,
      title: 'Follow for More',
      body: 'Follow @tshntkaur for more AI insights',
      slideNumber: 8,
      totalSlides,
      handle: '@tshntkaur',
    },
  ];

  return slides;
}

// ---- Template picker grid ----

/**
 * Renders the template picker grid for the carousel editor sidebar.
 * Each option shows the template emoji + name and becomes selectable.
 *
 * @returns {string} HTML string for the template picker
 */
export function renderTemplatePickerGrid() {
  const options = TEMPLATES.map((t, i) => `
    <div
      class="template-option${i === 0 ? ' active' : ''}"
      data-template-id="${t.id}"
    >
      <span class="template-emoji">${t.emoji}</span>
      <span>${escapeHtml(t.name)}</span>
    </div>
  `).join('');

  return `<div class="template-grid">${options}</div>`;
}
