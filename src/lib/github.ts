// Fetch GitHub repositories

import { cache } from "react";

const TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

export type Project = {
  name: string;
};

type githubRepo = {
  name: string;
  description: string | null;
};

const toProject = (repo: githubRepo) => {
  return {
    slug: repo.name,
    name: repo.name,
  };
};

// fetch repos
const fetchGithubRepos = async (): Promise<githubRepo[] | null> => {
  if (!TOKEN || !USERNAME) {
    throw new Error("Username or Access token not found!");
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(USERNAME)}/repos`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "User-Agent": "ddev-portfolio",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;

    const repos = await res.json();

    return repos;
  } catch (error) {
    console.log("Failet to fetch Github Repositories", error);
    return null;
  }
};

export const getProjects = cache(async (): Promise<Project[]> => {
  const repo = await fetchGithubRepos();

  if (!repo) return [];

  return repo.map(toProject)
});

// fetch readme
export const fetchRepoReadme = async () => {
  "use cache";
  try {
    const data = await fetch(
      `https://api.github.com/repos/${USERNAME}/dluksa.dev/readme`,
      {
        headers: {
          Accept: "application/vnd.github.raw",
          Authorization: `Bearer ${TOKEN}`,
          "User-agent": "NextJs-Readme-Fetcher",
        },
      },
    );
    if (data.ok) return data.text();
  } catch (error) {
    // Fallback
    console.log("Failed to fetch file", error);
  }

  return null;
};
