
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.6;

function startDrop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(canvas.width / 4, 50, 20, 0, Math.PI * 2);
  ctx.arc(canvas.width * 3 / 4, 50, 20, 0, Math.PI * 2);
  ctx.fill();
}

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
