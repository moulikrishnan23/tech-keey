import React, { useState } from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';

interface SuccessSectionProps {
  submissionId: string;
  onRestart: () => void;
}

export const SuccessSection: React.FC<SuccessSectionProps> = ({ submissionId, onRestart }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!submissionId || submissionId === '—') return;

    const onCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(submissionId).then(onCopied).catch(onCopied);
    } else {
      const ta = document.createElement('textarea');
      ta.value = submissionId;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (e) {
        console.warn('Copy fallback failed:', e);
      }
      document.body.removeChild(ta);
      onCopied();
    }
  };

  return (
    <div id="success-section" style={{ display: 'block' }}>
      <div className="success-shell">
        <div className="success-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="success-title">Submission Successful</h2>
        <p className="success-text">
          Thank you for sharing your challenge and solution with TechKeey.
        </p>

        <div className="tracking-card">
          <div className="tracking-label">Your TechKeey Tracking ID</div>
          <div className="tracking-value" id="submission-id-value">
            {submissionId}
          </div>
          <button
            type="button"
            className={`copy-btn ${copied ? 'copied' : ''}`}
            id="btn-copy-id"
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy ID'}
          </button>
        </div>
        <div className="success-note">Please keep this Tracking ID for future reference.</div>

        {/* Prevent Re-submission Note */}
        <div className="resubmission-block-notice">
          <span className="notice-icon">ℹ️</span>
          <span>If you have already submitted your response, you cannot submit another response.</span>
        </div>

        {/* Post-Submission Instagram Announcement Section */}
        <div className="submission-notice-card success-notice">
          <div className="notice-icon">📢</div>
          <div className="notice-content">
            <p className="notice-text">
              Notifications / announcements will be posted on our Instagram page. Kindly follow our{' '}
              <a
                href={HACKATHON_CONFIG.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="notice-link"
              >
                Instagram page
              </a>{' '}
              for updates.
            </p>
          </div>
        </div>

        <p className="after-note">
          Your submission has been successfully recorded. TechKeey will review the challenges and suggested solutions. If further information is required, the team may contact you using the details provided.
        </p>

        <div className="process-row">
          <div className="process-step">Submitted</div>
          <div className="process-arrow">→</div>
          <div className="process-step">Under Review</div>
          <div className="process-arrow">→</div>
          <div className="process-step">Feasibility Assessment</div>
          <div className="process-arrow">→</div>
          <div className="process-step">Mentorship &amp; Next Steps</div>
        </div>
      </div>

      {/* 
      // Submit Another Response button preserved in code
      <div className="btn-row" style={{ justifyContent: 'center', marginTop: '28px' }}>
        <button type="button" className="btn btn-primary" id="btn-restart" onClick={onRestart}>
          Submit Another Response
        </button>
      </div> 
      */}

      {/* Developer / Testing Back Button */}
      <div className="dev-back-row">
        <button
          type="button"
          className="dev-back-btn"
          id="btn-dev-back"
          onClick={onRestart}
          title="Developer testing button: returns to registration form"
        >
          ← Back to Registration (Dev / Testing)
        </button>
      </div>
    </div>
  );
};

