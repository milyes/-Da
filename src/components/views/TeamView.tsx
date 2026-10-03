import React, { useState } from 'react';
import {
  Users,
  Mail,
  Clock,
  Sparkles,
  FilterX,
  Plus,
  Briefcase,
  CheckCircle,
  MessageSquare,
  Shield,
  MapPin,
} from 'lucide-react';
import { TeamMember } from '../../types';

interface TeamViewProps {
  team: TeamMember[];
  searchQuery: string;
  onClearSearch: () => void;
  onSelectMember: (member: TeamMember) => void;
  onOpenAddMemberModal: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  team,
  searchQuery,
  onClearSearch,
  onSelectMember,
  onOpenAddMemberModal,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const departments = ['all', 'Engineering', 'Product', 'Design', 'Operations'];

  const q = searchQuery.toLowerCase().trim();
  const filteredTeam = team.filter((m) => {
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.bio.toLowerCase().includes(q) ||
      m.skills.some((s) => s.toLowerCase().includes(q));

    const matchesDept = selectedDept === 'all' || m.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner when Search is Active */}
      {searchQuery && (
        <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Filtering Team Members: &ldquo;{searchQuery}&rdquo;
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ({filteredTeam.length} of {team.length} matching)
            </span>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors shrink-0"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset Team Filter</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Engineering & Leadership Directory</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 tabular-nums">
              {filteredTeam.length} members
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Squad leads, architecture owners, and design token maintainers across active clusters.
          </p>
        </div>

        <button
          onClick={onOpenAddMemberModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Teammate</span>
        </button>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
              selectedDept === dept
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {dept === 'all' ? 'All Departments' : dept}
          </button>
        ))}
      </div>

      {/* Team Cards Grid */}
      {filteredTeam.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/60 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Status & Role */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm">
                        {member.initials}
                      </div>
                    )}
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                        member.status === 'online'
                          ? 'bg-emerald-500'
                          : member.status === 'away'
                          ? 'bg-amber-400'
                          : 'bg-slate-400'
                      }`}
                      title={`Status: ${member.status}`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {member.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {member.timezone.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {member.department}
                    </p>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3.5 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {member.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-mono py-0.5">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom contact bar */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[170px]">
                  {member.email}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMember(member);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors border border-slate-200/80 dark:border-slate-700/80"
                >
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No team members found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            No colleagues matched your query &ldquo;{searchQuery}&rdquo;.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={onClearSearch}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
            >
              Clear Search
            </button>
            <button
              onClick={onOpenAddMemberModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              + Add Member
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
