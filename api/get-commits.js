export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.github.com/users/pyroboots/events/public', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'pyroboots-portfolio' // requires a user-agent header
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'failed to fetch from github :(' });
    }

    const events = await response.json();

    const pushes = events
      .filter(event => event.type === 'PushEvent')
      .map(push => ({
        repo: push.repo.name,
        timestamp: push.created_at,
        message: push.payload.commits[0]?.message || 'no message :(', // latest commit message
        url: `https://github.com/${push.repo.name}`
      }))
      .slice(0, 5);

    // don't hit rate limits constantly
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(pushes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}