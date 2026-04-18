export default async function handler(req, res) {
    try {
        const response = await fetch('https://api.github.com/users/pyroboots/events/public', {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'User-Agent': 'pyroboots-portfolio'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'failed to fetch from github' });
        }

        const events = await response.json();

        const pushes = events
            .filter(event => 
                event.type === 'PushEvent' && 
                event.payload.commits && 
                event.payload.commits.length > 0
            )
            .map(push => {
                const latestCommit = push.payload.commits[0];
                
                return {
                    repo: push.repo.name.replace('pyroboots/', ''),
                    timestamp: push.created_at,
                    message: latestCommit ? latestCommit.message : 'pushed changes',
                    url: `https://github.com/${push.repo.name}`
                };
            })
            .slice(0, 5);

        // Cache for 1 hour, but allow background refresh
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).json(pushes);
        
    } catch (error) {
        console.error("Mapping error:", error);
        res.status(500).json({ 
            error: "Internal processing error", 
            details: error.message 
        });
    }
}