const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const gravityData = {
    Earth: 9.8, Moon: 1.6, Mars: 3.7, Jupiter: 24.8, Mercury: 3.7,
    Venus: 8.9, Saturn: 10.4, Uranus: 8.7, Neptune: 11.2, Pluto: 0.6
};
const objectData = {
    Feather: { image: 'feather2.png', mass: 0.02 },
    Rock: { image: 'rock.png', mass: 1 },
    Paper: { image: 'paper2.png', mass: 0.05 },
    Piano: { image: 'piano2.png', mass: 100 },
    Car: { image: 'car2.png', mass: 1000 },
    Ball: { image: 'ball2.png', mass: 0.5 }
};
let drops = [];

function populateSelectors() {
    const planets = Object.keys(gravityData);
    const objects = Object.keys(objectData);
    [planet1, planet2].forEach(sel => {
        planets.forEach(p => {
            const opt = document.createElement('option');
            opt.value = opt.text = p;
            sel.appendChild(opt);
        });
    });
    [object1, object2].forEach(sel => {
        objects.forEach(o => {
            const opt = document.createElement('option');
            opt.value = opt.text = o;
            sel.appendChild(opt);
        });
    });
    planet2.value = "Moon";
    object2.value = "Rock";
}

function drop() {
    drops = [createDrop(100, planet1.value, object1.value), createDrop(800, planet2.value, object2.value)];
    animate();
}

function reset() {
    drops = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('info').textContent = "";
}

function createDrop(x, planet, object) {
    const gravity = gravityData[planet];
    const { image, mass } = objectData[object];
    const air = document.getElementById('airResistance').checked;
    return {
        x, y: 0, v: 0, t: 0,
        gravity, air, mass,
        img: (() => {
            const i = new Image();
            i.src = `assets/${image}`;
            return i;
        })(),
        object, planet
    };
}

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let done = 0;
    drops.forEach(drop => {
        if (drop.y < canvas.height - 100) {
            drop.t += 0.016;
            let acc = drop.gravity;
            if (drop.air) acc *= 0.5 * (1 / drop.mass);
            drop.v += acc * 0.016;
            drop.y += drop.v;
        } else {
            done++;
        }
        ctx.drawImage(drop.img, drop.x - 25, drop.y, 50, 50);
    });
    if (done < drops.length) requestAnimationFrame(animate);
    else showInfo();
}

function showInfo() {
    const info = drops.map(d => `${d.planet} gravity: ${d.gravity} m/s²`).join(" | ");
    const time = Math.max(...drops.map(d => d.t)).toFixed(2);
    document.getElementById('info').textContent = `${info} | Time: ${time} s`;
}

populateSelectors();
