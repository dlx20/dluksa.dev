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

export const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'dluksa20';
const USERNAME = GITHUB_USERNAME;
const API = 'https://api.github.com';
const GRAPHQL = `${API}/graphql`;

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

export type ContributionDay = {
    date: string;
    count: number;
    /** 0 is none; 4 is the busiest quartile. Matches GitHub's five ink levels. */
    level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionWeek = {
    /** Sunday–Saturday. Leading or trailing slots are null when the year does not cover that day. */
    days: (ContributionDay | null)[];
};

export type ContributionCalendar = {
    total: number;
    weeks: ContributionWeek[];
};

type GraphQLCalendar = {
    data?: {
        user?: {
            contributionsCollection?: {
                contributionCalendar?: {
                    totalContributions: number;
                    weeks: {
                        contributionDays: {
                            date: string;
                            contributionCount: number;
                            weekday: number;
                        }[];
                    }[];
                };
            };
        };
    };
};

function toLevel(count: number, max: number): ContributionDay['level'] {
    if (count <= 0) return 0;
    if (max <= 1) return 1;
    const ratio = count / max;
    if (ratio > 0.75) return 4;
    if (ratio > 0.5) return 3;
    if (ratio > 0.25) return 2;
    return 1;
}

function withLevels(days: { date: string; count: number }[]): ContributionDay[] {
    const max = days.reduce((highest, day) => Math.max(highest, day.count), 0);
    return days.map((day) => ({
        ...day,
        level: toLevel(day.count, max),
    }));
}

function weekday(isoDate: string): number {
    return new Date(`${isoDate}T00:00:00Z`).getUTCDay();
}

function toWeeks(days: ContributionDay[]): ContributionWeek[] {
    if (days.length === 0) return [];

    const leading = weekday(days[0].date);
    const slots: (ContributionDay | null)[] = [...Array<null>(leading).fill(null), ...days];
    const weeks: ContributionWeek[] = [];

    for (let index = 0; index < slots.length; index += 7) {
        weeks.push({ days: slots.slice(index, index + 7) });
    }

    return weeks;
}

async function fetchGraphqlCalendar(): Promise<ContributionCalendar | null> {
    // GraphQL requires a token. Without one, skip straight to the public page.
    if (!process.env.GITHUB_TOKEN) return null;

    const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'ddev-portfolio',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    };

    try {
        const response = await fetch(GRAPHQL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: `
                    query ($login: String!) {
                        user(login: $login) {
                            contributionsCollection {
                                contributionCalendar {
                                    totalContributions
                                    weeks {
                                        contributionDays {
                                            date
                                            contributionCount
                                            weekday
                                        }
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: { login: USERNAME },
            }),
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!response.ok) {
            if (response.status !== 401) {
                console.error(`GitHub GraphQL responded ${response.status}`);
            }
            return null;
        }

        const payload = (await response.json()) as GraphQLCalendar;
        const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) return null;

        const days = withLevels(
            calendar.weeks.flatMap((week) =>
                week.contributionDays.map((day) => ({
                    date: day.date,
                    count: day.contributionCount,
                }))
            )
        );

        return { total: calendar.totalContributions, weeks: toWeeks(days) };
    } catch (error) {
        console.error('GitHub GraphQL failed', error);
        return null;
    }
}

/**
 * GitHub's public contributions page is the fallback when GraphQL is
 * unavailable (usually a missing token). The markup is not a contract, so a
 * failed parse just yields an empty calendar.
 */
async function fetchHtmlCalendar(): Promise<ContributionCalendar | null> {
    try {
        const response = await fetch(`https://github.com/users/${USERNAME}/contributions?tab=contributions`, {
            headers: { 'User-Agent': 'ddev-portfolio' },
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!response.ok) return null;

        const html = await response.text();
        const tags = html.match(/<td\b[^>]*\bContributionCalendar-day\b[^>]*>/g);
        if (!tags || tags.length === 0) return null;

        // Counts live in sibling <tool-tip for="cell-id"> elements, not on the cell.
        const counts = new Map<string, number>();
        for (const tip of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
            const text = tip[2].trim();
            counts.set(tip[1], /^No contributions/i.test(text) ? 0 : Number(text.match(/^([\d,]+)/)?.[1]?.replace(/,/g, '') ?? 0));
        }

        const parsed: { date: string; count: number; level: ContributionDay['level'] }[] = [];

        for (const tag of tags) {
            const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
            if (!date) continue;

            const id = tag.match(/\bid="([^"]+)"/)?.[1];
            const level = Number(tag.match(/data-level="([0-4])"/)?.[1] ?? 0) as ContributionDay['level'];
            const count = id ? (counts.get(id) ?? (level > 0 ? 1 : 0)) : level > 0 ? 1 : 0;

            parsed.push({ date, count, level });
        }

        if (parsed.length === 0) return null;

        const headingTotal = html.match(
            /id="js-contribution-activity-description"[^>]*>\s*([\d,]+)/i
        )?.[1];
        const total = headingTotal
            ? Number(headingTotal.replace(/,/g, ''))
            : parsed.reduce((sum, day) => sum + day.count, 0);

        return { total, weeks: toWeeks(parsed) };
    } catch (error) {
        console.error('GitHub contributions page failed', error);
        return null;
    }
}

/**
 * Last twelve months of contribution counts, the same calendar GitHub shows
 * on a profile. GraphQL is preferred; the public HTML page is the fallback.
 */
export const getContributions = cache(async (): Promise<ContributionCalendar | null> => {
    return (await fetchGraphqlCalendar()) ?? (await fetchHtmlCalendar());
});
