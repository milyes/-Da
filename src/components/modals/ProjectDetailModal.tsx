import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  Users,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onUpdateProject: (updatedProject: Project) => void;
  onShowToast: (message: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onUpdateProject,
  onShowToast,
}) => {
  const [currentProgress, setCurrentProgress] = useState(project.progress);
  const [currentStatus, setCurrentStatus] = useState(project.status);

  // Simulated subtasks for this project
  const [subtasks, setSubtasks] = useState([
    { id: 1, title: 'Architectural specification & security invariants', done: true },
    { id: 2, title: 'Distributed memory benchmark on 64-core runner', done: true },
    { id: 3, title: 'Client SDK bindings for WebAssembly and TypeScript', done: currentProgress > 60 },
    { id: 4, title: 'End-to-end integration tests & failure failover verification', done: currentProgress === 100 },
  ]);

  const toggleSubtask = (id: number) => {
    const updated = subtasks.map((st) =>
      st.id === id ? { ...st, done: !st.done } : st
    );
    setSubtasks(updated);
    const completedCount = updated.filter((s) => s.done).length;
    const newProgress = Math.round((completedCount / updated.length) * 100);
    setCurrentProgress(newProgress);
    onUpdateProject({
      ...project,
      progress: newProgress,
      completedTasksCount: completedCount,
      tasksCount: updated.length,
      status: newProgress === 100 ? 'Completed' : currentStatus,
    });
  };

  const handleStatusChange = (newStatus: Project['status']) => {
    setCurrentStatus(newStatus);
    onUpdateProject({
      ...project,
      status: newStatus,
      progress: newStatus === 'Completed' ? 100 : currentProgress,
    });
    onShowToast(`Updated project status to "${newStatus}"`);
  };

  const handleProgressSlider = (value: number) => {
    setCurrentProgress(value);
    onUpdateProject({
      ...project,
      progress: value,
      status: value === 100 ? 'Completed' : currentStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{project.category}</span>
              <span>·</span>
              <span className="font-mono text-slate-400">{project.budget}</span>
              <span>·</span>
              <span className="font-semibold uppercase text-indigo-600 dark:text-indigo-400 text-[10px]">
                {project.priority} priority
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>

          {/* Interactive Progress Slider */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-900 dark:text-white">
                Milestone Execution Progress
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums text-sm">
                {currentProgress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentProgress}
              onChange={(e) => handleProgressSlider(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0% Start</span>
              <span>50% Implementation</span>
              <span>100% Production Ready</span>
            </div>
          </div>

          {/* Status Switcher Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
              Workflow Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Planning', 'In Progress', 'Review', 'Completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    currentStatus === st
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Subtasks */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2.5">
              Deliverable Verification Checklist
            </h4>
            <div className="space-y-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(st.id)}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={st.done}
                    onChange={() => toggleSubtask(st.id)}
                    className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span
                    className={`text-xs ${
                      st.done
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200 font-medium'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Lead & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Project Lead</span>
              <div className="flex items-center gap-2.5">
                <img
                  src={project.lead.avatar}
                  alt={project.lead.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {project.lead.name}
                  </p>
                  <p className="text-[10px] text-slate-500">{project.lead.role}</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Target Delivery</span>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>{project.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Keywords & Stacks</span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Details
          </button>
          <button
            onClick={() => {
              onShowToast(`Saved changes for ${project.title}`);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
