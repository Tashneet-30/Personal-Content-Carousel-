/**
 * hnService.js
 * ────────────
 * Fetches AI-related stories from the Hacker News Algolia API
 * and transforms them into the unified news article schema
 * used throughout the app.
 *
 * Algolia API docs: https://hn.algolia.com/api
 */

import { categorizeArticle } from './newsService.js';
import { generateId, truncate } from '../utils/helpers.js';

/* ── Constants ──────────────────────────────────────────── */

const HN_API_BASE = 'https://hn.algolia.com/api/v1';

/* ── Public API ─────────────────────────────────────────── */

/**
 * Fetch AI-related stories from Hacker News.
 *
 * @param   {string} query       Search query (default: 'artificial intelligence')
 * @param   {number} numStories  Number of stories to request (default: 10)
 * @returns {Promise<Array>}     Array of articles in the unified schema
 */
export async function fetchHNStories(
  query = 'artificial intelligence',
  numStories = 10,
) {
  try {
    const url = `${HN_API_BASE}/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${numStories}`;

    console.log('[hnService] Fetching HN stories:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from Hacker News API`);
    }

    const data = await response.json();

    if (!Array.isArray(data.hits)) {
      throw new Error('Unexpected response shape from HN API');
    }

    // Transform each HN hit to the unified article schema
    const articles = data.hits
      .filter((hit) => hit.title) // Skip items without titles
      .map((hit) => transformHNHit(hit));

    console.log(`[hnService] ✓ ${articles.length} stories fetched`);
    return articles;
  } catch (err) {
    console.error('[hnService] Failed to fetch HN stories:', err.message);
    return [];
  }
}

/* ── Internal Helpers ───────────────────────────────────── */

/**
 * Transform a single Algolia HN hit into the unified article schema.
 * @param   {object} hit  Algolia search hit
 * @returns {object}      Normalised article object
 */
function transformHNHit(hit) {
  const title = hit.title || 'Untitled';
  const storyText = hit.story_text || '';

  // Build a synthetic excerpt from available data
  const excerpt = storyText
    ? truncate(storyText, 200)
    : `Discussion on Hacker News with ${hit.num_comments ?? 0} comments and ${hit.points ?? 0} points.`;

  // Build longer content for carousel generation
  const content = buildContent(hit);

  // Parse the date (HN uses ISO 8601)
  const dateStr = hit.created_at
    ? new Date(hit.created_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return {
    id: `hn-${hit.objectID || generateId()}`,
    title,
    source: 'Hacker News',
    category: categorizeArticle(title, content),
    date: dateStr,
    excerpt,
    content,
    imageUrl: null, // HN doesn't provide thumbnails
    link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
  };
}

/**
 * Build full-ish article content from the HN hit metadata.
 * Since HN often only has a link + comments, we compose a
 * readable summary from available fields.
 */
function buildContent(hit) {
  const parts = [];

  if (hit.story_text) {
    parts.push(hit.story_text);
  }

  // Add metadata paragraph
  const meta = [];
  if (hit.points) meta.push(`${hit.points} points`);
  if (hit.num_comments) meta.push(`${hit.num_comments} comments`);
  if (hit.author) meta.push(`submitted by ${hit.author}`);

  if (meta.length > 0) {
    parts.push(`This story received ${meta.join(', ')} on Hacker News.`);
  }

  if (hit.url) {
    parts.push(`Original source: ${hit.url}`);
  }

  return parts.join('\n\n') || hit.title || '';
}
