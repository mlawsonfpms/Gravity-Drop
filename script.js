
function $(id) {
  return document.getElementById(id);
}

function startDrop() {
  const leftPlanet = parseFloat($("leftPlanet").value);
  const rightPlanet = parseFloat($("rightPlanet").value);
  const air = $("airResistance").checked;

  const leftObj = $("leftObject").value;
  const rightObj = $("rightObject").value;

  const leftImg = $("leftObjectImg");
  const rightImg = $("rightObjectImg");

  leftImg.src = `assets/${leftObj}.png`;
  rightImg.src = `assets/${rightObj}.png`;

  leftImg.style.top = "0px";
  rightImg.style.top = "0px";

  $("leftTimer").textContent = "";
  $("rightTimer").textContent = "";

  animateDrop(leftImg, leftPlanet, air, $("leftTimer"));
  animateDrop(rightImg, rightPlanet, air, $("rightTimer"));
}

function resetSim() {
  $("leftObjectImg").style.top = "0px";
  $("rightObjectImg").style.top = "0px";
  $("leftTimer").textContent = "";
  $("rightTimer").textContent = "";
}

function animateDrop(img, gravity, airResistance, timerEl) {
  const start = performance.now();
  const height = img.parentElement.offsetHeight - img.offsetHeight - 5;

  function step(time) {
    const elapsed = (time - start) / 1000;
    let dist = 0.5 * gravity * elapsed * elapsed;
    if (airResistance) dist *= 0.7;

    if (dist >= height) {
      dist = height;
      timerEl.textContent = `Time: ${elapsed.toFixed(2)}s`;
    }

    img.style.top = `${dist}px`;

    if (dist < height) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
