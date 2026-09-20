import React, { useState, useEffect } from 'react';
import { getTimeRemaining, TimeRemaining } from '../utils/deadline';

interface CountdownTimerProps {
  onDeadlineReached?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ onDeadlineReached }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => getTimeRemaining());

  useEffect(() => {
    const updateTimer = () => {
      const remaining = getTimeRemaining();
      setTimeLeft(remaining);

      if (remaining.isClosed && onDeadlineReached) {
        onDeadlineReached();
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [onDeadlineReached]);

  if (timeLeft.isClosed) {
    return null;
  }

  const isUrgent = timeLeft.total < 2 * 60 * 60 * 1000; // Less than 2 hours

  return (
    <aside
      className={`top-countdown-banner ${isUrgent ? 'urgent' : ''}`}
      aria-label="Registration countdown deadline banner"
      role="region"
    >
      <div className="countdown-content">
        <div className="countdown-badge">
          <span className="pulse-indicator" aria-hidden="true" />
          <span className="countdown-label">Registration closes in:</span>
        </div>

        <div className="countdown-timer-digits" aria-live="polite">
          <span className="countdown-value">{timeLeft.formattedText}</span>
        </div>

        <div className="countdown-deadline-note">
          Deadline: 20 Sept 2026, 11:59:59 PM IST (12:00 AM)
        </div>
      </div>
    </aside>
  );
};
