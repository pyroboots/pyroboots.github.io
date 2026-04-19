export default async function handler(req, res) {
    try {
        const headers = {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'pyroboots-portfolio'
        };

        // get the fucking events
        const eventsResponse = await fetch('https://api.github.com/users/pyroboots/events/public', { headers });
        const events = await eventsResponse.json();

        // some magifuckery idk what this does
        const recentRepos = [...new Set(events
            .filter(e => e.type === 'PushEvent')
            .map(e => e.repo.name)
        )];

        // get the ACTUAL commits holy shit this took ages
        const commitPromises = recentRepos.map(async (repoName) => {
            const commitRes = await fetch(`https://api.github.com/repos/${repoName}/commits?per_page=2`, { headers });
            const commitData = await commitRes.json();
            
            return commitData.map(c => ({
                repo: repoName.split('/').pop(),
                timestamp: c.commit.author.date,
                message: c.commit.message,
                url: c.html_url
            }));
        });

        const results = await Promise.all(commitPromises);
        
        // flatten and sort istg
        const allCommits = results.flat()
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(allCommits);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "failed to fetch descriptive commits" });
    }
}