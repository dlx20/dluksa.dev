'use client'

import { ProjectSummary } from '@/lib/github'
import React, { useState } from 'react'
import ProjectCard from './ProjectCard'
import { CiGrid41, CiBoxList } from 'react-icons/ci'

type Layout = 'grid' | 'row'

type ProjectGridProps = {
    project: ProjectSummary[],
    defaultLayout?: Layout
}


function ProjectGrid({ defaultLayout = "grid", project }: ProjectGridProps) {

    const [cardLayout, setCardLayout] = useState<Layout>(defaultLayout)


    const toggleLayout = () => {
        setCardLayout((prev) => (prev == 'grid' ? 'row' : 'grid'))
    }

    console.log(cardLayout)


    if (project.length === 0) {
        return (
            <div>
                <p>
                    There is no projects to display
                </p>
            </div>
        )
    }

    return (
        <div >

            <div className='flex justify-end'>


                <button onClick={toggleLayout} className='relative box flex items-center p-2 gap-2 mb-2'>


                    <span className={`absolute box left-1 inset-y-1 w-[calc(50%-4px)] transition-transform ${cardLayout == 'grid' ? 'translate-x-0' : 'translate-x-full'}`} />

                    <span className='z-10 relative '>
                        <CiGrid41 size={24} />

                    </span>
                    <span className='z-10 relative'>
                        <CiBoxList size={24} />
                    </span>


                </button>
            </div>
            <div className={`grid grid-cols-1 gap-4 ${cardLayout === 'grid' ? '' : 'sm:grid-cols-2 md:grid-cols-3'}`}>

                {
                    project.map((_project) => (
                        <ProjectCard key={_project.slug} project={_project} />
                    ))
                }
            </div>
        </div>
    )
}

export default ProjectGrid