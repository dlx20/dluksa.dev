import { cache } from 'react';
import { toExcerpt } from './markdown';

export type Project = {
    slug: string;
    /** Repository name, shown verbatim to keep the terminal feel. */
    name: string;
    /** One-line summary taken from the README, for project cards. */
    excerpt: string;
    /** Full README markdown, for the dedicated project page. */
    readme: string;
    technologies: string[];
    language: string | null;
    stars: number;
    /** ISO date of the most recent push. */
    updatedAt: string;
    githubUrl: string;
    liveUrl: string | null;
};

/** A project without its README, which is all a card ever renders. */
export type ProjectSummary = Omit<Project, 'readme'>;

/**
 * Strip the README before handing projects to a client component. It is by far
 * the largest field, and shipping it would bloat the page payload for nothing.
 */
export function toSummary(project: Project): ProjectSummary {
    return {
        slug: project.slug,
        name: project.name,
        excerpt: project.excerpt,
        technologies: project.technologies,
        language: project.language,
        stars: project.stars,
        updatedAt: project.updatedAt,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
    };
}

type GitHubRepo = {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics?: string[];
    stargazers_count: number;
    pushed_at: string;
    archived: boolean;
    fork: boolean;
    private: boolean;
};

const USERNAME = process.env.GITHUB_USERNAME ?? 'dluksa20';
const API = 'https://api.github.com';

/** Cache GitHub responses for an hour so page views don't burn rate limit. */
const REVALIDATE_SECONDS = 3600;

/** Ignore languages that make up less than this share of a repository. */
const MIN_LANGUAGE_SHARE = 0.03;

const MAX_TECHNOLOGIES = 8;

async function request(path: string, accept: string): Promise<Response | null> {
    const headers: Record<string, string> = {
        Accept: accept,
        'X-GitHub-Api-Version': '2022-11-28',
        // GitHub requires a User-Agent on every API request.
        'User-Agent': 'ddev-portfolio',
    };

    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    try {
        const response = await fetch(`${API}${path}`, {
            headers,
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!response.ok) {
            // Plenty of repositories have no README; only flag real problems
            // such as rate limiting.
            if (response.status !== 404) {
                console.error(`GitHub ${path} responded ${response.status}`);
            }
            return null;
        }

        return response;
    } catch (error) {
        console.error(`GitHub ${path} failed`, error);
        return null;
    }
}

async function fetchJson<T>(path: string): Promise<T | null> {
    const response = await request(path, 'application/vnd.github+json');
    return response ? (response.json() as Promise<T>) : null;
}

/** READMEs are requested raw so the markdown can be rendered as-is. */
async function fetchReadme(repo: string): Promise<string> {
    const response = await request(`/repos/${USERNAME}/${repo}/readme`, 'application/vnd.github.raw');
    return response ? response.text() : '';
}

/**
 * Repository topics are the intended source of technologies, but they are
 * optional. Byte counts from the languages endpoint fill the gap, with the
 * long tail of incidental languages dropped.
 */
function toTechnologies(languageBytes: Record<string, number>, topics: string[]): string[] {
    const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);

    const languages = Object.entries(languageBytes)
        .filter(([, bytes]) => totalBytes > 0 && bytes / totalBytes >= MIN_LANGUAGE_SHARE)
        .sort(([, a], [, b]) => b - a)
        .map(([language]) => language);

    const unique = new Map<string, string>();
    for (const entry of [...languages, ...topics]) {
        unique.set(entry.toLowerCase(), entry);
    }

    return [...unique.values()].slice(0, MAX_TECHNOLOGIES);
}

function toLiveUrl(homepage: string | null): string | null {
    const trimmed = homepage?.trim();
    if (!trimmed) return null;
    return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

async function toProject(repo: GitHubRepo): Promise<Project> {
    const [languageBytes, readme] = await Promise.all([
        fetchJson<Record<string, number>>(`/repos/${USERNAME}/${repo.name}/languages`),
        fetchReadme(repo.name),
    ]);

    return {
        slug: repo.name,
        name: repo.name,
        excerpt: toExcerpt(readme) || repo.description || 'No description available yet.',
        readme,
        technologies: toTechnologies(languageBytes ?? {}, repo.topics ?? []),
        language: repo.language,
        stars: repo.stargazers_count,
        updatedAt: repo.pushed_at,
        githubUrl: repo.html_url,
        liveUrl: toLiveUrl(repo.homepage),
    };
}

/**
 * Public, owned, non-fork repositories, most recently pushed first.
 * Wrapped in `cache` so the several pages that need the list during one render
 * share a single set of GitHub requests.
 */
export const getProjects = cache(async (): Promise<Project[]> => {
    const repos = await fetchJson<GitHubRepo[]>(
        `/users/${USERNAME}/repos?sort=pushed&per_page=100&type=owner`
    );

    if (!repos) return [];

    const visible = repos.filter(
        (repo) =>
            !repo.fork &&
            !repo.archived &&
            !repo.private &&
            // The repository named after the account only holds the profile README.
            repo.name.toLowerCase() !== USERNAME.toLowerCase()
    );

    return Promise.all(visible.map(toProject));
});

export async function getProject(slug: string): Promise<Project | undefined> {
    const projects = await getProjects();
    return projects.find((project) => project.slug === slug);
}

export function readmeBaseUrl(slug: string): string {
    return `https://raw.githubusercontent.com/${USERNAME}/${slug}/HEAD`;
}
