import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiArrowLeft, FiGithub } from "react-icons/fi";
import { getProjects, getProject } from "@/lib/github";
import TerminalSection from "@/components/TerminalSection";
import TechBadge from "@/components/TechBadge";

export const instant = false;

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    notFound();
  }

  return (
    <div className="w-full text-fg-base">
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-4 sm:px-6 lg:px-10 lg:pt-12">
        <TerminalSection id="exe" label="exe" title={[project.name]}>
          {/* Navigation + repo link */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/projects" className="btn inline-flex items-center gap-2">
              <FiArrowLeft className="size-4" />
              cd ..
            </Link>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn inline-flex items-center gap-2"
            >
              <FiGithub className="size-4" />
              view source
            </a>
          </div>

          {/* Short description + language */}
          {(project.description || project.language) && (
            <div className="flex flex-col gap-4">
              {project.description && (
                <p className="text-subheading leading-8 tracking-wide text-fg-muted">
                  {project.description}
                </p>
              )}
              {project.language && (
                <div className="flex flex-wrap gap-2">
                  <TechBadge name={project.language} size="md" />
                </div>
              )}
            </div>
          )}
        </TerminalSection>

        {/* README */}
        <TerminalSection id="man" label="man" title={["read", "me"]}>
          {project.readme ? (
            <article className="box p-4 sm:p-6 lg:p-8">
              <div className="prose prose-sm sm:prose-base max-w-none tracking-default prose-headings:font-bold prose-a:underline-offset-4 prose-img:rounded-card prose-pre:border prose-pre:border-accent/20 prose-code:before:content-none prose-code:after:content-none">
                <Markdown remarkPlugins={[remarkGfm]}>{project.readme}</Markdown>
              </div>
            </article>
          ) : (
            <div className="box p-4 text-body text-fg-muted">
              <span className="text-accent/60">$ </span>
              cat README.md: No such file or directory
            </div>
          )}
        </TerminalSection>
      </main>
    </div>
  );
}
