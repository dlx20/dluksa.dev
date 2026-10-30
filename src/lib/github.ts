// Fetch GitHub repositories

import { request } from "http";
import { headers } from "next/headers";

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
  try {
    const data = await fetch(`https://github.com/${USERNAME}/dluksa.dev/readme`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if(data.ok) return data.text();
  } catch {
    // Fallback
  }
  const res = await request(`/repos/${USERNAME}/dluksa.dev/readme`);
  return res
};
