export default async function handler(req, res) {
  const query = `
    {
      user(login: "pyroboots") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              primaryLanguage {
                name
                color
              }
              openGraphImageUrl
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (data.errors) {
    return res.status(500).json({ error: data.errors[0].message });
  }

  // flatten for simplicity
  const repos = data.data.user.pinnedItems.nodes.map(repo => ({
    name: repo.name,
    description: repo.description,
    url: repo.url,
    stars: repo.stargazerCount,
    language: repo.primaryLanguage?.name,
    image: repo.openGraphImageUrl,
    commits: repo.defaultBranchRef?.target?.history?.totalCount || 0
  }));

  res.status(200).json(repos);
}