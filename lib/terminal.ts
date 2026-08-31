import { EMAIL, LOCATION } from './constants';
import { formatDate } from './format';

/**
 * The slice of a project the footer terminal needs. Deliberately narrow: the
 * full `Project` carries an entire README, which should not be shipped to the
 * browser on every page.
 */
export type CommandProject = {
    slug: string;
    technologies: string[];
    stars: number;
    updatedAt: string;
};

export type CommandOutput = {
    lines: string[];
    /** Route to push after printing the output. */
    navigateTo?: string;
    /** Wipe the scrollback instead of appending. */
    clear?: boolean;
};

type Command = {
    name: string;
    aliases?: string[];
    usage: string;
    description: string;
    run: (args: string[], projects: CommandProject[]) => CommandOutput;
};

const PAGES: Record<string, string> = {
    home: '/',
    projects: '/projects',
    resume: '/resume',
};

/** Case-insensitive match on slug, then on any part of the slug. */
function matchProjects(query: string, projects: CommandProject[]): CommandProject[] {
    const term = query.toLowerCase();
    const exact = projects.find((project) => project.slug.toLowerCase() === term);
    if (exact) return [exact];

    return projects.filter((project) => project.slug.toLowerCase().includes(term));
}

const COMMANDS: Command[] = [
    {
        name: 'help',
        usage: 'help',
        description: 'List the available commands',
        run: () => ({
            lines: COMMANDS.map(({ usage, description }) => `${usage.padEnd(24)}${description}`),
        }),
    },
    {
        name: 'info',
        aliases: ['whoami', 'about'],
        usage: 'info',
        description: 'About this site and its author',
        run: () => ({
            lines: [
                'Dovydas Luksa — MSc in Robotics, AI & Autonomous Systems.',
                `Based in ${LOCATION}.`,
                'Machine learning in Python with PyTorch and TensorFlow;',
                'web work in TypeScript, React and Next.js.',
                'This site reads its project list live from the GitHub API.',
                `Contact: ${EMAIL}`,
            ],
        }),
    },
    {
        name: 'stats',
        aliases: ['git'],
        usage: 'stats',
        description: 'GitHub activity summary',
        run: (_args, projects) => {
            if (projects.length === 0) {
                return { lines: ['No project data available right now.'] };
            }

            const stars = projects.reduce((total, project) => total + project.stars, 0);

            // Count how many projects use each technology, most common first.
            const usage = new Map<string, number>();
            for (const project of projects) {
                for (const technology of project.technologies) {
                    usage.set(technology, (usage.get(technology) ?? 0) + 1);
                }
            }

            const top = [...usage.entries()]
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([technology, count]) => `${technology} (${count})`);

            return {
                lines: [
                    `public repos   ${projects.length}`,
                    `total stars    ${stars}`,
                    `last push      ${formatDate(projects[0].updatedAt)}`,
                    `top tech       ${top.join(', ')}`,
                ],
            };
        },
    },
    {
        name: 'ls',
        aliases: ['projects'],
        usage: 'ls',
        description: 'List every project',
        run: (_args, projects) => {
            if (projects.length === 0) {
                return { lines: ['No projects available right now.'] };
            }

            return {
                lines: [
                    ...projects.map(
                        (project) =>
                            `${project.slug.padEnd(30)}${project.technologies.slice(0, 3).join(', ')}`
                    ),
                    '',
                    "Use 'open <name>' to jump to one.",
                ],
            };
        },
    },
    {
        name: 'find',
        aliases: ['search'],
        usage: 'find <text>',
        description: 'Search projects by name or technology',
        run: (args, projects) => {
            const term = args.join(' ').toLowerCase();
            if (!term) return { lines: ['Usage: find <text>'] };

            const matches = projects.filter(
                (project) =>
                    project.slug.toLowerCase().includes(term) ||
                    project.technologies.some((technology) =>
                        technology.toLowerCase().includes(term)
                    )
            );

            if (matches.length === 0) {
                return { lines: [`No project matches "${term}".`] };
            }

            return {
                lines: [
                    `${matches.length} match${matches.length === 1 ? '' : 'es'}:`,
                    ...matches.map(
                        (project) =>
                            `${project.slug.padEnd(30)}${project.technologies.join(', ')}`
                    ),
                ],
            };
        },
    },
    {
        name: 'open',
        usage: 'open <project>',
        description: 'Go to a project page',
        run: (args, projects) => {
            const term = args.join(' ');
            if (!term) return { lines: ['Usage: open <project>'] };

            const matches = matchProjects(term, projects);

            if (matches.length === 0) {
                return { lines: [`No project named "${term}". Try 'ls'.`] };
            }

            if (matches.length > 1) {
                return {
                    lines: [
                        'Several projects match — be more specific:',
                        ...matches.map((project) => project.slug),
                    ],
                };
            }

            return {
                lines: [`Opening ${matches[0].slug}…`],
                navigateTo: `/projects/${matches[0].slug}`,
            };
        },
    },
    {
        name: 'cd',
        aliases: ['goto'],
        usage: 'cd <page>',
        description: `Navigate to ${Object.keys(PAGES).join(', ')}`,
        run: (args) => {
            const target = (args[0] ?? '').toLowerCase().replace(/^\/+|\/+$/g, '') || 'home';
            const route = PAGES[target === '~' ? 'home' : target];

            if (!route) {
                return { lines: [`No such page: ${target}. Try ${Object.keys(PAGES).join(', ')}.`] };
            }

            return { lines: [`Going to ${route}…`], navigateTo: route };
        },
    },
    {
        name: 'clear',
        usage: 'clear',
        description: 'Clear the output',
        run: () => ({ lines: [], clear: true }),
    },
];

export function runCommand(input: string, projects: CommandProject[]): CommandOutput {
    const [name = '', ...args] = input.trim().split(/\s+/);
    const lookup = name.toLowerCase();

    const command = COMMANDS.find(
        ({ name: commandName, aliases }) =>
            commandName === lookup || aliases?.includes(lookup)
    );

    if (!command) {
        return { lines: [`command not found: ${name}. Type 'help'.`] };
    }

    return command.run(args, projects);
}
