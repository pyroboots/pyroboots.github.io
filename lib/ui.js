const _stack = [];
let _tabContainer = null;
let _firstTab = true;
let _staggerIndex = 0;
const _staggerStep = 0.1;

function _current() {
    return _stack[_stack.length - 1];
}

function _append(html) {
    _current().insertAdjacentHTML("beforeend", html);
    return _current().lastElementChild;
}

function _appendStaggered(html) {
    const el = _append(html);
    el.style.animationDelay = `calc(var(--type-duration) + ${_staggerIndex * _staggerStep}s)`;
    _staggerIndex++;
    return el;
}

function init(selector = ".content") {
    _stack.length = 0;
    _stack.push(document.querySelector(selector));
    _tabContainer = null;
    _firstTab = true;
    _staggerIndex = 0;
}

function End() {
    if (_stack.length > 1) _stack.pop();
}

function Header(name) {
    const el = _append(`
        <header>
            <h1>[&nbsp;&nbsp;&nbsp;${name}&nbsp;&nbsp;&nbsp;]</h1>
            <div class="status-container">
                <span id="status-dot"></span>
                <span id="status-text">loading status...</span>
            </div>
        </header>
    `);
    _stack.push(el);
}

function Description(txt) {
    _appendStaggered(`<p class="description">${txt}</p>`);
}

function Container(className) {
    const el = _appendStaggered(`<div class="${className}"></div>`);
    _stack.push(el);
}

function Label(txt) {
    _append(`<p>${txt}</p>`);
}

function Tag(txt) {
    _append(`<span class="skill-tag">${txt}</span>`);
}

function Button(txt, link) {
    _append(`<a href="${link}" class="btn">[ ${txt} ]</a>`);
}

function Tabs(array) {
    let nav = `<nav class="dashboard-tabs">`;
    array.forEach((item, i) => {
        const label = typeof item === "string" ? item : item.label;
        const id    = typeof item === "string" ? item : item.id;
        nav += `<button class="tab-btn${i === 0 ? " active" : ""}" data-target="${id}">${label}</button>`;
    });
    nav += `</nav>`;
    _appendStaggered(nav);
    _tabContainer = _append(`<div class="tab-container"></div>`);
    _firstTab = true;
}

function Tab(name, innerId = `${name}-container`) {
    const section = document.createElement("section");
    section.id = name;
    section.className = `tab-content${_firstTab ? " active" : ""}`;
    _firstTab = false;

    const inner = document.createElement("div");
    inner.className = "gallery";
    inner.id = innerId;
    section.appendChild(inner);

    _tabContainer.appendChild(section);
    _stack.push(inner);
}

export { 
    init, 
    End, 
    Header, 
    Description, 
    Container, 
    Label, 
    Tag, 
    Button, 
    Tabs, 
    Tab 
};