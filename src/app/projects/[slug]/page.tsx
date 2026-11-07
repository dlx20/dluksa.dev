import TerminalSection from '@/components/TerminalSection'
import { getProject, getProjects } from '@/lib/github'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const ProjectContent = async ({ params }: ProjectPageProps) => {
  const { slug } = await params;
  console.log(slug); // Debugging line
  const projectData = await getProject(slug);
  // console.log('Project data:', projectData); 

  if (!projectData) {
    notFound();
  }

  return (
    <>
      {projectData.description && (
        <p className="text-fg-muted">{projectData.description}</p>
      )}
      <div className="prose max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>{projectData.readme}</Markdown>
      </div>
    </>
  );
};

const Page = ({ params }: ProjectPageProps) => {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-4 sm:px-6 lg:px-10 lg:pt-12">
      <TerminalSection id="pro" label="pro" title={["Project", "info"]}>
        <Suspense fallback={<p>Loading project...</p>}>
          <ProjectContent params={params} />
        </Suspense>
      </TerminalSection>
    </main>
  );
};

export default Page;
