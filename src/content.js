const art = [
    {
        "img": "img/liminal_trace.jpeg",
        "name": "liminal 01",
        "tags": ["path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "33m render time"
        ]
    },
    {
        "img": "img/outside_trace.jpeg",
        "name": "outside 01",
        "tags": ["path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "46m render time"
        ]
    },
    {
        "img": "img/outside2_trace.jpeg",
        "name": "outside 02",
        "tags": ["path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "37m render time"
        ]
    },
    {
        "img": "img/outside3_trace.jpeg",
        "name": "outside 03",
        "tags": ["deferred"],
        "meta": [
            "1m 06s render time"
        ]
    },
    {
        "img": "img/poolhall_trace.jpeg",
        "name": "poolhall 01",
        "tags": ["path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "29m render time"
        ]
    },
    {
        "img": "img/poolhall2_trace.jpeg",
        "name": "poolhall 02",
        "tags": ["path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "28m render time"
        ]
    },
    {
        "img": "img/tunnel_trace2.jpeg",
        "name": "tunnel 01",
        "tags": ["path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "18m render time"
        ]
    }
]

async function addContent() {
    const gallery = document.getElementById("art-gallery");

    art.forEach((a) => {
        let tagsHTML = "";
        a.tags.forEach((t) => {
            tagsHTML += `<span class="skill-tag">${t}</span>\n`
        })

        let metaHTML = "";
        a.meta.forEach((m) => {
            metaHTML += `<p>- ${m}</p>\n`
        })

        gallery.innerHTML += `
                    <a href="${a.img}" class="project-link">
                <div class="project-card">
                    <img src="${a.img}" alt="${a.name}">
                    <div class="project-info">
                        <h3>[ ${a.name} ]</h3>
                        ${tagsHTML}
                        <p>&nbsp;</p>
                        ${metaHTML}
                    </div>
                </div>
            </a>`;
    })
}

addContent();