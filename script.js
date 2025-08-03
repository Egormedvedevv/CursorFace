const imagesToPreload = [
  "images/char1.png",
  "images/char2.png",
  "images/char3.png",
  "images/char4.png",
  "images/char5.png",
  "images/char6.png",
];

imagesToPreload.forEach((src) => {
  const img = new Image();
  img.src = src;
});

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animateEyes() {
  currentX += (targetX - currentX) * 0.07;
  currentY += (targetY - currentY) * 0.07;

  document.querySelectorAll(".eye").forEach((eye) => {
    const pupil = eye.querySelector(".pupil");
    if (!pupil) return;

    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = currentX - eyeCenterX;
    const dy = currentY - eyeCenterY;

    const maxDistance = 12;
    const distance = Math.min(maxDistance, Math.sqrt(dx * dx + dy * dy));
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
const backBtn = document.getElementById("back-to-start-btn");

function applyEyePositions(img) {
  const leftEye = document.getElementById("left-eye");
  const rightEye = document.getElementById("right-eye");

  if (img.dataset.eyeLeftTop) leftEye.style.top = img.dataset.eyeLeftTop + "px";
  if (img.dataset.eyeLeftLeft)
    leftEye.style.left = img.dataset.eyeLeftLeft + "px";

  if (img.dataset.eyeRightTop)
    rightEye.style.top = img.dataset.eyeRightTop + "px";
  if (img.dataset.eyeRightLeft)
    rightEye.style.left = img.dataset.eyeRightLeft + "px";

  if (img.dataset.pupilLeftTop)
    leftPupil.style.top = img.dataset.pupilLeftTop + "px";
  if (img.dataset.pupilLeftLeft)
    leftPupil.style.left = img.dataset.pupilLeftLeft + "px";

  if (img.dataset.pupilRightTop)
    rightPupil.style.top = img.dataset.pupilRightTop + "px";
  if (img.dataset.pupilRightLeft)
    rightPupil.style.left = img.dataset.pupilRightLeft + "px";
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

      applyEyePositions(img);

      screenFader.style.opacity = "0";
    }, 250);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  if (!params.has("char")) {
    window.location.href = "index.html";
    return;
  }

  const selectedChar = params.get("char") || "1";
  const selectedImg = [...thumbnails].find(
    (img) => img.dataset.char === selectedChar
  );

  if (selectedImg) {
    selectedImg.click();
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

const faceContainer = document.querySelector(".character");

let faceTargetX = 0;
let faceTargetY = 0;
let faceCurrentX = 0;
let faceCurrentY = 0;

let faceTargetRotate = 0;
let faceCurrentRotate = 0;

let velocityX = 0;
let velocityY = 0;
let velocityRotate = 0;

const stiffness = 0.05;
const damping = 0.8;

document.addEventListener("mousemove", (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  faceTargetX = (e.clientX - centerX) * 0.02;
  faceTargetY = (e.clientY - centerY) * 0.02;
  faceTargetRotate = (e.clientX - centerX) * 0.01;
});

function animateFace() {
  let forceX = (faceTargetX - faceCurrentX) * stiffness;
  velocityX = velocityX * damping + forceX;
  faceCurrentX += velocityX;

  let forceY = (faceTargetY - faceCurrentY) * stiffness;
  velocityY = velocityY * damping + forceY;
  faceCurrentY += velocityY;

  let forceR = (faceTargetRotate - faceCurrentRotate) * stiffness;
  velocityRotate = velocityRotate * damping + forceR;
  faceCurrentRotate += velocityRotate;

  if (faceContainer) {
    faceContainer.style.transform = `
      translate(${faceCurrentX}px, ${faceCurrentY}px)
      rotate(${faceCurrentRotate}deg)
    `;
  }

  requestAnimationFrame(animateFace);
}
animateFace();
