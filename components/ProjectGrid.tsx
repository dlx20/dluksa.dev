import type { ProjectSummary } from '@/lib/github';
import ProjectCard from './ProjectCard';

type ProjectGridProps = {
    projects: ProjectSummary[];
    /** Column count at the widest breakpoint; cards stay single column on phones. */
    columns?: 2 | 3;
    /** `rows` stretches every card to full width. */
    layout?: 'grid' | 'rows';
};

const COLUMN_CLASSES = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 xl:grid-cols-3',
} as const;

const ProjectGrid = ({ projects, columns = 3, layout = 'grid' }: ProjectGridProps) => {
    if (projects.length === 0) {
        return (
            <div className="container-elevated p-6 text-center sm:p-10">
                <p className="font-display text-body text-fg-muted">
                    No projects to show. GitHub may be unreachable or rate limiting requests —
                    try again shortly.
                </p>
            </div>
        );
    }

    const columnsClass = layout === 'rows' ? '' : COLUMN_CLASSES[columns];

    return (
        <div className={`grid grid-cols-1 gap-4 ${columnsClass}`}>
            {projects.map((project) => (
                <ProjectCard
                    key={project.slug}
                    project={project}
                    layout={layout === 'rows' ? 'row' : 'grid'}
                />
            ))}
        </div>
    );
};

export default ProjectGrid;
