// app/projects/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaExternalLinkAlt, FaFolderOpen, FaGithub } from "react-icons/fa";
import { getGitHubProject, getGitHubProjects } from "@/lib/github";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getGitHubProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = await getGitHubProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

        {/* Back button */}
        <Link
          href="/projects"
          className="group mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text/50 transition-colors hover:text-accent"
        >
          <FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </Link>

        {/* Project Card */}
        <div className="overflow-hidden rounded-xl border border-accent/20 bg-surface-elevated/20 transition-colors hover:border-accent/30">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-accent/15 px-5 py-4">
            <div className="flex items-center gap-3">
              <FaFolderOpen className="text-accent/70" />

              <span className="font-mono text-xs uppercase tracking-wider text-text/50">
                PROJECT // {project.id}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  project.status === "LIVE"
                    ? "animate-pulse bg-green-400"
                    : project.status === "MAINTENANCE"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
              />

              <span className="font-mono text-xs text-text/60">
                {project.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">

            {/* Title */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/50">
                PROJECT_DETAILS
              </span>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-text md:text-6xl">
                {project.name}
              </h1>

              <div className="mt-6 h-px bg-linear-to-r from-transparent via-accent/20 to-transparent" />
            </div>

            {/* Description */}
            <div className="mt-8">
              <span className="font-mono text-xs uppercase tracking-wider text-accent/50">
                DESCRIPTION
              </span>

              <div className="mt-3 rounded-lg border border-accent/10 bg-surface-elevated/20 p-5">
                <p className="max-w-3xl text-sm leading-7 text-fg-base md:text-base">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Technologies */}
            <div className="mt-8">
              <span className="font-mono text-xs uppercase tracking-wider text-accent/50">
                TECHNOLOGIES
              </span>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-md border border-accent/20 bg-accent/5 px-3 py-1.5 font-mono text-xs text-accent/70 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-accent/20 px-3 py-2 font-mono text-xs text-accent/70 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <FaGithub />
                GitHub
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-accent/20 px-3 py-2 font-mono text-xs text-accent/70 transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <FaExternalLinkAlt />
                  Live
                </a>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-accent/10 px-5 py-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text/30">
              <span>PROJECT_ID: {project.id}</span>
              <span>{project.status}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}