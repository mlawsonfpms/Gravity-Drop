const gravityMap = {
    mercury: 3.7,
    venus: 8.87,
    earth: 9.81,
    moon: 1.62,
    mars: 3.71,
    jupiter: 24.79,
    saturn: 10.44,
    uranus: 8.69,
    neptune: 11.15,
    pluto: 0.62
};

const objectImages = {
    feather: "assets/feather2.png",
    ball: "assets/ball2.png",
    car: "assets/car2.png",
    rock: "assets/rock.png",
    paper: "assets/paper2.png",
    piano: "assets/piano2.png"
};

function dropObjects() {
    const planet = document.getElementById("planet-select").value;
    const object = document.getElementById("object-select").value;
    const airResistance = document.getElementById("air-resistance").checked;

    const gravity = gravityMap[planet];
    const duration = Math.sqrt((2 * 400) / gravity).toFixed(2);

    const left = document.getElementById("object-left");
    const right = document.getElementById("object-right");

    left.src = objectImages[object];
    right.src = objectImages[object];

    left.style.left = "30%";
    right.style.left = "60%";
    left.style.top = right.style.top = "0px";

    const durationMs = airResistance ? duration * 1200 : duration * 1000;

    setTimeout(() => {
        left.style.transition = `top ${durationMs}ms linear`;
        right.style.transition = `top ${durationMs}ms linear`;
        left.style.top = right.style.top = "400px";

        document.getElementById("info").innerText =
            `${planet.charAt(0).toUpperCase() + planet.slice(1)} gravity: ${gravity} m/s² — Time: ${duration}s`;
    }, 100);
}

function reset() {
    document.getElementById("object-left").style.top = "0px";
    document.getElementById("object-right").style.top = "0px";
    document.getElementById("info").innerText = "";
}