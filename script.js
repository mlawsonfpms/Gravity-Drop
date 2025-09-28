const gravities = {
  Earth: 9.8,
  Moon: 1.6,
  Mars: 3.7,
  Jupiter: 24.8,
  Mercury: 3.7,
  Venus: 8.87,
  Saturn: 10.4,
  Uranus: 8.69,
  Neptune: 11.2,
  Pluto: 0.62
};

const objects = {
  Rock: { mass: 1, airCoeff: 0.1 },
  Feather: { mass: 0.1, airCoeff: 1.2 },
  Cannonball: { mass: 5, airCoeff: 0.05 }
};

function populateOptions() {
  const planetSelects = [document.getElementById('planet1'), document.getElementById('planet2')];
  const objectSelects = [document.getElementById('object1'), document.getElementById('object2')];

  for (let planet in gravities) {
    planetSelects.forEach(sel => {
      const opt = document.createElement('option');
      opt.value = planet;
      opt.textContent = planet;
      sel.appendChild(opt);
    });
  }

  for (let obj in objects) {
    objectSelects.forEach(sel => {
      const opt = document.createElement('option');
      opt.value = obj;
      opt.textContent = obj;
      sel.appendChild(opt);
    });
  }
}

let animationFrame;
let startTime;
let positions = [0, 0];
let velocities = [0, 0];
let finished = [false, false];

function startDrop() {
  const [planet1, planet2] = [document.getElementById('planet1').value, document.getElementById('planet2').value];
  const [object1, object2] = [document.getElementById('object1').value, document.getElementById('object2').value];
  const [air1, air2] = [document.getElementById('air1').checked, document.getElementById('air2').checked];

  const g1 = gravities[planet1];
  const g2 = gravities[planet2];
  const obj1 = objects[object1];
  const obj2 = objects[object2];

  const objEls = [document.getElementById('objectA'), document.getElementById('objectB')];
  objEls[0].style.left = '35%';
  objEls[1].style.left = '55%';

  velocities = [0, 0];
  positions = [0, 0];
  finished = [false, false];

  startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;

    [g1, g2].forEach((g, i) => {
      if (finished[i]) return;
      const obj = i === 0 ? obj1 : obj2;
      const air = i === 0 ? air1 : air2;
      let acc = g;
      if (air) acc -= obj.airCoeff * velocities[i];
      velocities[i] += acc * 0.02;
      positions[i] += velocities[i] * 2;

      if (positions[i] >= 340) {
        positions[i] = 340;
        finished[i] = true;
      }

      objEls[i].style.top = `${positions[i]}px`;
    });

    document.getElementById('info').textContent =
      `${planet1} gravity: ${g1} m/s² | ${planet2} gravity: ${g2} m/s²\nTime: ${elapsed.toFixed(2)} s`;

    if (!finished[0] || !finished[1]) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  animationFrame = requestAnimationFrame(animate);
}

function reset() {
  cancelAnimationFrame(animationFrame);
  document.getElementById('objectA').style.top = '0px';
  document.getElementById('objectB').style.top = '0px';
  document.getElementById('info').textContent = '';
  velocities = [0, 0];
  positions = [0, 0];
  finished = [false, false];
}

populateOptions();