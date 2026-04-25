const hero = document.getElementById("hero");
const video = document.getElementById("video");
const fallback = document.getElementById("fallback");
const heroContent = document.getElementById("heroContent");
const texts = document.querySelectorAll(".hero-text");
const tapHint = document.getElementById("tapHint");
const scrollHint = document.getElementById("scrollHint");

const leftCurtain = document.getElementById("leftCurtain");
const rightCurtain = document.getElementById("rightCurtain");

let started = false;

hero.addEventListener("click", () => {
  if (started) return;
  started = true;

  tapHint.style.display = "none";

  video.style.opacity = "1";
  fallback.style.opacity = "0";

  video.play();
  openCurtains();
});

function openCurtains() {
  let progress = 0;

  function animate() {
    progress += 0.02;

    leftCurtain.style.transform = `translateX(${-progress * 100}%)`;
    rightCurtain.style.transform = `translateX(${progress * 100}%)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      revealText();
    }
  }

  animate();
}

function revealText() {
  heroContent.style.opacity = "1";

  texts.forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), i * 150);
  });

  setTimeout(() => {
    scrollHint.style.opacity = "1";
  }, 1000);
}

/* ================= SCRATCH LOGIC ================= */

const canvases = document.querySelectorAll("canvas");
let globalRevealed = false;

canvases.forEach((canvas) => {
  const ctx = canvas.getContext("2d");

  let drawing = false;
  let scratchCount = 0;

  const img = new Image();
  img.src = "./assets/gold-texture.png";

  function drawLayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;

    ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

    // circle mask
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // shine
    ctx.globalCompositeOperation = "overlay";
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.3,
      canvas.height * 0.3,
      10,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width,
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.35)");
    gradient.addColorStop(1, "rgba(0,0,0,0.25)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";
  }

  function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    if (img.complete) drawLayer();
  }

  img.onload = setupCanvas;
  setupCanvas();

  function scratch(x, y) {
    if (globalRevealed) return;

    ctx.globalCompositeOperation = "destination-out";

    const radius = 22;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    scratchCount++;

    // 🔥 LOWER THRESHOLD (IMPORTANT)
    if (scratchCount > 20) {
      globalRevealAll();
    }
  }

  /* EVENTS */
  canvas.addEventListener("mousedown", () => (drawing = true));
  canvas.addEventListener("mouseup", () => (drawing = false));

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener("touchstart", () => (drawing = true));
  canvas.addEventListener("touchend", () => (drawing = false));

  canvas.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    scratch(t.clientX - rect.left, t.clientY - rect.top);
  });
});

// 🔥 FINAL GLOBAL REVEAL
function globalRevealAll() {
  if (globalRevealed) return;

  globalRevealed = true;

  document.querySelectorAll("canvas").forEach((c) => {
    c.style.opacity = "0";

    setTimeout(() => {
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
      c.style.display = "none";
    }, 600);
  });

  triggerCelebration();

  const msg = document.getElementById("finalMessage");
  setTimeout(() => {
    msg.style.opacity = "1";
    msg.style.transform = "scale(1.05)";
  }, 500);
}

function triggerCelebration() {
  const container = document.getElementById("effectsContainer");

  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");

    container.appendChild(el);
  }
}
