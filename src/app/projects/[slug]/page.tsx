
import { getProjects, getProject } from '@/lib/github';
import Markdown, { type Components } from "react-markdown";
import { notFound } from "next/navigation";


const markdownComponents: Components = {
  a: (props) => <a {...props} className="pointer-events-auto" />,
};
export const instant = false
type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  console.log('static params:', projects.map((p) => p.slug));
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    notFound();
  }


  return (
    <div>
      <h1>{project.name}</h1>
      <div>
        <Markdown components={markdownComponents}>
          {project.summary}
        </Markdown>
      </div>
    </div>
  );
}