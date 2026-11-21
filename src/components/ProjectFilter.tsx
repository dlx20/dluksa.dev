"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { useDebouncedCallback } from "use-debounce";

const ProjectFilter = () => {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
    console.log(term);
  }, 300);

  return (
    <div className="flex w-full">
      {/* Search bar */}
      <div className="box flex-1">
        <div className="flex items-center p-2 gap-2 focus-within:ring-1 focus-within:ring-inset focus-within:ring-accent rounded-md">
          <CiSearch className="fill-accent" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={searchParams.get('query')?.toString()}
            className="outline-none flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;
