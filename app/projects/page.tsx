import type { Metadata } from 'next';
import TerminalSection from '@/components/TerminalSection';
import ProjectFilter from '@/components/ProjectFilter';
import { getProjects, toSummary } from '@/lib/github';

export const metadata: Metadata = {
    title: 'Projects — ddev',
    description: 'Public projects pulled straight from GitHub.',
};

const ProjectsPage = async () => {
    const projects = await getProjects();

    return (
        <div className="site-page">
            <div className="site-page__inner">
                <TerminalSection label="exe" title="all projects">
                    <p className="mb-6 max-w-2xl text-body text-fg-muted">
                        {projects.length} public {projects.length === 1 ? 'repository' : 'repositories'},
                        newest first. Descriptions and technologies are read from GitHub.
                    </p>

                    <ProjectFilter projects={projects.map(toSummary)} />
                </TerminalSection>
            </div>
        </div>
    );
};

export default ProjectsPage;
