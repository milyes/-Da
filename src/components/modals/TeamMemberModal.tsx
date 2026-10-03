import React, { useState } from 'react';
import {
  X,
  Mail,
  Clock,
  Briefcase,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react';
import { TeamMember } from '../../types';

interface TeamMemberModalProps {
  member: TeamMember;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  member,
  onClose,
  onShowToast,
}) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onShowToast(`Direct message dispatched to ${member.name}.`);
      setMessageText('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-7">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-lg">
                {member.initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    member.status === 'online'
                      ? 'bg-emerald-500'
                      : member.status === 'away'
                      ? 'bg-amber-400'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {member.role}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">{member.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              About & Mission
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {member.bio}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Department</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {member.department}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Local Time</span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                {member.timezone}
              </span>
            </div>
          </div>

          {/* Active Projects */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Assigned Initiatives
            </h4>
            <div className="space-y-1.5">
              {member.activeProjects.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Message Form */}
          <form onSubmit={handleSendMessage} className="pt-2">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Quick Ping / Secure Message
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Send encrypted message to ${member.name.split(' ')[0]}...`}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isSending || !messageText.trim()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
