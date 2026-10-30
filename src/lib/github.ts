// Fetch GitHub repositories


const TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

export const fetchGithubRepos = async () => {
  "use cache";

  if (!TOKEN || !USERNAME) {
    throw new Error("Username or Access token not found!");
  }
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(USERNAME)}/repos`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub repositories: ${res.status}`);
  }

  return res.json();
};

export const fetchRepoReadme = async () => {
  'use cache'
  try {
    const data = await fetch(`https://api.github.com/repos/${USERNAME}/dluksa.dev/readme`, {
      headers: {
        'Accept': 'application/vnd.github.raw',
        Authorization: `Bearer ${TOKEN}`,
        'User-agent': 'NextJs-Readme-Fetcher'
      },
    });
    if(data.ok) return data.text();
  } catch (error) {
    // Fallback
    console.log('Failed to fetch file', error)
  }

  return null
};
