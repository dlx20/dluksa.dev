// Fetch GitHub repositories

export const fetchGithubRepos = async () => {
    'use cache'
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username) {
    throw new Error("Username or Access token not found!");
  }
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub repositories: ${res.status}`);
  }


  return res.json();
};
