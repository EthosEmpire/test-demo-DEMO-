const ebookData = [
  { title: "Built by Money", page: "https://ethosempire.gumroad.com/l/builtbymoney?layout=profile", link: "https://ethosempire.gumroad.com/l/builtbymoney?layout=profile", desc: "Learn how to build financial discipline, control your spending, and develop a long-term wealth mindset that helps you stay focused on growth.", preview: "Money habits • long game • self-control", image320: "images/ethos-empire-built-by-money-ebook-cover-320.webp", image1200: "images/ethos-empire-built-by-money-ebook-cover-1200.webp", alt: "Built by Money ebook cover financial discipline wealth mindset for men" },
  { title: "Command the Room", page: "https://ethosempire.gumroad.com/l/commandtheroom?layout=profile", link: "https://ethosempire.gumroad.com/l/commandtheroom?layout=profile", desc: "Build confidence, presence, and social strength so you can carry yourself with more authority in any room you walk into.", preview: "Presence • charisma • social strength", image320: "images/ethos-empire-command-the-room-ebook-cover-320.webp", image1200: "images/ethos-empire-command-the-room-ebook-cover-1200.webp", alt: "Command the Room ebook cover confidence presence social strength" },
  { title: "Confidence Guide", page: "https://ethosempire.gumroad.com/l/howtobeconfidence?layout=profile", link: "https://ethosempire.gumroad.com/l/howtobeconfidence?layout=profile", desc: "Develop real confidence through better habits, stronger self-belief, and a sharper mindset that carries into everyday life.", preview: "Habits • self-belief • sharp mindset", image320: "images/ethos-empire-confidence-guide-ebook-cover-320.webp", image1200: "images/ethos-empire-confidence-guide-ebook-cover-1200.webp", alt: "Confidence Guide ebook cover self belief mindset personal growth" },
  { title: "The Philosophy of Becoming", page: "https://ethosempire.gumroad.com/l/thephilosophyofbecoming?layout=profile", link: "https://ethosempire.gumroad.com/l/thephilosophyofbecoming?layout=profile", desc: "Explore the mindset, discipline, and personal standards needed to become stronger, sharper, and more intentional in how you live.", preview: "Mindset • discipline • becoming", image320: "images/ethos-empire-philosophy-of-becoming-ebook-cover-320.webp", image1200: "images/ethos-empire-philosophy-of-becoming-ebook-cover-1200.webp", alt: "The Philosophy of Becoming ebook cover mindset discipline personal growth" },
  { title: "Life Lessons in Faith", page: "https://ethosempire.gumroad.com/l/lifelessonsinfaith?layout=profile", link: "https://ethosempire.gumroad.com/l/lifelessonsinfaith?layout=profile", desc: "Explore purpose, discipline, and belief with a guide that connects inner strength to a more grounded way of living.", preview: "Faith • purpose • inner strength", image320: "images/ethos-empire-life-lessons-in-faith-ebook-cover-320.webp", image1200: "images/ethos-empire-life-lessons-in-faith-ebook-cover-1200.webp", alt: "Life Lessons in Faith ebook cover purpose discipline belief" },
  { title: "The Relationship Code", page: "https://ethosempire.gumroad.com/l/therelationshipcode?layout=profile", link: "https://ethosempire.gumroad.com/l/therelationshipcode?layout=profile", desc: "Learn how to communicate better, build attraction, and approach relationships with more clarity and confidence.", preview: "Communication • attraction • clarity", image320: "images/ethos-empire-relationship-code-ebook-cover-320.webp", image1200: "images/ethos-empire-relationship-code-ebook-cover-1200.webp", alt: "The Relationship Code ebook cover communication attraction confidence" },
  { title: "The Architecture of Health", page: "https://ethosempire.gumroad.com/l/thearchitechtureofhealth?layout=profile", link: "https://ethosempire.gumroad.com/l/thearchitechtureofhealth?layout=profile", desc: "Build a better body and clearer mind through habits that support energy, training, nutrition, and long-term health.", preview: "Training • nutrition • energy", image320: "images/ethos-empire-architecture-of-health-ebook-cover-320.webp", image1200: "images/ethos-empire-architecture-of-health-ebook-cover-1200.webp", alt: "The Architecture of Health ebook cover fitness nutrition wellness habits" },
  { title: "The Gym Mindset", page: "https://ethosempire.gumroad.com/l/thegymmindset?layout=profile", link: "https://ethosempire.gumroad.com/l/thegymmindset?layout=profile", desc: "Train with more consistency, discipline, and purpose so your gym routine turns into real progress over time.", preview: "Discipline • progress • consistency", image320: "images/ethos-empire-gym-mindset-ebook-cover-320.webp", image1200: "images/ethos-empire-gym-mindset-ebook-cover-1200.webp", alt: "The Gym Mindset ebook cover training discipline consistency progress" },
  { title: "The Clear Skin Guide", page: "https://ethosempire.gumroad.com/l/theclearskinguide?layout=profile", link: "https://ethosempire.gumroad.com/l/theclearskinguide?layout=profile", desc: "Improve your skincare routine with practical steps that help you build healthier skin and better daily habits.", preview: "Routine • healthy skin • consistency", image320: "images/ethos-empire-clear-skin-guide-ebook-cover-320.webp", image1200: "images/ethos-empire-clear-skin-guide-ebook-cover-1200.webp", alt: "The Clear Skin Guide ebook cover skincare routine healthy skin habits" },
  { title: "Looksmaxxing Guide", page: "https://ethosempire.gumroad.com/l/thelooksmaxxingguide?layout=profile", link: "https://ethosempire.gumroad.com/l/thelooksmaxxingguide?layout=profile", desc: "Level up your appearance with a sharper approach to style, grooming, confidence, and self-presentation.", preview: "Style • grooming • confidence", image320: "images/ethos-empire-looksmaxxing-guide-ebook-cover-320.webp", image1200: "images/ethos-empire-looksmaxxing-guide-ebook-cover-1200.webp", alt: "Looksmaxxing Guide ebook cover style grooming attraction appearance" },
  { title: "The Hair Care Blueprint", page: "https://ethosempire.gumroad.com/l/thehaircareblueprint?layout=profile", link: "https://ethosempire.gumroad.com/l/thehaircareblueprint?layout=profile", desc: "Take better care of your hair with a simple approach to grooming, maintenance, and a cleaner overall look.", preview: "Grooming • maintenance • cleaner look", image320: "images/ethos-empire-hair-care-blueprint-ebook-cover-320.webp", image1200: "images/ethos-empire-hair-care-blueprint-ebook-cover-1200.webp", alt: "The Hair Care Blueprint ebook cover grooming styling hair health" }
];

const merchData = [
  { title: "Black Hoodie", image: "images/ethos-empire-hoodie-black-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-black-gold-logo-1200.webp", alt: "Ethos Empire black hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Minimal look • gold emblem • daily wear" },
  { title: "Bone Hoodie", image: "images/ethos-empire-hoodie-bone-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-bone-gold-logo-1200.webp", alt: "Ethos Empire bone hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Soft tone • clean fit • legacy style" },
  { title: "Latte Hoodie", image: "images/ethos-empire-hoodie-latte-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-latte-gold-logo-1200.webp", alt: "Ethos Empire latte hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Warm neutral • premium feel • clean finish" },
  { title: "Lavender Hoodie", image: "images/ethos-empire-hoodie-lavender-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-lavender-gold-logo-1200.webp", alt: "Ethos Empire lavender hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Bold color • soft edge • standout piece" },
  { title: "Navy Hoodie", image: "images/ethos-empire-hoodie-navy-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-navy-gold-logo-1200.webp", alt: "Ethos Empire navy hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Dark tone • sharp contrast • versatile" },
  { title: "Oatmeal Hoodie", image: "images/ethos-empire-hoodie-oatmeal-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-oatmeal-gold-logo-1200.webp", alt: "Ethos Empire oatmeal hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Neutral color • easy fit • everyday piece" },
  { title: "Vintage Hoodie", image: "images/ethos-empire-hoodie-vintage-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-vintage-gold-logo-1200.webp", alt: "Ethos Empire vintage hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Classic tone • old-school feel • clean logo" },
  { title: "White Hoodie", image: "images/ethos-empire-hoodie-white-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-white-gold-logo-1200.webp", alt: "Ethos Empire white hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Bright color • crisp look • gold detail" },
  { title: "Pink Hoodie", image: "images/ethos-empire-hoodie-pink-gold-logo-400.webp", imageLarge: "images/ethos-empire-hoodie-pink-gold-logo-1200.webp", alt: "Ethos Empire pink hoodie with gold logo minimalist streetwear", link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie", preview: "Soft color • bold contrast • fresh style" }
];

/* =========================================
   TRANSFORM-BASED CAROUSEL ENGINE
   Uses translateX — no scrollLeft at all.
   Works identically on iOS, Android, desktop.
   ========================================= */

function updateCenteredCard(wrapper, itemSelector) {
  if (!wrapper) return;
  const cards = Array.from(wrapper.querySelectorAll(itemSelector));
  if (cards.length === 0) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const center = wrapperRect.left + wrapperRect.width / 2;
  let closestCard = null;
  let closestDistance = Infinity;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(center - cardCenter);
    card.classList.toggle("is-near", distance < rect.width * 1.1);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
    }
  });

  cards.forEach((card) => {
    card.classList.toggle("is-centered", card === closestCard);
  });
}

function buildLoopedCarouselMarkup(items, mode) {
  const copies = 3;
  return Array.from({ length: copies }, (_, copy) =>
    items.map((item, index) => {
      if (mode === "ebook") {
        return `<article class="ebook-card" data-loop-index="${index}" data-loop-copy="${copy}" data-ebook-index="${index}" role="button" tabindex="0" aria-label="Open ${item.title} details">
            <span class="card-eyebrow">Read</span>
            <span class="card-preview">${item.preview}</span>
            <img src="${item.image320}" srcset="${item.image320} 320w, ${item.image1200} 1200w" sizes="(max-width: 767px) 140px, 160px" alt="${item.alt}" width="160" height="226" loading="lazy" decoding="async" draggable="false">
            <a href="${item.page || item.link}" target="_blank" rel="noopener noreferrer bookmark" class="ebook-card-title">${item.title}</a>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="buy-btn">Buy</a>
          </article>`;
      }
      return `<article class="ebook-card" data-loop-index="${index}" data-loop-copy="${copy}" data-merch-index="${index}" role="button" tabindex="0" aria-label="Open ${item.title} details">
          <span class="card-eyebrow">Wear</span>
          <span class="card-preview is-merch">${item.preview}</span>
          <img src="${item.image}" srcset="${item.image} 400w, ${item.imageLarge} 1200w" sizes="(max-width: 767px) 140px, 160px" alt="${item.alt}" width="160" height="226" loading="lazy" decoding="async" draggable="false">
          <a href="${item.link}" target="_blank" rel="noopener noreferrer bookmark" class="ebook-card-title">${item.title}</a>
          <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="buy-btn">Buy</a>
        </article>`;
    }).join("")
  ).join("");
}

function bindCarouselCardEvents(track, selector, openerName) {
  track.querySelectorAll(selector).forEach((card) => {
    const open = () => {
      const fn = window[openerName];
      if (typeof fn === "function") fn(Number(card.dataset.loopIndex));
    };
    card.addEventListener("click", (e) => {
      const wrapper = card.closest(".ebook-wrapper");
      const suppress = Number(wrapper?.dataset.suppressClickUntil || 0);
      if (performance.now() < suppress) { e.preventDefault(); return; }
      if (e.target.closest("a")) return;
      open();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
}

function renderEbookCards() {
  const track = document.getElementById("ebookTrack");
  if (!track) return;
  track.innerHTML = buildLoopedCarouselMarkup(ebookData, "ebook");
  bindCarouselCardEvents(track, "[data-ebook-index]", "openEbookModal");
}

function renderMerchCards() {
  const track = document.getElementById("merchTrack");
  if (!track) return;
  track.innerHTML = buildLoopedCarouselMarkup(merchData, "merch");
  bindCarouselCardEvents(track, "[data-merch-index]", "openMerchModal");
}

/* -----------------------------------------
   Core carousel — transform: translateX
   ----------------------------------------- */

function setupTransformCarousel(config) {
  const wrapper = document.getElementById(config.wrapperId);
  const track = document.getElementById(config.trackId);
  if (!wrapper || !track || config.items.length < 2) return;

  // Force wrapper to clip (not scroll)
  wrapper.style.overflow = "hidden";

  let pos = 0;
  let setWidth = 0;
  let rafId = 0;
  let isInteracting = false;
  let resumeAt = 0;
  let suppressClickUntil = 0;

  let pointerDown = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let dragMoved = false;
  let dragIntent = null;

  function measure() {
    const cards = track.querySelectorAll(".ebook-card");
    if (cards.length < 2) return;
    const r0 = cards[0].getBoundingClientRect();
    const r1 = cards[1].getBoundingClientRect();
    const step = r1.left - r0.left;
    if (step <= 0) return;
    setWidth = step * config.items.length;
    pos = setWidth;
    apply();
  }

  function apply() {
    track.style.transform = "translateX(" + (-Math.round(pos)) + "px)";
  }

  function normalize() {
    if (setWidth <= 0) return;
    if (pos >= setWidth * 2) pos -= setWidth;
    if (pos < 0) pos += setWidth;
  }

  function focus() {
    updateCenteredCard(wrapper, ".ebook-card");
  }

  // --- Animation ---

  function tick() {
    if (!isInteracting && setWidth > 0 && performance.now() >= resumeAt) {
      pos += config.speed * config.direction;
      normalize();
      apply();
      focus();
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  // --- Pointer handling ---

  function down(cx, cy, isTouch) {
    pointerDown = true;
    dragMoved = false;
    startX = cx;
    startY = cy;
    lastX = cx;
    dragIntent = isTouch ? null : "horizontal";
    isInteracting = true;
    wrapper.classList.add("dragging");
  }

  function move(cx, cy, evt, isTouch) {
    if (!pointerDown) return;

    const dx = cx - startX;
    const dy = cy - startY;

    if (isTouch && dragIntent === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      dragIntent = Math.abs(dx) >= Math.abs(dy) ? "horizontal" : "vertical";
    }

    if (dragIntent === "vertical") return;

    if (isTouch && evt?.cancelable) evt.preventDefault();

    const delta = cx - lastX;
    lastX = cx;
    if (Math.abs(delta) > 0.5) dragMoved = true;

    pos -= delta;
    normalize();
    apply();
    focus();
  }

  function up() {
    if (!pointerDown) return;
    pointerDown = false;

    const wasDrag = dragIntent !== "vertical" && dragMoved;
    wrapper.classList.remove("dragging");
    dragIntent = null;
    dragMoved = false;
    isInteracting = false;

    if (wasDrag) {
      suppressClickUntil = performance.now() + 300;
      wrapper.dataset.suppressClickUntil = String(suppressClickUntil);
      resumeAt = performance.now() + 900;
    } else {
      wrapper.dataset.suppressClickUntil = "0";
      resumeAt = performance.now() + 200;
    }

    normalize();
    apply();
    focus();
  }

  // Mouse
  wrapper.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    down(e.clientX, e.clientY, false);
  });
  window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY, e, false));
  window.addEventListener("mouseup", up);
  window.addEventListener("blur", up);

  // Touch
  wrapper.addEventListener("touchstart", (e) => {
    if (!e.touches[0]) return;
    down(e.touches[0].clientX, e.touches[0].clientY, true);
  }, { passive: true });
  wrapper.addEventListener("touchmove", (e) => {
    if (!e.touches[0]) return;
    move(e.touches[0].clientX, e.touches[0].clientY, e, true);
  }, { passive: false });
  wrapper.addEventListener("touchend", up, { passive: true });
  wrapper.addEventListener("touchcancel", up, { passive: true });

  // Click suppression after drag
  wrapper.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (performance.now() < suppressClickUntil) e.preventDefault();
    });
  });

  // --- Lifecycle ---

  function init() {
    measure();
    focus();
    start();
  }

  track.querySelectorAll("img").forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", () => { measure(); focus(); }, { once: true });
      img.addEventListener("error", () => { measure(); focus(); }, { once: true });
    }
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { measure(); focus(); }, 100);
  });
  window.addEventListener("orientationchange", () => {
    setTimeout(() => { measure(); focus(); }, 150);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stop(); } else { measure(); focus(); start(); }
  });
  window.addEventListener("pageshow", () => {
    measure(); focus(); if (!rafId) start();
  });

  wrapper.querySelectorAll(".ebook-card").forEach((card) => {
    card.addEventListener("pointerenter", focus);
  });

  init();
  setTimeout(() => { measure(); focus(); }, 250);
  setTimeout(() => { measure(); focus(); }, 900);
}

/* -----------------------------------------
   Init
   ----------------------------------------- */

function initCarousels() {
  renderEbookCards();
  renderMerchCards();

  const isPhone = window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(pointer: coarse)").matches;

  setupTransformCarousel({
    wrapperId: "ebookWrapper",
    trackId: "ebookTrack",
    items: ebookData,
    speed: isPhone ? 0.6 : 0.5,
    direction: 1
  });

  setupTransformCarousel({
    wrapperId: "merchWrapper",
    trackId: "merchTrack",
    items: merchData,
    speed: isPhone ? 0.55 : 0.5,
    direction: -1
  });
}

window.ebookData = ebookData;
window.merchData = merchData;
window.initCarousels = initCarousels;

document.addEventListener("DOMContentLoaded", initCarousels);