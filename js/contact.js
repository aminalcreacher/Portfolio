let mouseX = 0;
let mouseY = 0;

const circles = document.querySelectorAll(".circle");
const highlights = document.querySelectorAll(".highlight");
const flashContainer = document.getElementById("flashContainer");
let themeColor = "#8328ad";
let animate = true;

document.querySelectorAll(".popin").forEach((element, index) => {
  element.style.animation = `pop-in 0.5s ${
    index * 0.3 + 1
  }s cubic-bezier(.66,1.46,.4,1) both`;
  element.style.visibility = "visible";
});

function emitLights() {
  if (!animate) return;

  requestAnimationFrame(emitLights);

  if (Math.random() < 0.98) return;

  const { width, height } = flashContainer.getBoundingClientRect();

  // Biasing towards edges
  const x = edgeBias(Math.random()) * width;
  const y = edgeBias(Math.random()) * height;

  createLight(flashContainer, x, y, 500);

  console.log(`attempted to create light`);
}

function edgeBias(value) {
  const biasFactor = 1 / 3;
  if (value < 0.5) {
    return 0.5 * Math.pow(2 * value, 1 / biasFactor);
  } else {
    return 1 - 0.5 * Math.pow(2 * (1 - value), 1 / biasFactor);
  }
}

function createLight(container, x, y, size) {
  const light = document.createElement("div");
  light.classList.add("flash");
  light.style.backgroundColor = themeColor;
  light.style.width = `${Math.sqrt(Math.random()) * size}px`;

  let initialPosX = x;
  let initialPosY = y;
  let targetPosX = initialPosX + Math.random() * 800 - 400;
  let targetPosY = initialPosY + Math.random() * 800 - 400;

  light.style.top = `${initialPosY}px`;
  light.style.left = `${initialPosX}px`;

  setTimeout(() => {
    light.style.top = `${targetPosY}px`;
    light.style.left = `${targetPosX}px`;
  }, 0);

  container.appendChild(light);

  setTimeout(() => container.removeChild(light), 5000);
}

function getDistanceFromCursor(div) {
  const rect = div.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.max(
    0,
    Math.sqrt((centerX - mouseX) ** 2 + (centerY - mouseY) ** 2) -
      rect.width / 2
  );
}

emitLights();
