const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let wave = null;
let showText = false;
let textAlpha = 0; // opacité du texte pour fondu

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;

        this.state = "moving";
        this.speed = 2;

        const angle = Math.atan2(
            this.centerY - this.y,
            this.centerX - this.x
        );

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        this.alpha = 1;
        this.radius = 3;
    }

    update() {
        if (this.state === "moving") {
            this.x += this.vx;
            this.y += this.vy;

            const dx = this.centerX - this.x;
            const dy = this.centerY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 15) {
                this.state = "exploding";

                const explosionAngle = Math.random() * Math.PI * 2;
                const explosionSpeed = Math.random() * 5 + 2;

                this.vx = Math.cos(explosionAngle) * explosionSpeed;
                this.vy = Math.sin(explosionAngle) * explosionSpeed;
            }
        } else if (this.state === "exploding") {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.03;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Wave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.alpha = 1;
    }

    update() {
        this.radius += 6;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

function createParticles() {
    for (let i = 0; i < 120; i++) {
        particles.push(new Particle());
    }
}

function drawText(alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "white";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAMING MODE", canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 20, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    particles = particles.filter(p => p.alpha > 0);

    // ✅ Quand toutes les particules ont disparu, créer l'onde et commencer le texte
    if (!showText && particles.length === 0) {
        showText = true;
        wave = new Wave(canvas.width / 2, canvas.height / 2);
    }

    // Mettre à jour l’onde si elle existe
    if (wave) {
        wave.update();
        wave.draw();
    }

    // Fondu du texte
    if (showText && textAlpha < 1) {
        textAlpha += 0.01; // vitesse du fondu
    }

    if (showText) {
        drawText(textAlpha);
    }

    requestAnimationFrame(animate);
}

createParticles();
animate();