import TerminalSection from "@/components/TerminalSection";
import ProjectFilter from "@/components/ProjectFilter";
import { getProjects, type ProjectSummary } from "@/lib/github";
import ProjectGrid from "@/components/ProjectGrid";
import { Suspense } from "react";

const Page = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) => {
  const repos = await getProjects();

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  // Only send what the cards need; full READMEs stay on the server
  const projects: ProjectSummary[] = repos.map(
    ({ readme: _readme, ...project }) => project,
  );

  return (
    <section className="w-full p-6">
      <div className="mx-auto w-full max-w-7xl">
        <TerminalSection label="exe" title={["All", "Projects"]} id="projects">
          <Suspense key={query + currentPage} fallback="No Projects found">
            <ProjectFilter />
            <ProjectGrid query={query} project={projects} />
          </Suspense>
        </TerminalSection>
      </div>
    </section>
  );
};

export default Page;
