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
    /** Weekly commit counts for the last year — GitHub's participation pulse. */
    pulse: number[];
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
        pulse: project.pulse,
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

export const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'dlx20';
const USERNAME = GITHUB_USERNAME;
const API = 'https://api.github.com';
const GRAPHQL = `${API}/graphql`;

/** Cache GitHub responses for an hour so page views don't burn rate limit. */
const REVALIDATE_SECONDS = 3600;

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
            // 404: missing README, expected. 403: unauthenticated rate limit.
            // Both are handled by callers; logging them trips the Next overlay.
            if (response.status !== 404 && response.status !== 403) {
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
    if (response) return response.text();

    // raw.githubusercontent.com is not rate-limited like the REST API.
    try {
        const raw = await fetch(`${readmeBaseUrl(repo)}/README.md`, {
            headers: { 'User-Agent': 'ddev-portfolio' },
            next: { revalidate: REVALIDATE_SECONDS },
        });
        return raw.ok ? raw.text() : '';
    } catch {
        return '';
    }
}

function toTechnologies(language: string | null, topics: string[]): string[] {
    const unique = new Map<string, string>();
    for (const entry of [language, ...topics]) {
        if (!entry) continue;
        unique.set(entry.toLowerCase(), entry);
    }
    return [...unique.values()].slice(0, MAX_TECHNOLOGIES);
}

function toLiveUrl(homepage: string | null): string | null {
    const trimmed = homepage?.trim();
    if (!trimmed) return null;
    return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function toProject(repo: GitHubRepo, readme = ''): Project {
    return {
        slug: repo.name,
        name: repo.name,
        excerpt: toExcerpt(readme) || repo.description || 'No description available yet.',
        readme,
        technologies: toTechnologies(repo.language, repo.topics ?? []),
        language: repo.language,
        stars: repo.stargazers_count,
        updatedAt: repo.pushed_at,
        githubUrl: repo.html_url,
        liveUrl: toLiveUrl(repo.homepage),
        pulse: [],
    };
}

/**
 * GitHub's public participation graph — 52 weekly commit counts. This URL is
 * not the REST API, so it still works when the API is rate-limited.
 */
async function fetchPulse(repo: string): Promise<number[]> {
    try {
        const response = await fetch(`https://github.com/${USERNAME}/${repo}/graphs/participation`, {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'ddev-portfolio',
            },
            next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!response.ok) return [];

        const payload: unknown = await response.json();
        const weeks = Array.isArray(payload)
            ? payload
            : payload && typeof payload === 'object' && 'all' in payload && Array.isArray(payload.all)
              ? payload.all
              : null;
        if (!weeks) return [];
        return weeks.map((value) => Number(value) || 0);
    } catch {
        return [];
    }
}

function isVisible(repo: GitHubRepo): boolean {
    return (
        !repo.fork &&
        !repo.archived &&
        !repo.private &&
        repo.name.toLowerCase() !== USERNAME.toLowerCase()
    );
}

/**
 * Public repositories page — used when the REST API is rate-limited (403).
 */
async function fetchHtmlRepos(): Promise<GitHubRepo[] | null> {
    try {
        const response = await fetch(
            `https://github.com/${USERNAME}?tab=repositories&type=source`,
            {
                headers: { 'User-Agent': 'ddev-portfolio' },
                next: { revalidate: REVALIDATE_SECONDS },
            }
        );
        if (!response.ok) return null;

        const html = await response.text();
        const blocks = html.split('itemtype="http://schema.org/Code"').slice(1);
        const repos: GitHubRepo[] = [];

        for (const block of blocks) {
            const name = block.match(/itemprop="name codeRepository"[^>]*>\s*([^<]+)/)?.[1]?.trim();
            if (!name) continue;

            const stars = Number(
                block.match(/stargazers">[\s\S]*?<\/svg>\s*([\d,]+)/)?.[1]?.replace(/,/g, '') ?? 0
            );

            repos.push({
                name,
                description:
                    block.match(/itemprop="description">\s*([^<]+)/)?.[1]?.trim() ?? null,
                html_url: `https://github.com/${USERNAME}/${name}`,
                homepage: null,
                language:
                    block.match(/itemprop="programmingLanguage">([^<]+)/)?.[1]?.trim() ?? null,
                topics: [],
                stargazers_count: stars,
                pushed_at:
                    block.match(/datetime="([^"]+)"/)?.[1] ?? new Date().toISOString(),
                archived: false,
                fork: false,
                private: false,
            });
        }

        return repos.length > 0 ? repos : null;
    } catch (error) {
        console.error('GitHub repositories page failed', error);
        return null;
    }
}

/**
 * Public, owned, non-fork repositories, most recently pushed first.
 * One REST call when the API is available; the public profile page otherwise.
 * READMEs are loaded only on the dedicated project page.
 */
export const getProjects = cache(async (): Promise<Project[]> => {
    const repos =
        (await fetchJson<GitHubRepo[]>(
            `/users/${USERNAME}/repos?sort=pushed&per_page=100&type=owner`
        )) ?? (await fetchHtmlRepos());

    if (!repos) return [];

    return Promise.all(
        repos.filter(isVisible).map(async (repo) => ({
            ...toProject(repo),
            pulse: await fetchPulse(repo.name),
        }))
    );
});

export async function getProject(slug: string): Promise<Project | undefined> {
    const projects = await getProjects();
    const project = projects.find((entry) => entry.slug === slug);
    if (!project) return undefined;

    const readme = await fetchReadme(project.slug);
    return {
        ...project,
        readme,
        excerpt: toExcerpt(readme) || project.excerpt,
    };
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

function yearRange(year: number): { from: string; to: string } {
    return {
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
    };
}

async function fetchGraphqlCalendar(year: number): Promise<ContributionCalendar | null> {
    // GraphQL requires a token. Without one, skip straight to the public page.
    if (!process.env.GITHUB_TOKEN) return null;

    const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'ddev-portfolio',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    };

    const { from, to } = yearRange(year);

    try {
        const response = await fetch(GRAPHQL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: `
                    query ($login: String!, $from: DateTime!, $to: DateTime!) {
                        user(login: $login) {
                            contributionsCollection(from: $from, to: $to) {
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
                variables: { login: USERNAME, from, to },
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
async function fetchHtmlCalendar(year: number): Promise<ContributionCalendar | null> {
    try {
        const response = await fetch(
            `https://github.com/users/${USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`,
            {
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

        // GitHub's table is row-major (all Sundays, then all Mondays, …).
        parsed.sort((a, b) => a.date.localeCompare(b.date));

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
 * One calendar year of contribution counts. GraphQL is preferred; the public
 * HTML page is the fallback when no token is set.
 */
export const getContributions = cache(async (year: number): Promise<ContributionCalendar | null> => {
    return (await fetchGraphqlCalendar(year)) ?? (await fetchHtmlCalendar(year));
});

/**
 * Years shown on the public contributions page, newest first. Avoids the
 * `/users/{login}` REST call, which 403s once the unauthenticated budget is gone.
 */
export const getContributionYears = cache(async (): Promise<number[]> => {
    const current = new Date().getUTCFullYear();

    try {
        const response = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
            headers: { 'User-Agent': 'ddev-portfolio' },
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (response.ok) {
            const html = await response.text();
            const found = [...html.matchAll(/id="year-link-(\d{4})"/g)].map((match) =>
                Number(match[1])
            );
            const unique = [...new Set(found)].sort((a, b) => b - a);
            if (unique.length > 0) return unique;
        }
    } catch {
        // Fall through to a short recent window.
    }

    const years: number[] = [];
    for (let year = current; year >= current - 4; year -= 1) years.push(year);
    return years;
});
