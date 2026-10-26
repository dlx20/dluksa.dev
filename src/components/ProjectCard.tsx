import React from 'react';
import { fetchGithubProfile } from '@/lib/github';

const ProjectCard = async () => {
    const data = await fetchGithubProfile()
    console.log(data);
    
    return (
        <div className="box h-50">
            {}
        </div>
    );
};

export default ProjectCard;