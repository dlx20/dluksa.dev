import type { Metadata } from 'next';
import TerminalSection from '@/components/TerminalSection';
import ProjectFilter from '@/components/ProjectFilter';
import { getProjects, toSummary } from '@/lib/github';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata(
    '/projects',
    'Projects — ddev',
    'Public GitHub projects by Dovydas Luksa — Next.js, TypeScript, Python, and machine learning work from ddev.'
);

const ProjectsPage = async () => {
    const projects = await getProjects();

    return (
        <div className="site-page">
            <div className="site-page__inner">
                <TerminalSection label="exe" title="all projects">
                    <p className="mb-6 text-body text-fg-muted">
                        {projects.length} public {projects.length === 1 ? 'repository' : 'repositories'} by
                        Dovydas Luksa, newest first. Descriptions and technologies are read from GitHub.
                    </p>

                    <ProjectFilter projects={projects.map(toSummary)} />
                </TerminalSection>
            </div>
        </div>
    );
};

export default ProjectsPage;
