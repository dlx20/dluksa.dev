import ProjectsExplorer from '@/components/ProjectsExplorer';
import { getGitHubProjects } from '@/lib/github';

const ProjectsPage = async () => {
  const projects = await getGitHubProjects();

  return <ProjectsExplorer projects={projects} />;
};

export default ProjectsPage;
