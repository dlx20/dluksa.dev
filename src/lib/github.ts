
/**
 * Fetch GitHub repositories for the configured user.
 */
export const fetchGithubRepos = async () => {
    "use cache";
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username) {
    throw new Error("Username or access token not found!");
  }

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": username,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch GitHub repositories: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
};
