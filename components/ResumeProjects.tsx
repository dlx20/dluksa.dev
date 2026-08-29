'use client';

import React, { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/lib/github';

const ResumeProjects = ({ projects }: { projects: Project[] }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className='min-h-screen w-full p-6 md:p-12'>
      <div className='max-w-7xl mx-auto space-y-6'>
        <div className="flex items-center justify-between backdrop-blur-md bg-surface-elevated/30 border border-accent/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-text/90 font-mono">
              Projects
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-mono">
              {projects.length}
            </span>
          </div>

          <div className="flex gap-1 p-1 bg-surface-base/40 rounded-lg border border-accent/15">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                view === 'grid'
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'text-text/60 hover:text-text/80'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                view === 'list'
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'text-text/60 hover:text-text/80'
              }`}
            >
              List
            </button>
          </div>
        </div>

        <div className={view === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeProjects;
