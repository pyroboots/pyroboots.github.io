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