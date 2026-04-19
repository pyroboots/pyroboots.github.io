import { art } from "/data/art.js";
import { logs } from "/data/logs.js";

async function addArt() {
    const gallery = document.getElementById("gallery-container");
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

async function addLogs() {
    const blog = document.getElementById("blog-container");
    logs.toReversed().forEach((log) => {
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

export {
    addArt, 
    addLogs
}