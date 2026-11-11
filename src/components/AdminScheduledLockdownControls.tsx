import React, { useState, useEffect } from 'react';
import { 
  LOCKDOWN_DURATIONS, 
  formatReopeningDateTime, 
  calculateRemainingTime, 
  CountdownResult 
} from '../lib/lockdownManager';
import { Clock, Calendar, CheckCircle2, AlertTriangle, XCircle, Power, Timer } from 'lucide-react';

interface AdminScheduledLockdownControlsProps {
  isMaintenanceMode: boolean;
  siteSettings: any;
  onToggleMaintenance: () => void;
  onScheduleLockdown?: (durationValue: string) => Promise<void>;
  onCancelScheduledLockdown?: () => Promise<void>;
}

export const AdminScheduledLockdownControls: React.FC<AdminScheduledLockdownControlsProps> = ({
  isMaintenanceMode,
  siteSettings,
  onToggleMaintenance,
  onScheduleLockdown,
  onCancelScheduledLockdown,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>(
    siteSettings?.lockdownDuration || '1h'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live countdown state if scheduled lockdown is active
  const isScheduled = isMaintenanceMode && siteSettings?.lockdownMode === 'scheduled' && siteSettings?.lockdownEndAt;
  const [remaining, setRemaining] = useState<CountdownResult>(() => 
    calculateRemainingTime(siteSettings?.lockdownEndAt)
  );

  useEffect(() => {
    if (!isScheduled) return;

    const timer = setInterval(() => {
      setRemaining(calculateRemainingTime(siteSettings.lockdownEndAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [isScheduled, siteSettings?.lockdownEndAt]);

  // Selected duration details and preview reopening time
  const currentOption = LOCKDOWN_DURATIONS.find(d => d.value === selectedDuration) || LOCKDOWN_DURATIONS[1];
  const previewEndAt = Date.now() + currentOption.ms;
  const previewFormatted = formatReopeningDateTime(previewEndAt);

  // Active scheduled lockdown details
  const activeFormatted = siteSettings?.lockdownEndAt ? formatReopeningDateTime(siteSettings.lockdownEndAt) : null;

  const handleActivateScheduled = async () => {
    if (!onScheduleLockdown) return;
    setIsSubmitting(true);
    try {
      await onScheduleLockdown(selectedDuration);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelLockdown = async () => {
    if (!onCancelScheduledLockdown) return;
    setIsSubmitting(true);
    try {
      await onCancelScheduledLockdown();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-white/[0.08]">
      
      {/* 1. If Scheduled Lockdown is Currently ACTIVE */}
      {isScheduled ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ffb74d]">
                Scheduled Lockdown Active ({siteSettings?.lockdownDuration?.toUpperCase() || '1H'})
              </span>
            </div>
            <span className="text-[11px] font-mono text-stone-300">
              {remaining.formattedString}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-black/40 p-3 rounded-xl border border-white/[0.06]">
              <span className="text-stone-400 block text-[10.5px] uppercase font-mono mb-1">
                Scheduled Reopening (English):
              </span>
              <span className="font-mono font-bold text-white">
                {activeFormatted?.en}
              </span>
            </div>

            <div className="bg-black/40 p-3 rounded-xl border border-white/[0.06]">
              <span className="text-stone-400 block text-[10.5px] uppercase font-mono mb-1">
                পুনরায় সচল হওয়ার সময় (বাংলা):
              </span>
              <span className="font-sans font-bold text-[#fdbf5e]">
                {activeFormatted?.bn}
              </span>
            </div>
          </div>

          {/* Quick Actions while active: Extend/Change Duration OR Cancel/Unlock */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-stone-300 font-mono">সময়সীমা পরিবর্তন:</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                disabled={isSubmitting}
                className="bg-[#121212] border border-white/[0.15] text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#d4a762] font-mono"
              >
                {LOCKDOWN_DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleActivateScheduled}
                disabled={isSubmitting}
                className="bg-[#d4a762]/20 hover:bg-[#d4a762]/30 border border-[#d4a762]/50 text-[#fdbf5e] font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                আপডেট করুন
              </button>
            </div>

            <button
              type="button"
              onClick={handleCancelLockdown}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>লকডাউন বাতিল ও ওয়েবসাইট আনলক করুন</span>
            </button>
          </div>
        </div>
      ) : isMaintenanceMode && (!siteSettings?.lockdownMode || siteSettings?.lockdownMode === 'manual') ? (
        /* 2. If Manual Permanent Lockdown is Currently ACTIVE */
        <div className="p-4 rounded-2xl bg-red-500/[0.06] border border-red-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-300">
                Manual Permanent Lockdown Active
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleMaintenance}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              <span>অবিলম্বে আনলক করুন</span>
            </button>
          </div>
          <p className="text-[11.5px] text-stone-300 leading-relaxed">
            স্থায়ী ম্যানুয়াল মোডে কোনো নির্দিষ্ট সময়সীমা ছাড়াই ওয়েবসাইট বন্ধ রাখা হয়েছে। আপনি চাইলে নিচে নির্দিষ্ট সময়সীমা নির্বাচন করে শিডিউলড লকডাউনে রূপান্তর করতে পারেন।
          </p>
        </div>
      ) : null}

      {/* 3. Scheduled Lockdown Duration Configuration Controls */}
      <div className="bg-[#050505] p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#d4a762]">
              Scheduled Lockdown Duration (নির্ধারিত লকডাউন সময়সীমা)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-stone-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.08]">
            Auto-Reopening System
          </span>
        </div>

        {/* Dropdown Selector for All 11 Exact Durations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-[11px] font-mono text-stone-300 mb-1.5 font-semibold">
              সময়সীমা নির্বাচন করুন (Select Duration):
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-[#121212] border border-white/[0.15] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#d4a762] font-mono cursor-pointer"
            >
              {LOCKDOWN_DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick pills for popular choices */}
          <div>
            <label className="block text-[11px] font-mono text-stone-400 mb-1.5">
              দ্রুত নির্বাচন:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['30m', '1h', '2h', '6h', '12h', '1d'].map((val) => {
                const item = LOCKDOWN_DURATIONS.find(d => d.value === val);
                const isActive = selectedDuration === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedDuration(val)}
                    className={`text-[10.5px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#d4a762] text-black font-black border-[#d4a762]' 
                        : 'bg-white/[0.03] text-stone-300 border-white/[0.1] hover:border-white/[0.25]'
                    }`}
                  >
                    {item?.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-time Reopening Preview */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-stone-400 block flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#d4a762]" />
              নির্ধারিত সময় শেষে স্বয়ংক্রিয়ভাবে সচল হওয়ার সময় (Preview):
            </span>
            <span className="font-sans font-bold text-[#fdbf5e] text-xs sm:text-[13px] block">
              {previewFormatted.bn}
            </span>
            <span className="font-mono text-stone-400 text-[10.5px] block">
              {previewFormatted.en}
            </span>
          </div>

          {/* Activation Action Button */}
          <button
            type="button"
            onClick={handleActivateScheduled}
            disabled={isSubmitting}
            className="shrink-0 bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Timer className="w-4 h-4 text-stone-950" />
            <span>লকডাউন সক্রিয় করুন ({currentOption.label})</span>
          </button>
        </div>

        <p className="text-[10.5px] text-stone-400 font-mono leading-relaxed">
          💡 <strong>অটোমেটিক রিকভারি:</strong> নির্ধারিত সময় শেষ হওয়া মাত্রই ক্লাউড ফায়ারবেস ও ভিজিটর ব্রাউজার স্বয়ংক্রিয়ভাবে ওয়েবসাইটটিকে লাইভ করে দেবে। এডমিনের ম্যানুয়ালি ফিরে এসে আনলক করার প্রয়োজন নেই।
        </p>
      </div>

    </div>
  );
};
