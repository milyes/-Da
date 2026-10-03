import React, { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FilterX,
  Plus,
  RefreshCw,
  Server,
  ShieldCheck,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react';
import { MetricCard, ActivityItem, Project } from '../../types';

interface OverviewViewProps {
  metrics: MetricCard[];
  activities: ActivityItem[];
  projects: Project[];
  searchQuery: string;
  onClearSearch: () => void;
  onSelectProject: (project: Project) => void;
  onNavigateToView: (view: 'projects' | 'analytics' | 'team') => void;
}

interface QuickTask {
  id: string;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  dueDate: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  activities,
  projects,
  searchQuery,
  onClearSearch,
  onSelectProject,
  onNavigateToView,
}) => {
  const [tasks, setTasks] = useState<QuickTask[]>([
    {
      id: 'task-1',
      title: 'Review TLS 1.3 zero-copy buffer compaction commit',
      assignee: 'Sarah Chen',
      priority: 'high',
      done: false,
      dueDate: 'Today',
    },
    {
      id: 'task-2',
      title: 'Verify accessible color contrast on dark mode badges',
      assignee: 'Elena Rostova',
      priority: 'medium',
      done: true,
      dueDate: 'Completed',
    },
    {
      id: 'task-3',
      title: 'Run multi-region latency benchmark simulation',
      assignee: 'Marcus Vance',
      priority: 'high',
      done: false,
      dueDate: 'Tomorrow',
    },
    {
      id: 'task-4',
      title: 'Submit SOC2 quarterly compliance verification package',
      assignee: 'Devon Thorne',
      priority: 'low',
      done: false,
      dueDate: 'Oct 18',
    },
  ]);

  const [newTaskInput, setNewTaskInput] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: QuickTask = {
      id: `task-${Date.now()}`,
      title: newTaskInput.trim(),
      assignee: 'Sarah Chen',
      priority: 'medium',
      done: false,
      dueDate: 'This week',
    };
    setTasks([newTask, ...tasks]);
    setNewTaskInput('');
    setShowTaskInput(false);
  };

  // Filter metrics
  const q = searchQuery.toLowerCase().trim();
  const filteredMetrics = metrics.filter(
    (m) =>
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.value.toLowerCase().includes(q)
  );

  // Filter activities
  const filteredActivities = activities.filter(
    (a) =>
      !q ||
      a.user.name.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      a.target.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );

  // Filter projects preview
  const filteredProjects = projects.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.lead.name.toLowerCase().includes(q)
  );

  // Filter tasks
  const filteredTasks = tasks.filter(
    (t) =>
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.assignee.toLowerCase().includes(q) ||
      t.priority.toLowerCase().includes(q)
  );

  const totalMatches =
    filteredMetrics.length +
    filteredActivities.length +
    filteredProjects.length +
    filteredTasks.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner when Search Filter is Active */}
      {searchQuery && (
        <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Filtered Overview by &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Found {totalMatches} matching items across KPIs, activities, tasks, and featured projects.
              </p>
            </div>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors shrink-0 self-start sm:self-auto"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset Search Filter</span>
          </button>
        </div>
      )}

      {/* Header Info Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Production Cluster us-west2</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Operational Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time telemetry, active workflows, delivery milestones, and team activity for the current sprint.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToView('projects')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateToView('analytics')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <span>Analytics Engine</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stat Metric Cards */}
      {filteredMetrics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMetrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{metric.category}</span>
                  <span
                    className={`font-semibold text-[11px] tabular-nums ${
                      metric.isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {metric.title}
                </h3>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums tracking-tight">
                  {metric.value}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
                {metric.description}
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
          No metrics matched &ldquo;{searchQuery}&rdquo;.
        </div>
      ) : null}

      {/* Two Column Layout: Featured Projects & Operational Task Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): High Priority Active Projects */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Workflow className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Active Core Deliverables</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Highest priority initiatives currently in engineering review or active rollout.
              </p>
            </div>
            <button
              onClick={() => onNavigateToView('projects')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all ({projects.length})
            </button>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="space-y-3">
              {filteredProjects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="group p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700/60 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>{proj.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">{proj.budget}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold uppercase tracking-wider text-[10px] ${
                            proj.priority === 'critical'
                              ? 'text-rose-600 dark:text-rose-400'
                              : proj.priority === 'high'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {proj.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {proj.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        {proj.progress}%
                      </span>
                      <p className="text-[10px] text-slate-400">Due {proj.dueDate}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        proj.progress === 100
                          ? 'bg-emerald-500'
                          : proj.progress > 70
                          ? 'bg-indigo-600 dark:bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No active deliverables matched &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>

        {/* Right (1 col): Sprint Tasks Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Sprint Priority Tasks</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Action items assigned to current shift.
                </p>
              </div>
              <button
                onClick={() => setShowTaskInput(!showTaskInput)}
                className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Add task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Add Task Input */}
            {showTaskInput && (
              <form onSubmit={handleAddTask} className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Task title..."
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  Add
                </button>
              </form>
            )}

            {/* Tasks list */}
            {filteredTasks.length > 0 ? (
              <div className="space-y-2">
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-tight ${
                          t.done
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{t.assignee}</span>
                        <span>·</span>
                        <span className="font-mono">{t.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No tasks match &ldquo;{searchQuery}&rdquo;.
              </div>
            )}
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>
              {tasks.filter((t) => t.done).length} of {tasks.length} tasks completed
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Real-Time Audit & Deployment Stream</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cryptographically verified pipeline promotions, PR reviews, and infrastructure events.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {filteredActivities.length} events logged
          </span>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={act.user.avatar}
                    alt={act.user.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {act.user.name}
                    </span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">{act.action}</span>{' '}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                      {act.target}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto pl-10 sm:pl-0 text-[11px] text-slate-400 shrink-0 font-mono">
                  <span className="text-slate-500">{act.category}</span>
                  <span>·</span>
                  <span>{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No activity events matched &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>

    </div>
  );
};
