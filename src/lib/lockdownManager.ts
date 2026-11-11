/**
 * Scheduled Website Lockdown System
 * Source of truth: Cloud Firestore (site_settings/current)
 */

export interface LockdownDurationOption {
  label: string;
  value: string;
  ms: number;
}

export const LOCKDOWN_DURATIONS: LockdownDurationOption[] = [
  { label: '30 Minutes', value: '30m', ms: 30 * 60 * 1000 },
  { label: '1 Hour', value: '1h', ms: 60 * 60 * 1000 },
  { label: '2 Hours', value: '2h', ms: 2 * 60 * 60 * 1000 },
  { label: '3 Hours', value: '3h', ms: 3 * 60 * 60 * 1000 },
  { label: '4 Hours', value: '4h', ms: 4 * 60 * 60 * 1000 },
  { label: '6 Hours', value: '6h', ms: 6 * 60 * 60 * 1000 },
  { label: '12 Hours', value: '12h', ms: 12 * 60 * 60 * 1000 },
  { label: '1 Day', value: '1d', ms: 24 * 60 * 60 * 1000 },
  { label: '2 Days', value: '2d', ms: 2 * 24 * 60 * 60 * 1000 },
  { label: '3 Days', value: '3d', ms: 3 * 24 * 60 * 60 * 1000 },
  { label: '4 Days', value: '4d', ms: 4 * 24 * 60 * 60 * 1000 },
];

export interface LockdownState {
  isLocked: boolean;
  isMaintenanceMode?: boolean;
  lockdownMode: 'manual' | 'scheduled' | 'off';
  lockdownDuration?: string;
  lockdownStartAt?: number | null;
  lockdownEndAt?: number | null;
  updatedAt?: number;
  updatedBy?: string;
  lockdownId?: string;
}

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedString: string;
}

/**
 * Calculates countdown units from target timestamp against current time
 */
export function calculateRemainingTime(endTimestamp?: number | null): CountdownResult {
  if (!endTimestamp || typeof endTimestamp !== 'number') {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formattedString: '00 DAYS : 00 HOURS : 00 MINUTES : 00 SECONDS'
    };
  }

  const now = Date.now();
  const diff = endTimestamp - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formattedString: '00 DAYS : 00 HOURS : 00 MINUTES : 00 SECONDS'
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedString = `${pad(days)} DAYS : ${pad(hours)} HOURS : ${pad(minutes)} MINUTES : ${pad(seconds)} SECONDS`;

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    formattedString
  };
}

/**
 * Determines whether lockdown is currently in effect.
 * Automatically treats expired scheduled lockdowns as UNLOCKED even before background jobs run.
 */
export function isLockdownActive(settings?: Partial<LockdownState>): boolean {
  if (!settings) return false;

  const isEnabled = Boolean(settings.isLocked ?? settings.isMaintenanceMode);
  if (!isEnabled) return false;

  const mode = settings.lockdownMode || (settings.lockdownEndAt ? 'scheduled' : 'manual');

  if (mode === 'scheduled' && settings.lockdownEndAt) {
    if (Date.now() >= settings.lockdownEndAt) {
      return false; // Scheduled time has passed - automatically open website!
    }
  }

  return true;
}

/**
 * Formats a target reopening timestamp in Bengali and English for admin and user display
 */
export function formatReopeningDateTime(timestamp?: number | null): { bn: string; en: string } {
  if (!timestamp) {
    return { bn: 'নির্দিষ্ট নয়', en: 'Not scheduled' };
  }

  const d = new Date(timestamp);
  
  const en = d.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const bn = d.toLocaleString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return { bn, en };
}
