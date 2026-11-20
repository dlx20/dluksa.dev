import { CiSearch } from "react-icons/ci";

const ProjectFilter = () => {
  return (
    <div className="box flex-1">
      <div className="flex items-center p-2 gap-2 focus-within:ring-1 focus-within:ring-inset focus-within:ring-accent rounded-md">
        <CiSearch className='fill-accent' />
        <input type="text" placeholder="Search" className='outline-none flex-1' />
      </div>
    </div>
  );
};

export default ProjectFilter;
