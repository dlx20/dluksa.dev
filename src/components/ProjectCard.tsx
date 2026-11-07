import Link from "next/link";
import { FaRegFolder } from "react-icons/fa";
import Markdown from "react-markdown";
import type { Project } from "@/lib/github";
import TechBadge from "./TechBadge";

type ProjectCardProps = {
  reposData: Project[];
};

const ProjectCard = ({ reposData }: ProjectCardProps) => {
  return (
    <>
      {reposData.map((repo) => (
        <article key={repo.name} className="box flex flex-col justify-between h-full p-5">
          <Link
            href={`/projects/${repo.slug}`}
            aria-label={`View ${repo.name} project`}
            className="absolute inset-0 z-0 block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="sr-only">View {repo.name} project</span>
          </Link>
          <div className="relative z-10 flex flex-col gap-4 pointer-events-none">
            <div className="flex gap-3 items-center">
              <div className="rounded-card border border-accent/25 bg-linear-to-br from-accent/15 to-accent/5 text-accent/70 size-8 flex items-center justify-center ">
                <FaRegFolder size={16} />
              </div>

              <h2 className="font-bold">{repo.name}</h2>
            </div>
            <div className="line-clamp-3">
              <Markdown
                components={{
                  a: ({ children, ...props }) => (
                    <a {...props} className="pointer-events-auto">
                      {children}
                    </a>
                  ),
                }}
              >
                {repo.summary}
              </Markdown>
            </div>
            {repo.language && (
              <div>
                <TechBadge name={repo.language} size='sm' />
              </div>
            )}
          </div>

          <div className="border-t border-accent/10">

          </div>
        </article>
      ))}
    </>
  );
};

export default ProjectCard;
