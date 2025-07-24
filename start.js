const face = document.querySelector(".layer.interface");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (e) => {
  targetX = (window.innerWidth / 2 - e.clientX) * 0.03;
  targetY = (window.innerHeight / 2 - e.clientY) * 0.03;
});

function animate() {
  currentX += (targetX - currentX) * 0.3;
  currentY += (targetY - currentY) * 0.3;

  face.style.transform = `translate(${currentX}px, ${currentY}px)`;

  requestAnimationFrame(animate);
}

animate();

const infoBtn = document.getElementById('info-btn');
const infoModal = document.getElementById('info-modal');
const closeInfo = document.getElementById('close-info');

infoBtn.addEventListener('click', () => {
  infoModal.style.display = 'flex';
});

closeInfo.addEventListener('click', () => {
  infoModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === infoModal) {
    infoModal.style.display = 'none';
  }
});
