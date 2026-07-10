/**
 * ============================================
 * EXPLORE PAGE — Browse AI Topics & Learning Paths
 * AI News Hub · by Tashneet Kaur (@tshntkaur)
 * ============================================
 *
 * Displays clickable category cards that filter the dashboard,
 * plus curated learning paths organized into three tracks:
 *   • AI Fundamentals
 *   • AI Agents & Tools
 *   • AI in the Real World
 */

// ── Data ──────────────────────────────────────────────────
import { CATEGORIES } from '../data/feedSources.js';

// ── Utils ─────────────────────────────────────────────────
import { initScrollAnimations } from '../utils/animations.js';

/* ──────────────────────────────────────────────────────────
   LEARNING PATHS DATA
   ────────────────────────────────────────────────────────── */

const LEARNING_PATHS = [
  {
    title: 'AI Fundamentals',
    items: [
      {
        title: 'What is Machine Learning?',
        desc: 'An introduction to supervised, unsupervised, and reinforcement learning — the three pillars of modern ML.',
      },
      {
        title: 'Neural Networks Explained',
        desc: 'From single perceptrons to deep multi-layer networks — understand the building blocks of AI.',
      },
      {
        title: 'How Transformers Work',
        desc: 'The attention mechanism, positional encoding, and why architectures like BERT and GPT changed everything.',
      },
      {
        title: 'Understanding LLMs',
        desc: 'Tokenization, pre-training, fine-tuning, and RLHF — the full lifecycle of large language models.',
      },
    ],
  },
  {
    title: 'AI Agents & Tools',
    items: [
      {
        title: 'What are AI Agents?',
        desc: 'Autonomous systems that observe, plan, and act — including tool use, memory, and goal-oriented behaviour.',
      },
      {
        title: 'Building with LangChain',
        desc: 'Chains, agents, memory modules, and tool integrations — the developer framework for LLM apps.',
      },
      {
        title: 'Multi-Agent Systems',
        desc: 'CrewAI, AutoGen, and collaboration patterns where multiple agents solve tasks together.',
      },
      {
        title: 'AI Developer Tools',
        desc: 'Cursor, GitHub Copilot, Replit, and v0 — tools that are reshaping how software gets built.',
      },
    ],
  },
  {
    title: 'AI in the Real World',
    items: [
      {
        title: 'AI in Healthcare',
        desc: 'Diagnostics, drug discovery, and medical imaging — how AI is transforming patient outcomes.',
      },
      {
        title: 'AI in Finance',
        desc: 'Algorithmic trading, fraud detection, and risk analysis — AI on Wall Street and beyond.',
      },
      {
        title: 'AI in Transportation',
        desc: 'Autonomous vehicles, route optimization, and the electrification of transit.',
      },
      {
        title: 'AI Ethics & Policy',
        desc: 'Bias, fairness, regulation, and responsible AI — the human side of the technology.',
      },
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   CATEGORY DESCRIPTIONS (used in the visual cards)
   ────────────────────────────────────────────────────────── */

const CATEGORY_DESCRIPTIONS = {
  agents:   'Autonomous AI agents, tool use, planning, and multi-agent collaboration.',
  llms:     'Large language models — GPT, Claude, Llama, Gemini, and the latest breakthroughs.',
  vision:   'Computer vision, image generation, video models, and multimodal AI.',
  startups: 'Funding rounds, acquisitions, and the hottest AI companies to watch.',
  tools:    'Developer tools, APIs, frameworks, and infrastructure for building AI apps.',
  learning: 'Tutorials, courses, and resources to level up your AI skills.',
  research: 'Papers, benchmarks, and cutting-edge research from top AI labs.',
  industry: 'Enterprise AI adoption, regulation, market trends, and real-world deployments.',
};

/* ──────────────────────────────────────────────────────────
   RENDER HELPERS
   ────────────────────────────────────────────────────────── */

/**
 * Build the HTML for a single learning-path group.
 * @param {Object} path - { title, items[] }
 * @param {number} stagger - animation stagger seed
 * @returns {string} HTML
 */
function renderLearningPath(path, stagger) {
  const items = path.items
    .map(
      (item, i) => `
      <div class="card learning-item animate-on-scroll animate-stagger-${(i % 6) + 1}">
        <div class="item-number">${i + 1}</div>
        <div>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        </div>
      </div>`
    )
    .join('');

  return `
    <div class="mt-xl animate-on-scroll animate-stagger-${stagger}">
      <h3 class="mb-lg">${path.title}</h3>
      <div class="learning-path">
        ${items}
      </div>
    </div>`;
}

/* ──────────────────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────────────────── */

/**
 * Boot the Explore page.
 * Called every time the user navigates to #explore.
 */
export function initExplore() {
  const container = document.querySelector('#page-explore .page-content');
  if (!container) return;

  /* ── Category Cards ───────────────────────────────────── */
  const categoryCards = CATEGORIES
    .filter((c) => c.id !== 'all')
    .map(
      (cat, i) => `
      <div class="card category-card animate-on-scroll animate-stagger-${(i % 6) + 1}"
           data-category="${cat.id}">
        <span class="cat-icon">${cat.emoji}</span>
        <h3>${cat.label}</h3>
        <p>${CATEGORY_DESCRIPTIONS[cat.id] || 'Explore this topic.'}</p>
      </div>`
    )
    .join('');

  /* ── Learning Paths ───────────────────────────────────── */
  const learningHTML = LEARNING_PATHS.map((p, i) =>
    renderLearningPath(p, (i % 6) + 1)
  ).join('');

  /* ── Assemble ─────────────────────────────────────────── */
  container.innerHTML = `
    <!-- Section header -->
    <div class="section-header text-center" style="padding-top:var(--space-3xl);">
      <h2>Explore <span class="gradient-text">AI Topics</span></h2>
      <p>Dive deep into every corner of artificial intelligence.</p>
    </div>

    <!-- Category grid -->
    <div class="category-grid mt-xl">
      ${categoryCards}
    </div>

    <!-- Learning Paths -->
    <div class="mt-3xl">
      <div class="section-header">
        <h2>Learning Paths</h2>
        <p>From basics to cutting edge.</p>
      </div>
      ${learningHTML}
    </div>`;

  /* ── Click handler: category cards → dashboard ────────── */
  const grid = container.querySelector('.category-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (!card) return;

      const cat = card.dataset.category;
      // Navigate to dashboard with category hash hint
      window.location.hash = `dashboard?cat=${cat}`;
    });
  }

  /* ── Scroll animations ────────────────────────────────── */
  initScrollAnimations();
}
