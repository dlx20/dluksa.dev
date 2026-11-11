import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import TerminalSection from "@/components/TerminalSection";
import ProjectFilter from "@/components/ProjectFilter";
import { getProjects, type ProjectSummary } from "@/lib/github";
import ProjectGrid from "@/components/ProjectGrid";

const Page = async () => {
  const repos = await getProjects();

  // Only send what the cards need; full READMEs stay on the server
  const projects: ProjectSummary[] = repos.map(({ readme: _readme, ...project }) => project);

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl">
        <TerminalSection label="exe" title={['All', 'Projects']} id="projects">

          <ProjectGrid defaultLayout="grid" project={projects}>

          </ProjectGrid>
        </TerminalSection>
      </div>
    </section>
  );
};

export default Page;
