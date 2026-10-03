import React, { useState, useEffect, useMemo } from 'react';
import { ViewId, Project, TeamMember, SettingItem, NotificationItem } from './types';
import {
  INITIAL_METRICS,
  INITIAL_PROJECTS,
  INITIAL_ACTIVITIES,
  INITIAL_TEAM,
  INITIAL_ENDPOINTS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { TopNavbar } from './components/TopNavbar';
import { OverviewView } from './components/views/OverviewView';
import { ProjectsView } from './components/views/ProjectsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { TeamView } from './components/views/TeamView';
import { SettingsView } from './components/views/SettingsView';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { TeamMemberModal } from './components/modals/TeamMemberModal';
import { NewItemModal } from './components/modals/NewItemModal';
import { Toast } from './components/Toast';

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core application data collections
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [metrics] = useState(INITIAL_METRICS);
  const [activities] = useState(INITIAL_ACTIVITIES);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [endpoints] = useState(INITIAL_ENDPOINTS);
  const [settings, setSettings] = useState<SettingItem[]>(INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Active Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Compute search match counts per current active view
  const { matchCount, totalCount } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (activeView === 'overview') {
      const total = metrics.length + activities.length + projects.length;
      if (!q) return { matchCount: total, totalCount: total };
      const mMatches = metrics.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      ).length;
      const aMatches = activities.filter(
        (a) =>
          a.user.name.toLowerCase().includes(q) ||
          a.action.toLowerCase().includes(q) ||
          a.target.toLowerCase().includes(q)
      ).length;
      const pMatches = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      ).length;
      return { matchCount: mMatches + aMatches + pMatches, totalCount: total };
    }

    if (activeView === 'projects') {
      const total = projects.length;
      if (!q) return { matchCount: total, totalCount: total };
      const pMatches = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.lead.name.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          p.status.toLowerCase().includes(q)
      ).length;
      return { matchCount: pMatches, totalCount: total };
    }

    if (activeView === 'analytics') {
      const total = endpoints.length;
      if (!q) return { matchCount: total, totalCount: total };
      const eMatches = endpoints.filter(
        (ep) =>
          ep.endpoint.toLowerCase().includes(q) ||
          ep.service.toLowerCase().includes(q) ||
          ep.method.toLowerCase().includes(q) ||
          ep.status.toLowerCase().includes(q)
      ).length;
      return { matchCount: eMatches, totalCount: total };
    }

    if (activeView === 'team') {
      const total = team.length;
      if (!q) return { matchCount: total, totalCount: total };
      const tMatches = team.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      ).length;
      return { matchCount: tMatches, totalCount: total };
    }

    if (activeView === 'settings') {
      const total = settings.length;
      if (!q) return { matchCount: total, totalCount: total };
      const sMatches = settings.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.keywords.some((k) => k.toLowerCase().includes(q))
      ).length;
      return { matchCount: sMatches, totalCount: total };
    }

    return { matchCount: 0, totalCount: 0 };
  }, [activeView, searchQuery, metrics, activities, projects, endpoints, team, settings]);

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProject?.id === updated.id) {
      setSelectedProject(updated);
    }
  };

  const handleAddProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setActiveView('projects');
  };

  const handleAddTeamMember = (newMember: TeamMember) => {
    setTeam([newMember, ...team]);
    setActiveView('team');
  };

  const handleUpdateSetting = (id: string, value: boolean | string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value } : s))
    );
  };

  const handleMarkNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastMessage('Marked all notifications as read.');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setToastMessage('Search filter cleared.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* 1. FIXED TOP NAVIGATION BAR WITH INTEGRATED VIEW SWITCHER & SEARCH INPUT */}
      <TopNavbar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          // Keep search query to allow cross-view filtering exploration, or toast if non-empty
          if (searchQuery) {
            setToastMessage(`Switched to ${view.toUpperCase()} view with filter "${searchQuery}".`);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResultCount={matchCount}
        totalItemsCount={totalCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => {
          setIsDarkMode(!isDarkMode);
          setToastMessage(`Switched to ${!isDarkMode ? 'Dark' : 'Light'} theme.`);
        }}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        notifications={notifications}
        onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
      />

      {/* 2. MAIN VIEWPORT CONTENT (Padded top to accommodate fixed top navigation bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-22 pb-16">
        {activeView === 'overview' && (
          <OverviewView
            metrics={metrics}
            activities={activities}
            projects={projects}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onSelectProject={setSelectedProject}
            onNavigateToView={(view) => setActiveView(view)}
          />
        )}

        {activeView === 'projects' && (
          <ProjectsView
            projects={projects}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onSelectProject={setSelectedProject}
            onOpenNewProjectModal={() => setIsNewModalOpen(true)}
          />
        )}

        {activeView === 'analytics' && (
          <AnalyticsView
            endpoints={endpoints}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />
        )}

        {activeView === 'team' && (
          <TeamView
            team={team}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onSelectMember={setSelectedMember}
            onOpenAddMemberModal={() => setIsNewModalOpen(true)}
          />
        )}

        {activeView === 'settings' && (
          <SettingsView
            settings={settings}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onUpdateSetting={handleUpdateSetting}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}
      </main>

      {/* 3. FOOTER (Clean unboxed metadata, zero slop) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Pulse Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Cluster Production-v3</span>
            <span aria-hidden="true">·</span>
            <span>99.98% Nominal Uptime</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('overview')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('projects')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveView('team')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Team
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdateProject={handleUpdateProject}
          onShowToast={(msg) => setToastMessage(msg)}
        />
      )}

      {selectedMember && (
        <TeamMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onShowToast={(msg) => setToastMessage(msg)}
        />
      )}

      {isNewModalOpen && (
        <NewItemModal
          onClose={() => setIsNewModalOpen(false)}
          onAddProject={handleAddProject}
          onAddTeamMember={handleAddTeamMember}
          onShowToast={(msg) => setToastMessage(msg)}
        />
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}

    </div>
  );
}
