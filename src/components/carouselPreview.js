// ============================================
// AI NEWS HUB — Carousel Preview Component
// Renders a scaled-down preview of a 1080×1350
// Instagram slide inside the editor's preview frame,
// and provides slide dot navigation indicators.
// ============================================

import { renderSlide } from './slideTemplates.js';

/**
 * Renders a single slide into the given preview container element.
 * The actual slide is rendered at full 1080×1350 resolution and then
 * CSS-scaled down to fit the preview frame (~360×450).
 *
 * @param {Object} slide - Slide data object
 * @param {string} templateId - Active template id
 * @param {HTMLElement} containerEl - The DOM element to render into
 */
export function renderSlidePreview(slide, templateId, containerEl) {
  if (!containerEl) return;

  // Get the container dimensions to compute the scale factor.
  // The preview frame is 360×450 (desktop) or 280×350 (mobile).
  const containerWidth = containerEl.clientWidth || 360;
  const containerHeight = containerEl.clientHeight || 450;

  // The actual slide is 1080×1350. Compute scale to fit.
  const scaleX = containerWidth / 1080;
  const scaleY = containerHeight / 1350;
  const scale = Math.min(scaleX, scaleY);

  // Generate the slide HTML at full resolution
  const slideHtml = renderSlide(slide, templateId);

  // Wrap in a scaling container
  containerEl.innerHTML = `
    <div style="
      width: 1080px;
      height: 1350px;
      transform: scale(${scale});
      transform-origin: top left;
      pointer-events: none;
    ">
      ${slideHtml}
    </div>
  `;
}

/**
 * Returns HTML for slide dot indicators below the preview.
 * The active slide's dot gets the .active class.
 *
 * @param {number} totalSlides - Total number of slides
 * @param {number} activeIndex - Zero-based index of the active slide
 * @returns {string} HTML string for the dots container
 */
export function renderSlideDots(totalSlides, activeIndex) {
  const dots = Array.from({ length: totalSlides }, (_, i) => {
    const activeClass = i === activeIndex ? ' active' : '';
    return `<span class="slide-dot${activeClass}" data-slide-index="${i}"></span>`;
  }).join('');

  return `<div class="slide-dots">${dots}</div>`;
}
