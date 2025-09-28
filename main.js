
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;
const friction = 0.8;

class ObjectImage {
  constructor(src, x, y, vx, vy) {
    this.img = new Image();
    this.img.src = src;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = 80;
    this.height = 80;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.y + this.height + this.vy > canvas.height) {
      this.vy = -this.vy * friction;
      this.y = canvas.height - this.height;
    } else {
      this.vy += gravity;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.draw();
  }
}

const objects = [
  new ObjectImage("assets/ball.png", 50, 50, 2, 2),
  new ObjectImage("assets/car.png", 150, 50, 2, 2),
  new ObjectImage("assets/feather.png", 250, 50, 2, 2),
  new ObjectImage("assets/paper.png", 350, 50, 2, 2),
  new ObjectImage("assets/piano.png", 450, 50, 2, 2),
  new ObjectImage("assets/rock.png", 550, 50, 2, 2)
];

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let obj of objects) {
    obj.update();
  }
}

animate();
