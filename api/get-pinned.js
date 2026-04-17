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
  res.status(200).json(data.data.user.pinnedItems.nodes);
}