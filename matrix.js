const introOverlay = document.getElementById("introOverlay");
const introCanvas = document.getElementById("matrixCanvas");
const introCtx = introCanvas ? introCanvas.getContext("2d") : null;
const introContent = document.querySelector(".intro-content");

const pageMatrixCanvas = document.getElementById("pageMatrixCanvas");
const pageMatrixCtx = pageMatrixCanvas ? pageMatrixCanvas.getContext("2d") : null;

const INTRO_CLOSE_DURATION = 1100;
const MATRIX_CHARSET = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ0123456789<>+-=*";

let introClosing = false;
let introCloseStart = 0;
let introAnimationFrame = 0;
let introFontSize = 16;
let introColumns = [];
let introParticles = [];
let introLastFrameTime = 0;
let introEventsBound = false;

let pageMatrixFontSize = 14;
let pageMatrixColumns = [];
let pageMatrixLastFrameTime = 0;
let pageMatrixAnimationFrame = 0;
let pageMatrixEventsBound = false;
let pageMatrixTime = 0;

function randomMatrixChar() {
  return MATRIX_CHARSET[Math.floor(Math.random() * MATRIX_CHARSET.length)];
}

function isMobileMatrixDevice() {
  return (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth <= 1024
  );
}

function resizeIntroCanvas() {
  if (!introCanvas || !introCtx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  introCanvas.width = Math.floor(width * dpr);
  introCanvas.height = Math.floor(height * dpr);
  introCanvas.style.width = `${width}px`;
  introCanvas.style.height = `${height}px`;

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

function createPageColumn(x, height, isMobile) {
  const depthRoll = Math.random();
  const depth = depthRoll > 0.74 ? 2 : depthRoll > 0.36 ? 1 : 0;

  const sizeScale = depth === 2 ? 1.16 : depth === 1 ? 1 : 0.84;
  const speedBase = isMobile
    ? (depth === 2 ? 12 : depth === 1 ? 9.5 : 7.2)
    : (depth === 2 ? 19 : depth === 1 ? 14.5 : 11.5);
  const speedRange = isMobile
    ? (depth === 2 ? 4 : depth === 1 ? 3.2 : 2.6)
    : (depth === 2 ? 5.5 : depth === 1 ? 4.5 : 3.4);
  const lengthBase = isMobile
    ? (depth === 2 ? 8 : depth === 1 ? 7 : 6)
    : (depth === 2 ? 11 : depth === 1 ? 9 : 7);
  const lengthRange = isMobile
    ? (depth === 2 ? 4 : depth === 1 ? 3 : 2)
    : (depth === 2 ? 5 : depth === 1 ? 4 : 3);

  return {
    x,
    baseX: x,
    y: Math.random() * (height + 220) - 220,
    speed: speedBase + Math.random() * speedRange,
    length: lengthBase + Math.floor(Math.random() * lengthRange),
    glyphs: Array.from({ length: 26 }, randomMatrixChar),
    depth,
    sizeScale,
    headBoost: depth === 2 ? 1.12 : depth === 1 ? 1 : 0.84,
    trailBoost: depth === 2 ? 1.05 : depth === 1 ? 0.88 : 0.72,
    blur: depth === 2 ? 4 : depth === 1 ? 2.2 : 0.8,
    drift: depth === 2 ? 3.8 : depth === 1 ? 2 : 0.9,
    phase: Math.random() * Math.PI * 2,
    swaySpeed: depth === 2 ? 0.38 : depth === 1 ? 0.27 : 0.18
  };
}

function resizePageMatrixCanvas() {
  if (!pageMatrixCanvas || !pageMatrixCtx) return;

  const isMobile = isMobileMatrixDevice();
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  pageMatrixCanvas.width = Math.floor(width * dpr);
  pageMatrixCanvas.height = Math.floor(height * dpr);
  pageMatrixCanvas.style.width = `${width}px`;
  pageMatrixCanvas.style.height = `${height}px`;

  pageMatrixCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  pageMatrixFontSize = isMobile
    ? Math.max(10, Math.min(12, width / 104))
    : Math.max(12, Math.min(15, width / 132));

  const cols = Math.ceil(width / pageMatrixFontSize) + (isMobile ? 5 : 8);

  pageMatrixColumns = Array.from({ length: cols }, (_, i) =>
    createPageColumn(i * pageMatrixFontSize, height, isMobile)
  );

  pageMatrixTime = 0;
  pageMatrixLastFrameTime = performance.now();
}

function drawPageMatrixLayer(width, height, delta) {
  if (!pageMatrixCtx) return;

  const isMobile = isMobileMatrixDevice();
  pageMatrixTime += delta;

  const headAlphaBase = isMobile ? 0.085 : 0.115;
  const trailAlphaBase = isMobile ? 0.04 : 0.058;
  const fadeFill = isMobile ? 0.08 : 0.06;

  pageMatrixCtx.clearRect(0, 0, width, height);
  pageMatrixCtx.fillStyle = `rgba(0, 0, 0, ${fadeFill})`;
  pageMatrixCtx.fillRect(0, 0, width, height);
  pageMatrixCtx.textBaseline = "top";

  for (const col of pageMatrixColumns) {
    const fontSize = pageMatrixFontSize * col.sizeScale;
    const step = fontSize * 1.16;
    const x = col.baseX + Math.sin(pageMatrixTime * col.swaySpeed + col.phase) * col.drift;

    pageMatrixCtx.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

    for (let i = 0; i < col.length; i += 1) {
      const y = col.y - i * step;
      if (y < -40 || y > height + 40) continue;

      if (Math.random() > 0.986) {
        col.glyphs[i] = randomMatrixChar();
      }

      const trailStrength = 1 - i / col.length;

      if (i === 0) {
        pageMatrixCtx.shadowColor = `rgba(110, 170, 134, ${0.09 * col.headBoost})`;
        pageMatrixCtx.shadowBlur = col.blur;
        pageMatrixCtx.fillStyle = `rgba(220, 234, 226, ${headAlphaBase * col.headBoost})`;
      } else {
        pageMatrixCtx.shadowColor = `rgba(50, 95, 72, ${0.045 * col.trailBoost})`;
        pageMatrixCtx.shadowBlur = Math.max(0.4, col.blur * 0.5);
        pageMatrixCtx.fillStyle = `rgba(72, 128, 97, ${trailAlphaBase * trailStrength * col.trailBoost})`;
      }

      pageMatrixCtx.fillText(col.glyphs[i], x, y);
    }

    col.y += col.speed * delta;

    if (col.y - col.length * step > height + 80) {
      const reset = createPageColumn(col.baseX, height, isMobile);
      col.y = -Math.random() * 180;
      col.speed = reset.speed;
      col.length = reset.length;
      col.glyphs = reset.glyphs;
      col.depth = reset.depth;
      col.sizeScale = reset.sizeScale;
      col.headBoost = reset.headBoost;
      col.trailBoost = reset.trailBoost;
      col.blur = reset.blur;
      col.drift = reset.drift;
      col.phase = reset.phase;
      col.swaySpeed = reset.swaySpeed;
    }
  }
}

function animatePageMatrix(now) {
  if (!pageMatrixCtx || !pageMatrixCanvas) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const delta = Math.min(0.033, ((now - pageMatrixLastFrameTime) / 1000) || 0.016);
  pageMatrixLastFrameTime = now;

  drawPageMatrixLayer(width, height, delta);
  pageMatrixAnimationFrame = requestAnimationFrame(animatePageMatrix);
}

function stopPageMatrix() {
  if (pageMatrixAnimationFrame) {
    cancelAnimationFrame(pageMatrixAnimationFrame);
    pageMatrixAnimationFrame = 0;
  }
}

function startPageMatrix() {
  if (!pageMatrixCanvas || !pageMatrixCtx) return;

  pageMatrixCanvas.style.display = "block";
  resizePageMatrixCanvas();
  stopPageMatrix();
  pageMatrixAnimationFrame = requestAnimationFrame(animatePageMatrix);
}

function setupPageMatrix() {
  if (!pageMatrixCanvas || !pageMatrixCtx) return;

  startPageMatrix();

  if (pageMatrixEventsBound) return;
  pageMatrixEventsBound = true;

  window.addEventListener("resize", resizePageMatrixCanvas);
  window.addEventListener("orientationchange", () => {
    window.setTimeout(() => {
      resizePageMatrixCanvas();
    }, 120);
  });

  window.addEventListener("pageshow", () => {
    resizePageMatrixCanvas();
    if (!pageMatrixAnimationFrame) {
      pageMatrixAnimationFrame = requestAnimationFrame(animatePageMatrix);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopPageMatrix();
      return;
    }

    resizePageMatrixCanvas();
    if (!pageMatrixAnimationFrame) {
      pageMatrixAnimationFrame = requestAnimationFrame(animatePageMatrix);
    }
  });
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

  if (introEventsBound) return;
  introEventsBound = true;

  const dismiss = (e) => {
    e?.preventDefault?.();
    closeIntroOverlay();
  };

  introOverlay.addEventListener("pointerup", dismiss);
  introOverlay.addEventListener("click", dismiss);

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

window.setupIntroOverlay = setupIntroOverlay;
window.setupPageMatrix = setupPageMatrix;

document.addEventListener("DOMContentLoaded", () => {
  setupIntroOverlay();
  setupPageMatrix();
});