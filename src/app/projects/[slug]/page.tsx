import TerminalSection from '@/components/TerminalSection'
import { getProject } from '@/lib/github'
import { Suspense } from 'react'
import Markdown from 'react-markdown'

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const ProjectContent = async ({ params }: ProjectPageProps) => {
  const { slug } = await params;
  const projectData = await getProject(slug);

  return (
    <>
      <div>{projectData?.name}</div>
      <div>
        <Markdown>{projectData?.readme}</Markdown>
      </div>
    </>
  );
};

const Page = ({ params }: ProjectPageProps) => {
  return (
    <TerminalSection id="pro" label="pro" title={["Project", "info"]}>
      <Suspense fallback={<p>Loading project...</p>}>
        <ProjectContent params={params} />
      </Suspense>
    </TerminalSection>
  );
};

export default Page;
