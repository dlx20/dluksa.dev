import Link from "next/link";
import { FaRegFolder } from "react-icons/fa";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ProjectCardProps = {
  reposData: Record<string, any>[];
};

const ProjectCard = async ({ reposData }: ProjectCardProps) => {
  return (
    <>
      {reposData.map((repo) => (
        <Link
          href={`/projects/${repo.slug}`}
          key={repo.name}
          className="box h-50 p-4"
        >
          <div className="flex-col gap-4">
            <div className="flex gap-3 items-center">
              <div className="rounded-card border border-accent/25 bg-linear-to-br from-accent/15 to-accent/5 text-accent/70 size-8 flex items-center justify-center ">
                <FaRegFolder size={16} />
              </div>

              <h2 className="font-bold">{repo.name} </h2>
            </div>
            <p className="line-clamp-3">
              <Markdown  rehypePlugins={[remarkGfm]}>
                {
                  repo.readme
                }
              </Markdown>
            </p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default ProjectCard;
