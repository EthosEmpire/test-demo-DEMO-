const introOverlay = document.getElementById("introOverlay");
const introCanvas = document.getElementById("matrixCanvas");
const introCtx = introCanvas ? introCanvas.getContext("2d") : null;
const introContent = document.querySelector(".intro-content");

const INTRO_CLOSE_DURATION = 1100;
const MATRIX_CHARSET = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ0123456789<>+-=*";

let introClosing = false;
let introCloseStart = 0;
let introAnimationFrame = 0;
let introFontSize = 16;
let introColumns = [];
let introParticles = [];
let introLastFrameTime = 0;

function randomMatrixChar() {
  return MATRIX_CHARSET[Math.floor(Math.random() * MATRIX_CHARSET.length)];
}

function resizeIntroCanvas() {
  if (!introCanvas || !introCtx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  introCanvas.width = Math.floor(width * dpr);
  introCanvas.height = Math.floor(height * dpr);
  introCanvas.style.width = "100%";
  introCanvas.style.height = "100%";

  introCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  introFontSize = Math.max(12, Math.min(16, width / 110));
  const cols = Math.ceil(width / introFontSize) + 14;

  introColumns = Array.from({ length: cols }, (_, i) => ({
    x: i * introFontSize,
    y: Math.random() * (height + 220) - 220,
    speed: 52 + Math.random() * 36,
    length: 14 + Math.floor(Math.random() * 10),
    glyphs: Array.from({ length: 30 }, randomMatrixChar)
  }));

  introLastFrameTime = performance.now();
}

function drawMatrixLayer(width, height, visibility, delta) {
  if (!introCtx) return;

  introCtx.fillStyle = `rgba(0, 0, 0, ${introClosing ? 0.12 * visibility : 0.065})`;
  introCtx.fillRect(0, 0, width, height);

  introCtx.font = `700 ${introFontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  introCtx.textBaseline = "top";

  for (const col of introColumns) {
    for (let i = 0; i < col.length; i += 1) {
      const y = col.y - i * introFontSize * 1.12;
      if (y < -40 || y > height + 40) continue;

      if (Math.random() > 0.972) {
        col.glyphs[i] = randomMatrixChar();
      }

      const trailStrength = 1 - i / col.length;

      if (i === 0) {
        introCtx.shadowColor = "rgba(210, 255, 225, 0.45)";
        introCtx.shadowBlur = 12;
        introCtx.fillStyle = `rgba(236, 255, 244, ${0.96 * visibility})`;
      } else {
        introCtx.shadowColor = "rgba(100, 255, 160, 0.16)";
        introCtx.shadowBlur = 6;
        introCtx.fillStyle = `rgba(120, 255, 170, ${0.48 * trailStrength * visibility})`;
      }

      introCtx.fillText(col.glyphs[i], col.x, y);
    }

    col.y += col.speed * delta;

    if (col.y - col.length * introFontSize * 1.12 > height + 80) {
      col.y = -Math.random() * 180;
      col.length = 14 + Math.floor(Math.random() * 10);
    }
  }
}

function spawnDustBurst() {
  if (!introContent) return;

  const rect = introContent.getBoundingClientRect();
  const count = 110;
  introParticles = [];

  for (let i = 0; i < count; i += 1) {
    introParticles.push({
      x: rect.left + Math.random() * rect.width,
      y: rect.top + Math.random() * rect.height * 0.85,
      vx: (Math.random() - 0.5) * 0.85,
      vy: -(0.28 + Math.random() * 1.05),
      size: 0.7 + Math.random() * 1.8,
      life: 1,
      decay: 0.006 + Math.random() * 0.006,
      swirl: (Math.random() - 0.5) * 0.016
    });
  }
}

function drawDustLayer(visibility) {
  if (!introCtx || introParticles.length === 0) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  introCtx.save();
  introCtx.globalCompositeOperation = "lighter";

  for (const p of introParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy -= 0.0015;
    p.vx += p.swirl;
    p.life -= p.decay;

    const alpha = Math.max(0, p.life) * visibility;
    if (alpha <= 0) continue;

    introCtx.beginPath();
    introCtx.fillStyle = `rgba(255, 220, 135, ${alpha})`;
    introCtx.shadowColor = "rgba(255, 215, 0, 0.28)";
    introCtx.shadowBlur = 8;
    introCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    introCtx.fill();
  }

  introCtx.restore();

  introParticles = introParticles.filter(
    (p) =>
      p.life > 0 &&
      p.y > -60 &&
      p.x > -60 &&
      p.x < width + 60 &&
      p.y < height + 60
  );
}

function animateIntro(now) {
  if (!introCtx || !introCanvas || !introOverlay) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const delta = Math.min(0.033, ((now - introLastFrameTime) / 1000) || 0.016);
  introLastFrameTime = now;

  const closeProgress = introClosing
    ? Math.min(1, (now - introCloseStart) / INTRO_CLOSE_DURATION)
    : 0;

  const visibility = 1 - closeProgress;

  introCtx.clearRect(0, 0, width, height);
  drawMatrixLayer(width, height, visibility, delta);

  if (introParticles.length > 0) {
    drawDustLayer(visibility);
  }

  if (!introClosing || closeProgress < 1 || introParticles.length > 0) {
    introAnimationFrame = requestAnimationFrame(animateIntro);
  }
}

function closeIntroOverlay() {
  if (!introOverlay || introClosing) return;

  introClosing = true;
  introCloseStart = performance.now();
  introOverlay.classList.add("is-closing");
  introOverlay.setAttribute("aria-hidden", "true");
  spawnDustBurst();

  window.setTimeout(() => {
    document.body.classList.remove("intro-locked");
    if (introAnimationFrame) cancelAnimationFrame(introAnimationFrame);
    introOverlay.remove();
  }, INTRO_CLOSE_DURATION + 80);
}

function setupIntroOverlay() {
  if (!introOverlay) return;

  document.body.classList.add("intro-locked");
  introOverlay.setAttribute("aria-hidden", "false");

  resizeIntroCanvas();
  introAnimationFrame = requestAnimationFrame(animateIntro);

  const dismiss = (e) => {
    e?.preventDefault?.();
    closeIntroOverlay();
  };

  introOverlay.addEventListener("pointerup", dismiss, { once: true });

  introOverlay.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
      dismiss(e);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeIntroOverlay();
  });

  window.addEventListener("resize", resizeIntroCanvas);
}

const ebookData = [
  {
    title: "Built by Money",
    page: "https://ethosempire.gumroad.com/l/builtbymoney?layout=profile",
    link: "https://ethosempire.gumroad.com/l/builtbymoney?layout=profile",
    desc: "Learn how to build financial discipline, control your spending, and develop a long-term wealth mindset that helps you stay focused on growth.",
    image320: "images/ethos-empire-built-by-money-ebook-cover-320.webp",
    image1200: "images/ethos-empire-built-by-money-ebook-cover-1200.webp",
    alt: "Built by Money ebook cover financial discipline wealth mindset for men"
  },
  {
    title: "Command the Room",
    page: "https://ethosempire.gumroad.com/l/commandtheroom?layout=profile",
    link: "https://ethosempire.gumroad.com/l/commandtheroom?layout=profile",
    desc: "Build confidence, presence, and social strength so you can carry yourself with more authority in any room you walk into.",
    image320: "images/ethos-empire-command-the-room-ebook-cover-320.webp",
    image1200: "images/ethos-empire-command-the-room-ebook-cover-1200.webp",
    alt: "Command the Room ebook cover confidence presence social strength"
  },
  {
    title: "Confidence Guide",
    page: "https://ethosempire.gumroad.com/l/howtobeconfidence?layout=profile",
    link: "https://ethosempire.gumroad.com/l/howtobeconfidence?layout=profile",
    desc: "Develop real confidence through better habits, stronger self-belief, and a sharper mindset that carries into everyday life.",
    image320: "images/ethos-empire-confidence-guide-ebook-cover-320.webp",
    image1200: "images/ethos-empire-confidence-guide-ebook-cover-1200.webp",
    alt: "Confidence Guide ebook cover self belief mindset personal growth"
  },
  {
    title: "Life Lessons in Faith",
    page: "https://ethosempire.gumroad.com/l/lifelessonsinfaith?layout=profile",
    link: "https://ethosempire.gumroad.com/l/lifelessonsinfaith?layout=profile",
    desc: "Explore purpose, discipline, and belief with a guide that connects inner strength to a more grounded way of living.",
    image320: "images/ethos-empire-life-lessons-in-faith-ebook-cover-320.webp",
    image1200: "images/ethos-empire-life-lessons-in-faith-ebook-cover-1200.webp",
    alt: "Life Lessons in Faith ebook cover purpose discipline belief"
  },
  {
    title: "The Relationship Code",
    page: "https://ethosempire.gumroad.com/l/therelationshipcode?layout=profile",
    link: "https://ethosempire.gumroad.com/l/therelationshipcode?layout=profile",
    desc: "Learn how to communicate better, build attraction, and approach relationships with more clarity and confidence.",
    image320: "images/ethos-empire-relationship-code-ebook-cover-320.webp",
    image1200: "images/ethos-empire-relationship-code-ebook-cover-1200.webp",
    alt: "The Relationship Code ebook cover communication attraction confidence"
  },
  {
    title: "The Architecture of Health",
    page: "https://ethosempire.gumroad.com/l/thearchitechtureofhealth?layout=profile",
    link: "https://ethosempire.gumroad.com/l/thearchitechtureofhealth?layout=profile",
    desc: "Create stronger health habits with a practical guide focused on fitness, nutrition, and wellness routines that last.",
    image320: "images/ethos-empire-architecture-of-health-ebook-cover-320.webp",
    image1200: "images/ethos-empire-architecture-of-health-ebook-cover-1200.webp",
    alt: "The Architecture of Health ebook cover fitness nutrition wellness habits"
  },
  {
    title: "The Gym Mindset",
    page: "https://ethosempire.gumroad.com/l/thegymmindset?layout=profile",
    link: "https://ethosempire.gumroad.com/l/thegymmindset?layout=profile",
    desc: "Train with discipline, consistency, and intensity so your workouts turn into real progress instead of temporary motivation.",
    image320: "images/ethos-empire-gym-mindset-ebook-cover-320.webp",
    image1200: "images/ethos-empire-gym-mindset-ebook-cover-1200.webp",
    alt: "The Gym Mindset ebook cover training discipline consistency progress"
  },
  {
    title: "The Clear Skin Guide",
    page: "https://ethosempire.gumroad.com/l/theclearskinguide?layout=profile",
    link: "https://ethosempire.gumroad.com/l/theclearskinguide?layout=profile",
    desc: "Build a simple skincare routine and healthy skin habits that support a cleaner, sharper, more confident look.",
    image320: "images/ethos-empire-clear-skin-guide-ebook-cover-320.webp",
    image1200: "images/ethos-empire-clear-skin-guide-ebook-cover-1200.webp",
    alt: "The Clear Skin Guide ebook cover skincare routine healthy skin habits"
  },
  {
    title: "The Hair Care Blueprint",
    page: "https://ethosempire.gumroad.com/l/thehaircareblueprint?layout=profile",
    link: "https://ethosempire.gumroad.com/l/thehaircareblueprint?layout=profile",
    desc: "Improve hair health, grooming, and styling with a guide built to help you look more put together every day.",
    image320: "images/ethos-empire-hair-care-blueprint-ebook-cover-320.webp",
    image1200: "images/ethos-empire-hair-care-blueprint-ebook-cover-1200.webp",
    alt: "The Hair Care Blueprint ebook cover grooming styling hair health"
  },
  {
    title: "Looksmaxxing Guide",
    page: "https://ethosempire.gumroad.com/l/thelooksmaxxingguide?layout=profile",
    link: "https://ethosempire.gumroad.com/l/thelooksmaxxingguide?layout=profile",
    desc: "Level up your appearance with practical advice on style, grooming, and attraction that helps you look your best.",
    image320: "images/ethos-empire-looksmaxxing-guide-ebook-cover-320.webp",
    image1200: "images/ethos-empire-looksmaxxing-guide-ebook-cover-1200.webp",
    alt: "Looksmaxxing Guide ebook cover style grooming attraction appearance"
  }
];

const merchData = [
  {
    title: "Black Hoodie",
    image: "images/ethos-empire-hoodie-black-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-black-gold-logo-1200.webp",
    alt: "Ethos Empire black hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  },
  {
    title: "Bone Hoodie",
    image: "images/ethos-empire-hoodie-bone-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-bone-gold-logo-1200.webp",
    alt: "Ethos Empire bone hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  },
  {
    title: "Latte Hoodie",
    image: "images/ethos-empire-hoodie-latte-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-latte-gold-logo-1200.webp",
    alt: "Ethos Empire latte hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  },
  {
    title: "Lavender Hoodie",
    image: "images/ethos-empire-hoodie-lavender-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-lavender-gold-logo-1200.webp",
    alt: "Ethos Empire lavender hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  },
  {
    title: "Navy Hoodie",
    image: "images/ethos-empire-hoodie-navy-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-navy-gold-logo-1200.webp",
    alt: "Ethos Empire navy hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  },
  {
    title: "Oatmeal Hoodie",
    image: "images/ethos-empire-hoodie-oatmeal-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-oatmeal-gold-logo-1200.webp",
    alt: "Ethos Empire oatmeal hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  },
  {
    title: "Vintage Hoodie",
    image: "images/ethos-empire-hoodie-vintage-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-vintage-gold-logo-1200.webp",
    alt: "Ethos Empire vintage hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  },
  {
    title: "White Hoodie",
    image: "images/ethos-empire-hoodie-white-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-white-gold-logo-1200.webp",
    alt: "Ethos Empire white hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  },
  {
    title: "Pink Hoodie",
    image: "images/ethos-empire-hoodie-pink-gold-logo-400.webp",
    imageLarge: "images/ethos-empire-hoodie-pink-gold-logo-1200.webp",
    alt: "Ethos Empire pink hoodie with gold logo minimalist streetwear",
    link: "https://ethosempireo.printful.me/product/ethos-unisex-hoodie"
  }
];

let currentEbookIndex = 0;
let currentMerchIndex = 0;

const $ = (id) => document.getElementById(id);

function renderEbookCards() {
  const track = $("ebookTrack");
  if (!track) return;

  track.innerHTML = ebookData.map((item, index) => `
    <article class="ebook-card" data-ebook-index="${index}" role="button" tabindex="0" aria-label="Open ${item.title} details">
      <img
        src="${item.image320}"
        srcset="${item.image320} 320w, ${item.image1200} 1200w"
        sizes="(max-width: 767px) 140px, 160px"
        alt="${item.alt}"
        width="160"
        height="226"
        loading="lazy"
        decoding="async"
        draggable="false"
      >
      <a href="${item.page || item.link}" target="_blank" rel="noopener noreferrer bookmark" class="mt-3 text-[#FFD700] font-semibold leading-tight hover:text-[#FFE082] transition">
        ${item.title}
      </a>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="buy-btn">Buy</a>
    </article>
  `).join("");

  track.querySelectorAll("[data-ebook-index]").forEach((card) => {
    const open = () => openEbookModal(Number(card.dataset.ebookIndex));

    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      open();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

function renderMerchCards() {
  const track = $("merchTrack");
  if (!track) return;

  track.innerHTML = merchData.map((item, index) => `
    <article class="ebook-card" data-merch-index="${index}" role="button" tabindex="0" aria-label="Open ${item.title} details">
      <img
        src="${item.image}"
        srcset="${item.image} 400w, ${item.imageLarge} 1200w"
        sizes="(max-width: 767px) 140px, 160px"
        alt="${item.alt}"
        width="160"
        height="226"
        loading="lazy"
        decoding="async"
        draggable="false"
      >
      <a href="${item.link}" target="_blank" rel="noopener noreferrer bookmark" class="mt-3 text-[#FFD700] font-semibold leading-tight hover:text-[#FFE082] transition">
        ${item.title}
      </a>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="buy-btn">Buy</a>
    </article>
  `).join("");

  track.querySelectorAll("[data-merch-index]").forEach((card) => {
    const open = () => openMerchModal(Number(card.dataset.merchIndex));

    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      open();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

function openEbookModal(index) {
  currentEbookIndex = index;
  const item = ebookData[index];

  const modalCover = $("ebookModalCover");
  modalCover.src = item.image1200 || item.image320;
  modalCover.srcset = `${item.image320} 320w, ${item.image1200} 1200w`;
  modalCover.sizes = "(max-width: 767px) 90vw, 280px";
  modalCover.alt = item.alt;

  $("ebookModalTitle").textContent = item.title;
  $("ebookModalDesc").textContent = item.desc;
  $("ebookModalPage").href = item.page;
  $("ebookModalBuy").href = item.link;
  $("ebookModal").classList.add("open");
  $("ebookModal").setAttribute("aria-hidden", "false");
}

function closeEbookModal() {
  $("ebookModal").classList.remove("open");
  $("ebookModal").setAttribute("aria-hidden", "true");
}

function openMerchModal(index) {
  currentMerchIndex = index;
  const item = merchData[index];

  const modalCover = $("merchModalCover");
  modalCover.src = item.imageLarge || item.image;
  modalCover.srcset = `${item.image} 400w, ${item.imageLarge} 1200w`;
  modalCover.sizes = "(max-width: 767px) 90vw, 280px";
  modalCover.alt = item.alt;

  $("merchModalTitle").textContent = item.title;
  $("merchModalBuy").href = item.link;
  $("merchModal").classList.add("open");
  $("merchModal").setAttribute("aria-hidden", "false");
}

function closeMerchModal() {
  $("merchModal").classList.remove("open");
  $("merchModal").setAttribute("aria-hidden", "true");
}

function nextEbook(delta) {
  currentEbookIndex = (currentEbookIndex + delta + ebookData.length) % ebookData.length;
  openEbookModal(currentEbookIndex);
}

function nextMerch(delta) {
  currentMerchIndex = (currentMerchIndex + delta + merchData.length) % merchData.length;
  openMerchModal(currentMerchIndex);
}

function setupModalControls() {
  $("ebookModalClose")?.addEventListener("click", closeEbookModal);
  $("ebookPrevBtn")?.addEventListener("click", () => nextEbook(-1));
  $("ebookNextBtn")?.addEventListener("click", () => nextEbook(1));

  $("merchModalClose")?.addEventListener("click", closeMerchModal);
  $("merchPrevBtn")?.addEventListener("click", () => nextMerch(-1));
  $("merchNextBtn")?.addEventListener("click", () => nextMerch(1));

  ["ebookModal", "merchModal"].forEach((id) => {
    const overlay = $(id);
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) {
        if (id === "ebookModal") closeEbookModal();
        if (id === "merchModal") closeMerchModal();
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEbookModal();
      closeMerchModal();
    }
    if (e.key === "ArrowLeft" && $("ebookModal")?.classList.contains("open")) nextEbook(-1);
    if (e.key === "ArrowRight" && $("ebookModal")?.classList.contains("open")) nextEbook(1);
    if (e.key === "a" && $("merchModal")?.classList.contains("open")) nextMerch(-1);
    if (e.key === "d" && $("merchModal")?.classList.contains("open")) nextMerch(1);
  });
}

function setupDragScroll(el) {
  if (!el) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const start = (clientX) => {
    isDown = true;
    el.classList.add("dragging");
    startX = clientX - el.getBoundingClientRect().left;
    scrollLeft = el.scrollLeft;
  };

  const move = (clientX) => {
    if (!isDown) return;
    const x = clientX - el.getBoundingClientRect().left;
    const walk = (x - startX) * 1.4;
    el.scrollLeft = scrollLeft - walk;
  };

  const end = () => {
    isDown = false;
    el.classList.remove("dragging");
  };

  el.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    start(e.clientX);
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => move(e.clientX));
  window.addEventListener("mouseup", end);

  el.addEventListener("touchstart", (e) => {
    if (!e.touches[0]) return;
    start(e.touches[0].clientX);
  }, { passive: true });

  el.addEventListener("touchmove", (e) => {
    if (!e.touches[0]) return;
    move(e.touches[0].clientX);
  }, { passive: true });

  el.addEventListener("touchend", end);
}

window.addEventListener("DOMContentLoaded", () => {
  setupIntroOverlay();
  renderEbookCards();
  renderMerchCards();
  setupModalControls();
  setupDragScroll($("ebookWrapper"));
  setupDragScroll($("merchWrapper"));
});