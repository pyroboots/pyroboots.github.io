export default async function handler(req, res) {
    try {
        const response = await fetch('https://api.github.com/users/pyroboots/events/public', {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'User-Agent': 'pyroboots-portfolio'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'failed to fetch' });
        }

        const events = await response.json();
        let allCommits = [];

        events.forEach(event => {
            if (event.type === 'PushEvent' && event.payload.commits) {
                // GET THEM ALL
                const repoName = event.repo.name.split('/').pop();
                const pushTime = event.created_at;

                event.payload.commits.forEach(commit => {
                    allCommits.push({
                        repo: repoName,
                        timestamp: pushTime,
                        message: commit.message,
                        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`
                    });
                });
            }
        });

        // top 20 shockingly shocking commits that will shock the rocks off your socks
        const result = allCommits
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 20);

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json({ error: "processing error", details: error.message });
    }
}