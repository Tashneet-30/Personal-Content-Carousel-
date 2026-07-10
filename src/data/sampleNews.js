/**
 * sampleNews.js
 * ─────────────
 * 18 realistic sample AI news articles that serve as:
 *   1. Fallback data when RSS feeds fail
 *   2. Demo content for carousel generation
 *   3. Seed data on first launch
 *
 * Each article follows the unified news schema used
 * throughout the app.
 */

export const SAMPLE_NEWS = [
  /* ── AI Agents ────────────────────────────────────────── */
  {
    id: 'sample-agents-01',
    title: 'What Are AI Agents? A Beginner-Friendly Explainer',
    source: 'AI News Hub',
    category: 'agents',
    date: '2026-07-09',
    excerpt:
      'AI agents are autonomous programs that perceive their environment, reason about goals, and take actions without constant human direction. Here is everything you need to know.',
    content:
      'AI agents represent a paradigm shift from traditional chatbots. Instead of simply responding to prompts, agents can plan multi-step tasks, use external tools, and adapt their strategy based on intermediate results.\n\nModern agent frameworks like CrewAI and LangGraph let developers define teams of specialised agents that collaborate on complex workflows — from research to code generation to data analysis. CrewAI uses a role-based metaphor where each agent has a backstory, goal, and set of tools, while LangGraph models agent logic as a state machine with conditional edges.\n\nThe key components of an AI agent include: a large language model (the "brain"), a planning module, a memory system (short-term and long-term), and tool integrations (web search, code execution, APIs). Agents can even spawn sub-agents to delegate subtasks.\n\nReal-world applications are exploding: customer-support agents that resolve tickets end-to-end, coding agents that fix bugs across entire repositories, and research agents that survey literature and produce summaries. Enterprises like Salesforce, ServiceNow, and Shopify have all launched agent platforms in 2026.\n\nWhile powerful, agents carry risks — they can hallucinate plans, loop endlessly, or take unintended actions. Guardrails, human-in-the-loop approval steps, and sandboxed execution environments are critical safety measures.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-agents-02',
    title: 'CrewAI 3.0 Launches with Native Multi-Agent Orchestration',
    source: 'VentureBeat',
    category: 'agents',
    date: '2026-07-08',
    excerpt:
      'CrewAI releases version 3.0 with built-in multi-agent orchestration, persistent memory, and an enterprise-ready deployment layer. The open-source framework now powers over 50,000 production workflows.',
    content:
      'CrewAI, the popular open-source multi-agent framework, announced version 3.0 today with a host of enterprise features. The headline addition is native multi-agent orchestration, which lets developers define hierarchical teams where a "manager" agent delegates tasks to specialist workers.\n\nVersion 3.0 also ships with persistent memory backed by vector databases, enabling agents to recall past interactions across sessions. A new "flow" abstraction provides a visual graph editor for designing agent workflows without code.\n\nThe release includes a managed cloud deployment layer — CrewAI Enterprise — with role-based access control, audit logging, and usage-based billing. Early adopters include a Fortune 500 logistics company using CrewAI to coordinate supply-chain monitoring agents.\n\n"We believe multi-agent systems will be the dominant paradigm for enterprise AI by 2027," said founder João Moura. The framework has grown 400% in GitHub stars over the past year and is now used by over 50,000 production workflows globally.\n\nCompetitors LangGraph and AutoGen have also accelerated their release cadence, signaling that the agent-orchestration market is entering a high-growth phase.',
    imageUrl: null,
    link: '#',
  },

  /* ── LLMs ─────────────────────────────────────────────── */
  {
    id: 'sample-llms-01',
    title: 'GPT-5 "Orion" Rolls Out with 1M Token Context and Built-in Reasoning',
    source: 'TechCrunch',
    category: 'llms',
    date: '2026-07-10',
    excerpt:
      'OpenAI launches GPT-5, codenamed Orion, featuring a 1-million-token context window, native chain-of-thought reasoning, and multimodal input/output across text, images, and audio.',
    content:
      'OpenAI has officially released GPT-5 "Orion," its most capable model to date. The headline feature is a 1-million-token context window — roughly 750,000 words — enabling the model to ingest entire codebases, legal corpora, or book-length documents in a single prompt.\n\nOrion introduces native chain-of-thought reasoning, meaning the model automatically decomposes complex problems into steps before answering. In benchmarks, this lifts performance on MATH, GPQA, and ARC-AGI by 15-20% over GPT-4o.\n\nThe model is natively multimodal: it accepts text, images, audio, and video as input and can generate text, images, and structured data as output. A new "canvas" mode lets users collaborate with the model on documents and code in real time.\n\nPricing starts at $10 per million input tokens and $30 per million output tokens — roughly 40% cheaper than GPT-4o on a per-capability basis, according to OpenAI. The model is available through the API immediately and will roll out to ChatGPT Plus users over the next two weeks.\n\nAnalysts predict Orion will accelerate adoption of LLM-powered agents, since long-context and reasoning capabilities are prerequisites for reliable autonomous workflows.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-llms-02',
    title: 'Anthropic Releases Claude 4.5 Sonnet with Enhanced Coding and Agentic Capabilities',
    source: 'The Verge',
    category: 'llms',
    date: '2026-07-07',
    excerpt:
      'Claude 4.5 Sonnet sets new state-of-the-art on SWE-bench and introduces an "extended thinking" mode that lets the model deliberate for up to 128K tokens before responding.',
    content:
      'Anthropic has released Claude 4.5 Sonnet, a mid-cycle upgrade that significantly improves coding and agentic performance. The model achieves 72% on SWE-bench Verified, surpassing all competitors including GPT-5 and Gemini 2.5 Pro.\n\nThe star feature is "extended thinking" — a deliberation mode where Claude can use up to 128K tokens of internal reasoning before producing its response. This is particularly effective for multi-step debugging, architecture decisions, and mathematical proofs.\n\nClaude 4.5 Sonnet also gains native tool-use improvements: it can now call tools in parallel, handle streaming tool results, and self-correct when a tool call fails. These enhancements make it significantly better at powering autonomous agent workflows.\n\nAnthropic has simultaneously launched the "Claude Code" CLI, a terminal-based coding assistant that uses Claude 4.5 as its backbone. Early users report it can autonomously navigate codebases, write tests, and submit pull requests with minimal human oversight.\n\nThe model is available at the same price point as Claude 3.5 Sonnet, continuing Anthropic\'s strategy of improving capability without increasing cost.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-llms-03',
    title: 'How Transformers Work: The Architecture Behind Every Modern LLM',
    source: 'AI News Hub',
    category: 'learning',
    date: '2026-07-05',
    excerpt:
      'A beginner-friendly breakdown of the Transformer architecture — self-attention, positional encoding, and why this 2017 invention still powers GPT, Claude, Gemini, and every major language model.',
    content:
      'The Transformer architecture, introduced in the landmark 2017 paper "Attention Is All You Need," is the foundation of every major large language model today. Understanding it is essential for anyone working in or following AI.\n\nAt its core, a Transformer processes input text as a sequence of tokens. Each token is converted to a numerical embedding vector. Since the model processes all tokens in parallel (unlike older RNNs), positional encodings are added so the model knows the order of words.\n\nThe magic happens in the self-attention mechanism. For each token, the model computes how much it should "attend to" every other token in the sequence. This lets the model capture long-range dependencies — for example, linking a pronoun to its antecedent paragraphs earlier.\n\nSelf-attention uses three learned matrices — Query, Key, and Value. The attention score between two tokens is the dot product of their Query and Key vectors, scaled and softmaxed into a weight. These weights are then used to combine Value vectors, producing a context-aware representation for each token.\n\nModern LLMs stack dozens (or hundreds) of Transformer layers, each refining the representation. Techniques like multi-head attention, layer normalization, and rotary positional embeddings have improved the original design, but the fundamental architecture remains remarkably unchanged after nearly a decade.',
    imageUrl: null,
    link: '#',
  },

  /* ── Vision ───────────────────────────────────────────── */
  {
    id: 'sample-vision-01',
    title: 'Meta Releases SAM 3: Real-Time Segment Anything at 120 FPS',
    source: 'MIT Tech Review',
    category: 'vision',
    date: '2026-07-06',
    excerpt:
      'Meta\'s Segment Anything Model 3 achieves real-time segmentation at 120 FPS on consumer GPUs, opening the door to live AR overlays and autonomous drone navigation.',
    content:
      'Meta AI has released SAM 3, the third generation of its Segment Anything Model, and the performance leap is dramatic. The new model segments any object in an image or video frame at 120 frames per second on an NVIDIA RTX 4070 — up from ~30 FPS with SAM 2.\n\nThe speed improvement comes from a distilled architecture that replaces the heavy ViT backbone with a lightweight hybrid CNN-Transformer encoder. Despite being 8x faster, SAM 3 matches or exceeds SAM 2 accuracy on all standard benchmarks including SA-1B, COCO, and DAVIS.\n\nFor video, SAM 3 introduces temporal consistency tracking, ensuring that segmentation masks remain stable across frames without flickering. This is critical for applications like augmented reality overlays, sports analytics, and autonomous navigation.\n\nMeta is releasing the model weights under an Apache 2.0 license, along with a Python SDK and a JavaScript library for browser-based deployment via WebGPU. The company demonstrated a live AR prototype where SAM 3 segments objects in a smartphone camera feed in real time.\n\nComputer vision researchers are calling SAM 3 a "foundation model moment" for perception tasks, similar to what GPT-3 was for language. Expect rapid adoption in robotics, medical imaging, and content creation pipelines.',
    imageUrl: null,
    link: '#',
  },

  /* ── Startups ─────────────────────────────────────────── */
  {
    id: 'sample-startups-01',
    title: 'Cognition AI Raises $500M at $4B Valuation for Devin, the AI Software Engineer',
    source: 'TechCrunch',
    category: 'startups',
    date: '2026-07-09',
    excerpt:
      'Cognition AI closes a massive Series B to scale Devin, its autonomous AI software engineer. The startup reports Devin now resolves 40% of Jira tickets end-to-end at enterprise customers.',
    content:
      'Cognition AI, the startup behind Devin — billed as the world\'s first AI software engineer — has raised $500 million in a Series B round led by Founders Fund, with participation from a16z and Khosla Ventures. The round values the company at $4 billion.\n\nDevin is an autonomous coding agent that can take a Jira ticket, understand the codebase, write code, run tests, and submit a pull request — all without human intervention. The company reports that at its largest enterprise customers, Devin now resolves approximately 40% of tickets end-to-end.\n\nThe funding will be used to expand Devin\'s capabilities to full-stack development (including frontend, infrastructure-as-code, and database migrations) and to build a team-collaboration layer where human engineers can review and guide Devin\'s work.\n\nCEO Scott Wu emphasized that Devin is designed to augment, not replace, human developers. "The best teams will be hybrid — humans setting direction and reviewing critical decisions, with Devin handling the implementation throughput," he said.\n\nThe AI coding-agent space is heating up: competitors include GitHub Copilot Workspace, Amazon Q Developer, and open-source alternatives like SWE-Agent. Analysts estimate the market for AI-assisted software development will reach $30 billion by 2028.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-startups-02',
    title: 'Perplexity AI Valued at $18B After New Funding Round',
    source: 'VentureBeat',
    category: 'startups',
    date: '2026-07-04',
    excerpt:
      'AI search engine Perplexity AI raises $500M in fresh funding, pushing its valuation to $18 billion. The company now processes over 200 million queries per month.',
    content:
      'Perplexity AI, the AI-powered search engine challenging Google\'s dominance, has raised $500 million in a new funding round that values the company at $18 billion. The round was led by Institutional Venture Partners with participation from existing investors.\n\nThe company has seen explosive growth, now processing over 200 million queries per month — up from 15 million just 18 months ago. Revenue is on a $200 million annual run rate, driven by its Pro subscription ($20/month) and a new enterprise API tier.\n\nPerplexity differentiates from traditional search by providing direct, cited answers rather than a list of links. Its latest model, Sonar 2, combines web retrieval with reasoning to handle complex, multi-step research questions.\n\nThe company plans to use the funding to expand internationally, launch an enterprise product for internal knowledge search, and invest in its own foundation models. CEO Aravind Srinivas noted that AI search is becoming a "must-have" rather than a "nice-to-have" for knowledge workers.\n\nThe funding underscores investor confidence in AI-native search as a category, even as Google, Microsoft, and Apple integrate AI more deeply into their own search products.',
    imageUrl: null,
    link: '#',
  },

  /* ── Tools & Apps ─────────────────────────────────────── */
  {
    id: 'sample-tools-01',
    title: 'Cursor IDE 2.0 Launches with Multi-File Agent Mode and Background Tasks',
    source: 'The Verge',
    category: 'tools',
    date: '2026-07-08',
    excerpt:
      'The AI-first code editor Cursor releases version 2.0, featuring an agent mode that can edit multiple files simultaneously, run terminal commands, and execute background tasks autonomously.',
    content:
      'Cursor, the AI-first code editor built on VS Code, has released version 2.0 with transformative new capabilities. The headline feature is Agent Mode, which allows the AI to autonomously edit multiple files, run terminal commands, install dependencies, and execute tests — all in a single workflow.\n\nAgent Mode uses a planning-execution loop: the AI first outlines its approach, then executes changes step by step, checking results at each stage. Users can intervene at any point to redirect the agent or approve/reject specific changes.\n\nVersion 2.0 also introduces Background Tasks — long-running agent jobs that continue working while you focus on other parts of your codebase. For example, you can ask Cursor to "refactor all API endpoints to use the new authentication middleware" and it will work through the codebase in the background.\n\nOther notable features include inline image understanding (paste a screenshot and Cursor recreates the UI), a built-in MCP (Model Context Protocol) client for connecting to external tools, and support for multiple AI backends including Claude, GPT-5, and Gemini.\n\nCursor reports over 2 million monthly active developers, with 40% of them on paid plans. The company recently raised $900 million, signaling that AI-native development tools are becoming a major software category.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-tools-02',
    title: 'Hugging Face Launches Open-Source Model Router for Optimized Inference',
    source: 'VentureBeat',
    category: 'tools',
    date: '2026-07-03',
    excerpt:
      'Hugging Face releases an open-source model router that automatically selects the best model for each query based on cost, latency, and accuracy requirements.',
    content:
      'Hugging Face has launched an open-source "Model Router" that intelligently routes AI queries to the optimal model based on the task\'s complexity, latency requirements, and cost constraints. The tool is available as a Python library and a hosted API.\n\nThe router works by analyzing incoming prompts with a lightweight classifier that predicts task difficulty. Simple queries (e.g., summarization, translation) are routed to smaller, cheaper models, while complex tasks (e.g., multi-step reasoning, code generation) are sent to larger, more capable models.\n\nIn benchmarks, the router reduced API costs by 60% while maintaining 95% of the quality of always using the most capable model. It supports all major model providers — OpenAI, Anthropic, Google, Mistral, and open-source models on Hugging Face Inference Endpoints.\n\nThe project includes a dashboard for monitoring routing decisions, cost savings, and quality metrics. Enterprise users can define custom routing policies and fallback chains.\n\n"Every production AI application will need a router layer," said Hugging Face CEO Clément Delangue. "This is infrastructure, not a feature — and it should be open source." The project already has over 5,000 GitHub stars after its first week.',
    imageUrl: null,
    link: '#',
  },

  /* ── Research ─────────────────────────────────────────── */
  {
    id: 'sample-research-01',
    title: 'DeepMind AlphaFold 4 Predicts Protein-Drug Interactions with 95% Accuracy',
    source: 'MIT Tech Review',
    category: 'research',
    date: '2026-07-07',
    excerpt:
      'Google DeepMind unveils AlphaFold 4, which extends beyond structure prediction to model protein-drug interactions, potentially cutting drug discovery timelines from years to months.',
    content:
      'Google DeepMind has announced AlphaFold 4, a major evolution of its Nobel Prize-winning protein structure prediction system. The new version goes beyond static structure prediction to model dynamic protein-drug interactions with 95% accuracy on standard benchmarks.\n\nAlphaFold 4 can predict how a candidate drug molecule will bind to a target protein, estimate binding affinity, and flag potential off-target interactions — tasks that traditionally require months of wet-lab experiments. In validation studies with two pharmaceutical partners, AlphaFold 4 identified promising drug candidates that were later confirmed in the lab.\n\nThe model uses a novel diffusion-based architecture that generates an ensemble of possible binding conformations rather than a single prediction. This ensemble approach captures the inherent flexibility of proteins, a major limitation of earlier AlphaFold versions.\n\nDeepMind is making the model freely available for academic research through an updated AlphaFold Server. Commercial licensing is available through Google Cloud\'s Drug Discovery Suite. The company estimates that widespread adoption could reduce average drug development costs by 30-40%.\n\nThe pharmaceutical industry has responded enthusiastically. Pfizer, Roche, and Novartis have all announced expanded partnerships with DeepMind to integrate AlphaFold 4 into their discovery pipelines.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-research-02',
    title: 'Stanford Researchers Achieve Breakthrough in Efficient Transformer Training',
    source: 'Google AI Blog',
    category: 'research',
    date: '2026-07-02',
    excerpt:
      'A new training method called "FlashAttention-3" reduces Transformer training compute by 50% without sacrificing model quality, potentially democratizing large model development.',
    content:
      'Researchers at Stanford University have published FlashAttention-3, a new algorithm that reduces the computational cost of training Transformer models by approximately 50% compared to current best practices.\n\nFlashAttention-3 builds on the memory-efficient attention algorithm from the same group but introduces two key innovations: "block-sparse attention" that skips provably unimportant attention computations, and a "gradient checkpointing" scheme that recomputes activations in a cache-friendly order.\n\nIn experiments training a 70B-parameter model on 2 trillion tokens, FlashAttention-3 achieved the same final loss as the baseline while using half the GPU-hours. The wall-clock training time on a 256-H100 cluster dropped from 14 days to 7.5 days.\n\nThe implications for AI democratization are significant. Training a frontier model currently costs $50-100 million in compute alone. If FlashAttention-3 adoption becomes widespread, it could halve that figure, enabling more organizations to train competitive models.\n\nThe code is open-sourced and integrated into PyTorch nightly builds. NVIDIA has announced plans to include FlashAttention-3 kernels in the next version of its cuDNN library for further hardware-level optimization.',
    imageUrl: null,
    link: '#',
  },

  /* ── Industry ─────────────────────────────────────────── */
  {
    id: 'sample-industry-01',
    title: 'EU AI Act Enters Full Enforcement: What Companies Need to Know',
    source: 'The Verge',
    category: 'industry',
    date: '2026-07-01',
    excerpt:
      'The European Union\'s AI Act is now fully enforceable. High-risk AI systems must comply with transparency, safety, and governance requirements or face fines up to 7% of global revenue.',
    content:
      'The EU AI Act, the world\'s most comprehensive AI regulation, has entered full enforcement as of July 1, 2026. Companies deploying AI systems in the EU must now comply with a tiered framework that classifies AI applications by risk level.\n\nHigh-risk systems — including AI used in healthcare, education, hiring, law enforcement, and critical infrastructure — must meet strict requirements: technical documentation, human oversight mechanisms, bias testing, and conformity assessments by certified bodies.\n\nGeneral-purpose AI models (like GPT-5 and Claude) face transparency obligations: providers must disclose training data summaries, publish model cards, and implement copyright safeguards. Models deemed to pose "systemic risk" face additional requirements including red-teaming and incident reporting.\n\nPenalties are severe: up to €35 million or 7% of global annual revenue for the most serious violations. The Act also establishes an EU AI Office to coordinate enforcement across member states.\n\nIndustry response has been mixed. Large tech companies have generally complied, having had two years to prepare. Smaller startups, however, have raised concerns about compliance costs. Several industry groups are calling for clearer guidance on how the rules apply to open-source models.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-industry-02',
    title: 'AI in Healthcare: FDA Approves First Fully Autonomous Diagnostic System',
    source: 'MIT Tech Review',
    category: 'industry',
    date: '2026-07-06',
    excerpt:
      'The FDA grants full approval to an AI system that autonomously diagnoses diabetic retinopathy from retinal scans, requiring no physician oversight for screening decisions.',
    content:
      'The U.S. Food and Drug Administration has granted full approval to MediScan AI\'s autonomous diabetic retinopathy screening system — the first AI diagnostic tool approved to operate without physician oversight in a clinical setting.\n\nThe system uses a deep learning model trained on over 2 million retinal images to detect diabetic retinopathy (a leading cause of blindness) with 97.5% sensitivity and 98.2% specificity. Patients simply look into a desktop camera, and the system delivers a diagnosis in under 30 seconds.\n\nUnlike previous FDA-cleared AI tools that required a physician to review results, this system can independently make screening decisions and refer patients for treatment. It is approved for use in primary care clinics, pharmacies, and community health centers.\n\nThe approval is expected to dramatically improve screening rates. Currently, only about 50% of diabetic patients receive annual eye exams as recommended. By deploying the system in pharmacies and rural clinics, MediScan aims to reach underserved populations.\n\nHealthcare AI experts see this as a landmark moment. "This approval establishes that AI can meet the same standard of care as a specialist for specific, well-defined diagnostic tasks," said Dr. Eric Topol, director of the Scripps Research Translational Institute.',
    imageUrl: null,
    link: '#',
  },

  /* ── Learning ─────────────────────────────────────────── */
  {
    id: 'sample-learning-01',
    title: 'RAG Explained: How Retrieval-Augmented Generation Actually Works',
    source: 'AI News Hub',
    category: 'learning',
    date: '2026-07-04',
    excerpt:
      'Retrieval-Augmented Generation (RAG) lets LLMs answer questions using your own documents. Here is a step-by-step breakdown of how it works and when to use it.',
    content:
      'Retrieval-Augmented Generation (RAG) is the most practical technique for making LLMs work with private or up-to-date data. Instead of fine-tuning a model (expensive and inflexible), RAG retrieves relevant documents at query time and feeds them to the LLM as context.\n\nThe RAG pipeline has three stages. First, Indexing: your documents are split into chunks, each chunk is converted into a numerical embedding vector, and these vectors are stored in a vector database (like Pinecone, Weaviate, or Chroma). Second, Retrieval: when a user asks a question, the question is also embedded, and the vector database finds the most similar document chunks. Third, Generation: the retrieved chunks are inserted into the LLM prompt as context, and the model generates an answer grounded in your data.\n\nRAG shines for enterprise use cases: customer support bots that answer from product docs, legal assistants that cite specific clauses, and research tools that synthesize findings from paper collections. It avoids the hallucination problem because the model has access to source material.\n\nKey challenges include chunking strategy (too small loses context, too large dilutes relevance), retrieval quality (embedding models matter enormously), and citation accuracy (users need to verify sources). Advanced techniques like HyDE, reranking, and query decomposition can significantly improve results.\n\nIf you are building with RAG in 2026, start with a framework like LangChain, LlamaIndex, or Haystack. All three provide turnkey RAG pipelines that you can customize and deploy in hours rather than weeks.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-learning-02',
    title: 'Prompt Engineering in 2026: Advanced Techniques Beyond "Think Step by Step"',
    source: 'AI News Hub',
    category: 'learning',
    date: '2026-07-03',
    excerpt:
      'A comprehensive guide to modern prompt engineering — from chain-of-thought and few-shot prompting to tree-of-thought, self-consistency, and meta-prompting strategies.',
    content:
      'Prompt engineering has evolved far beyond simple "think step by step" instructions. In 2026, getting the best results from LLMs requires a toolkit of advanced techniques.\n\nChain-of-thought (CoT) prompting remains foundational: asking the model to show its reasoning steps dramatically improves accuracy on math, logic, and multi-step problems. But newer techniques build on this. Tree-of-thought prompting explores multiple reasoning paths simultaneously and selects the best one. Self-consistency generates multiple answers and picks the one that appears most frequently.\n\nFew-shot prompting — providing examples in the prompt — is more powerful than ever with long-context models. With 1M-token windows, you can provide dozens of high-quality examples. The key is selecting examples that are diverse and representative of the task.\n\nMeta-prompting is an emerging technique where you ask the LLM to write its own optimal prompt. You describe the task, and the model generates a system prompt that it predicts will produce the best results. Research shows this often outperforms human-written prompts.\n\nOther advanced techniques include: structured output prompting (using JSON schemas to constrain the response format), role prompting (assigning specific expertise to the model), and negative prompting (explicitly stating what the model should NOT do). The best practitioners combine multiple techniques for each task.',
    imageUrl: null,
    link: '#',
  },

  /* ── News / Policy ────────────────────────────────────── */
  {
    id: 'sample-news-01',
    title: 'Google Merges DeepMind and Brain Teams into Unified "Google AI" Division',
    source: 'TechCrunch',
    category: 'news',
    date: '2026-07-08',
    excerpt:
      'Google restructures its AI operations, merging Google DeepMind and Google Brain into a single "Google AI" division led by Demis Hassabis, with a $10B annual budget.',
    content:
      'Google has announced a major organizational restructuring, merging its Google DeepMind and remaining Google Brain research teams into a unified division called "Google AI." The combined division will be led by Demis Hassabis, who previously headed DeepMind.\n\nThe merger consolidates Google\'s AI research, infrastructure, and product teams under a single umbrella with an estimated annual budget exceeding $10 billion. The goal is to accelerate the path from research breakthroughs to product deployment.\n\nKey focus areas for Google AI include: next-generation Gemini models, AI-native search experiences, healthcare AI (building on Med-PaLM), and robotics. The division will also oversee Google\'s AI infrastructure, including TPU development and cloud AI services.\n\nThe restructuring reflects a broader industry trend of centralizing AI efforts. Microsoft, Meta, and Amazon have all consolidated their AI teams over the past year, driven by the belief that tightly integrated research-to-product pipelines produce faster innovation.\n\nFor developers, the practical impact will be felt through a unified API platform. Google plans to merge the Vertex AI, Gemini API, and AI Studio offerings into a single developer experience by Q4 2026.',
    imageUrl: null,
    link: '#',
  },
  {
    id: 'sample-news-02',
    title: 'AI-Powered Digital Twins Transform Urban Transit Planning',
    source: 'MIT Tech Review',
    category: 'industry',
    date: '2026-07-05',
    excerpt:
      'Cities worldwide are adopting AI-powered digital twins to simulate and optimize public transit systems, reducing wait times by up to 30% and cutting operational costs.',
    content:
      'A growing number of cities are deploying AI-powered digital twins — virtual replicas of their transit networks — to optimize service planning, predict passenger demand, and respond to disruptions in real time.\n\nDigital twins ingest data from IoT sensors, GPS trackers, fare systems, and weather forecasts to create a living model of the transit network. Machine learning algorithms then simulate thousands of scheduling scenarios to find optimal configurations. Cities like Singapore, Helsinki, and Toronto report 20-30% reductions in average passenger wait times after deploying these systems.\n\nThe technology is particularly powerful for multi-horizon forecasting — predicting demand at 15-minute, hourly, and daily intervals simultaneously. This enables transit agencies to dynamically adjust bus frequencies and train schedules based on anticipated ridership.\n\nRecent research, including work on digital twin-based passenger demand forecasting frameworks, has demonstrated that combining deep learning models with real-time data feeds can achieve forecasting accuracy above 90% across multiple time horizons.\n\nThe convergence of IoT, AI, and cloud computing is making digital twins accessible even to mid-sized cities. Open-source platforms like Eclipse Ditto and commercial solutions from Siemens and IBM are lowering the barrier to entry, with deployment costs dropping 60% over the past two years.',
    imageUrl: null,
    link: '#',
  },
];
