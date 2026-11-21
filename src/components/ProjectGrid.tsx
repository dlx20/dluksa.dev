"use client";

import { ProjectSummary } from "@/lib/github";
import { ReactNode, useState } from "react";
import ProjectCard from "./ProjectCard";
import { CiGrid41, CiBoxList } from "react-icons/ci";

type Layout = "grid" | "row";

type ProjectGridProps = {
  project: ProjectSummary[];
  defaultLayout?: Layout;
  children?: ReactNode;
  query?: string;
};

function ProjectGrid({
  defaultLayout = "grid",
  project,
  children,
  query,
}: ProjectGridProps) {
  const [cardLayout, setCardLayout] = useState<Layout>(defaultLayout);

  const toggleLayout = () => {
    setCardLayout((prev) => (prev == "grid" ? "row" : "grid"));
  };

  const filteredProjects = project.filter((data) => 
    data.name.toLowerCase().includes(query.toLowerCase())
  )
  console.log(filteredProjects);
  

  if (project.length === 0) {
    return (
      <div>
        <p>There is no projects to display</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-4">
        {children}

        <button
          onClick={toggleLayout}
          className="relative cursor-pointer box flex items-center p-2 gap-2"
        >
          <span
            className={`absolute box rounded-md  left-1 inset-y-1 w-[calc(50%-4px)] transition-transform bg-accent/20 ${cardLayout == "grid" ? "translate-x-0" : "translate-x-full"}`}
          />

          <span className="z-10 relative ">
            {" "}
            <CiGrid41 size={24} />
          </span>
          <span className="z-10 relative">
            <CiBoxList size={24} />
          </span>
        </button>
      </div>
      <div
        className={`grid grid-cols-1 gap-4 ${cardLayout === "grid" ? "" : "sm:grid-cols-2 md:grid-cols-3"}`}
      >
        {filteredProjects.map((_project) => (
          <ProjectCard key={_project.slug} project={_project} />
        ))}
      </div>
    </div>
  );
}

export default ProjectGrid;
