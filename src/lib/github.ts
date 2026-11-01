// Fetch GitHub repositories

import { cache } from "react";

const TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

export type Project = {
  name: string;
};

// repo types
type githubRepo = {
  name: string;
  description: string | null;
};


// project types
const toProject = (repo: githubRepo) => {
  return {
    slug: repo.name,
    name: repo.name,
  };
};



// Request data
const request = async ({
  url,
  headers = {},
}: {
  url: string;
  headers?: Record<string, string>;
}) => {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "User-Agent": "ddev-portfolio",
        ...headers,
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      throw new Error(`Request Failed ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.log("API request failed:", error);
    throw error;
  }
};

// fetch repos
const fetchGithubRepos = async (): Promise<githubRepo[] | null> => {
  if (!USERNAME) {
    throw new Error("Username not found!");
  }
  try {
    const repos = await request({
      url: `https://api.github.com/users/${encodeURIComponent(USERNAME)}/repos?sort=updated&per_page=100`,
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return repos as githubRepo[];
  } catch (error) {
    console.log("Failet to fetch Github Repositories", error);
    return null;
  }
};

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

export const getProjects = cache(async (): Promise<Project[]> => {
  const repo = await fetchGithubRepos();

  if (!repo) return [];

  return repo.map(toProject);
});
