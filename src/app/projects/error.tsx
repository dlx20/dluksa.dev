'use client'

const ProjectsError = ({ retry }: { error: unknown; retry: () => void }) => {
  return (
    <div className="box flex flex-col items-start gap-4 p-5">
      <p>Projects could not be loaded from GitHub right now.</p>
      <button type="button" onClick={() => retry()} className="text-accent">
        Try again
      </button>
    </div>
  );
};

export default ProjectsError;
