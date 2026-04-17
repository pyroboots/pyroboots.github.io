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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; 
    dots.forEach(dot => {
        const dx = mouse.x - dot.baseX;
        const dy = mouse.y - dot.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < pullRadius) {
            const targetX = dot.baseX + dx * pullStrength;
            const targetY = dot.baseY + dy * pullStrength;
            dot.x += (targetX - dot.x) * 0.1;
            dot.y += (targetY - dot.y) * 0.1;
        } else {
            dot.x += (dot.baseX - dot.x) * 0.1;
            dot.y += (dot.baseY - dot.y) * 0.1;
        }
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animate);
}

resize();
animate();