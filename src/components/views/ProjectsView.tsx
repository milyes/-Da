import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  LayoutGrid,
  List,
  FilterX,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Clock,
  Layers,
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  searchQuery: string;
  onClearSearch: () => void;
  onSelectProject: (project: Project) => void;
  onOpenNewProjectModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  searchQuery,
  onClearSearch,
  onSelectProject,
  onOpenNewProjectModal,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = [
    'all',
    'Infrastructure',
    'Frontend',
    'Core Platform',
    'Data Pipeline',
    'Design System',
  ];

  const statuses = ['all', 'In Progress', 'Review', 'Planning', 'Completed'];

  // Search and filter logic
  const q = searchQuery.toLowerCase().trim();
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.lead.name.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      p.status.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner when Search is active */}
      {searchQuery && (
        <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Filtering Projects: &ldquo;{searchQuery}&rdquo;
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ({filteredProjects.length} of {projects.length} matching)
            </span>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors shrink-0"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Clear Project Filter</span>
          </button>
        </div>
      )}

      {/* View Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Project Deliverables</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 tabular-nums">
              {filteredProjects.length} active
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking execution milestones, resource allocations, and pull requests across engineering squads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / List Mode Switcher */}
          <div className="flex items-center gap-0.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New Project CTA */}
          <button
            onClick={onOpenNewProjectModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs: Category & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Domains' : cat}
            </button>
          ))}
        </div>

        {/* Statuses dropdown / pills */}
        <div className="flex items-center gap-1 self-start sm:self-auto">
          <span className="text-[11px] text-slate-400 font-medium mr-1 hidden md:inline">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedStatus === st
                  ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid or List */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/60 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top metadata line (zero pills) */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span>{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold uppercase tracking-wider text-[10px] ${
                          project.priority === 'critical'
                            ? 'text-rose-600 dark:text-rose-400'
                            : project.priority === 'high'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {project.priority}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-semibold ${
                        project.status === 'Completed'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : project.status === 'In Progress'
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  {/* Progress info */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        {project.completedTasksCount}/{project.tasksCount} Tasks
                      </span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          project.progress === 100
                            ? 'bg-emerald-500'
                            : project.progress > 70
                            ? 'bg-indigo-600 dark:bg-indigo-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Team Avatars & Due Date */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center -space-x-1.5">
                      {project.team.map((member, i) => (
                        <img
                          key={i}
                          src={member.avatar}
                          alt={member.name}
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ))}
                      <span className="text-[11px] text-slate-500 ml-3 truncate max-w-[120px]">
                        {project.lead.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{project.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                    <span>{project.category}</span>
                    <span>·</span>
                    <span
                      className={`font-semibold uppercase text-[10px] ${
                        project.priority === 'critical'
                          ? 'text-rose-600'
                          : project.priority === 'high'
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {project.priority}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-400">{project.budget}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-xs">
                  {/* Progress bar compact */}
                  <div className="w-28 hidden sm:block">
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-slate-400">{project.progress}%</span>
                      <span className="text-slate-400">{project.completedTasksCount}/{project.tasksCount}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`font-semibold text-xs px-2.5 py-1 rounded-lg border ${
                      project.status === 'Completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : project.status === 'In Progress'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {project.status}
                  </span>

                  <span className="text-slate-400 text-[11px] font-mono w-24 text-right">
                    {project.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No projects found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {searchQuery
              ? `No deliverables matched your search query "${searchQuery}".`
              : 'There are no projects matching the selected filter criteria.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={onOpenNewProjectModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              + Create New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
