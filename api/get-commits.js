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

        const activity = events
            .filter(event => event.type === 'PushEvent')
            .map(push => {
                // maybe now?
                const commitMessage = (push.payload.commits && push.payload.commits.length > 0)
                    ? push.payload.commits[0].message
                    : `pushed to ${push.payload.ref.split('/').pop()}`; // "pushed to main"

                return {
                    repo: push.repo.name.replace('pyroboots/', ''),
                    timestamp: push.created_at,
                    message: commitMessage,
                    url: `https://github.com/${push.repo.name}`
                };
            })
            .slice(0, 5);

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(activity);
        
    } catch (error) {
        res.status(500).json({ error: "processing error", details: error.message });
    }
}