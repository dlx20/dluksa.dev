import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaRegClock, FaRegStar } from 'react-icons/fa';
import Markdown from '@/components/Markdown';
import TechBadgeList from '@/components/TechBadgeList';
import { getProject, getProjects, readmeBaseUrl } from '@/lib/github';
import { formatDate } from '@/lib/format';
import { getTech } from '@/lib/tech';

type ProjectPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) return { title: 'Project not found — ddev' };

    return {
        title: `${project.name} — ddev`,
        description: project.excerpt,
    };
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) notFound();

    const language = project.language ? getTech(project.language) : null;

    return (
        <div className="site-page">
            <div className="site-page__inner site-page__inner--narrow">
                <Link href="/projects" className="link-subtle group mb-8 inline-flex items-center gap-2">
                    <FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-1" />
                    Back to projects
                </Link>

                <header className="space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-display text-2xl font-bold break-words text-fg-base sm:text-3xl">
                            {project.name}
                        </h1>

                        {project.liveUrl && <span className="badge-live">live</span>}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-display text-ui text-fg-muted">
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
                            {project.stars} {project.stars === 1 ? 'star' : 'stars'}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <FaRegClock />
                            Updated {formatDate(project.updatedAt)}
                        </span>
                    </div>

                    <TechBadgeList technologies={project.technologies} size="md" />

                    <div className="flex flex-wrap gap-3">
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                        >
                            <FaGithub />
                            Source
                        </a>

                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                <FaExternalLinkAlt size={12} />
                                Live site
                            </a>
                        )}
                    </div>
                </header>

                <div className="my-8 h-px bg-accent/15" />

                <section>
                    <h2 className="mb-4 font-display text-ui uppercase tracking-wide text-accent/60">
                        readme
                    </h2>

                    {project.readme ? (
                        <Markdown content={project.readme} baseUrl={readmeBaseUrl(project.slug)} />
                    ) : (
                        <p className="container-elevated p-5 text-body text-fg-muted">
                            This repository has no README yet.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProjectPage;
