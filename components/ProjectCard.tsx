import Link from 'next/link';
import { FaArrowRight, FaRegClock, FaRegFolder, FaRegStar } from 'react-icons/fa';
import type { ProjectSummary } from '@/lib/github';
import { formatDate } from '@/lib/format';
import { getTech } from '@/lib/tech';
import TechBadgeList from './TechBadgeList';
import CommitPulse from './CommitPulse';

const CARD_TECH_LIMIT = 4;

/**
 * The whole card is one link, so anything inside it must stay non-interactive.
 * External GitHub and live links live on the project page instead.
 */
const ProjectCard = ({
    project,
    layout = 'grid',
}: {
    project: ProjectSummary;
    layout?: 'grid' | 'row';
}) => {
    const language = project.language ? getTech(project.language) : null;

    return (
        <Link
            href={`/projects/${project.slug}`}
            className={`project-card group${layout === 'row' ? ' project-card--row' : ''}`}
        >
            <div className="project-card__header">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="project-card__glyph">
                        <FaRegFolder size={16} />
                    </span>

                    <h2 className="truncate font-display text-base font-bold text-fg-base group-hover:text-accent">
                        {project.name}
                    </h2>
                </div>

                {project.liveUrl && <span className="badge-live">live</span>}
            </div>

            <p className="project-card__excerpt">{project.excerpt}</p>

            <div className="project-card__tech">
                <TechBadgeList technologies={project.technologies} limit={CARD_TECH_LIMIT} />
            </div>

            <CommitPulse values={project.pulse} />

            <div className="project-card__meta">
                {language && (
                    <span className="inline-flex items-center gap-1.5">
                        <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: language.color }}
                        />
                        {language.label}
                    </span>
                )}

                <span className="inline-flex items-center gap-1.5">
                    <FaRegStar />
                    {project.stars}
                </span>

                <span className="inline-flex items-center gap-1.5">
                    <FaRegClock />
                    {formatDate(project.updatedAt)}
                </span>

                <span className="ml-auto inline-flex items-center gap-1.5 text-accent/70 group-hover:text-accent">
                    View
                    <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </span>
            </div>
        </Link>
    );
};

export default ProjectCard;
