import TerminalSection from "@/components/TerminalSection";
import { getProjects, type ProjectSummary } from "@/lib/github";
import ProjectGrid from "@/components/ProjectGrid";
import { Suspense } from "react";
import Search from "@/components/Search";
import ViewToggle, { toView } from "@/components/ViewToggle";

type SearchParams = Promise<{
  query?: string;
  view?: string;
}>;

const Page = (props: { searchParams: SearchParams }) => {
  return (
    <section className="w-full p-6">
      <div className="mx-auto w-full max-w-7xl">
        <TerminalSection label="exe" title={["All", "Projects"]} id="projects">
          <section>
            {/* Search bar */}
            <Suspense>
              <Search />
            </Suspense>

            {/* Toggle layoout */}
            <Suspense>
              <ViewToggle searchParams={props.searchParams} />
            </Suspense>

            {/* Load the projects */}
            <Suspense>
              <Projects searchParams={props.searchParams} />
            </Suspense>
          </section>
        </TerminalSection>
      </div>
    </section>
  );
};

const Projects = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { query = "", view } = await searchParams;
  const repos = await getProjects();
  const projects: ProjectSummary[] = repos.map(
    ({ readme: _readme, ...project }) => project,
  );
  return <ProjectGrid query={query} view={toView(view)} project={projects} />;
};

export default Page;
