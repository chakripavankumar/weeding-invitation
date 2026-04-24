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
