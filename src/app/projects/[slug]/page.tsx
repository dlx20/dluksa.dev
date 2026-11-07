
import { getProjects, getProject } from '@/lib/github';


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


  return (
    <div>
      {slug}

    </div>
  );
}