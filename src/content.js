import { art } from "/data/art.js";
import { logs } from "/data/logs.js";
import { formatLink, initGalleryLightbox } from "/src/lightbox.js";

async function addArt() {
    const gallery = document.getElementById("gallery-container");
    art.toReversed().forEach((a) => {
        let tagsHTML = "";
        a.tags.forEach((t) => {
            tagsHTML += `<span class="skill-tag">#${t.replaceAll(" ", "-")}</span>\n`
        })

        let metaHTML = "";
        a.meta.forEach((m) => {
            metaHTML += `<p>- ${m}</p>\n`
        })

        const linkHTML = a.link == undefined ? "" : `
            <p>&nbsp;</p>
            <a href="${a.link}" class="skill-tag gallery-link-tag" target="_blank" rel="noopener noreferrer">${formatLink(a.link)}</a>`;

        gallery.innerHTML += `
            <div class="gallery-item project-link" role="button" tabindex="0" data-img="${a.img}" data-name="${a.name}" aria-label="view ${a.name}">
                <div class="project-card">
                    <img src="${a.img}" alt="${a.name}">
                    <div class="project-info">
                        <h3>[ ${a.name.replaceAll(" ", "_")} ]</h3>
                        ${tagsHTML}
                        <p>&nbsp;</p>
                        ${metaHTML}
                        ${linkHTML}
                    </div>
                </div>
            </div>`;
    })

    initGalleryLightbox();
}

async function addLogs() {
    const blog = document.getElementById("blog-container");
    logs.toReversed().forEach((log) => {
        let htmlContent = "";
        
        log.desc.split("\n").forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return; // Skip empty lines

            if (trimmed.startsWith("# ")) {
                htmlContent += `<h3 class="blog-heading">${trimmed.replace("# ", "")}</h3>\n`;
            } else if (trimmed.startsWith("## ")) {
                htmlContent += `<h4 class="blog-subheading">${trimmed.replace("## ", "")}</h4>\n`;
            } else if (trimmed.startsWith("> ")) {
                htmlContent += `<p class="blog-note">${trimmed.replace("> ", "")}</p>\n`;
            } else {
                htmlContent += `<p>${trimmed}</p>\n`;
            }
        });

        blog.innerHTML += `
            <div class="project-card blog-post">
                <div class="project-info">
                    <div class="blog-meta">
                        <span class="skill-tag">${log.date}</span>
                        <h3 class="blog-title">[ ${log.title.replaceAll(" ", "_")} ]</h3>
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