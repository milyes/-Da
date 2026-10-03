import React, { useState } from 'react';
import { X, Plus, FolderKanban, UserPlus, Sparkles } from 'lucide-react';
import { Project, TeamMember } from '../../types';

interface NewItemModalProps {
  onClose: () => void;
  onAddProject: (project: Project) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onShowToast: (message: string) => void;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  onClose,
  onAddProject,
  onAddTeamMember,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'project' | 'member'>('project');

  // Project form state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState<Project['category']>('Infrastructure');
  const [projectPriority, setProjectPriority] = useState<Project['priority']>('high');
  const [projectBudget, setProjectBudget] = useState('$50,000');
  const [projectTags, setProjectTags] = useState('Rust, Cloud, Performance');

  // Member form state
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberDept, setMemberDept] = useState<TeamMember['department']>('Engineering');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberBio, setMemberBio] = useState('');
  const [memberSkills, setMemberSkills] = useState('TypeScript, Architecture, Cloud');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: projectTitle.trim(),
      description: projectDesc.trim() || 'High-performance engineering initiative.',
      category: projectCategory,
      priority: projectPriority,
      status: 'Planning',
      progress: 0,
      dueDate: 'Nov 30, 2026',
      lead: {
        name: 'Sarah Chen',
        role: 'Staff Systems Architect',
        avatar: '/src/assets/images/avatar_sarah_chen_1791044271279.jpg',
      },
      team: [
        { name: 'Sarah Chen', avatar: '/src/assets/images/avatar_sarah_chen_1791044271279.jpg' },
      ],
      budget: projectBudget,
      tasksCount: 12,
      completedTasksCount: 0,
      tags: projectTags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onAddProject(newProj);
    onShowToast(`Created project "${newProj.title}"`);
    onClose();
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;

    const initials = memberName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: memberName.trim(),
      role: memberRole.trim() || 'Senior Software Engineer',
      department: memberDept,
      email: memberEmail.trim(),
      avatar: '',
      initials,
      status: 'online',
      timezone: 'UTC-7 (PST)',
      activeProjects: ['General Onboarding'],
      bio: memberBio.trim() || 'Newly onboarded technical squad contributor.',
      skills: memberSkills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    onAddTeamMember(newMember);
    onShowToast(`Added team member ${newMember.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-7">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Resource
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setTab('project')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'project'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Project Deliverable</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('member')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'member'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Team Member</span>
          </button>
        </div>

        {/* Forms */}
        {tab === 'project' ? (
          <form onSubmit={handleCreateProject} className="pt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus Engine"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="Scope, technical objectives, and key milestones..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-900 dark:text-white mb-1">
                  Category
                </label>
                <select
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value as Project['category'])}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Core Platform">Core Platform</option>
                  <option value="Data Pipeline">Data Pipeline</option>
                  <option value="Design System">Design System</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 dark:text-white mb-1">
                  Priority
                </label>
                <select
                  value={projectPriority}
                  onChange={(e) => setProjectPriority(e.target.value as Project['priority'])}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-900 dark:text-white mb-1">
                  Budget Allocation
                </label>
                <input
                  type="text"
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(e.target.value)}
                  placeholder="$75,000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 dark:text-white mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={projectTags}
                  onChange={(e) => setProjectTags(e.target.value)}
                  placeholder="eBPF, Rust, Kernel"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Create Project
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateMember} className="pt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="e.g. Liam Sterling"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-900 dark:text-white mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="liam@pulseworkspace.internal"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 dark:text-white mb-1">
                  Department
                </label>
                <select
                  value={memberDept}
                  onChange={(e) => setMemberDept(e.target.value as TeamMember['department'])}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                placeholder="Senior Distributed Systems Engineer"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={memberSkills}
                onChange={(e) => setMemberSkills(e.target.value)}
                placeholder="Rust, Go, Kafka, Docker"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Add Member
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
