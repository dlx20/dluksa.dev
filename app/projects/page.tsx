'use client';

import React, { useState } from 'react';
import TerminalSection from '@/components/TerminalSection';
import ProjectCard from '@/components/ProjectCard';
import { PROJECT_DATA } from '@/lib/constants';
import Link from 'next/link';

const ProjectsPage = () => {
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'MAINTENANCE' | 'OFFLINE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'GRID' | 'LIST'>('GRID');

  // Filter projects
  const filteredProjects = PROJECT_DATA.filter((project) => {
    const matchesFilter = filter === 'ALL' || project.status === filter;
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      project.name.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  // Get counts
  const statusCounts = {
    ALL: PROJECT_DATA.length,
    LIVE: PROJECT_DATA.filter((p) => p.status === 'LIVE').length,
    MAINTENANCE: PROJECT_DATA.filter((p) => p.status === 'MAINTENANCE').length,
    OFFLINE: PROJECT_DATA.filter((p) => p.status === 'OFFLINE').length,
  };

  return (
    <div className="min-h-screen w-full p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <TerminalSection
          label="exe"
          title='PRojects'>
          {/* Filters and Search */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-surface-elevated/30 border border-accent/20 rounded-lg p-3">
              <span className="text-accent/50 text-sm">$</span>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-text text-sm font-mono placeholder:text-text/40 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-accent/50 hover:text-accent text-xs"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'LIVE', 'MAINTENANCE', 'OFFLINE'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-lg transition-all ${
                    filter === status
                      ? 'bg-accent/20 border-accent/40 text-accent'
                      : 'bg-surface-elevated/20 border-accent/20 text-text/60 hover:border-accent/30 hover:bg-surface-elevated/30'
                  }`}
                >
                  {status}
                  <span className="ml-2 opacity-60">({statusCounts[status]})</span>
                </button>
              ))}
            </div>

            {/* Results Count + View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-text/50">
              <span>
                Showing {filteredProjects.length} of {PROJECT_DATA.length} projects
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('GRID')}
                  className={`px-3 py-1 rounded-md border transition-colors ${
                    view === 'GRID'
                      ? 'border-accent/40 text-accent bg-accent/10'
                      : 'border-accent/20 text-text/50 hover:border-accent/30'
                  }`}
                  aria-pressed={view === 'GRID'}
                >
                  GRID
                </button>
                <button
                  onClick={() => setView('LIST')}
                  className={`px-3 py-1 rounded-md border transition-colors ${
                    view === 'LIST'
                      ? 'border-accent/40 text-accent bg-accent/10'
                      : 'border-accent/20 text-text/50 hover:border-accent/30'
                  }`}
                  aria-pressed={view === 'LIST'}
                >
                  LIST
                </button>
              </div>
            </div>
          </div>

          {/* Projects: Grid or List */}
          <div
            className={`mt-6 gap-6 ${
              view === 'GRID'
                ? 'grid grid-cols-1 lg:grid-cols-2'
                : 'flex flex-col'
            }`}
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map(({ id, slug, name, status, description, technologies }) => (
                <Link 
                  key={id} 
                  href={`/projects/${slug}`} 
                  >
                <ProjectCard
                  key={id}
                  name={name}
                  status={status}
                  desc={description}
                  tech={technologies}
                />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-surface-elevated/20 border border-accent/15 rounded-xl p-8">
                  <span className="text-4xl mb-4 block opacity-50">🔍</span>
                  <p className="text-text/50 font-mono text-sm">
                    No projects found matching your criteria
                  </p>
                  <button
                    onClick={() => {
                      setFilter('ALL');
                      setSearchTerm('');
                      setView('GRID');
                    }}
                    className="mt-4 px-4 py-2 text-xs font-mono text-accent/70 hover:text-accent border border-accent/20 rounded hover:border-accent/40 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </TerminalSection>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects', value: PROJECT_DATA.length, icon: '📦' },
            { label: 'Live', value: statusCounts.LIVE, icon: '🟢' },
            { label: 'In Progress', value: statusCounts.MAINTENANCE, icon: '🟡' },
            { label: 'Archived', value: statusCounts.OFFLINE, icon: '🔴' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-elevated/30 border border-accent/20 rounded-xl p-4 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-[10px] uppercase tracking-wider text-accent/50 font-mono">
                  {stat.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-accent/90 font-mono">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;