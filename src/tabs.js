document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            const active = document.getElementById(target);
            if (!active || btn.classList.contains('active')) return;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active', 'tab-glitch'));

            active.classList.add('active', 'tab-glitch');
            active.addEventListener('animationend', () => {
                active.classList.remove('tab-glitch');
            }, { once: true });
        });
    });
});