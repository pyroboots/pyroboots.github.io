// sticky grid logic
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
let dots = [];

const spacing = 80; 
const mouse = { x: -1000, y: -1000 };
const pullRadius = 150; 
const pullStrength = 0.4; 

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
}

function initDots() {
    dots = [];
    for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
            dots.push({
                baseX: x + 2,
                baseY: y + 2,
                x: x + 2,
                y: y + 2
            });
        }
    }
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', resize);
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(dot => {
        const pullDx = mouse.x - dot.baseX;
        const pullDy = mouse.y - dot.baseY;
        const dist = Math.sqrt(pullDx * pullDx + pullDy * pullDy);
        if (dist < pullRadius) {
            const targetX = dot.baseX + pullDx * pullStrength;
            const targetY = dot.baseY + pullDy * pullStrength;
            dot.x += (targetX - dot.x) * 0.1;
            dot.y += (targetY - dot.y) * 0.1;
        } else {
            dot.x += (dot.baseX - dot.x) * 0.1;
            dot.y += (dot.baseY - dot.y) * 0.1;
        }
        const glowDx = dot.x - mouse.x;
        const glowDy = dot.y - mouse.y;
        const mouseDist = Math.sqrt(glowDx * glowDx + glowDy * glowDy);
        const proximity = Math.max(0, 1 - mouseDist / 280);
        const alpha = 0.22 + proximity * 0.45;
        const radius = 1 + proximity * 0.6;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animate);
}

resize();
animate();