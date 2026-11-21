"use client";

import { ProjectSummary } from "@/lib/github";
import ProjectCard from "./ProjectCard";
import type { View } from "./ViewToggle";

type ProjectGridProps = {
  project: ProjectSummary[];
  view?: View;
  query?: string;
};

export default function ProjectGrid({
  view = "grid",
  project,
  query = "",
}: ProjectGridProps) {
  const filteredProjects = project.filter(
    (data) =>
      data.name.toLowerCase().includes(query.toLowerCase()) ||
      data.summary.toLowerCase().includes(query.toLowerCase()) ||
      (data.language ?? "").toLowerCase().includes(query.toLowerCase()),
  );

  if (project.length === 0) {
    return (
      <div>
        <p>There is no projects to display</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div
        className={`grid grid-cols-1 gap-4 ${view === "grid" ? "" : "sm:grid-cols-2 md:grid-cols-3"}`}
      >
        {filteredProjects.map((_project) => (
          <ProjectCard key={_project.slug} project={_project} />
        ))}
      </div>
    </div>
  );
}
