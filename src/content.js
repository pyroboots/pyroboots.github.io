const art = [
    {
        "img": "img/liminal_trace.jpeg",
        "name": "liminal 01",
        "tags": ["unreal engine", "path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "33m render time"
        ]
    },
    {
        "img": "img/outside_trace.jpeg",
        "name": "outside 01",
        "tags": ["unreal engine", "path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "46m render time"
        ]
    },
    {
        "img": "img/outside2_trace.jpeg",
        "name": "outside 02",
        "tags": ["unreal engine", "path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "37m render time"
        ]
    },
    {
        "img": "img/outside3_trace.jpeg",
        "name": "outside 03",
        "tags": ["unreal engine", "deferred"],
        "meta": [
            "1m 06s render time"
        ]
    },
    {
        "img": "img/poolhall_trace.jpeg",
        "name": "poolhall 01",
        "tags": ["unreal engine", "path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "29m render time"
        ]
    },
    {
        "img": "img/poolhall2_trace.jpeg",
        "name": "poolhall 02",
        "tags": ["unreal engine", "path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "28m render time"
        ]
    },
    {
        "img": "img/tunnel_trace2.jpeg",
        "name": "tunnel 01",
        "tags": ["unreal engine", "path traced"],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "18m render time"
        ]
    },
    {
        "img": "img/cat5_1.jpeg",
        "name": "catasaki 01",
        "tags": ["unreal engine", "deferred", "/!\\ cat /!\\"],
        "meta": [
            "cat 5 act 1 finale: catasaki",
            "first time using advanced particles (mesh renderer)",
            "6000+ concurrent cats"
        ]
    },
    {
        "img": "img/cat5_2.jpeg",
        "name": "catasaki 02",
        "tags": ["unreal engine", "deferred", "/!\\ cat /!\\"],
        "meta": [
            "cat 5 act 1 finale: catasaki",
            "first time using procedural content generation (pcg) for the city",
        ]
    },
    {
        "img": "img/cat5_3.jpeg",
        "name": "catasaki 03",
        "tags": ["unreal engine", "deferred", "/!\\ cat /!\\"],
        "meta": [
            "cat 5 act 1 finale: catasaki",
            "very advanced material",
            "had fun :)"
        ]
    }
]

const blog = document.getElementById("nanoblog");
const gallery = document.getElementById("art-gallery");

async function addArt() {
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

const logs = [
    {
        date: "18/04/26",
        title: "devlog 01",
        desc: `# building the dashboard
        finally got around to adding tabs.
        # the logic
        it uses a simple display: none toggle.
        > note: need to fix the mobile layout later.`
    }
];

async function addLogs() {
    logs.forEach((log) => {
        let htmlContent = "";
        
        log.desc.split("\n").forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return; // Skip empty lines

            if (trimmed.startsWith("# ")) {
                // Heading 1 level
                htmlContent += `<h3 class="blog-heading">${trimmed.replace("# ", "")}</h3>\n`;
            } else if (trimmed.startsWith("## ")) {
                // Smaller sub-heading
                htmlContent += `<h4 class="blog-subheading">${trimmed.replace("## ", "")}</h4>\n`;
            } else if (trimmed.startsWith("> ")) {
                // Blockquote/Terminal Note
                htmlContent += `<p class="blog-note">${trimmed.replace("> ", "")}</p>\n`;
            } else {
                // Regular paragraph
                htmlContent += `<p>${trimmed}</p>\n`;
            }
        });

        blog.innerHTML += `
            <div class="project-card blog-post">
                <div class="project-info">
                    <div class="blog-meta">
                        <span class="skill-tag">${log.date}</span>
                        <h3 class="blog-title">[ ${log.title} ]</h3>
                    </div>
                    <div class="blog-body">
                        ${htmlContent}
                    </div>
                </div>
            </div>`;
    });
}

addArt();
addLogs();