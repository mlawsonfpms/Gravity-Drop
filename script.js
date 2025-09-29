// --- 1. DATA DEFINITIONS ---
const GRAVITY_DATA = {
    Sun: 274.0,
    Jupiter: 24.79,
    Neptune: 11.15,
    Saturn: 10.44,
    Earth: 9.81,
    Uranus: 8.69,
    Venus: 8.9,
    Mars: 3.7,
    Mercury: 3.7,
    'The Moon': 1.62,
    Pluto: 0.58,
};

// Item data: Mass (kg), Drag Area (Cd * A, m^2), and a display emoji/color
// Updated CdA for bowling ball and rock to be more realistic.
const ITEM_DATA = {
    'Rock (5 kg)': { mass: 5.0, dragArea: 0.03, symbol: '🪨', color: '#6e6e6e' },
    'Bowling Ball (7.2 kg)': { mass: 7.2, dragArea: 0.018, symbol: '🎳', color: '#1a1a1a' },
    'Piece of Paper (0.005 kg)': { mass: 0.005, dragArea: 0.5, symbol: '📄', color: '#ffffff', border: '1px solid #ccc' },
    'Piano (200 kg)': { mass: 200.0, dragArea: 2.0, symbol: '🎹', color: '#8b4513' },
    'Car (1500 kg)': { mass: 1500.0, dragArea: 5.0, symbol: '🚗', color: '#007bff' },
};

// Simulation Constants
const DROP_DISTANCE_M = 1000; // 1 km in meters
const ANIMATION_HEIGHT_PX = 600; // Height of the animation-area in pixels

// Approximate near-surface atmospheric densities (kg/m^3); others default to vacuum.
const ATMOSPHERE_RHO = {
    Earth: 1.225,
    Venus: 65,
    Mars: 0.020,
    // Add more if desired (e.g., Titan ~5.3) when you include them in GRAVITY_DATA.
};

// --- 2. DOM ELEMENTS AND STATE ---
const UI = {
    location1: document.getElementById('location-1'),
    item1: document.getElementById('item-1'),
    gravity1: document.getElementById('gravity-1'),
    time1: document.getElementById('time-1'),
    object1: document.getElementById('object-1'),
    timer1: document.getElementById('timer-1'),

    location2: document.getElementById('location-2'),
    item2: document.getElementById('item-2'),
    gravity2: document.getElementById('gravity-2'),
    time2: document.getElementById('time-2'),
    object2: document.getElementById('object-2'),
    timer2: document.getElementById('timer-2'),

    startButton: document.getElementById('start-button'),
    resetButton: document.getElementById('reset-button'),
    air1: document.getElementById('air-resistance-1'),
    air2: document.getElementById('air-resistance-2'),
};

let simState = {
    isRunning: false,
    startTime: 0,
    lastTime: 0,
    animationFrameId: null,

    // State for Object 1
    t1: 0, // elapsed time (s)
    y1: 0, // position (m, 0 at top)
    v1: 0, // velocity (m/s)

    // State for Object 2
    t2: 0,
    y2: 0,
    v2: 0,
};

// --- 3. HELPER FUNCTIONS ---

/**
 * Calculates the theoretical fall time without air resistance.
 * @param {number} g - Acceleration due to gravity (m/s^2).
 * @returns {number} The time to fall 1000m (s).
 */
function calculateFreeFallTime(g) {
    if (g <= 0) return Infinity;
    // t = sqrt(2 * d / g)
    return Math.sqrt((2 * DROP_DISTANCE_M) / g);
}

/**
 * Updates the display elements for a single simulation panel.
 * @param {number} panelNum - 1 or 2.
 */
function updatePanelDisplay(panelNum) {
    const locationEl = UI[`location${panelNum}`];
    const gravityEl = UI[`gravity${panelNum}`];
    const timeEl = UI[`time${panelNum}`];

    const g = GRAVITY_DATA[locationEl.value];
    const t = calculateFreeFallTime(g);

    gravityEl.textContent = g.toFixed(2);
    timeEl.textContent = t.toFixed(2);

    // Set object appearance
    const itemEl = UI[`item${panelNum}`];
    const objectEl = UI[`object${panelNum}`];
    const itemData = ITEM_DATA[itemEl.value];

    objectEl.innerHTML = itemData.symbol;
    objectEl.style.backgroundColor = itemData.color;
    objectEl.style.border = itemData.border || 'none';
    objectEl.style.transform = `translateY(0px)`;
}

// --- 4. ANIMATION & PHYSICS LOOP ---

/**
 * Advance physics for one object using semi-implicit Euler.
 * @param {number} panelNum - 1 or 2.
 * @param {number} dt - Time step (s).
 */
function stepSimulation(panelNum, dt) {
    // Clamp dt to avoid big jumps when tab regains focus
    dt = Math.min(dt, 0.05); // 50 ms max step

    const location = UI[`location${panelNum}`].value;
    const g = GRAVITY_DATA[location];
    const itemData = ITEM_DATA[UI[`item${panelNum}`].value];

    // Per-panel drag
    const airToggle = panelNum === 1 ? UI.air1 : UI.air2;
    const dragEnabled = airToggle.checked;
    const rho = dragEnabled ? (ATMOSPHERE_RHO[location] ?? 0) : 0;

    let { t, y, v } = { t: simState[`t${panelNum}`], y: simState[`y${panelNum}`], v: simState[`v${panelNum}`] };

    if (y >= DROP_DISTANCE_M) return;

    // Acceleration
    let a = g;
    if (rho > 0 && v > 0) {
        // Quadratic drag: FD = 0.5 * rho * v^2 * CdA
        const dragForce = 0.5 * rho * v * v * itemData.dragArea;
        a -= dragForce / itemData.mass;
    }

    // Semi-implicit Euler integration
    v = v + a * dt;
    y = y + v * dt;
    t = t + dt;

    // Ground collision clamp
    if (y >= DROP_DISTANCE_M) y = DROP_DISTANCE_M;

    // Save state
    simState[`t${panelNum}`] = t;
    simState[`y${panelNum}`] = y;
    simState[`v${panelNum}`] = v;

    // UI update
    const objectEl = UI[`object${panelNum}`];
    const timerEl = UI[`timer${panelNum}`];

    const yPx = (y / DROP_DISTANCE_M) * ANIMATION_HEIGHT_PX;
    objectEl.style.transform = `translateY(${yPx}px)`;
    timerEl.textContent = `${t.toFixed(2)} s`;
}

/**
 * Main animation loop.
 */
function animate(timestamp) {
    if (!simState.isRunning) return;
    if (!simState.lastTime) simState.lastTime = timestamp;

    const elapsed = timestamp - simState.lastTime;
    simState.lastTime = timestamp;

    const dt = elapsed / 1000;

    stepSimulation(1, dt);
    stepSimulation(2, dt);

    const isFinished1 = simState.y1 >= DROP_DISTANCE_M;
    const isFinished2 = simState.y2 >= DROP_DISTANCE_M;

    if (!isFinished1 || !isFinished2) {
        simState.animationFrameId = requestAnimationFrame(animate);
    } else {
        simState.isRunning = false;
        UI.startButton.textContent = "FINISHED";
        UI.startButton.disabled = false; // allow another run without changing controls
    }
}

// --- 5. EVENT HANDLERS ---

function handleStart() {
    if (simState.isRunning) return;

    // Fresh run state
    simState.isRunning = true;
    simState.lastTime = 0;
    simState.t1 = simState.y1 = simState.v1 = 0;
    simState.t2 = simState.y2 = simState.v2 = 0;

    UI.startButton.textContent = "RUNNING...";
    UI.startButton.disabled = true;
    UI.resetButton.disabled = false;

    simState.animationFrameId = requestAnimationFrame(animate);
}

function handleReset() {
    if (simState.animationFrameId) cancelAnimationFrame(simState.animationFrameId);

    // Visual reset
    UI.object1.style.transform = `translateY(0px)`;
    UI.object2.style.transform = `translateY(0px)`;
    UI.timer1.textContent = '0.00 s';
    UI.timer2.textContent = '0.00 s';

    // Internal state reset
    simState.isRunning = false;
    simState.animationFrameId = null;
    simState.t1 = simState.y1 = simState.v1 = 0;
    simState.t2 = simState.y2 = simState.v2 = 0;

    // Controls reset
    UI.startButton.textContent = "START SIMULATION";
    UI.startButton.disabled = false;
    UI.resetButton.disabled = true;

    // Info display refresh
    updatePanelDisplay(1);
    updatePanelDisplay(2);
}

// --- 6. INITIALIZATION ---
function init() {
    // Populate Location Dropdowns
    for (const location in GRAVITY_DATA) {
        const option1 = new Option(location, location);
        const option2 = new Option(location, location);
        UI.location1.add(option1);
        UI.location2.add(option2);
    }

    // Defaults
    UI.location1.value = 'Earth';
    UI.location2.value = 'Mars';

    // Populate Item Dropdowns
    for (const item in ITEM_DATA) {
        const option1 = new Option(item, item);
        const option2 = new Option(item, item);
        UI.item1.add(option1);
        UI.item2.add(option2);
    }

    // Default items
    UI.item1.value = 'Bowling Ball (7.2 kg)';
    UI.item2.value = 'Bowling Ball (7.2 kg)';

    // Event listeners
    UI.startButton.addEventListener('click', handleStart);
    UI.resetButton.addEventListener('click', handleReset);

    UI.location1.addEventListener('change', () => { updatePanelDisplay(1); handleReset(); });
    UI.item1.addEventListener('change', () => { updatePanelDisplay(1); handleReset(); });
    UI.location2.addEventListener('change', () => { updatePanelDisplay(2); handleReset(); });
    UI.item2.addEventListener('change', () => { updatePanelDisplay(2); handleReset(); });
    UI.air1.addEventListener('change', handleReset);
    UI.air2.addEventListener('change', handleReset);

    // Initial display update
    handleReset();
}

// Run initialization when the page loads
document.addEventListener('DOMContentLoaded', init);
