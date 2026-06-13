/* empire-data.js — Part 1: Structure + 12 Main Categories
   Sub-bubbles are added in subsequent parts.
   Load BEFORE empire-map.js in dashboard.html */

window.EE_MAP_DATA = (function () {
  'use strict';

  /* ── Internal bubble registry ───────────────────────── */
  var _b = {};
  function add(obj) { _b[obj.id] = obj; }

  /* ── Shared difficulty label helper ─────────────────── */
  function diff(d) { return d || 'beginner'; }

  /* ── ROOT node (level 0) ─────────────────────────────── */
  add({
    id: 'root',
    parentId: null,
    level: 0,
    title: 'Build Your Empire',
    icon: '⚡',
    color: '#d4a018',
    glow: 'rgba(212,160,24,0.5)',
    category: 'Root',
    highlight: 'Your empire is built one intentional decision at a time.',
    whatYouLearn: [
      'How to use this map to accelerate every area of your life',
      'Why discipline is the foundation of every other skill',
      'How your financial, mental, and physical health all connect',
      'The 12 pillars that separate high-performers from everyone else',
      'How to build a personal system that compounds over time'
    ],
    coreLesson: `Empire isn't a destination. It's a daily operating system.

Every successful person — in business, health, relationships, or wealth — runs a version of the same system: they define what they want with clarity, they build habits that move toward it without requiring constant motivation, and they measure progress so the work compounds.

This map is your operating system. Each bubble represents a domain of mastery. Click into any domain to get a full lesson, a today-action, and a checklist you can start immediately. Navigate deeper to find sub-skills — the specific techniques that build the larger capability.

You don't have to do everything at once. The highest leverage move is to identify the ONE area most limiting your progress right now, go deep on it for 30-90 days, then expand.

Use this map to think, not just to learn. Ask yourself: where am I strongest? Where am I avoiding? Where is my biggest gap costing me the most?

The empire you want already exists — it's just waiting on you to build it systematically.`,
    examples: [],
    howItApplies: 'Start with one category. Go deep. Then expand.',
    todayAction: 'Click one main bubble below that you know is your biggest gap right now.',
    checklist: [
      'Pick the 1 category most holding you back',
      'Read the full lesson for that category',
      'Complete the Today Action',
      'Mark your first checklist item done',
      'Return tomorrow and pick the next sub-bubble'
    ],
    children: [
      'financial','discipline','mindset','health','self-mastery',
      'legacy','ebooks','ai-plan-builder','business','faith',
      'relationships','confidence'
    ],
    connections: [],
    estimatedMinutes: 5,
    difficulty: diff('beginner'),
    lessonCount: 1,
    progress: 0,
    status: 'available'
  });

  /* ══════════════════════════════════════════════════════
     12 MAIN CATEGORY BUBBLES  (level 1)
     Sub-bubbles are appended in parts 2–5.
  ══════════════════════════════════════════════════════ */

  /* ── 1. FINANCIAL ───────────────────────────────────── */
  add({
    id: 'financial',
    parentId: 'root',
    level: 1,
    title: 'Financial',
    icon: '💰',
    color: '#d4a018',
    glow: 'rgba(212,160,24,0.4)',
    category: 'Financial',
    highlight: 'Financial freedom isn\'t about how much you earn — it\'s about how much you keep and grow.',
    whatYouLearn: [
      'How to assign every dollar a job before you spend it',
      'Why systems beat willpower when it comes to saving money',
      'The exact difference between assets and liabilities in real life',
      'How to build income streams that don\'t require your daily presence',
      'The mindset shift that separates the financially free from the financially stuck'
    ],
    coreLesson: `Most people treat money reactively — they earn it, spend it, and wonder where it went. The wealthy treat money proactively: every dollar is assigned a role before it arrives.

Financial mastery starts with one principle — your money must have a job. That job is either covering essentials, building a reserve, growing wealth through investment, or generating future income. Any dollar without a job becomes a dollar that vanishes.

The wealth gap between people with similar incomes comes down to systems, not salaries. Someone earning $60K with a budget, automated savings, and no consumer debt can build more real wealth in five years than someone earning $150K who lives paycheck to paycheck. Income is a raw material — the system is what shapes it.

Start with total clarity: monthly take-home, fixed expenses, variable spending, and all debt payments. Most people cannot list these four numbers without checking their phone. That inability is the problem — not the income.

Next, separate your money physically. Open dedicated accounts: bills, savings, investment. Automate transfers on payday. When money moves automatically, you remove willpower from the equation — the most unreliable financial tool you own.

Finally, think in timelines. Short-term: emergency reserve and eliminating high-interest debt. Medium-term: consistent investing and income growth. Long-term: financial independence and legacy wealth. Each tier enables the next.

Money doesn't require genius. It requires one good system applied with consistency.`,
    examples: [
      'Darius earned $85K but saved nothing. He listed every expense, cut $400/month in subscriptions and dining, and automated $500 to savings. In 18 months he had $9,000 saved and zero credit card debt.',
      'Maya ran a profitable side business but reinvested nothing. She opened a business account, paid herself a set salary, and locked 30% of revenue into reinvestment. Revenue grew 40% in one year.'
    ],
    howItApplies: 'Your Empire needs a financial engine. Without financial clarity, every decision is made from fear rather than strategy. Build this foundation before you scale anything else.',
    todayAction: 'Open a spreadsheet and list every monthly expense. Label each one: Essential, Lifestyle, or Waste. Eliminate one Waste item before you sleep tonight.',
    checklist: [
      'List all monthly income (after tax)',
      'List all fixed monthly expenses',
      'Identify 1 "Waste" expense to cut this week',
      'Set up an automatic savings transfer (even $25)',
      'Check your credit score — know your starting point'
    ],
    children: ['budgeting','saving','debt-control','investing','cash-flow','business-income','credit','taxes','financial-discipline','cognitive-biases-money'],
    connections: [
      {id:'discipline', type:'supports'},
      {id:'business', type:'related'},
      {id:'self-mastery', type:'supports'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 10,
    progress: 0,
    status: 'available'
  });

  /* ── 2. DISCIPLINE ──────────────────────────────────── */
  add({
    id: 'discipline',
    parentId: 'root',
    level: 1,
    title: 'Discipline',
    icon: '🔥',
    color: '#e05c2a',
    glow: 'rgba(224,92,42,0.4)',
    category: 'Discipline',
    highlight: 'Motivation gets you started. Discipline keeps you going when motivation is gone.',
    whatYouLearn: [
      'Why relying on motivation is the most unreliable strategy for success',
      'How to design your environment so discipline becomes the default',
      'The role of identity in building unbreakable habits',
      'How to use time blocking to protect your highest-value work',
      'Why consistency over time beats intensity in every domain'
    ],
    coreLesson: `Discipline is not about white-knuckling through tasks you hate. It's about building systems that make the right action easier than the wrong one.

The biggest myth about discipline is that some people have it and others don't. Discipline is not a personality trait — it's a skill developed through repetition, environment design, and identity anchoring.

Your environment is your first lever. If junk food is in your house, you will eat it eventually. If your phone is on your desk during deep work, you will check it. If you don't plan your morning the night before, you will drift. Change your environment, and behavior follows with significantly less willpower required.

Your identity is your second lever. People who say "I'm a runner" run when they don't feel like it because skipping would conflict with who they believe they are. People who say "I'm trying to get fit" quit when motivation dips because there's no identity on the line. The key shift: define your identity by the habits you want to keep, not the goals you want to hit.

Your system is your third lever. Build a non-negotiable daily minimum — the smallest version of your most important habit that you will do no matter what. Not the full 60-minute workout. Five push-ups. Not the full journal entry. Three sentences. The minimum keeps the streak alive. The streak builds identity. The identity builds a life.

Discipline isn't punishment — it's the highest form of self-respect.`,
    examples: [
      'Jared committed to writing 200 words every morning before checking his phone. He started in January with no motivation. By June he had finished a full ebook draft of 48,000 words.',
      'Keisha blocked 6–8am daily for skill-building with no exceptions. In 90 days she went from beginner to booking paid clients in graphic design.'
    ],
    howItApplies: 'Every other pillar in your Empire depends on discipline. Financial consistency, business growth, health — all of it rests on your ability to do the right thing when you don\'t feel like it.',
    todayAction: 'Pick one important habit you\'ve been inconsistent on. Set a non-negotiable daily minimum (the smallest possible version). Do it today.',
    checklist: [
      'Identify your most important daily habit',
      'Define the smallest possible version of it',
      'Remove 1 environmental trigger that causes distraction',
      'Set a consistent wake time for the next 7 days',
      'Write your identity statement: "I am someone who ___"'
    ],
    children: ['morning-routine','deep-work','habit-stacking','willpower','accountability','time-blocking','delayed-gratification','consistency','discipline-vs-motivation'],
    connections: [
      {id:'mindset', type:'supports'},
      {id:'self-mastery', type:'related'},
      {id:'financial', type:'supports'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 9,
    progress: 0,
    status: 'available'
  });

  /* ── 3. MINDSET ─────────────────────────────────────── */
  add({
    id: 'mindset',
    parentId: 'root',
    level: 1,
    title: 'Mindset',
    icon: '🧠',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.4)',
    category: 'Mindset',
    highlight: 'The way you think about your life is the life you will live.',
    whatYouLearn: [
      'Why your current beliefs are the ceiling on your results',
      'How to identify and dismantle the stories holding you back',
      'The exact difference between fixed and growth mindset in daily decisions',
      'How to use failure as data rather than identity',
      'Why high performers think differently — and how to adopt those patterns'
    ],
    coreLesson: `Your mindset is not a background process — it is the operating system running every decision, reaction, and interpretation of your life. Change the OS, and everything the system produces changes with it.

The fundamental divide is between a fixed mindset and a growth mindset. A fixed mindset treats ability as static: "I'm not good at money," "I'm not creative," "I'm just not that type of person." A growth mindset treats ability as a direction: "I haven't learned this yet."

That single word — yet — carries enormous weight. It means the gap between you and where you want to be is a function of time and effort, not talent. Nearly every skill you admire in someone else was built, not born.

Belief shapes behavior, and behavior shapes results. If you believe you'll fail, you'll unconsciously avoid the actions that lead to success. You'll procrastinate, quit early, or never start. Not out of laziness — out of protection. The mind defends its own story.

Rewriting the story requires evidence, not affirmations. You cannot think your way out of a pattern that your experience built. You act your way out of it. Take a small action that contradicts the limiting belief. Record the outcome. Repeat. Gradually, the evidence overrides the story.

High-performers are not more confident than average people at the start. They are more willing to act before the confidence arrives.`,
    examples: [
      'Terrence believed he "wasn\'t a business person." He started one micro-offer — a $25 Notion template — and made three sales in a week. That evidence permanently changed his self-concept.',
      'Aaliyah failed her first product launch. Instead of quitting, she treated it as a data collection exercise. Her second launch made $3,200.'
    ],
    howItApplies: 'Your mindset is the first thing your Empire is built on. Every other module — discipline, business, confidence — runs on the beliefs you carry into each day.',
    todayAction: 'Write down one belief that has been limiting you. Write three pieces of evidence that contradict it. Read them tonight before bed.',
    checklist: [
      'Identify one fixed-mindset belief you hold',
      'Find 3 examples that prove it wrong',
      'Replace "I can\'t" with "I haven\'t learned yet" for one day',
      'Read one chapter of a book by someone who overcame your exact limitation',
      'Tell someone one ambitious goal you\'ve been afraid to say out loud'
    ],
    children: ['growth-mindset','abundance-mindset','self-belief','reframing-failure','visualization','identity-shift','stoicism','focus-mindset','emotional-mastery'],
    connections: [
      {id:'discipline', type:'supports'},
      {id:'confidence', type:'supports'},
      {id:'self-mastery', type:'related'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 9,
    progress: 0,
    status: 'available'
  });

  /* ── 4. HEALTH ──────────────────────────────────────── */
  add({
    id: 'health',
    parentId: 'root',
    level: 1,
    title: 'Health',
    icon: '💪',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.4)',
    category: 'Health',
    highlight: 'Your body is the vehicle for every other goal. Neglect it and everything else suffers.',
    whatYouLearn: [
      'Why sleep is the highest-leverage health investment you can make',
      'The core nutrition principles that apply regardless of any specific diet',
      'How strength training changes your body and your brain at the same time',
      'The connection between physical health and mental performance',
      'How to build sustainable health habits without overhauling your entire life'
    ],
    coreLesson: `Health is infrastructure, not a hobby. When your energy, sleep, and body are functioning well, every other area of your life performs better — thinking, decision-making, emotional regulation, creativity, and output all improve.

Most people treat health as something they get to once everything else is handled. This is backwards. Chronic fatigue, poor nutrition, and zero exercise cost you performance in everything you do. The ROI on basic health habits is higher than almost any other investment.

The three most impactful non-negotiables are sleep, movement, and food quality. Not in that order — they all matter, but sleep is frequently the most neglected and has the broadest impact. Sleeping 6 hours instead of 8 over a week creates the same cognitive impairment as 24 hours without sleep — and most people can't tell the difference because impaired sleep kills your ability to assess your own impairment.

Movement doesn't require a gym. Thirty minutes of walking daily reduces all-cause mortality, improves mood via BDNF and dopamine, reduces cortisol, and increases cognitive clarity. It is the most accessible medicine available.

Food quality over calorie counting. Eat mostly whole foods, enough protein (0.7–1g per pound of bodyweight), and stay hydrated. Eliminate or drastically reduce ultra-processed foods — not because of the calories, but because they impair insulin, gut health, and dopamine regulation simultaneously.

Build one health habit at a time. Master it until it requires no thought. Then add the next.`,
    examples: [
      'Marcus added a 20-minute walk after lunch. Within 3 weeks his afternoon energy crash disappeared and his creative output in that 2-5pm window measurably increased.',
      'Priya prioritized 8 hours of sleep for 30 days. She reported better decision-making, reduced anxiety, and dropped 4 pounds without changing her diet.'
    ],
    howItApplies: 'You cannot build an empire from a depleted body. Health is the fuel system for every other module in this map.',
    todayAction: 'Pick one: go to bed 30 minutes earlier tonight, drink 8 glasses of water today, or take a 20-minute walk. Just one. Do it.',
    checklist: [
      'Set a consistent sleep schedule (same bedtime and wake time)',
      'Drink at least 2L of water today',
      'Get 20+ minutes of movement (walk, gym, anything)',
      'Eat one meal today with no ultra-processed food',
      'Identify the health habit you\'ve been avoiding most'
    ],
    children: ['sleep-optimization','nutrition-basics','strength-training','cardio-endurance','mental-health','stress-management','hydration','recovery'],
    connections: [
      {id:'discipline', type:'requires'},
      {id:'self-mastery', type:'supports'},
      {id:'mindset', type:'supports'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 8,
    progress: 0,
    status: 'available'
  });

  /* ── 5. SELF-MASTERY ────────────────────────────────── */
  add({
    id: 'self-mastery',
    parentId: 'root',
    level: 1,
    title: 'Self-Mastery',
    icon: '🎯',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.4)',
    category: 'Self-Mastery',
    highlight: 'The greatest battle you will ever fight is with the version of you that wants to stay comfortable.',
    whatYouLearn: [
      'How to develop genuine self-awareness — not just surface-level introspection',
      'Why emotional intelligence matters more than IQ in most real-world outcomes',
      'How to make better decisions by understanding your own cognitive biases',
      'The role of personal values in creating a life that actually feels meaningful',
      'How to manage your energy, not just your time'
    ],
    coreLesson: `Self-mastery is the practice of understanding yourself well enough to direct yourself deliberately. It is the meta-skill underneath every other skill in this map.

Most people live reactively — responding to whatever demand appears loudest. Self-mastery means choosing the response rather than defaulting to it. It means knowing why you get angry, why you procrastinate, why you shrink in certain rooms, and what triggers your best and worst work.

Self-awareness is the entry point. Not the kind that comes from endless journaling about feelings, but the kind that tracks patterns: What time of day do you do your best work? What environments make you anxious? What people drain your energy? What activities make you lose track of time? These patterns are the raw data of self-knowledge.

Emotional intelligence is the application layer. It's the ability to name what you're feeling, understand why, regulate the reaction, and use that awareness to navigate relationships and decisions more skillfully. High EQ doesn't mean suppressing emotion — it means not being controlled by it.

Values clarity is the compass. When you know your top three core values, decision-making simplifies dramatically. Opportunities that conflict with your values stop being tempting. Commitments that align with them feel energizing rather than obligatory.

Energy management is often more practical than time management. You cannot manufacture more hours, but you can protect the hours when you're sharpest. Guard those hours with the discipline of a professional athlete.`,
    examples: [
      'Jerome tracked his energy levels every hour for two weeks. He discovered he was scheduling creative work at 3pm — his lowest point — and admin during his 9am peak. Swapping the two doubled his creative output.',
      'Simone identified "being seen as incompetent" as her core fear. Recognizing it allowed her to stop avoiding challenging projects and start taking the risks her business needed.'
    ],
    howItApplies: 'You are the most important tool in your Empire. If you don\'t master yourself, you cannot master anything else you\'re trying to build.',
    todayAction: 'Track your energy every hour today (1–10 scale). Note what you\'re doing when energy is highest and lowest. Use that data tomorrow.',
    checklist: [
      'Write your top 3 core personal values',
      'Identify your peak energy hours and protect one for deep work',
      'Name an emotion you\'ve been avoiding and write what\'s underneath it',
      'List the 3 habits that have the biggest impact on your self-control',
      'Identify one pattern of self-sabotage and its trigger'
    ],
    children: ['self-awareness','emotional-intelligence','personal-values','decision-making','energy-management','boundaries','inner-critic','meditation','journaling'],
    connections: [
      {id:'mindset', type:'related'},
      {id:'discipline', type:'supports'},
      {id:'relationships', type:'supports'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('intermediate'),
    lessonCount: 9,
    progress: 0,
    status: 'available'
  });

  /* ── 6. LEGACY ──────────────────────────────────────── */
  add({
    id: 'legacy',
    parentId: 'root',
    level: 1,
    title: 'Legacy',
    icon: '🏛️',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.4)',
    category: 'Legacy',
    highlight: 'A legacy is not what you leave behind — it\'s what you build forward.',
    whatYouLearn: [
      'How to define your legacy before someone else defines it for you',
      'Why systems and structures outlast personal effort',
      'The difference between leaving money and leaving impact',
      'How mentorship multiplies your reach beyond what you can do alone',
      'How to align daily decisions with a long-term vision that matters to you'
    ],
    coreLesson: `Legacy is not a retirement project. It is built in the daily decisions made long before anyone is watching.

Most people think about legacy only at the end — what they'll leave behind when they're gone. But legacy is constructed in real time, through the systems you build, the people you develop, the work you create, and the values you model under pressure.

The first question is not "what do I want to leave?" — it's "what kind of impact do I want to have while I'm here?" Legacy is not posthumous. It's ongoing. The mentor who changes one student's life creates a ripple that touches everyone that student later affects. The business that solves a real problem for real people creates value that compounds long after the founder exits.

Building legacy requires two things most people resist: a long time horizon and the willingness to invest in others. Short-term thinkers optimize for themselves. Long-term thinkers build systems that work without them and people who can carry the work forward.

The most durable legacy comes from intersection: something you do excellently, something the world genuinely needs, and something aligned with your deepest values. Work that sits at that intersection doesn't feel like sacrifice — it feels like purpose.

Start now. Identify one person you could mentor, one system you could build, or one piece of work you could create that would outlast today's effort.`,
    examples: [
      'Denzel used to chase short-term consulting contracts. He shifted to training junior consultants inside his firm. Five years later, three of them run their own agencies and publicly credit him as the reason.',
      'Camille started documenting her parenting philosophy in a private blog. It became a published book that helped 40,000 parents. She considers it her most important work.'
    ],
    howItApplies: 'Everything in your Empire — your business, your discipline, your health — serves a larger story. Legacy gives that story a meaning that survives the moment.',
    todayAction: 'Write two sentences: what you want people to say about you at your 80th birthday, and what you\'re actually doing today to earn that.',
    checklist: [
      'Write your legacy statement (2–3 sentences)',
      'Identify one person you could begin mentoring',
      'List one system in your life that runs without you already',
      'Identify one piece of lasting work you want to create',
      'Align one daily habit with your long-term legacy goal'
    ],
    children: ['define-your-legacy','long-term-vision','impact-vs-income','mentorship','giving-back','family-legacy','building-systems','creating-lasting-work'],
    connections: [
      {id:'faith', type:'supports'},
      {id:'business', type:'related'},
      {id:'mindset', type:'supports'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('intermediate'),
    lessonCount: 8,
    progress: 0,
    status: 'available'
  });

  /* ── 7. EBOOKS ──────────────────────────────────────── */
  add({
    id: 'ebooks',
    parentId: 'root',
    level: 1,
    title: 'Ebooks',
    icon: '📖',
    color: '#14b8a6',
    glow: 'rgba(20,184,166,0.4)',
    category: 'Ebooks',
    highlight: 'Writing an ebook is proof that you know something worth knowing.',
    whatYouLearn: [
      'How to find the exact topic your ebook should be about',
      'How to outline a complete ebook in one afternoon',
      'The writing process that eliminates perfectionism and produces a finished draft',
      'How to self-publish professionally on Amazon KDP with no upfront cost',
      'How to market your ebook so it sells while you sleep'
    ],
    coreLesson: `Writing an ebook is one of the most accessible paths to building a passive income stream and establishing credibility in your field. You don't need to be a professional writer. You need to know something useful and be willing to organize it clearly.

The best ebooks don't cover everything — they solve one specific problem for one specific person. "Make money online" is a topic. "How to earn your first $500 freelancing on Upwork this month as a complete beginner" is an ebook. The more specific the problem, the more urgently readers seek the solution.

Your process: Start with your reader's core frustration. Write down the ten questions someone asks before solving this problem. Your chapter outline is already there. Each question becomes a chapter. Each chapter answers that specific question completely and moves the reader forward.

Write fast on the first draft — quality editing happens after, not during. The enemy of any ebook is perfectionism during the drafting phase. Set a daily word target (500–1,000 words), write without editing, and finish the draft before revising a single line.

Publishing on Amazon KDP is free, takes under 30 minutes, and gives you global distribution immediately. Price your first ebook between $2.99 and $9.99. Lower prices generate more reviews and social proof; higher prices signal premium value.

Your ebook is not your income ceiling — it's your credibility entry point. From there, courses, coaching, and speaking all become accessible.`,
    examples: [
      'Nathaniel wrote a 58-page ebook on meal planning for athletes with busy schedules. He published it on KDP for $7.99. It earns him $200–$400/month passively with zero ongoing effort.',
      'Jasmine wrote a 40-page resume guide for recent graduates. She launched it to a 500-person email list and made $1,800 in the first week.'
    ],
    howItApplies: 'An ebook is the simplest digital product you can create. It establishes authority, generates passive income, and opens doors to larger offers in your Empire.',
    todayAction: 'Write the title and a 3-sentence description of an ebook you could write from knowledge you already have. That\'s your starting point.',
    checklist: [
      'Identify your ebook topic (specific problem, specific reader)',
      'Write a working title',
      'Outline 5–8 chapter questions',
      'Set a daily writing target and a completion date',
      'Create an Amazon KDP account (free)'
    ],
    children: ['finding-your-topic','outlining-your-book','writing-your-draft','editing-polishing','cover-design','publishing-kdp','marketing-ebook','passive-income-books'],
    connections: [
      {id:'business', type:'supports'},
      {id:'legacy', type:'related'},
      {id:'ai-plan-builder', type:'supports'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 8,
    progress: 0,
    status: 'available'
  });

  /* ── 8. AI PLAN BUILDER ─────────────────────────────── */
  add({
    id: 'ai-plan-builder',
    parentId: 'root',
    level: 1,
    title: 'AI Plan Builder',
    icon: '🤖',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.4)',
    category: 'AI Plan Builder',
    highlight: 'AI doesn\'t replace your work — it removes the friction between your ideas and execution.',
    whatYouLearn: [
      'What AI can and cannot do reliably for your business',
      'How to write prompts that produce useful, specific output rather than generic filler',
      'How to build repeatable AI workflows that save you hours each week',
      'The best AI tools for content, automation, planning, and research',
      'How to monetize AI skills in a market where most people are still confused by them'
    ],
    coreLesson: `AI is the most significant productivity multiplier most people are using wrong. The mistake is treating AI like a magic answer machine — ask a vague question, get a vague answer, decide it's not useful. The skill is treating AI like a junior team member who needs precise direction and context to produce excellent output.

Prompt engineering is the core skill. The quality of your output is almost entirely determined by the quality of your input. A good prompt has four elements: role (who the AI is playing), context (the situation and constraints), task (what specifically to produce), and format (how you want the output structured). Most people provide only the task and wonder why the result is mediocre.

AI workflows are where the real leverage lives. A workflow is a repeatable sequence: write a blog post → AI generates a Twitter thread from it → AI generates three email subject lines → AI generates a short-form video script. One piece of content, four outputs, 20 minutes instead of 4 hours.

For entrepreneurs, the highest-value AI applications are content repurposing, customer research synthesis, sales copy drafting, and administrative automation. These are the areas where hours are lost to work that AI can draft at a fraction of the time — leaving you to refine rather than create from scratch.

The people who monetize AI fastest are not the ones who know the most about AI. They're the ones who understand a domain well enough to evaluate AI output, direct it precisely, and apply it to real problems.`,
    examples: [
      'Brendan used AI to turn his 45-minute coaching calls into summary notes, action plans, and follow-up emails — automated. He saved 3 hours per client week without changing his coaching quality.',
      'Sofia used a structured AI prompt workflow to produce 12 weeks of social media content in a single afternoon. She went from posting twice a week to posting daily with no added effort.'
    ],
    howItApplies: 'AI is a force multiplier for every area of your Empire — your content, your plans, your business, your ebooks. Learn to use it well and you operate like a team of one.',
    todayAction: 'Open ChatGPT or Claude and write a prompt using all four elements: Role, Context, Task, Format. Compare the output to a vague prompt on the same topic.',
    checklist: [
      'Write one well-structured AI prompt using Role + Context + Task + Format',
      'Identify one repetitive task in your week that AI could draft',
      'Try one AI tool you\'ve never used before',
      'Build one repeatable AI workflow (even 2 steps)',
      'List three ways AI could save you 1+ hour this week'
    ],
    children: ['ai-basics','prompt-engineering','ai-content-creation','ai-automation','ai-tools-overview','ai-workflow','ai-ethics','monetizing-ai'],
    connections: [
      {id:'business', type:'supports'},
      {id:'ebooks', type:'supports'},
      {id:'discipline', type:'related'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 8,
    progress: 0,
    status: 'available'
  });

  /* ── 9. BUSINESS ────────────────────────────────────── */
  add({
    id: 'business',
    parentId: 'root',
    level: 1,
    title: 'Business',
    icon: '🏢',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.4)',
    category: 'Business',
    highlight: 'A business is not what you sell — it\'s the system you build around delivering value.',
    whatYouLearn: [
      'How to validate a business idea before spending a single dollar building it',
      'The five-step sales process that works whether you\'re selling $50 or $5,000',
      'Why most small businesses fail — and the one system that prevents it',
      'How to build a brand that attracts customers without constant outreach',
      'The path from solo operator to scalable business with systems and leverage'
    ],
    coreLesson: `Most people start a business backwards — they build the product first, then try to find the customers. The correct order is: find a specific group of people with a specific, painful, recurring problem, confirm they will pay to solve it, then build the simplest possible solution.

Validation before creation is the first law of business. Talk to ten potential customers before writing a single line of code or creating any content. Ask them what their biggest challenge is, how they currently solve it, and what a solution would be worth to them. Their language becomes your marketing. Their price point validates your model.

Sales is a skill, not a personality type. The fundamentals are universal: understand the customer's actual problem (not the symptom), show them a clear path from where they are to where they want to be, and make the decision to buy feel obviously correct given what they've shared with you. Pushy sales fails. Consultative sales scales.

Brand is not a logo — it's a reputation. What do people say about your business when you're not in the room? Brand is built through consistency: consistent quality, consistent communication, consistent values applied even under pressure. You cannot fake brand — you can only earn it.

Scaling requires systems. A business that requires you personally to function is not a business — it's a job with extra steps. Build processes, document them, and train others to execute them. Your goal is to make yourself progressively unnecessary in daily operations.`,
    examples: [
      'Kelvin tried to launch an app and spent $12,000 before finding out no one wanted it. He rebuilt his process: validated his next idea by pre-selling 20 spots at $97 before building anything. Sold out in 4 days.',
      'Rachel\'s coaching business was stuck at $4K/month because everything depended on her. She built an intake process, onboarding templates, and hired a VA. Revenue grew to $11K/month within 6 months.'
    ],
    howItApplies: 'Business is how you transform your skills and knowledge into financial independence. It is the commercial engine of your Empire.',
    todayAction: 'Write the exact person your business serves, the exact problem it solves, and the exact result it delivers. If you can\'t write these three things clearly, that\'s your first business problem.',
    checklist: [
      'Define your ideal customer in 2 sentences',
      'Write the specific problem you solve',
      'Identify your first offer and its price',
      'Talk to one potential customer this week',
      'List the one bottleneck most limiting your current growth'
    ],
    children: ['business-model','finding-customers','sales-fundamentals','marketing-basics','brand-building','product-creation','pricing-strategy','customer-retention','scaling','systems-sops'],
    connections: [
      {id:'financial', type:'related'},
      {id:'discipline', type:'requires'},
      {id:'ai-plan-builder', type:'supports'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('intermediate'),
    lessonCount: 10,
    progress: 0,
    status: 'available'
  });

  /* ── 10. FAITH ──────────────────────────────────────── */
  add({
    id: 'faith',
    parentId: 'root',
    level: 1,
    title: 'Faith',
    icon: '✨',
    color: '#7dd3fc',
    glow: 'rgba(125,211,252,0.4)',
    category: 'Faith',
    highlight: 'Purpose is not found — it\'s built, one faithful step at a time.',
    whatYouLearn: [
      'How to distinguish your calling from your ambitions — and why both matter',
      'The role of gratitude in maintaining clarity and momentum through adversity',
      'Why spiritual discipline and practical discipline reinforce each other',
      'How to act from faith when results aren\'t visible yet',
      'How community and accountability amplify personal growth'
    ],
    coreLesson: `Faith is not the belief that everything will be easy. Faith is the conviction that the work is worth doing even when it's hard, that meaning exists even in difficult seasons, and that you are equipped for more than you've accessed yet.

Purpose gives direction. The clearest leaders and highest performers across every field share one trait: they know why they're doing what they're doing. Not just what they want to achieve, but who they want to become and what impact that growth will have on others. When the "why" is strong enough, the "how" becomes a solvable problem.

Gratitude is not a soft skill — it is a cognitive reset. Neuroscience confirms that deliberately practicing gratitude shifts your brain's attention bias away from threat and toward possibility. People who practice gratitude daily report higher motivation, better sleep, stronger relationships, and greater resilience under pressure. It costs nothing and compounds.

Faith in action means taking the next step before seeing the full staircase. Most people wait for certainty before acting — and certainty rarely arrives on schedule. The pattern of high-achievers is consistent: act, observe, adjust, act again. The confidence follows the action; it does not precede it.

Spiritual discipline — prayer, reflection, meditation, scripture, stillness — builds what no external achievement can: a settled sense of identity and direction that doesn't fluctuate with results. This is the anchor that holds everything else together during hard seasons.`,
    examples: [
      'Michael was offered a high-paying job that conflicted with his values. He turned it down to launch something aligned with his purpose. It took 18 months of difficulty. It ultimately became his most meaningful and most profitable work.',
      'Nia started a daily 10-minute gratitude practice during the hardest year of her life. She credits it as the single habit that kept her building when everything felt like it was falling apart.'
    ],
    howItApplies: 'Your Empire needs an anchor. External success without internal purpose is noise. Faith gives your work a reason that outlasts any single result.',
    todayAction: 'Write your answer to this: "If money were not a factor, what work would I still do because it matters?" Keep that answer somewhere visible.',
    checklist: [
      'Write your purpose statement (why you are doing this)',
      'Start a 3-item daily gratitude practice — write it down, not just think it',
      'Identify one area where fear is disguised as "waiting for the right time"',
      'Connect with one person whose faith or purpose inspires you',
      'Schedule 10 minutes of daily stillness (prayer, meditation, reflection)'
    ],
    children: ['purpose-calling','gratitude-practice','prayer-intention','overcoming-doubt','faith-in-action','spiritual-discipline','community-connection','divine-timing'],
    connections: [
      {id:'mindset', type:'supports'},
      {id:'legacy', type:'supports'},
      {id:'self-mastery', type:'related'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 8,
    progress: 0,
    status: 'available'
  });

  /* ── 11. RELATIONSHIPS ──────────────────────────────── */
  add({
    id: 'relationships',
    parentId: 'root',
    level: 1,
    title: 'Relationships',
    icon: '🤝',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.4)',
    category: 'Relationships',
    highlight: 'The quality of your relationships is the quality of your life.',
    whatYouLearn: [
      'Why listening is a more powerful skill than speaking in almost every relationship',
      'How to have difficult conversations without damaging the relationship',
      'The mechanics of trust — how it\'s built and how quickly it\'s lost',
      'How to build a professional network that opens doors and creates opportunity',
      'How personal boundaries protect relationships rather than harm them'
    ],
    coreLesson: `Relationships are not a soft subject — they are the medium through which nearly every career opportunity, business deal, and personal breakthrough occurs. Research consistently shows that the strongest predictor of career success, happiness, and longevity is the quality of your close relationships.

Communication is the foundation. And the most neglected half of communication is listening — not the passive waiting-for-your-turn kind, but active listening that makes the other person feel genuinely understood before you offer any perspective of your own. People do not remember what you said nearly as much as they remember how you made them feel when you were speaking with them.

Trust is the currency of all relationships, professional and personal. It is built slowly through consistency — doing what you say you will do, being honest when it's uncomfortable, showing up reliably over time. It is destroyed quickly through dishonesty, inconsistency, or betrayal. The math is asymmetric: trust takes months to earn and minutes to lose.

Boundaries are not walls — they are the honest communication of what you need to show up fully. Resentment in relationships is almost always a sign of unexpressed needs. When you communicate clearly what you can and cannot give, you protect the relationship from the slow corrosion of unspoken expectations.

Network building is relationship building done with intentionality. The mistake most people make is networking transactionally — going to events to collect contacts they can use. The people who build real networks lead with value: what can I give, share, or connect for this person first?`,
    examples: [
      'Damon changed one habit in his team meetings: he asked each person "what\'s the biggest challenge you\'re facing right now?" before discussing business. Team retention went from 60% to 95% in two years.',
      'Lyra spent six months giving value in an online community before ever mentioning her services. When she did, she had three client inquiries within 48 hours from people who already trusted her work.'
    ],
    howItApplies: 'Your business grows through relationships. Your health is supported by relationships. Your legacy is defined by the people you helped. Invest here deliberately.',
    todayAction: 'Send one message today to someone you haven\'t connected with in over 3 months — not to ask for anything, but to check in genuinely.',
    checklist: [
      'Identify the one relationship you\'ve been neglecting most',
      'Practice active listening in one conversation today (ask follow-up questions, don\'t redirect to yourself)',
      'Express gratitude to one person who has helped you',
      'Identify one boundary you need to communicate more clearly',
      'Reach out to one person in your network you can genuinely help'
    ],
    children: ['communication-skills','active-listening','setting-boundaries','building-trust','conflict-resolution','network-building','romantic-relationships','family-dynamics'],
    connections: [
      {id:'self-mastery', type:'supports'},
      {id:'business', type:'supports'},
      {id:'confidence', type:'related'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 8,
    progress: 0,
    status: 'available'
  });

  /* ── 12. CONFIDENCE ─────────────────────────────────── */
  add({
    id: 'confidence',
    parentId: 'root',
    level: 1,
    title: 'Confidence',
    icon: '👑',
    color: '#eab308',
    glow: 'rgba(234,179,8,0.4)',
    category: 'Confidence',
    highlight: 'Confidence is not the absence of fear — it\'s the decision to act despite it.',
    whatYouLearn: [
      'Why confidence follows action rather than preceding it — and what that means for how you start',
      'How your body language affects your own psychology, not just others\' perception of you',
      'The difference between arrogance and genuine confidence — and why one repels while the other attracts',
      'How to eliminate social anxiety through systematic exposure rather than avoidance',
      'How competence and confidence compound to create unshakeable self-assurance'
    ],
    coreLesson: `Confidence is misunderstood as a trait — something you either have or don't. In reality, confidence is a skill that is built through repeated exposure to the things that scare you, combined with developing genuine competence in the areas that matter most to you.

The confidence-competence loop is the key mechanism: take action in an uncomfortable situation, survive it, accumulate evidence that you can handle it, feel slightly more confident next time, take a slightly harder action. Each cycle builds on the previous one. The people you perceive as naturally confident simply have more laps of this loop behind them.

Body language works backwards. Research by Amy Cuddy and others shows that adopting expansive, open posture doesn't just signal confidence to others — it changes your cortisol and testosterone levels, measurably altering how you feel and perform. Stand tall, take up space, slow down your movements. These physical shifts precede the emotional shift.

The most durable confidence is not derived from external validation — it's derived from alignment between your values and your actions. When you consistently do what you said you would do, keep the promises you make to yourself, and act according to your stated values, you build an internal credibility with yourself that no external approval can match or threaten.

Fear of judgment is the confidence killer for most people. The cure is not eliminating the fear — it's taking the action anyway, repeatedly, until the fear becomes background noise rather than a stop sign.`,
    examples: [
      'DeShawn avoided public speaking for years. He joined a local Toastmasters club and committed to speaking once a week. In 90 days, he gave a 15-minute talk at a company event without notes and received a standing ovation.',
      'Priscilla launched her first offer terrified of rejection. She sent 20 cold emails. Got 18 no-replies and 2 yeses. Those 2 clients became her first case studies. Her next launch closed 8 clients.'
    ],
    howItApplies: 'Confidence is what moves every other module from theory into action. You can know everything about business, finance, and mindset — but without the confidence to act, nothing changes.',
    todayAction: 'Do one thing today that you\'ve been avoiding because of fear of judgment or failure. It doesn\'t have to be big — it has to be real.',
    checklist: [
      'Identify one thing you\'ve been avoiding due to fear of judgment',
      'Do that thing today (or schedule it for this week)',
      'Practice power posture for 2 minutes before your next important interaction',
      'List 5 things you\'ve already done that required courage — evidence of your capability',
      'Write one commitment to yourself and keep it — this builds internal credibility'
    ],
    children: ['body-language','public-speaking','overcoming-fear','self-worth','assertiveness','action-despite-fear','social-skills','presentation-skills','building-competence'],
    connections: [
      {id:'mindset', type:'supports'},
      {id:'relationships', type:'supports'},
      {id:'self-mastery', type:'related'}
    ],
    estimatedMinutes: 15,
    difficulty: diff('beginner'),
    lessonCount: 9,
    progress: 0,
    status: 'available'
  });

  /* ══════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════ */
  return {
    version: 1,
    mainCategories: [
      'financial','discipline','mindset','health','self-mastery',
      'legacy','ebooks','ai-plan-builder','business','faith',
      'relationships','confidence'
    ],

    getById: function (id) { return _b[id] || null; },

    getChildren: function (id) {
      var bubble = _b[id];
      if (!bubble || !bubble.children) return [];
      return bubble.children.map(function (cid) { return _b[cid]; }).filter(Boolean);
    },

    getMainBubbles: function () {
      return this.mainCategories.map(function (id) { return _b[id]; }).filter(Boolean);
    },

    getRoot: function () { return _b['root']; },

    /* Add a custom bubble at runtime */
    addCustom: function (obj) {
      obj._custom = true;
      _b[obj.id] = obj;
      if (obj.parentId && _b[obj.parentId]) {
        _b[obj.parentId].children = _b[obj.parentId].children || [];
        if (_b[obj.parentId].children.indexOf(obj.id) === -1) {
          _b[obj.parentId].children.push(obj.id);
        }
      }
    },

    /* Remove a custom bubble */
    removeCustom: function (id) {
      var b = _b[id];
      if (!b || !b._custom) return false;
      if (b.parentId && _b[b.parentId]) {
        _b[b.parentId].children = (_b[b.parentId].children || []).filter(function (c) { return c !== id; });
      }
      delete _b[id];
      return true;
    },

    /* Get all bubbles as flat array (for search) */
    all: function () { return Object.keys(_b).map(function (k) { return _b[k]; }); },

    /* Internal registry — don't modify directly */
    _bubbles: _b
  };

})();
