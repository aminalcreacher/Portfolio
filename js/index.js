let mouseX = 0;
let mouseY = 0;

const circles = document.querySelectorAll(".circle");
const highlights = document.querySelectorAll(".highlight");
const flashContainer = document.getElementById("flashContainer");
let themeColor = null;
let animate = true;

document.querySelectorAll(".popin").forEach((element, index) => {
  element.style.animation = `pop-in 0.5s ${
    index * 0.3 + 1
  }s cubic-bezier(.66,1.46,.4,1) both`;
  element.style.visibility = "visible";
});

function fancigate(div, url) {
  animate = false;
  const rect = div.getBoundingClientRect();
  const divCenterX = rect.left + rect.width / 2;
  const viewportCenterX = window.innerWidth / 2;
  const distance = viewportCenterX - divCenterX;
  Array.from(div.children).forEach((child) => {
    child.style.animation = `fade-in 0.5s reverse ease-out forwards`;
  });
  div.style.zIndex = `5`;
  // div.style.filter = `blur(500px)`;
  div.style.backgroundColor = "#303030";
  div.style.animation = `zoom-trans 1s cubic-bezier(.11,-0.09,1,-0.28) forwards`;
  setTimeout(() => {
    window.location.href = url;
    console.log(`attempted to navigate`);
  }, 1000);
}

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  highlights.forEach((highlight) => {
    const parent = highlight.parentElement;
    const distance = getCenterDistanceFromCursor(parent);
    const displacement = (Math.atan(distance / 100) * 50) / Math.PI;
    const angle = getAngleOfCursor(parent);
    const x = Math.cos(angle) * displacement;
    const y = Math.sin(angle) * displacement;
    highlight.style.transform = `translate(${x - 25}%, ${y - 25}%)`;
  });
});

let angle = 0;
const maxRadius = 20;

function updatePosition() {
  if (!animate) return;

  circles.forEach((circle, index) => {
    const distanceFromCursor = getDistanceFromCursor(circle);
    const radius = (maxRadius * Math.min(250, distanceFromCursor)) / 250;
    const x = Math.cos(angle + index) * radius;
    const y = Math.sin(angle + index) * radius;

    const scale = 120 - 0.04 * Math.min(500, distanceFromCursor);
    circle.style.transform = `translate(${x}px, ${y}px) scale(${scale}%)`;
  });

  angle += 0.02;
  requestAnimationFrame(updatePosition);
}

// function scatterLights(circleDiv) {
//   const rect = circleDiv.getBoundingClientRect();
//   const centerX = rect.left + rect.width / 2;
//   const centerY = rect.top + rect.height / 2;
//   const radius = Math.min(rect.width, rect.height) / 2;

//   // Generate 16 random points around the circumference
//   for (let i = 0; i < 16; i++) {
//     // Generate a random angle between 0 and 2π radians (360 degrees)
//     const angle = Math.random() * 2 * Math.PI;

//     // Calculate the x and y coordinates for the point on the circumference
//     const x = centerX + radius * Math.cos(angle);
//     const y = centerY + radius * Math.sin(angle);

//     // Assuming createLight function signature is (container, x, y, size)
//     // Adjust x and y if necessary to fit your exact needs for positioning
//     createLight(flashContainer, x, y, 500); // Size is arbitrary; adjust as needed
//   }
// }

function emitLights() {
  if (!animate) return;

  requestAnimationFrame(emitLights);

  if (Math.random() < 0.98) return;

  const { width, height } = flashContainer.getBoundingClientRect();

  // Biasing towards edges
  const x = edgeBias(Math.random()) * width;
  const y = edgeBias(Math.random()) * height;

  createLight(flashContainer, x, y, 500);
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
  light.style.backgroundColor = generateRandomHSLColor();
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

function generateRandomHSLColor() {
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 50%, 50%)`;
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

function getCenterDistanceFromCursor(div) {
  const rect = div.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.sqrt((centerX - mouseX) ** 2 + (centerY - mouseY) ** 2);
}

function getAngleOfCursor(div) {
  const rect = div.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.atan2(mouseY - centerY, mouseX - centerX);
}

function scatterFlashes(container, rect, interval, size) {
  // Top
  for (let i = rect.x; i < rect.right; i++) {
    createFlashingDiv(container, i, rect.y, size);
    i += Math.floor(Math.random() * interval);
  }

  // Right
  for (let i = rect.y; i < rect.bottom; i++) {
    createFlashingDiv(container, rect.right, i, size);
    i += Math.floor(Math.random() * interval);
  }

  // Bottom
  for (let i = rect.x; i < rect.right; i++) {
    createFlashingDiv(container, i, rect.bottom, size);
    i += Math.floor(Math.random() * interval);
  }

  // Left
  for (let i = rect.y; i < rect.bottom; i++) {
    createFlashingDiv(container, rect.x, i, size);
    i += Math.floor(Math.random() * interval);
  }
  container.style.animation = "flash 1s linear forwards";
}

updatePosition();
emitLights();
