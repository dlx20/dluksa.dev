'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import type { ProjectSummary } from '@/lib/github';
import { countTechnologies, usesTech } from '@/lib/tech';
import ProjectGrid from './ProjectGrid';
import ViewToggle, { type ProjectView } from './ViewToggle';

/** Same chrome as a skill badge, plus the toggle states. */
const chipClass = (isActive: boolean) =>
    `tech-badge tech-badge--md filter-chip${isActive ? ' filter-chip--active' : ''}`;

/**
 * Technology filter above the project grid. One technology at a time: with a
 * handful of repositories that stays predictable, and no filter can ever
 * produce an empty grid because the options come from the projects themselves.
 */
const ProjectFilter = ({ projects }: { projects: ProjectSummary[] }) => {
    const [active, setActive] = useState<string | null>(null);
    const [view, setView] = useState<ProjectView>('grid');

    const technologies = useMemo(() => countTechnologies(projects), [projects]);

    const visible = active
        ? projects.filter((project) => usesTech(project.technologies, active))
        : projects;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between gap-3">
                <div
                    role="group"
                    aria-label="Filter projects by technology"
                    className="flex min-w-0 flex-1 flex-wrap gap-1.5"
                >
                    <button
                        type="button"
                        onClick={() => setActive(null)}
                        aria-pressed={active === null}
                        className={chipClass(active === null)}
                        // No brand colour of its own, so it borrows the theme accent.
                        style={{ '--tech': 'var(--color-accent)' } as CSSProperties}
                    >
                        All
                        <span className="filter-chip__count">({projects.length})</span>
                    </button>

                    {technologies.map(({ label, icon: Icon, color, count }) => (
                        <button
                            key={label}
                            type="button"
                            // Clicking the active chip clears it, so the row doubles
                            // as its own reset.
                            onClick={() => setActive(active === label ? null : label)}
                            aria-pressed={active === label}
                            className={chipClass(active === label)}
                            style={{ '--tech': color } as CSSProperties}
                        >
                            <Icon className="tech-badge__icon" aria-hidden />
                            {label}
                            <span className="filter-chip__count">({count})</span>
                        </button>
                    ))}
                </div>

                <ViewToggle value={view} onChange={setView} />
            </div>

            <ProjectGrid projects={visible} layout={view} />
        </div>
    );
};

export default ProjectFilter;
