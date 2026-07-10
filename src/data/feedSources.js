/**
 * feedSources.js
 * ──────────────
 * RSS feed sources the app polls for AI news, plus the
 * master category taxonomy used across filtering, badges,
 * and carousel generation.
 */

/* ── RSS Feed Sources ───────────────────────────────────── */
export const FEED_SOURCES = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'startups',
    icon: '🚀',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    category: 'news',
    icon: '📰',
  },
  {
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'research',
    icon: '🔬',
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'tools',
    icon: '🛠️',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    category: 'research',
    icon: '🧪',
  },
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'llms',
    icon: '🧠',
  },
];

/* ── Category Taxonomy ──────────────────────────────────── */
export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'agents', label: 'AI Agents', icon: '🤖' },
  { id: 'llms', label: 'LLMs', icon: '🧠' },
  { id: 'vision', label: 'Vision', icon: '👁️' },
  { id: 'startups', label: 'Startups', icon: '🚀' },
  { id: 'tools', label: 'Tools & Apps', icon: '🛠️' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'research', label: 'Research', icon: '🔬' },
  { id: 'industry', label: 'Industry', icon: '🌍' },
  { id: 'news', label: 'News', icon: '📰' },
];
