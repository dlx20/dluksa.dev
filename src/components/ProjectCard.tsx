import Link from "next/link";
import { FaRegFolder } from "react-icons/fa";
import Markdown from "react-markdown";
import type { Project } from "@/lib/github";

type ProjectCardProps = {
  reposData: Project[];
};

const ProjectCard = ({ reposData }: ProjectCardProps) => {
  return (
    <>
      {reposData.map((repo) => (
        <article key={repo.name} className="box h-50 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <div className="rounded-card border border-accent/25 bg-linear-to-br from-accent/15 to-accent/5 text-accent/70 size-8 flex items-center justify-center ">
                <FaRegFolder size={16} />
              </div>

              <h2 className="font-bold">
                <Link href={`/projects/${repo.slug}`}>{repo.name}</Link>
              </h2>
            </div>
            <div className="line-clamp-3">
              <Markdown>
                {repo.readme}
              </Markdown>
            </div>
          </div>
        </article>
      ))}
    </>
  );
};

export default ProjectCard;
