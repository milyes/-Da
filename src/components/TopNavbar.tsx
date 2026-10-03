import React, { useRef, useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  Search,
  X,
  Plus,
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  Menu,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { ViewId, NotificationItem } from '../types';

interface TopNavbarProps {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResultCount: number;
  totalItemsCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNewModal: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsAsRead: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  searchResultCount,
  totalItemsCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenNewModal,
  notifications,
  onMarkNotificationsAsRead,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Global keyboard shortcut: Cmd+K / Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && isSearchFocused) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // View configuration items
  const navItems: Array<{ id: ViewId; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Dynamic placeholder text tailored to the active view
  const searchPlaceholders: Record<ViewId, string> = {
    overview: 'Filter metrics, activity & tasks...',
    projects: 'Filter projects by title, tag, lead...',
    analytics: 'Filter metrics, APIs & endpoints...',
    team: 'Filter members by name, role, skill...',
    settings: 'Filter preferences & options...',
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand & Desktop View Navigation Switcher */}
        <div className="flex items-center gap-3 lg:gap-7 shrink-0">
          {/* Brand Wordmark */}
          <button
            onClick={() => {
              onViewChange('overview');
              onSearchChange('');
            }}
            className="flex items-center gap-2.5 focus:outline-none group text-left"
            title="Pulse Workspace - Home"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                Pulse
                <span className="hidden xl:inline-block text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/50">
                  v3.8
                </span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-0.5 hidden sm:block">
                Workspace
              </span>
            </div>
          </button>

          {/* Desktop View Switcher Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/70 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center / Right: Filter Search Input Field */}
        <div className="flex-1 max-w-md mx-auto sm:mx-0 min-w-0">
          <div
            className={`relative flex items-center transition-all duration-200 ${
              isSearchFocused
                ? 'ring-2 ring-indigo-500/30 border-indigo-500 dark:border-indigo-400'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            } bg-slate-100/90 dark:bg-slate-800/80 border rounded-lg px-2.5 py-1.5`}
          >
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={searchPlaceholders[activeView]}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none min-w-0"
              aria-label={`Search and filter in ${activeView}`}
            />

            {/* Clear Button or Result Count Pill */}
            {searchQuery ? (
              <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 tabular-nums">
                  {searchResultCount}/{totalItemsCount}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 shrink-0 ml-1.5">
                <kbd className="hidden lg:inline-block text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Controls: Quick Create, Notifications, Theme, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Contextual "+ New" Action Button */}
          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-all active:scale-95 whitespace-nowrap"
            title="Create new project or task"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New Item</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.2 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkNotificationsAsRead}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        !notif.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              title="User Account: Sarah Chen"
            >
              <img
                src="/src/assets/images/avatar_sarah_chen_1791044271279.jpg"
                alt="Sarah Chen"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="hidden xl:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Sarah Chen
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Sarah Chen</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    sarah.chen@pulseworkspace.internal
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Staff Systems Architect</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onViewChange('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Account Settings</span>
                    <span className="text-[10px] text-slate-400">⌘,</span>
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('team');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Team Directory
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      alert('Signed in as Sarah Chen (Administrator Session Active)');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-medium"
                  >
                    Session Information
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Open mobile menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search match info in mobile menu if filtering */}
          {searchQuery && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <span>Filter active: &ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => onSearchChange('')}
                className="text-indigo-600 dark:text-indigo-400 font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
