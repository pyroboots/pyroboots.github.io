export default async function handler(req, res) {
    try {
        const response = await fetch('https://api.github.com/users/pyroboots/events/public', {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'User-Agent': 'pyroboots-portfolio'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'GitHub API offline' });
        }

        const events = await response.json();
        let activityLog = [];

        events.forEach(event => {
            const repoName = event.repo.name.split('/').pop();
            const time = event.created_at;

            // if it's a push grab EVERY commit in that push
            if (event.type === 'PushEvent' && event.payload.commits) {
                event.payload.commits.forEach(commit => {
                    activityLog.push({
                        repo: repoName,
                        timestamp: time,
                        message: commit.message,
                        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
                        type: 'commit'
                    });
                });
            } 
            // fallback: if no commits found at least show the event (created repo etc.)
            else if (event.type === 'CreateEvent' || event.type === 'WatchEvent') {
                activityLog.push({
                    repo: repoName,
                    timestamp: time,
                    message: event.type === 'CreateEvent' ? `created ${event.payload.ref_type}` : 'starred repository',
                    url: `https://github.com/${event.repo.name}`,
                    type: 'activity'
                });
            }
        });

        // sort and limit to 20
        const result = activityLog
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 20);

        res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate'); // low cache for all these fucking oushes ong
        res.status(200).json(result);
        
    } catch (error) {
        // i learned my lesson: log to vercel.
        console.error("Pipeline Error:", error);
        res.status(500).json({ error: "server error", details: error.message });
    }
}