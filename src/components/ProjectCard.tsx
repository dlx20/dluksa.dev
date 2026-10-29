import { FaRegFolder } from "react-icons/fa";

type ProjectCardProps = {
  reposData: Record<string, any>[];
};

const ProjectCard = async ({ reposData }: ProjectCardProps) => {
  return (
    <div>
      {reposData.map((repo) => (
        <div className="box h-50 p-4">
          <div className="flex gap-2 items-center">
            <div className="rounded-card border border-accent/25 bg-linear-to-br from-accent/15 to-accent/5 text-accent/70 size-8 flex items-center justify-center ">
              <FaRegFolder size={16} />
            </div>

            <h2 className="font-bold">{repo.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectCard;
