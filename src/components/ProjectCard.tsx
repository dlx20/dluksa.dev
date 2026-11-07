import Link from "next/link";
import { FaRegFolder } from "react-icons/fa";
import Markdown, { type Components } from "react-markdown";
import type { Project } from "@/lib/github";
import TechBadge from "./TechBadge";

// Defined once, outside the component, so it isn't recreated on every render
const markdownComponents: Components = {
  a: (props) => <a {...props} className="pointer-events-auto" />,
};

const ProjectCard = ({ data }: { data: Project }) => {

  return (
    <Link href={`/projects/${data.slug}`} className='box' >
      <div>
        {data.name}
      </div>
      <div>
        <Markdown components={markdownComponents} disallowedElements={["a"]} unwrapDisallowed>
          {data.summary}
        </Markdown>
      </div>

    </Link>
  )
};

export default ProjectCard;