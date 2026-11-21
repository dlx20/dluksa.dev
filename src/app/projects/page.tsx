import TerminalSection from "@/components/TerminalSection";
import Search from "@/components/Search";
import { getProjects, type ProjectSummary } from "@/lib/github";
import ProjectGrid from "@/components/ProjectGrid";
import { Suspense } from "react";

type SearchParams = Promise<{
  query?: string;
  page?: string;
}>;

const Page = (props: { searchParams: SearchParams }) => {
  return (
    <section className="w-full p-6">
      <div className="mx-auto w-full max-w-7xl">
        <TerminalSection label="exe" title={["All", "Projects"]} id="projects">
          <Suspense>
            <Search />
            <Projects searchParams={props.searchParams} />
          </Suspense>
        </TerminalSection>
      </div>
    </section>
  );
};

const Projects = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { query = "" } = await searchParams;
  const repos = await getProjects();
  const projects: ProjectSummary[] = repos.map(
    ({ readme: _readme, ...project }) => project,
  );
  return <ProjectGrid query={query} project={projects} />;
};

export default Page;
