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
  Feather: 'feather.png',
  Rock: 'rock.png',
  Ball: 'ball.png',
  Paper: 'paper.png',
  Piano: 'piano.png',
  Car: 'car.png'
};

window.onload = () => {
  const pL = document.getElementById("planetLeft");
  const pR = document.getElementById("planetRight");
  const oL = document.getElementById("objectLeft");
  const oR = document.getElementById("objectRight");

  for (let planet in planets) {
    pL.add(new Option(planet, planet));
    pR.add(new Option(planet, planet));
  }
  for (let obj in objects) {
    oL.add(new Option(obj, obj));
    oR.add(new Option(obj, obj));
  }
  pL.value = "Earth";
  pR.value = "Earth";
  oL.value = "Rock";
  oR.value = "Rock";
};

function drop() {
  startDrop("Left");
  startDrop("Right");
}

function reset() {
  document.getElementById("dropLeft").innerHTML = "";
  document.getElementById("dropRight").innerHTML = "";
  document.getElementById("timerLeft").innerText = "";
  document.getElementById("timerRight").innerText = "";
}

function startDrop(side) {
  const planet = document.getElementById(`planet${side}`).value;
  const object = document.getElementById(`object${side}`).value;
  const air = document.getElementById(`air${side}`).checked;
  const g = planets[planet];
  const height = 300; // px
  let t = Math.sqrt(2 * height / g);
  if (air) t *= 1.5;

  const zone = document.getElementById(`drop${side}`);
  const timerDisplay = document.getElementById(`timer${side}`);
  const img = document.createElement("img");
  img.src = `assets/${objects[object]}`;
  zone.innerHTML = "";
  zone.appendChild(img);

  img.style.transition = `top ${t}s linear`;
  setTimeout(() => {
    img.style.top = (height - 50) + "px";
  }, 50);

  let start = Date.now();
  let interval = setInterval(() => {
    let elapsed = (Date.now() - start) / 1000;
    if (elapsed >= t) {
      clearInterval(interval);
      elapsed = t;
    }
    timerDisplay.innerText = `${elapsed.toFixed(2)}s`;
  }, 50);
}
