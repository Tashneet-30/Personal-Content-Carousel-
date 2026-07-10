/**
 * newsService.js
 * ──────────────
 * Fetches AI news from RSS feeds via the rss2json proxy,
 * auto-categorises articles, merges with cache, and exposes
 * search / filter helpers.
 *
 * Falls back to SAMPLE_NEWS when all feeds fail.
 */

import { FEED_SOURCES } from '../data/feedSources.js';
import { SAMPLE_NEWS } from '../data/sampleNews.js';
import cacheService from './cacheService.js';
import { generateId, stripHtml, truncate } from '../utils/helpers.js';

/* ── Constants ──────────────────────────────────────────── */

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';
const CACHE_KEY = 'news_feed';
const CACHE_TTL = 30; // minutes

/* ── Keyword-Based Auto-Categoriser ─────────────────────── */

/**
 * Categorise an article by scanning its title & content for
 * domain-specific keywords.
 *
 * @param   {string} title   Article title
 * @param   {string} content Article body / excerpt
 * @returns {string}         Category id (e.g. 'agents', 'llms')
 */
export function categorizeArticle(title = '', content = '') {
  const text = `${title} ${content}`.toLowerCase();

  // Keyword → category mapping, ordered from most specific to broadest
  const rules = [
    {
      category: 'agents',
      keywords: [
        'ai agent', 'ai agents', 'autonomous agent', 'multi-agent',
        'crewai', 'langgraph', 'autogen', 'agentic', 'tool use',
        'function calling', 'agent framework', 'orchestration',
      ],
    },
    {
      category: 'llms',
      keywords: [
        'llm', 'large language model', 'gpt-5', 'gpt-4', 'gpt',
        'claude', 'gemini', 'llama', 'mistral', 'openai', 'anthropic',
        'chatbot', 'chat model', 'transformer model', 'fine-tun',
        'prompt engineer', 'tokens', 'context window', 'rlhf',
      ],
    },
    {
      category: 'vision',
      keywords: [
        'computer vision', 'image recognition', 'object detection',
        'segmentation', 'sam ', 'diffusion model', 'stable diffusion',
        'midjourney', 'dall-e', 'image generation', 'video generation',
        'visual', 'opencv', 'yolo', 'multimodal vision',
      ],
    },
    {
      category: 'research',
      keywords: [
        'research paper', 'arxiv', 'benchmark', 'state-of-the-art',
        'novel approach', 'alphafold', 'deepmind', 'breakthrough',
        'peer-review', 'conference paper', 'icml', 'neurips', 'iclr',
        'aaai', 'cvpr', 'scientific', 'laboratory',
      ],
    },
    {
      category: 'startups',
      keywords: [
        'startup', 'funding', 'series a', 'series b', 'series c',
        'valuation', 'venture capital', 'vc', 'raise', 'seed round',
        'y combinator', 'accelerator', 'unicorn',
      ],
    },
    {
      category: 'tools',
      keywords: [
        'tool', 'app', 'platform', 'sdk', 'api', 'library',
        'framework', 'open source', 'launch', 'release', 'update',
        'developer tool', 'devtool', 'ide', 'cursor', 'copilot',
        'hugging face',
      ],
    },
    {
      category: 'learning',
      keywords: [
        'tutorial', 'explainer', 'beginner', 'how to', 'guide',
        'learn', 'course', 'explained', 'introduction', 'basics',
        'step by step', 'what is', 'what are', 'deep dive',
      ],
    },
    {
      category: 'industry',
      keywords: [
        'healthcare', 'finance', 'transport', 'enterprise', 'regulation',
        'policy', 'eu ai act', 'fda', 'government', 'ethics',
        'bias', 'safety', 'alignment', 'compliance', 'gdpr',
        'manufacturing', 'retail', 'digital twin',
      ],
    },
  ];

  // Return the first matching category
  for (const rule of rules) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.category;
    }
  }

  // Default fallback
  return 'news';
}

/* ── Single Feed Fetcher ────────────────────────────────── */

/**
 * Fetch and normalise articles from a single RSS feed.
 * @param   {object} source  Feed source from FEED_SOURCES
 * @returns {Array}          Normalised article objects
 */
async function fetchSingleFeed(source) {
  const url = `${RSS2JSON_BASE}?rss_url=${encodeURIComponent(source.url)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${source.name}`);
  }

  const data = await response.json();

  if (data.status !== 'ok' || !Array.isArray(data.items)) {
    throw new Error(`Invalid response from ${source.name}`);
  }

  // Normalise each item to the unified schema
  return data.items.map((item) => {
    const plainContent = stripHtml(item.content || item.description || '');
    const plainTitle = stripHtml(item.title || 'Untitled');

    return {
      id: generateId(),
      title: plainTitle,
      source: source.name,
      category: categorizeArticle(plainTitle, plainContent) || source.category,
      date: item.pubDate
        ? new Date(item.pubDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      excerpt: truncate(plainContent, 200),
      content: plainContent,
      imageUrl: item.thumbnail || item.enclosure?.link || null,
      link: item.link || '#',
    };
  });
}

/* ── Fetch All News ─────────────────────────────────────── */

/**
 * Fetch news from ALL configured RSS feeds in parallel.
 * Merges results with cached data and falls back to
 * SAMPLE_NEWS if every feed fails.
 *
 * @returns {Promise<Array>}  Sorted array of article objects (newest first)
 */
export async function fetchAllNews() {
  // 1. Check cache first
  const cached = cacheService.get(CACHE_KEY);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    console.log('[newsService] Returning cached news:', cached.length, 'articles');
    return cached;
  }

  // 2. Fetch from all feeds concurrently
  console.log('[newsService] Fetching from', FEED_SOURCES.length, 'feeds…');

  const results = await Promise.allSettled(
    FEED_SOURCES.map((source) => fetchSingleFeed(source))
  );

  // Collect successful results
  const freshArticles = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      freshArticles.push(...result.value);
      console.log(`[newsService] ✓ ${FEED_SOURCES[i].name}: ${result.value.length} articles`);
    } else {
      console.warn(`[newsService] ✗ ${FEED_SOURCES[i].name}:`, result.reason?.message);
    }
  });

  // 3. Deduplicate by title similarity (exact match after lowercase trim)
  const seen = new Set();
  const deduplicated = freshArticles.filter((article) => {
    const key = article.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 4. Sort by date descending (newest first)
  const sorted = deduplicated.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 5. If we got results, cache and return; otherwise fall back
  if (sorted.length > 0) {
    cacheService.set(CACHE_KEY, sorted, CACHE_TTL);
    console.log('[newsService] Cached', sorted.length, 'articles');
    return sorted;
  }

  console.warn('[newsService] All feeds failed — falling back to sample data');
  return [...SAMPLE_NEWS];
}

/* ── Search & Filter ────────────────────────────────────── */

/**
 * Filter articles by a free-text search query.
 * Searches title, source, excerpt, and content (case-insensitive).
 *
 * @param   {Array}  articles  Articles to search
 * @param   {string} query     Search term
 * @returns {Array}            Filtered articles
 */
export function searchNews(articles, query) {
  if (!query || !query.trim()) return articles;

  const q = query.toLowerCase().trim();

  return articles.filter((article) => {
    const haystack = [
      article.title,
      article.source,
      article.excerpt,
      article.content,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}

/**
 * Filter articles by category id.
 * Returns all articles if categoryId is 'all'.
 *
 * @param   {Array}  articles    Articles to filter
 * @param   {string} categoryId  Category id (e.g. 'agents', 'llms', 'all')
 * @returns {Array}              Filtered articles
 */
export function filterByCategory(articles, categoryId) {
  if (!categoryId || categoryId === 'all') return articles;
  return articles.filter((article) => article.category === categoryId);
}
