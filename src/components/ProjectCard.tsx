import { Suspense } from "react";
type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
};

type ProjectCardProps = {
  reposData: Repository[];
};

const ProjectCard = async ({ reposData }: ProjectCardProps) => {
  return (
    <div className="box h-50">
      {
        reposData.map((repo)=> (
            <h1>
                {
                    repo.name
                }
            </h1>
        ))
      }
    </div>
  );
};

export default ProjectCard;
