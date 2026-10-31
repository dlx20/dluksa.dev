import TerminalSection from '@/components/TerminalSection'
import { getProjects } from '@/lib/github'
import ProjectCard from '@/components/ProjectCard';
 const page = async () => {

  const repos = await getProjects();
   return (
     <div>

      <TerminalSection label='bin' id='bin' title={['projects']} >
        <div className="grid grid-cols-2 gap-2">
            <ProjectCard  reposData={repos} />
          </div>
      </TerminalSection>
     </div>
   )
 }
 
 export default page