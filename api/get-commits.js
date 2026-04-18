export default async function handler(req, res) {
    try {
        const response = await fetch('https://api.github.com/users/pyroboots/events/public', {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'User-Agent': 'pyroboots-portfolio'
            }
        });

        if (!response.ok) return res.status(response.status).json([]);

        const events = await response.json();
        let activityLog = [];

        events.forEach(event => {
            const repoName = event.repo.name.split('/').pop();
            const dateObj = new Date(event.created_at);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear().toString().slice(-2)}`;

            if (event.type === 'PushEvent' && event.payload.commits) {
                // EVERY commit in the push
                event.payload.commits.forEach(c => {
                    activityLog.push({
                        repo: repoName,
                        date: formattedDate,
                        rawDate: event.created_at,
                        message: c.message.split('\n')[0],
                        url: `https://github.com/${event.repo.name}/commit/${c.sha}`
                    });
                });
            } else if (event.type === 'CreateEvent') {
                // branch/repo creation as a backup
                activityLog.push({
                    repo: repoName,
                    date: formattedDate,
                    rawDate: event.created_at,
                    message: `sys_event: created ${event.payload.ref_type || 'repository'}`,
                    url: `https://github.com/${event.repo.name}`
                });
            }
        });

        // sort and cap at 20
        const result = activityLog
            .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
            .slice(0, 20);

        res.setHeader('Cache-Control', 'no-store, max-age=0'); // Disable cache for this final test
        res.status(200).json(result);
        
    } catch (e) {
        console.error("Critical Failure:", e);
        res.status(500).json([]);
    }
}