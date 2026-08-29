import { getGitHubProjects } from '@/lib/github';
import ResumeProjects from '@/components/ResumeProjects';

const ResumePage = async () => {
  const projects = await getGitHubProjects();

  return <ResumeProjects projects={projects} />;
};

export default ResumePage;
