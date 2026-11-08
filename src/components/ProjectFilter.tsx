"use client";

import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import type { ProjectSummary } from "@/lib/github";
import ProjectCard from "./ProjectCard";

const ALL = "all";

const matchesQuery = (project: ProjectSummary, query: string) => {
  if (!query) return true;
  const haystack = [project.name, project.description, project.summary, project.language]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
};

const ProjectFilter = ({ projects }: { projects: ProjectSummary[] }) => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState(ALL);

  // Languages ordered by how many projects use them
  const counts = new Map<string, number>();
  for (const { language } of projects) {
    if (language) counts.set(language, (counts.get(language) ?? 0) + 1);
  }
  const languages = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = projects.filter(
    (project) =>
      (language === ALL || project.language === language) &&
      matchesQuery(project, normalizedQuery),
  );

  const isFiltering = language !== ALL || normalizedQuery !== "";
  const reset = () => {
    setQuery("");
    setLanguage(ALL);
  };

  const chipClass = (active: boolean) =>
    `btn inline-flex items-center gap-1.5 text-ui ${
      active ? "border-accent/60 bg-accent/10 text-accent" : ""
    }`;

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <label className="box flex items-center gap-2 px-3 py-2 focus-within:border-accent/50">
        <span className="text-accent/60">$</span>
        <span className="text-body text-fg-muted">grep</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="search projects..."
          aria-label="Search projects"
          className="min-w-0 flex-1 bg-transparent text-body tracking-default text-fg-base placeholder:text-fg-muted/60 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="cursor-pointer text-fg-muted hover:text-accent"
          >
            <FiX className="size-4" />
          </button>
        ) : (
          <FiSearch className="size-4 text-fg-muted" />
        )}
      </label>

      {/* Language chips */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by language">
          <button
            type="button"
            className={chipClass(language === ALL)}
            aria-pressed={language === ALL}
            onClick={() => setLanguage(ALL)}
          >
            all <span className="text-fg-muted">{projects.length}</span>
          </button>
          {languages.map(([name, count]) => (
            <button
              key={name}
              type="button"
              className={chipClass(language === name)}
              aria-pressed={language === name}
              onClick={() => setLanguage(language === name ? ALL : name)}
            >
              {name.toLowerCase()} <span className="text-fg-muted">{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      <div className="flex items-center justify-between gap-2 text-ui text-fg-muted" aria-live="polite">
        <span>
          <span className="text-accent/60">ls | wc -l </span>
          {filtered.length}
          {isFiltering && ` / ${projects.length}`}
        </span>
        {isFiltering && (
          <button type="button" onClick={reset} className="cursor-pointer hover:text-accent">
            reset filters
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} data={project} />
          ))}
        </div>
      ) : (
        <div className="box p-4 text-body text-fg-muted">
          <span className="text-accent/60">$ </span>
          {projects.length > 0 ? "grep: no projects match your filters" : "ls: no projects found"}
        </div>
      )}
    </div>
  );
};

export default ProjectFilter;
