let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animateEyes() {
  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;

  const eyes = document.querySelectorAll(".eye");

  eyes.forEach((eye) => {
    const pupil = eye.querySelector(".pupil");
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = currentX - eyeCenterX;
    const dy = currentY - eyeCenterY;

    const distance = Math.min(15, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  requestAnimationFrame(animateEyes);
}

animateEyes();

const mainFace = document.getElementById("main-face");
const thumbnails = document.querySelectorAll(".character-switcher .menu img");
const leftEyeWhite = document.querySelector("#left-eye .eye-white");
const rightEyeWhite = document.querySelector("#right-eye .eye-white");
const leftPupil = document.querySelector("#left-eye .pupil");
const rightPupil = document.querySelector("#right-eye .pupil");
const screenFader = document.getElementById("screen-fader");

function applyEyeAndPupilPositions(img) {
  const leftEye = document.getElementById("left-eye");
  const rightEye = document.getElementById("right-eye");

  const leftPupil = leftEye.querySelector(".pupil");
  const rightPupil = rightEye.querySelector(".pupil");

  leftEye.style.top = img.dataset.eyeLeftTop + "px";
  leftEye.style.left = img.dataset.eyeLeftLeft + "px";

  rightEye.style.top = img.dataset.eyeRightTop + "px";
  rightEye.style.left = img.dataset.eyeRightLeft + "px";

  leftPupil.style.top = img.dataset.pupilLeftTop + "px";
  leftPupil.style.left = img.dataset.pupilLeftLeft + "px";

  rightPupil.style.top = img.dataset.pupilRightTop + "px";
  rightPupil.style.left = img.dataset.pupilRightLeft + "px";
}

function applyEyeWhitePositions(img) {
  leftEyeWhite.style.top = (img.dataset.eyeWhiteLeftTop || 0) + "px";
  leftEyeWhite.style.left = (img.dataset.eyeWhiteLeftLeft || 0) + "px";

  rightEyeWhite.style.top = (img.dataset.eyeWhiteRightTop || 0) + "px";
  rightEyeWhite.style.left = (img.dataset.eyeWhiteRightLeft || 0) + "px";
}

thumbnails.forEach((img) => {
  img.addEventListener("click", () => {
    thumbnails.forEach((i) => i.classList.remove("active"));
    img.classList.add("active");

    screenFader.style.opacity = "1";

    setTimeout(() => {
      mainFace.src = img.dataset.face;
      leftEyeWhite.src = img.dataset.eyeLeft;
      rightEyeWhite.src = img.dataset.eyeRight;
      leftPupil.src = img.dataset.pupilLeft;
      rightPupil.src = img.dataset.pupilRight;

      applyEyeAndPupilPositions(img);
      applyEyeWhitePositions(img);

      screenFader.style.opacity = "0";
    }, 300);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  if (!params.has("char")) {
    window.location.href = "index.html";
    return;
  }

  const selectedChar = params.get("char") || "1";

  thumbnails.forEach((img) => {
    if (img.dataset.char === selectedChar) {
      img.click();
    }
  });
});

const backBtn = document.getElementById('back-to-start-btn');
backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});
