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

document.querySelectorAll("canvas").forEach((canvas) => {
  const ctx = canvas.getContext("2d");

  let drawing = false;
  let revealed = false;

  const img = new Image();
  img.src = "./assets/gold-texture.png";

  function drawLayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✅ FIX 1: PERFECT CENTER CROP
    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;

    ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

    // ✅ FIX 2: FORCE PERFECT CIRCLE MASK
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      0,
      Math.PI * 2,
    );
    ctx.closePath();
    ctx.fill();

    // ✅ FIX 3: METAL SHINE
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
    gradient.addColorStop(0.4, "rgba(255,255,255,0.1)");
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

  img.onload = drawLayer;

  setupCanvas();
  window.addEventListener("resize", setupCanvas);

  // ✅ FIX 4: SOFT SCRATCH
  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out";

    const radius = 22;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    checkReveal();
  }

  function getScratchedPercent() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) cleared++;
    }

    return cleared / (imageData.data.length / 4);
  }

  function checkReveal() {
    if (revealed) return;

    if (getScratchedPercent() > 0.6) {
      revealed = true;

      canvas.style.opacity = "0";

      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
      }, 700);
    }
  }

  /* DESKTOP */
  canvas.addEventListener("mousedown", () => (drawing = true));
  canvas.addEventListener("mouseup", () => (drawing = false));

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  });

  /* MOBILE */
  canvas.addEventListener("touchstart", () => (drawing = true));
  canvas.addEventListener("touchend", () => (drawing = false));

  canvas.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    scratch(t.clientX - rect.left, t.clientY - rect.top);
  });
});
