const GRAVITY_DATA = {
    Sun: 274.0, Jupiter: 24.79, Neptune: 11.15, Saturn: 10.44,
    Earth: 9.81, Uranus: 8.69, Venus: 8.9, Mars: 3.7,
    Mercury: 3.7, 'The Moon': 1.62, Pluto: 0.58,
};
const ITEM_DATA = {
    'Rock (5 kg)': { mass: 5.0, dragArea: 0.03, symbol: '🪨', color: '#6e6e6e' },
    'Bowling Ball (7.2 kg)': { mass: 7.2, dragArea: 0.018, symbol: '🎳', color: '#1a1a1a' },
    'Piece of Paper (0.005 kg)': { mass: 0.005, dragArea: 0.5, symbol: '📄', color: '#ffffff', border: '1px solid #ccc' },
    'Piano (200 kg)': { mass: 200.0, dragArea: 2.0, symbol: '🎹', color: '#8b4513' },
    'Car (1500 kg)': { mass: 1500.0, dragArea: 5.0, symbol: '🚗', color: '#007bff' },
};
const DROP_DISTANCE_M = 1000;
const ANIMATION_HEIGHT_PX = 600;
const AIR_DENSITY_RHO = 1.225;

const UI = {
    location1: document.getElementById('location-1'),
    item1: document.getElementById('item-1'),
    gravity1: document.getElementById('gravity-1'),
    time1: document.getElementById('time-1'),
    object1: document.getElementById('object-1'),
    timer1: document.getElementById('timer-1'),
    air1: document.getElementById('air-resistance-1'),

    location2: document.getElementById('location-2'),
    item2: document.getElementById('item-2'),
    gravity2: document.getElementById('gravity-2'),
    time2: document.getElementById('time-2'),
    object2: document.getElementById('object-2'),
    timer2: document.getElementById('timer-2'),
    air2: document.getElementById('air-resistance-2'),

    startButton: document.getElementById('start-button'),
    resetButton: document.getElementById('reset-button'),
};

let simState = { isRunning: false, lastTime: 0, animationFrameId: null,
    t1:0,y1:0,v1:0, t2:0,y2:0,v2:0 };

function updatePanelDisplay(panelNum) {
    const locationEl = UI[`location${panelNum}`];
    const gravityEl = UI[`gravity${panelNum}`];
    const g = GRAVITY_DATA[locationEl.value];
    gravityEl.textContent = g.toFixed(2);
    const itemEl = UI[`item${panelNum}`];
    const objectEl = UI[`object${panelNum}`];
    const itemData = ITEM_DATA[itemEl.value];
    objectEl.innerHTML = itemData.symbol;
    objectEl.style.backgroundColor = itemData.color;
    objectEl.style.border = itemData.border || 'none';
    objectEl.style.transform = `translateY(0px)`;
    UI[`time${panelNum}`].textContent = '—';
}

function stepSimulation(panelNum, dt) {
    const g = GRAVITY_DATA[UI[`location${panelNum}`].value];
    const itemData = ITEM_DATA[UI[`item${panelNum}`].value];
    const airToggle = UI[`air${panelNum}`].checked;
    let { t, y, v } = { t: simState[`t${panelNum}`], y: simState[`y${panelNum}`], v: simState[`v${panelNum}`] };
    if (y >= DROP_DISTANCE_M) return;
    let a = g;
    if (airToggle && v > 0 && UI[`location${panelNum}`].value === 'Earth') {
        const dragForce = 0.5 * AIR_DENSITY_RHO * v * v * itemData.dragArea;
        a -= dragForce / itemData.mass;
    }
    v += a * dt; y += v * dt; t += dt;
    if (y >= DROP_DISTANCE_M) {
        y = DROP_DISTANCE_M;
        UI[`time${panelNum}`].textContent = t.toFixed(2) + ' s';
    }
    simState[`t${panelNum}`] = t; simState[`y${panelNum}`] = y; simState[`v${panelNum}`] = v;
    const objectEl = UI[`object${panelNum}`];
    const timerEl = UI[`timer${panelNum}`];
    const yPx = (y / DROP_DISTANCE_M) * ANIMATION_HEIGHT_PX;
    objectEl.style.transform = `translateY(${yPx}px)`;
    timerEl.textContent = `${t.toFixed(2)} s`;
}

function animate(timestamp) {
    if (!simState.isRunning) return;
    if (!simState.lastTime) simState.lastTime = timestamp;
    const elapsed = timestamp - simState.lastTime;
    simState.lastTime = timestamp;
    const dt = elapsed / 1000;
    stepSimulation(1, dt); stepSimulation(2, dt);
    const finished1 = simState.y1 >= DROP_DISTANCE_M;
    const finished2 = simState.y2 >= DROP_DISTANCE_M;
    if (!finished1 || !finished2) {
        simState.animationFrameId = requestAnimationFrame(animate);
    } else {
        simState.isRunning = false;
        UI.startButton.textContent = "FINISHED";
    }
}

function handleStart() {
    if (simState.isRunning) return;
    simState.isRunning = true; simState.lastTime = 0;
    simState.t1=simState.y1=simState.v1=0;
    simState.t2=simState.y2=simState.v2=0;
    UI.startButton.textContent = "RUNNING...";
    UI.startButton.disabled = true; UI.resetButton.disabled = false;
    simState.animationFrameId = requestAnimationFrame(animate);
}

function handleReset() {
    if (simState.animationFrameId) cancelAnimationFrame(simState.animationFrameId);
    UI.object1.style.transform = `translateY(0px)`;
    UI.object2.style.transform = `translateY(0px)`;
    UI.timer1.textContent = '0.00 s'; UI.timer2.textContent = '0.00 s';
    simState.isRunning=false; simState.animationFrameId=null;
    simState.t1=simState.y1=simState.v1=0; simState.t2=simState.y2=simState.v2=0;
    UI.startButton.textContent="START SIMULATION"; UI.startButton.disabled=false; UI.resetButton.disabled=true;
    updatePanelDisplay(1); updatePanelDisplay(2);
}

function init() {
    for (const location in GRAVITY_DATA) {
        UI.location1.add(new Option(location, location));
        UI.location2.add(new Option(location, location));
    }
    UI.location1.value='Earth'; UI.location2.value='Mars';
    for (const item in ITEM_DATA) {
        UI.item1.add(new Option(item, item)); UI.item2.add(new Option(item, item));
    }
    UI.item1.value='Bowling Ball (7.2 kg)'; UI.item2.value='Piece of Paper (0.005 kg)';
    UI.startButton.addEventListener('click', handleStart);
    UI.resetButton.addEventListener('click', handleReset);
    UI.location1.addEventListener('change', () => { updatePanelDisplay(1); handleReset(); });
    UI.item1.addEventListener('change', () => { updatePanelDisplay(1); handleReset(); });
    UI.location2.addEventListener('change', () => { updatePanelDisplay(2); handleReset(); });
    UI.item2.addEventListener('change', () => { updatePanelDisplay(2); handleReset(); });
    UI.air1.addEventListener('change', handleReset);
    UI.air2.addEventListener('change', handleReset);
    handleReset();
}
document.addEventListener('DOMContentLoaded', init);
