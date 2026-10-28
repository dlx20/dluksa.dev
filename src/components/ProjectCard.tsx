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
                    repo.name
                    
                }
            </h1>
            <p>
                {
                    repo.description
                }
            </p>
            <p>
                {
                    repo.id
                }
            </p>

        </div>
        ))
    }
    </>
  );
};

export default ProjectCard;
