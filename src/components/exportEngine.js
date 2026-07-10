// ============================================
// AI NEWS HUB — Export Engine
// Captures carousel slides as PNGs using html2canvas,
// bundles multiple slides into a ZIP via JSZip,
// and triggers browser downloads.
// ============================================

import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { renderSlide } from './slideTemplates.js';
import { showToast } from '../utils/helpers.js';

/**
 * Renders a slide into the hidden export container and captures it
 * as a PNG canvas using html2canvas.
 *
 * @param {Object} slide - Slide data object
 * @param {string} templateId - Template id for rendering
 * @returns {Promise<HTMLCanvasElement>} Captured canvas element
 */
async function captureSlideAsCanvas(slide, templateId) {
  const exportContainer = document.getElementById('export-container');
  if (!exportContainer) {
    throw new Error('Export container (#export-container) not found in the DOM.');
  }

  // Render the full-size slide (1080×1350) into the hidden container
  const slideHtml = renderSlide(slide, templateId);
  exportContainer.innerHTML = `
    <div style="width:1080px;height:1350px;position:relative;">
      ${slideHtml}
    </div>
  `;

  // The element to capture is the inner wrapper
  const target = exportContainer.firstElementChild;

  // html2canvas needs the element in the DOM and visible (though off-screen is OK)
  const canvas = await html2canvas(target, {
    width: 1080,
    height: 1350,
    scale: 1,                // 1:1 pixel ratio for sharp 1080×1350 output
    useCORS: true,
    backgroundColor: null,   // Preserve slide's own background
    logging: false,
  });

  // Clean up the container after capture
  exportContainer.innerHTML = '';

  return canvas;
}

/**
 * Converts an HTMLCanvasElement to a Blob (PNG).
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

/**
 * Triggers a browser download for the given Blob.
 * @param {Blob} blob - File data
 * @param {string} filename - Download filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Clean up after a brief delay so the download starts
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 200);
}

/**
 * Exports a single slide as a PNG download.
 *
 * @param {Object} slide - Slide data object
 * @param {string} templateId - Template id
 * @param {number} slideNumber - Slide number (used in the filename)
 */
export async function exportSingleSlide(slide, templateId, slideNumber) {
  try {
    showToast('Exporting slide…', 'info');

    const canvas = await captureSlideAsCanvas(slide, templateId);
    const blob = await canvasToBlob(canvas);
    downloadBlob(blob, `slide-${slideNumber}.png`);

    showToast('Slide exported successfully!', 'success');
  } catch (err) {
    console.error('Export failed:', err);
    showToast('Export failed — see console for details.', 'error');
  }
}

/**
 * Exports all slides as PNG images.
 *  - Single slide → direct PNG download
 *  - Multiple slides → bundled into a ZIP archive
 *
 * Shows progress via toast notifications.
 *
 * @param {Object[]} slides - Array of slide data objects
 * @param {string} templateId - Template id for rendering
 */
export async function exportAllSlides(slides, templateId) {
  if (!slides || slides.length === 0) {
    showToast('No slides to export.', 'error');
    return;
  }

  // Single slide — just download the PNG directly
  if (slides.length === 1) {
    await exportSingleSlide(slides[0], templateId, 1);
    return;
  }

  // Multiple slides — bundle into a ZIP
  try {
    showToast(`Exporting ${slides.length} slides…`, 'info');

    const zip = new JSZip();
    const imgFolder = zip.folder('carousel-slides');

    for (let i = 0; i < slides.length; i++) {
      // Progress toast every 3 slides to avoid spam
      if (i > 0 && i % 3 === 0) {
        showToast(`Processing slide ${i + 1} of ${slides.length}…`, 'info');
      }

      const canvas = await captureSlideAsCanvas(slides[i], templateId);
      const blob = await canvasToBlob(canvas);
      const filename = `slide-${String(i + 1).padStart(2, '0')}.png`;
      imgFolder.file(filename, blob);
    }

    // Generate the ZIP and trigger download
    showToast('Zipping files…', 'info');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'carousel-slides.zip');

    showToast(`All ${slides.length} slides exported! 🎉`, 'success');
  } catch (err) {
    console.error('Batch export failed:', err);
    showToast('Export failed — see console for details.', 'error');
  }
}
