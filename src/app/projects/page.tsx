import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import TerminalSection from "@/components/TerminalSection";
import ProjectFilter from "@/components/ProjectFilter";
import { getProjects, type ProjectSummary } from "@/lib/github";

const Page = async () => {
  const repos = await getProjects();

  // Only send what the cards need; full READMEs stay on the server
  const projects: ProjectSummary[] = repos.map(({ readme: _readme, ...project }) => project);

  return (
    <div className="w-full text-fg-base">
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-4 sm:px-6 lg:px-10 lg:pt-12">
        <TerminalSection id="exe" label="exe" title={["all", "projects"]}>
          <div>
            <Link href="/" className="btn inline-flex items-center gap-2">
              <FiArrowLeft className="size-4" />
              cd ~
            </Link>
          </div>

          <ProjectFilter projects={projects} />
        </TerminalSection>
      </main>
    </div>
  );
};

export default Page;
