const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
const cursorGlow = document.getElementById('cursor-glow');
let dots = [];
let neighborMap = new Map();

const spacing = 80;
const mouse = { x: -1000, y: -1000 };
const pullRadius = 180;
const pullStrength = 0.45;
const lineRadius = 220;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
}

function initDots() {
    dots = [];
    neighborMap = new Map();

    for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
            dots.push({
                baseX: x + 2,
                baseY: y + 2,
                x: x + 2,
                y: y + 2,
            });
        }
    }

    dots.forEach((dot) => neighborMap.set(`${dot.baseX},${dot.baseY}`, dot));
    dots.forEach((dot) => {
        dot.right = neighborMap.get(`${dot.baseX + spacing},${dot.baseY}`);
        dot.down = neighborMap.get(`${dot.baseX},${dot.baseY + spacing}`);
    });
}

function drawLine(a, b, mouseDist) {
    const alpha = (1 - mouseDist / lineRadius) * 0.18;
    if (alpha <= 0) return;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 0.6;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}

function updateCursorGlow() {
    if (!cursorGlow) return;
    cursorGlow.style.left = `${mouse.x}px`;
    cursorGlow.style.top = `${mouse.y}px`;
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    updateCursorGlow();
});

window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
    if (cursorGlow) cursorGlow.style.opacity = '0';
});

window.addEventListener('mouseenter', () => {
    if (cursorGlow) cursorGlow.style.opacity = '1';
});

window.addEventListener('resize', resize);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach((dot) => {
        const pullDx = mouse.x - dot.baseX;
        const pullDy = mouse.y - dot.baseY;
        const dist = Math.sqrt(pullDx * pullDx + pullDy * pullDy);

        if (dist < pullRadius) {
            const targetX = dot.baseX + pullDx * pullStrength;
            const targetY = dot.baseY + pullDy * pullStrength;
            dot.x += (targetX - dot.x) * 0.12;
            dot.y += (targetY - dot.y) * 0.12;
        } else {
            dot.x += (dot.baseX - dot.x) * 0.1;
            dot.y += (dot.baseY - dot.y) * 0.1;
        }

        const glowDx = dot.x - mouse.x;
        const glowDy = dot.y - mouse.y;
        const mouseDist = Math.sqrt(glowDx * glowDx + glowDy * glowDy);
        const proximity = Math.max(0, 1 - mouseDist / 300);
        const alpha = 0.18 + proximity * 0.55;
        const radius = 1 + proximity * 0.9;

        if (dot.right) {
            const lineDist = Math.min(mouseDist, Math.hypot(dot.right.x - mouse.x, dot.right.y - mouse.y));
            drawLine(dot, dot.right, lineDist);
        }
        if (dot.down) {
            const lineDist = Math.min(mouseDist, Math.hypot(dot.down.x - mouse.x, dot.down.y - mouse.y));
            drawLine(dot, dot.down, lineDist);
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

resize();
animate();