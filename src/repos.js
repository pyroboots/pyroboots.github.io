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
                        <div class="card-shine"></div>
                        <div class="img-gradient">
                            <img src="${repo.image}" alt="${repo.name}">
                        </div>
                        <div class="project-info">
                            <h3>[ ${repo.name} ]</h3>
                            <p>${repo.description || 'no description :('}</p>
                            <div class="project-meta">
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

export { fetchPinnedRepos };