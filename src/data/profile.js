/**
 * profile.js
 * ─────────
 * Complete profile data for Tashneet Kaur (@tshntkaur).
 * Sourced from CV — used across the app for branding,
 * carousel watermarks, and the "About" section.
 */

export const PROFILE = {
  name: 'Tashneet Kaur',
  title: 'Master of Applied Computing (Thesis) Student',
  university: 'Wilfrid Laurier University',
  location: 'Waterloo, Ontario, Canada',
  email: 'kaur6910@mylaurier.ca',
  instagram: '@tshntkaur',
  instagramUrl: 'https://www.instagram.com/tshntkaur/',
  github: 'https://github.com/Tashneet-30',
  portfolio: 'https://linktr.ee/tashneetkaur',

  bio: 'Master\'s student and AI researcher passionate about making complex AI accessible. Published 4 research papers spanning digital twins, deep learning, and GPU-accelerated computing. Currently exploring the intersection of AI and sustainable infrastructure.',

  researchInterests: [
    'Applied AI',
    'Data Analytics',
    'Digital Twins',
    'Smart Infrastructure',
    'Transportation Analytics',
    'Sustainable Mobility',
    'AI Agents',
  ],

  /* ── Publications ─────────────────────────────────────── */
  publications: [
    {
      title:
        'A Digital Twin-Based Multi-Horizon Passenger Demand Forecasting Framework for Public Transits',
      venue: 'Future Generation Computer Systems (Elsevier)',
      year: 2025,
      status: 'Accepted',
      description:
        'A novel framework leveraging digital twin technology for multi-horizon passenger demand forecasting in public transit systems.',
    },
    {
      title:
        'From Haze and Smoke to Clarity: An Integration of Deep Learning and Atmospheric Models for Enhanced Visual Clarity',
      venue: 'CICBA, NIT Patna',
      year: 2024,
      status: 'Published',
      description:
        'Integration of deep learning with atmospheric models to enhance visual clarity in hazy and smoky conditions.',
    },
    {
      title:
        'GPU-Accelerated Monte Carlo Simulations for Real-time Financial Risk Analysis',
      venue: 'ICDMIS-2024',
      year: 2024,
      status: 'Published',
      description:
        'Leveraging GPU acceleration to perform Monte Carlo simulations for real-time financial risk assessment.',
    },
    {
      title:
        'Deep Scene Fusion: A Hybrid Deep Learning-CNN Approach for Scene Recognition',
      venue: 'ICDAM-2024',
      year: 2024,
      status: 'Published',
      description:
        'A hybrid deep learning and CNN approach for robust scene recognition across diverse environments.',
    },
  ],

  /* ── Awards & Scholarships ────────────────────────────── */
  awards: [
    {
      title: 'William Nikolaus Martin Science Scholarship',
      org: 'Wilfrid Laurier University',
      year: 2025,
    },
    {
      title: 'Laurier Graduate Scholarship',
      org: 'Wilfrid Laurier University',
      year: 2025,
    },
    {
      title: 'Differential Tuition Fee Award (International)',
      org: 'Wilfrid Laurier University',
      year: 2025,
    },
    {
      title: 'CSIR-CRRI Young Researchers\' Conclave — Third Place',
      org: 'National Level, New Delhi',
      year: 2023,
    },
  ],

  /* ── Technical Skills ─────────────────────────────────── */
  skills: {
    programming: ['Python', 'C', 'C++', 'SQL'],
    frameworks: [
      'Django',
      'ReactJS',
      'Flask',
      'REST APIs',
      'FastAPI',
      'Generative AI',
    ],
    dataScience: [
      'Pandas',
      'NumPy',
      'Scikit-Learn',
      'TensorFlow',
      'PyTorch',
      'Data Visualization',
    ],
    tools: ['PostgreSQL', 'Git', 'GitHub', 'Linux', 'Jupyter Notebook'],
  },
};
