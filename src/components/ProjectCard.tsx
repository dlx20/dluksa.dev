import { Suspense } from "react";

type ProjectCardProps = {
  reposData: Record<string, any>[];
};

const ProjectCard = async ({ reposData }: ProjectCardProps) => {
  return (
    <>
      {
          reposData.map((repo)=> (
              <div className="box h-50">
            <h1>
                {
                    repo.id
                    
                }
            </h1>
        </div>
        ))
    }
    </>
  );
};

export default ProjectCard;
