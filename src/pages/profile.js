/**
 * ============================================
 * PROFILE PAGE — Tashneet's Portfolio
 * AI News Hub · by Tashneet Kaur (@tshntkaur)
 * ============================================
 *
 * A personal portfolio / about page showcasing:
 *   • Profile hero with avatar & social links
 *   • Bio
 *   • Research interests
 *   • Publications
 *   • Awards & scholarships
 *   • Technical skills
 */

// ── Data ──────────────────────────────────────────────────
import { PROFILE } from '../data/profile.js';

// ── Utils ─────────────────────────────────────────────────
import { initScrollAnimations } from '../utils/animations.js';

/* ──────────────────────────────────────────────────────────
   RENDER HELPERS
   ────────────────────────────────────────────────────────── */

/**
 * Build the social-links row from PROFILE data.
 * @returns {string} HTML
 */
function renderSocialLinks() {
  const links = [
    { label: '📸 Instagram', url: PROFILE.social?.instagram || 'https://instagram.com/tshntkaur' },
    { label: '🐙 GitHub',    url: PROFILE.social?.github    || 'https://github.com/tshntkaur' },
    { label: '🌐 Portfolio', url: PROFILE.social?.portfolio || '#' },
  ];

  return links
    .map(
      (l) =>
        `<a href="${l.url}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">${l.label}</a>`
    )
    .join('');
}

/**
 * Render a list of publications.
 * @returns {string} HTML
 */
function renderPublications() {
  if (!PROFILE.publications || PROFILE.publications.length === 0) return '';

  const cards = PROFILE.publications
    .map(
      (pub, i) => `
      <div class="card pub-card animate-on-scroll animate-stagger-${(i % 6) + 1}">
        <div class="pub-venue">${pub.venue || 'Publication'}</div>
        <h3>${pub.title}</h3>
        <p>${pub.description || ''}</p>
        ${pub.year ? `<span class="card-category cat-research" style="margin-top:var(--space-sm);">${pub.year}</span>` : ''}
      </div>`
    )
    .join('');

  return `
    <div class="mt-3xl">
      <div class="section-header">
        <h2>Research Publications</h2>
      </div>
      <div class="publications-list">
        ${cards}
      </div>
    </div>`;
}

/**
 * Render the awards list.
 * @returns {string} HTML
 */
function renderAwards() {
  if (!PROFILE.awards || PROFILE.awards.length === 0) return '';

  const items = PROFILE.awards
    .map(
      (a, i) => `
      <div class="card award-item animate-on-scroll animate-stagger-${(i % 6) + 1}">
        <div class="award-icon">🏆</div>
        <div>
          <h4>${a.title}</h4>
          <p>${a.org || ''}${a.year ? ` · ${a.year}` : ''}</p>
        </div>
      </div>`
    )
    .join('');

  return `
    <div class="mt-3xl">
      <div class="section-header">
        <h2>Awards &amp; Scholarships</h2>
      </div>
      <div class="awards-list">
        ${items}
      </div>
    </div>`;
}

/**
 * Render grouped technical skills.
 * @returns {string} HTML
 */
function renderSkills() {
  if (!PROFILE.skills || PROFILE.skills.length === 0) return '';

  const groups = PROFILE.skills
    .map(
      (group, i) => `
      <div class="animate-on-scroll animate-stagger-${(i % 6) + 1}" style="margin-bottom:var(--space-xl);">
        <h4 class="mb-md" style="color:var(--text-secondary);">${group.category}</h4>
        <div class="skills-cloud">
          ${group.items.map((s) => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      </div>`
    )
    .join('');

  return `
    <div class="mt-3xl">
      <div class="section-header">
        <h2>Technical Skills</h2>
      </div>
      ${groups}
    </div>`;
}

/* ──────────────────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────────────────── */

/**
 * Boot the Profile page.
 * Called every time the user navigates to #profile.
 */
export function initProfile() {
  const container = document.querySelector('#page-profile .page-content');
  if (!container) return;

  /* ── Research Interests (skills cloud) ────────────────── */
  const interestsHTML = PROFILE.interests
    ? `<div class="mt-2xl">
         <div class="section-header text-center">
           <h2>Research Interests</h2>
         </div>
         <div class="skills-cloud" style="justify-content:center;">
           ${PROFILE.interests.map((t) => `<span class="skill-tag">${t}</span>`).join('')}
         </div>
       </div>`
    : '';

  /* ── Assemble ─────────────────────────────────────────── */
  container.innerHTML = `
    <!-- Profile Hero -->
    <div class="profile-hero">
      <div class="profile-avatar">👩‍💻</div>
      <h1 class="profile-name">${PROFILE.name || 'Tashneet Kaur'}</h1>
      <p class="profile-title">
        ${PROFILE.title || 'Master of Applied Computing (Thesis) · Wilfrid Laurier University'}
      </p>
      <div class="profile-links">
        ${renderSocialLinks()}
      </div>
    </div>

    <!-- Bio -->
    <div class="mt-2xl">
      <div class="glass-card" style="padding:var(--space-xl);max-width:800px;margin:0 auto;">
        <p style="line-height:var(--lh-relaxed);color:var(--text-secondary);font-size:var(--fs-md);">
          ${PROFILE.bio || ''}
        </p>
      </div>
    </div>

    <!-- Research Interests -->
    ${interestsHTML}

    <!-- Publications -->
    ${renderPublications()}

    <!-- Awards -->
    ${renderAwards()}

    <!-- Technical Skills -->
    ${renderSkills()}
  `;

  /* ── Scroll animations ────────────────────────────────── */
  initScrollAnimations();
}
