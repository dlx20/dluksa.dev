'use client'

import { ProjectSummary } from '@/lib/github'
import React, { useState } from 'react'
import ProjectCard from './ProjectCard'

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
                <button onClick={toggleLayout} className='box p-2 mb-3'>
                    toggle me
                </button>
            </div>
            <div className={`grid grid-cols-1 ${cardLayout === 'grid' ? '' : 'gap-4 sm:grid-cols-2 md:grid-cols-3'}`}>

                {
                    project.map((_project) => (
                        <ProjectCard key={_project.slug} project={_project}>

                        </ProjectCard>
                    ))
                }
            </div>
        </div>
    )
}

export default ProjectGrid