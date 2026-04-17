const title = document.querySelector('header h1');
const originalText = title.innerText;
const chars = "0123456789!@#$%^&*";
let loopInterval = null;
const speed = 50; 

title.addEventListener("mouseenter", () => {
    let index = 0;
    clearInterval(loopInterval);
    loopInterval = setInterval(() => {
        const scrambled = originalText.split("").map((char, i) => {
            if (i === index && char.trim() !== "" && char !== "[" && char !== "]") {
                return chars[Math.floor(Math.random() * chars.length)];
            }
            return originalText[i];
        }).join("");
        title.innerText = scrambled;
        index++;
        if (index >= originalText.length) index = 0;
    }, speed);
});

title.addEventListener("mouseleave", () => {
    clearInterval(loopInterval);
    title.innerText = originalText;
});

async function fetchPinnedRepos() {
    const container = document.getElementById('pinned-repos-container');
    try {
        const response = await fetch('/api/get-pinned');
        const repos = await response.json();
        container.innerHTML = '';
        repos.forEach(repo => {
            container.innerHTML += `
                <a href="${repo.url}" class="project-link" target="_blank">
                    <div class="project-card">
                        <img src="${repo.image}" alt="${repo.name}">
                        <div class="project-info">
                            <h3>[ ${repo.name} ]</h3>
                            <p>${repo.description || 'no description :('}</p>
                            <div style="margin-top: 10px;">
                                <span class="skill-tag">${repo.language || 'code'}</span>
                                <span class="skill-tag">${repo.commits} commit${repo.commits != 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                </a>`;
        });
    } catch (e) {
        container.innerHTML = '<p>backend offline or token expired :(</p>';
    }
}   
fetchPinnedRepos();

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