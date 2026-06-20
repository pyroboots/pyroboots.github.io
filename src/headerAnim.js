const title = document.querySelector("header h1");
const originalText = title.textContent;
const scrambleChars = "abcdefghijklmnopqrstuvwxyz0123456789";
let loopInterval = null;
let passDelayTimeout = null;
let index = 0;
const speed = 50;
const passDelay = 350;

const gradientStops = [
    { pos: 0, color: [122, 162, 247] },
    { pos: 0.5, color: [187, 154, 247] },
    { pos: 1, color: [255, 158, 100] },
];

const letterPositions = [...originalText].reduce((acc, char, i) => {
    if (char.trim() !== "" && char !== "[" && char !== "]") acc.push(i);
    return acc;
}, []);

const whiteLayer = document.createElement("span");
whiteLayer.className = "title-white";
whiteLayer.textContent = originalText;

const hueLayer = document.createElement("span");
hueLayer.className = "title-hue";
hueLayer.setAttribute("aria-hidden", "true");
hueLayer.textContent = originalText;

title.replaceChildren(whiteLayer, hueLayer);

function isScrambleable(char) {
    return char.trim() !== "" && char !== "[" && char !== "]";
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function gradientColorAt(t) {
    const clamped = Math.max(0, Math.min(1, t));

    for (let i = 0; i < gradientStops.length - 1; i++) {
        const start = gradientStops[i];
        const end = gradientStops[i + 1];
        if (clamped >= start.pos && clamped <= end.pos) {
            const mix = (clamped - start.pos) / (end.pos - start.pos);
            return [
                Math.round(lerp(start.color[0], end.color[0], mix)),
                Math.round(lerp(start.color[1], end.color[1], mix)),
                Math.round(lerp(start.color[2], end.color[2], mix)),
            ];
        }
    }

    return gradientStops[gradientStops.length - 1].color;
}

function colorForIndex(charIndex) {
    const letterSlot = letterPositions.indexOf(charIndex);
    const t = letterPositions.length > 1
        ? letterSlot / (letterPositions.length - 1)
        : 0;
    return gradientColorAt(t);
}

function scrambleAt(activeIndex) {
    return [...originalText]
        .map((char, i) => {
            if (i !== activeIndex || !isScrambleable(char)) return char;
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join("");
}

function clipToChar(layer, charIndex) {
    const textNode = layer.firstChild;
    if (!textNode || charIndex < 0 || charIndex >= layer.textContent.length) {
        layer.style.clipPath = "inset(100%)";
        return;
    }

    const range = document.createRange();
    range.setStart(textNode, charIndex);
    range.setEnd(textNode, charIndex + 1);

    const charRect = range.getBoundingClientRect();
    const layerRect = layer.getBoundingClientRect();

    if (charRect.width === 0 && charRect.height === 0) {
        layer.style.clipPath = "inset(100%)";
        return;
    }

    const pad = 3;
    const top = Math.max(0, charRect.top - layerRect.top - pad);
    const left = Math.max(0, charRect.left - layerRect.left - pad);
    const right = Math.max(0, layerRect.right - charRect.right - pad);
    const bottom = Math.max(0, layerRect.bottom - charRect.bottom - pad);

    layer.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
}

function renderText(activeIndex, text) {
    whiteLayer.textContent = text;
    hueLayer.textContent = text;

    if (!isScrambleable(originalText[activeIndex])) {
        hueLayer.style.clipPath = "inset(100%)";
        return;
    }

    const [r, g, b] = colorForIndex(activeIndex);
    const color = `rgb(${r}, ${g}, ${b})`;
    hueLayer.style.color = color;
    hueLayer.style.textShadow = `0 0 16px rgba(${r}, ${g}, ${b}, 0.95), 0 0 36px rgba(${r}, ${g}, ${b}, 0.5)`;

    clipToChar(hueLayer, activeIndex);
}

function tick() {
    let attempts = 0;
    while (!isScrambleable(originalText[index]) && attempts < originalText.length) {
        index = (index + 1) % originalText.length;
        attempts++;
    }

    renderText(index, scrambleAt(index));
    index = (index + 1) % originalText.length;

    if (index === 0) {
        clearInterval(loopInterval);
        loopInterval = null;
        whiteLayer.textContent = originalText;
        hueLayer.textContent = originalText;
        hueLayer.style.clipPath = "inset(100%)";

        passDelayTimeout = setTimeout(() => {
            passDelayTimeout = null;
            loopInterval = setInterval(tick, speed);
        }, passDelay);
    }
}

function stopScramble() {
    clearInterval(loopInterval);
    clearTimeout(passDelayTimeout);
    loopInterval = null;
    passDelayTimeout = null;
}

title.addEventListener("mouseenter", () => {
    index = 0;
    stopScramble();
    title.classList.add("glitching");
    loopInterval = setInterval(tick, speed);
});

title.addEventListener("mouseleave", () => {
    stopScramble();
    title.classList.remove("glitching");
    whiteLayer.textContent = originalText;
    hueLayer.textContent = originalText;
    hueLayer.style.clipPath = "inset(100%)";
});