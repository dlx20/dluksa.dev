import Link from "next/link";
import { FaRegFolder } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import Markdown from "react-markdown";
import type { ProjectSummary } from "@/lib/github";
import TechBadge from "./TechBadge";

const ProjectCard = ({ data }: { data: ProjectSummary }) => {
  const summary = data.summary || data.description;

  return (
    <Link
      href={`/projects/${data.slug}`}
      className="box group flex h-full flex-col gap-3 p-4 transition-colors hover:border-accent/40 hover:bg-surface-hovered/40"
    >
      <div className="flex items-center gap-2">
        <FaRegFolder className="size-4 shrink-0 text-accent/60 transition-colors group-hover:text-accent" />
        <h3 className="flex-1 truncate font-bold text-subheading transition-colors group-hover:text-accent">
          {data.name}
        </h3>
        <FiArrowUpRight className="size-4 shrink-0 text-fg-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>

      {summary && (
        <div className="line-clamp-3 text-body leading-6 text-fg-muted [&_code]:text-accent [&_p]:text-fg-muted">
          <Markdown disallowedElements={["a"]} unwrapDisallowed>
            {summary}
          </Markdown>
        </div>
      )}

      {data.language && (
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <TechBadge name={data.language} size="sm" />
        </div>
      )}
    </Link>
  );
};

export default ProjectCard;
