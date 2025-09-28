const planets = {
  Earth: 9.81,
  Moon: 1.62,
  Mars: 3.71,
  Jupiter: 24.79,
  Saturn: 10.44,
  Uranus: 8.69,
  Neptune: 11.15,
  Venus: 8.87,
  Mercury: 3.7,
  Pluto: 0.62
};

const objects = {
  Rock: "rock.png",
  Feather: "feather2.png",
  Paper: "paper2.png",
  Piano: "piano2.png",
  Car: "car2.png",
  "Bowling Ball": "ball2.png"
};

function populateSelect(selectId, items) {
  const select = document.getElementById(selectId);
  for (let item in items) {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  }
}

window.onload = () => {
  populateSelect("planetSelectLeft", planets);
  populateSelect("planetSelectRight", planets);
  populateSelect("objectSelectLeft", objects);
  populateSelect("objectSelectRight", objects);
};

function startSimulation() {
  dropObject("Left");
  dropObject("Right");
}

function dropObject(side) {
  const planet = document.getElementById("planetSelect" + side).value;
  const object = document.getElementById("objectSelect" + side).value;
  const airResistance = document.getElementById("airResistance" + side).checked;
  const container = document.getElementById("simulation" + side);
  container.innerHTML = "";

  const img = document.createElement("img");
  img.src = "assets/" + objects[object];
  img.className = "object";
  container.appendChild(img);

  const gravity = planets[planet];
  const start = performance.now();
  const duration = airResistance ? 3000 / gravity : 2000 / gravity;
  const distance = container.clientHeight - 50;

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    img.style.top = distance * progress + "px";
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

function resetSimulation() {
  document.getElementById("simulationLeft").innerHTML = "";
  document.getElementById("simulationRight").innerHTML = "";
}