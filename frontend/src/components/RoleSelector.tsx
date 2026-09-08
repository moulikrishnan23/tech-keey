import React from 'react';
import { UserType } from '../types';

interface RoleSelectorProps {
  selectedRole: UserType;
  onSelectRole: (role: 'Student' | 'Faculty') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="section-block">
      <div className="section-card">
        <div className="section-head">
          <div className="section-eyebrow">Step One</div>
          <h2 className="section-title">Who's sharing today?</h2>
          <p className="section-sub">Choose the option that describes you to get started.</p>
        </div>
        <div className="role-grid">
          <div
            className={`role-card ${selectedRole === 'Student' ? 'selected' : ''}`}
            data-role="Student"
            tabIndex={0}
            role="button"
            aria-pressed={selectedRole === 'Student'}
            onClick={() => onSelectRole('Student')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectRole('Student');
              }
            }}
          >
            <div className="role-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
            </div>
            <div className="role-title">I'm a college student</div>
            <div className="role-desc">
              Share challenges you experience in your academic or college environment and ideas that could improve them.
            </div>
          </div>

          <div
            className={`role-card ${selectedRole === 'Faculty' ? 'selected' : ''}`}
            data-role="Faculty"
            tabIndex={0}
            role="button"
            aria-pressed={selectedRole === 'Faculty'}
            onClick={() => onSelectRole('Faculty')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectRole('Faculty');
              }
            }}
          >
            <div className="role-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div className="role-title">I'm a faculty member</div>
            <div className="role-desc">
              Share challenges you observe in academic or campus environments and ideas that could improve them.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
