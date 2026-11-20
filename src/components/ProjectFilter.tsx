

import { CiSearch } from "react-icons/ci";

const ProjectFilter = () => {
  return (
    <div className='box'>
      <div className='flex'>
        <CiSearch />
        <input
          type="text"
          placeholder="Search"
          name=""
          value=""
          className="p-2"
        />
      </div>
    </div>
  );
};

export default ProjectFilter;
