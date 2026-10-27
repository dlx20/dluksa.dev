

// Fetch GitHub repositories
export const fetchGithubRepos = async (username: string) => {
  const res = await fetch(`https://api.github.com/users/${username}/repos`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub repositories: ${res.status}`);
  }

  return res.json();
};
