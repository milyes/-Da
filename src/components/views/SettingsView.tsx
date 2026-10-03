import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Webhook,
  FilterX,
  Check,
  Save,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { SettingItem } from '../../types';

interface SettingsViewProps {
  settings: SettingItem[];
  searchQuery: string;
  onClearSearch: () => void;
  onUpdateSetting: (id: string, value: boolean | string) => void;
  onShowToast: (message: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  searchQuery,
  onClearSearch,
  onUpdateSetting,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    'all',
    'General',
    'Notifications',
    'Security',
    'Appearance',
    'API & Webhooks',
  ];

  const q = searchQuery.toLowerCase().trim();
  const filteredSettings = settings.filter((s) => {
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.toLowerCase().includes(q));

    const matchesCategory =
      activeCategory === 'all' || s.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const categoryIcons: Record<string, React.ElementType> = {
    General: Sliders,
    Notifications: Bell,
    Security: Shield,
    Appearance: Palette,
    'API & Webhooks': Webhook,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner when Search is Active */}
      {searchQuery && (
        <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Filtering Workspace Preferences: &ldquo;{searchQuery}&rdquo;
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ({filteredSettings.length} of {settings.length} options matching)
            </span>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors shrink-0"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset Settings Search</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Workspace Configuration</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global governance parameters, telemetry toggles, cryptographic WebAuthn policies, and webhook listeners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowToast('All configuration changes saved to cloud storage.')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Settings' : cat}
          </button>
        ))}
      </div>

      {/* Settings Sections / Cards */}
      {filteredSettings.length > 0 ? (
        <div className="space-y-4">
          {filteredSettings.map((item) => {
            const Icon = categoryIcons[item.category] || Sliders;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 max-w-xl">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                      <span>{item.category}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Interactive Controls per Setting Type */}
                <div className="shrink-0 self-end sm:self-center">
                  {item.type === 'toggle' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !item.value;
                        onUpdateSetting(item.id, nextVal);
                        onShowToast(`Updated "${item.title}" to ${nextVal ? 'Enabled' : 'Disabled'}`);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        item.value ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={Boolean(item.value)}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          item.value ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  ) : item.type === 'select' ? (
                    <select
                      value={String(item.value)}
                      onChange={(e) => {
                        onUpdateSetting(item.id, e.target.value);
                        onShowToast(`Updated "${item.title}"`);
                      }}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {item.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={String(item.value)}
                      onChange={(e) => onUpdateSetting(item.id, e.target.value)}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No settings found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            No preferences matched &ldquo;{searchQuery}&rdquo;.
          </p>
          <div className="mt-4">
            <button
              onClick={onClearSearch}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
            >
              Clear Search Query
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
