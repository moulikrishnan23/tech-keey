/**
 * ============================================================================
 *  TechKeey — Registration Deadline & Timezone Utility
 *  Target Deadline: 21 September 2026, 12:00:00 AM IST (Midnight / UTC+5:30)
 * ============================================================================
 */

export const REGISTRATION_DEADLINE_ISO = '2026-09-21T00:00:00+05:30';
export const REGISTRATION_DEADLINE_MS = new Date(REGISTRATION_DEADLINE_ISO).getTime();

export interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isClosed: boolean;
  formattedText: string;
}

/**
 * Checks if current time has reached or passed the absolute registration cutoff (21 Sep 2026, 12:00:00 AM IST).
 * Timezone-agnostic: uses absolute UTC epoch timestamps.
 */
export function isRegistrationClosed(): boolean {
  return Date.now() >= REGISTRATION_DEADLINE_MS;
}

/**
 * Calculates remaining time until the registration deadline.
 */
export function getTimeRemaining(): TimeRemaining {
  const total = REGISTRATION_DEADLINE_MS - Date.now();

  if (total <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isClosed: true,
      formattedText: '00:00:00'
    };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  const pad = (n: number) => String(n).padStart(2, '0');

  let formattedText = '';
  if (days > 0) {
    formattedText = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  } else {
    formattedText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isClosed: false,
    formattedText
  };
}
