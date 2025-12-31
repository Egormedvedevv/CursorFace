document.addEventListener("DOMContentLoaded", () => {
  const face = document.querySelector(".layer.interface");
  const infoBtn = document.getElementById("info-btn");
  const infoModal = document.getElementById("info-modal");
  const closeInfo = document.getElementById("close-info");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  if (face) {
    function updateFacePosition(x, y) {
      targetX = (window.innerWidth / 2 - x) * 0.007;
      targetY = (window.innerHeight / 2 - y) * 0.007;
    }

    document.addEventListener("mousemove", (e) => {
      updateFacePosition(e.clientX, e.clientY);
    });

    document.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        updateFacePosition(touch.clientX, touch.clientY);
      }
    });

    document.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      if (touch) {
        updateFacePosition(touch.clientX, touch.clientY);
      }
    });

    function animate() {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      face.style.transform = `translate(${currentX}px, ${currentY}px)`;

      requestAnimationFrame(animate);
    }

    animate();
  }

  if (infoBtn && infoModal) {
    infoBtn.addEventListener("click", () => {
      infoModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  }

  if (closeInfo) {
    closeInfo.addEventListener("click", () => {
      infoModal.style.display = "none";
      document.body.style.overflow = "";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === infoModal) {
      infoModal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
});
