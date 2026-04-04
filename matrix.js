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

let pageMatrixFontSize = 14;
let pageMatrixColumns = [];
let pageMatrixLastFrameTime = 0;
let pageMatrixAnimationFrame = 0;

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

function resizePageMatrixCanvas() {
  if (!pageMatrixCanvas || !pageMatrixCtx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  pageMatrixCanvas.width = Math.floor(width * dpr);
  pageMatrixCanvas.height = Math.floor(height * dpr);
  pageMatrixCanvas.style.width = "100%";
  pageMatrixCanvas.style.height = "100%";

  pageMatrixCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  pageMatrixFontSize = Math.max(12, Math.min(15, width / 120));
  const cols = Math.ceil(width / pageMatrixFontSize) + 10;

  pageMatrixColumns = Array.from({ length: cols }, (_, i) => ({
    x: i * pageMatrixFontSize,
    y: Math.random() * (height + 180) - 180,
    speed: 26 + Math.random() * 18,
    length: 10 + Math.floor(Math.random() * 8),
    glyphs: Array.from({ length: 24 }, randomMatrixChar)
  }));

  pageMatrixLastFrameTime = performance.now();
}

function drawPageMatrixLayer(width, height, delta) {
  if (!pageMatrixCtx) return;

  pageMatrixCtx.clearRect(0, 0, width, height);
  pageMatrixCtx.fillStyle = "rgba(0, 0, 0, 0.02)";
  pageMatrixCtx.fillRect(0, 0, width, height);

  pageMatrixCtx.font = `600 ${pageMatrixFontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  pageMatrixCtx.textBaseline = "top";

  for (const col of pageMatrixColumns) {
    for (let i = 0; i < col.length; i += 1) {
      const y = col.y - i * pageMatrixFontSize * 1.14;
      if (y < -40 || y > height + 40) continue;

      if (Math.random() > 0.98) {
        col.glyphs[i] = randomMatrixChar();
      }

      const trailStrength = 1 - i / col.length;

      if (i === 0) {
        pageMatrixCtx.shadowColor = "rgba(185, 255, 220, 0.18)";
        pageMatrixCtx.shadowBlur = 8;
        pageMatrixCtx.fillStyle = "rgba(235, 255, 244, 0.18)";
      } else {
        pageMatrixCtx.shadowColor = "rgba(90, 255, 150, 0.08)";
        pageMatrixCtx.shadowBlur = 4;
        pageMatrixCtx.fillStyle = `rgba(110, 255, 165, ${0.12 * trailStrength})`;
      }

      pageMatrixCtx.fillText(col.glyphs[i], col.x, y);
    }

    col.y += col.speed * delta;

    if (col.y - col.length * pageMatrixFontSize * 1.14 > height + 60) {
      col.y = -Math.random() * 120;
      col.length = 10 + Math.floor(Math.random() * 8);
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

function setupPageMatrix() {
  if (!pageMatrixCanvas || !pageMatrixCtx) return;

  const isTouchDevice =
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth <= 1024;

  if (isTouchDevice) {
    if (pageMatrixAnimationFrame) {
      cancelAnimationFrame(pageMatrixAnimationFrame);
      pageMatrixAnimationFrame = 0;
    }

    pageMatrixCanvas.style.display = "none";
    return;
  }

  pageMatrixCanvas.style.display = "block";
  resizePageMatrixCanvas();

  if (pageMatrixAnimationFrame) {
    cancelAnimationFrame(pageMatrixAnimationFrame);
  }

  pageMatrixAnimationFrame = requestAnimationFrame(animatePageMatrix);
  window.addEventListener("resize", resizePageMatrixCanvas);
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