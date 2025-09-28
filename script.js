const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 500;

const gravityValues = {
  Earth: 9.8,
  Moon: 1.6,
  Mars: 3.7,
  Jupiter: 24.8,
  Europa: 1.3
};

const objects = {
  Feather: { img: "feather.png", mass: 0.02 },
  "Bowling Ball": { img: "bowlingball.png", mass: 6 }
};

const planetOptions = Object.keys(gravityValues);
const objectOptions = Object.keys(objects);

function populateSelect(id, options) {
  const sel = document.getElementById(id);
  sel.innerHTML = "";
  options.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt;
    o.textContent = opt;
    sel.appendChild(o);
  });
}

populateSelect("planet1", planetOptions);
populateSelect("planet2", planetOptions);
populateSelect("object1", objectOptions);
populateSelect("object2", objectOptions);

class DropObject {
  constructor(x, planet, object, air) {
    this.x = x;
    this.y = 0;
    this.vy = 0;
    this.planet = planet;
    this.gravity = gravityValues[planet];
    this.object = object;
    this.mass = objects[object].mass;
    this.air = air;
    this.img = new Image();
    this.img.src = objects[object].img;
    this.done = false;
  }

  update(dt) {
    if (this.done) return;
    let g = this.gravity;
    if (this.air) {
      const drag = 0.1 * this.vy;
      this.vy += (g - drag) * dt;
    } else {
      this.vy += g * dt;
    }
    this.y += this.vy;
    if (this.y >= canvas.height - 50) {
      this.y = canvas.height - 50;
      this.done = true;
    }
  }

  draw() {
    ctx.drawImage(this.img, this.x - 25, this.y, 50, 50);
  }
}

let drops = [];
let time = 0;
let interval = null;

document.getElementById("dropButton").onclick = () => {
  drops = [];
  time = 0;
  const p1 = planet1.value;
  const p2 = planet2.value;
  const o1 = object1.value;
  const o2 = object2.value;
  const a1 = air1.checked;
  const a2 = air2.checked;
  drops.push(new DropObject(canvas.width / 3, p1, o1, a1));
  drops.push(new DropObject((2 * canvas.width) / 3, p2, o2, a2));
  interval = setInterval(update, 20);
};

document.getElementById("resetButton").onclick = () => {
  clearInterval(interval);
  drops = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("info").textContent = "";
};

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lime";
  ctx.fillRect(0, canvas.height - 2, canvas.width, 2);
  time += 0.02;
  drops.forEach(d => {
    d.update(0.02);
    d.draw();
  });
  document.getElementById("info").textContent = `${drops[0].planet} gravity: ${drops[0].gravity} m/s² | ${drops[1].planet} gravity: ${drops[1].gravity} m/s²\nTime: ${time.toFixed(2)} s`;
}