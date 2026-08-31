export type ProjectStatus = 'LIVE' | 'MAINTENANCE' | 'OFFLINE';

export type Project = {
  id: string;
  slug: string;
  name: string;
  status: ProjectStatus;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
};

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  archived: boolean;
  fork: boolean;
  updated_at: string;
};

const TOPIC_TO_SKILL: Record<string, string> = {
  react: 'React',
  nextjs: 'Next.js',
  'next-js': 'Next.js',
  tailwind: 'Tailwindcss',
  tailwindcss: 'Tailwindcss',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node-js': 'Node.js',
  django: 'Django',
  python: 'Python',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  supabase: 'Supabase',
  docker: 'Docker',
  vercel: 'Vercel',
};

const LANGUAGE_TO_SKILL: Record<string, string> = {
  TypeScript: 'TypeScript',
  JavaScript: 'JavaScript',
  Python: 'Python',
  HTML: 'HTML',
  CSS: 'CSS',
  Go: 'Go',
  Rust: 'Rust',
  Java: 'Java',
  PHP: 'PHP',
  Ruby: 'Ruby',
  Shell: 'Shell',
  Dockerfile: 'Docker',
};

function toTechnologies(language: string | null, topics: string[]): string[] {
  const technologies: string[] = [];
  const seen = new Set<string>();

  const add = (value: string) => {
    if (!value || seen.has(value.toLowerCase())) return;
    seen.add(value.toLowerCase());
    technologies.push(value);
  };

  if (language) {
    add(LANGUAGE_TO_SKILL[language] ?? language);
  }

  for (const topic of topics) {
    add(TOPIC_TO_SKILL[topic.toLowerCase()] ?? topic.replace(/-/g, ' '));
  }

  return technologies;
}

function toLiveUrl(homepage: string | null): string | undefined {
  if (!homepage?.trim()) return undefined;
  if (homepage.startsWith('http://') || homepage.startsWith('https://')) {
    return homepage;
  }
  return `https://${homepage}`;
}

function toProject(repo: GitHubRepo): Project {
  const liveUrl = toLiveUrl(repo.homepage);

  return {
    id: String(repo.id),
    slug: repo.name,
    name: repo.name.replace(/-/g, '_').toUpperCase(),
    status: liveUrl ? 'LIVE' : 'OFFLINE',
    description: repo.description ?? '',
    technologies: toTechnologies(repo.language, repo.topics ?? []),
    githubUrl: repo.html_url,
    liveUrl,
  };
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const username = process.env.GITHUB_USERNAME ?? 'dlx20';
  const token = process.env.GITHUB_TOKEN;

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'ddev-portfolio',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
    {
      next: { revalidate: 3600 },
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub repositories (${response.status})`);
  }

  return response.json();
}

export async function getGitHubProjects(): Promise<Project[]> {
  try {
    const repos = await fetchRepos();

    return repos
      .filter((repo) => !repo.fork && !repo.archived)
      .map(toProject);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getGitHubProject(slug: string): Promise<Project | undefined> {
  const projects = await getGitHubProjects();
  return projects.find((project) => project.slug === slug);
}
