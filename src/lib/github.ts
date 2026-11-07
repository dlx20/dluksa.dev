// Fetch GitHub repositories

import { headers } from "next/headers";
import { cache } from "react";
import { formatReadme, getReadmeSummary } from "./readme";

const TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

export type Project = {
  name: string;
  slug: string;
  readme: string;
  summary: string;
  description: string | null;
  language: string | null;
};

// repo types
type githubRepo = {
  name: string;
  full_name: string;
  default_branch: string;
  description: string | null;
  language: string | null;
  languages_url: string;
};
// project types
const toProject = (repo: githubRepo, rawReadme = ""): Project => {
  const readme = formatReadme(rawReadme, repo.full_name, repo.default_branch);

  return {
    slug: repo.name,
    name: repo.name,
    readme,
    summary: getReadmeSummary(readme),
    description: repo.description,
    language: repo.language,
  };
};


// Request data
const request = async ({
  url,
  headers = {},
  responseType = "json",
}: {
  url: string;
  headers?: Record<string, string>;
  responseType?: "json" | "text";
}) => {
  try {
    const res = await fetch(url, {
      headers: {
        revalidate: "3600",
        Authorization: `Bearer ${TOKEN}`,
        "User-Agent": "ddev-portfolio",
        ...headers,
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      throw new Error(`Request Failed ${res.status} ${res.statusText}`);
    }
    return responseType === "text" ? await res.text() : await res.json();
  } catch (error) {
    console.log("API request failed:", error);
    throw error;
  } 
};


// Fetch Json data from url
const fetchJson = async <T>(url: string): Promise<T> => {
  return await request({ url });
};


// fetch repos
const fetchGithubRepos = async (): Promise<githubRepo[]> => {
  if (!USERNAME) {
    throw new Error("Username not found!");
  }

  const repos = await request({
    url: `https://api.github.com/users/${encodeURIComponent(USERNAME)}/repos`,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return repos as githubRepo[];
};

// fetch readme
export const fetchRepoReadme = cache(
  async (repoName: string): Promise<string | null> => {
    if (!USERNAME) {
      throw new Error("Username not found!");
    }
    try {
      const readme = await request({
        url: `https://api.github.com/repos/${encodeURIComponent(USERNAME)}/${encodeURIComponent(repoName)}/readme`,
        headers: {
          Accept: "application/vnd.github.raw+json",
        },
        responseType: "text",
      });

      return readme;
    } catch (error) {
      console.error(`Failed to fetch README for ${repoName}:`, error);
      return null;
    }
  },
);


export const getLanguages = async (
  url: string,
): Promise<Record<string, number>> => {
  return await fetchJson<Record<string, number>>(url);
};

export const getProjects = cache(async (): Promise<Project[]> => {
  const repos = await fetchGithubRepos();

  return Promise.all(
    repos.map(async (repo) => {
      const readme = await fetchRepoReadme(repo.name);
      return toProject(repo, readme ?? "");
    }),
  );
});

export const getProject = cache(
  async (name: string): Promise<Project | undefined> => {
    const projects = await getProjects();
    return projects.find((entry) => entry.name === name);
  },
);
