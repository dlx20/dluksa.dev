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

// Stands in for the real slugs when GitHub can't be reached at build time.
// With Cache Components the build needs at least one param to check, so it
// checks this one, and real project pages render on their first visit
const PLACEHOLDER_SLUG = "__placeholder__";

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    if (projects.length > 0) {
      return projects.map((project) => ({ slug: project.slug }));
    }
  } catch (error) {
    // A missing token or a GitHub outage shouldn't fail the whole build
    console.warn(
      "Couldn't load projects from GitHub at build time, so project pages will render on first visit:",
      error instanceof Error ? error.message : error,
    );
  }
  return [{ slug: PLACEHOLDER_SLUG }];
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  // Checked before fetching, so prerendering the placeholder never calls GitHub
  if (slug === PLACEHOLDER_SLUG) {
    notFound();
  }
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
