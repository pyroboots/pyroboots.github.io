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

        const pushes = events
            .filter(event => event.type === 'PushEvent')
            .map(push => {
                // GET THE ACTUAL FUCKING COMMIT BRO
                const commits = push.payload.commits || [];
                const latestMessage = commits.length > 0 
                    ? commits[0].message 
                    : `pushed to ${push.payload.ref.split('/').pop()}`;

                return {
                    repo: push.repo.name.split('/').pop(), // just the repo name, no username
                    timestamp: push.created_at,
                    message: latestMessage,
                    url: `https://github.com/${push.repo.name}`
                };
            })
            .slice(0, 5);

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(pushes);
        
    } catch (error) {
        res.status(500).json({ error: "processing error", details: error.message });
    }
}