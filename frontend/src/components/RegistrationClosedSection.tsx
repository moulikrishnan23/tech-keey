import React from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';
import LeSuccessLogo from '../assets/LeSuccess.png';
import TechKeeyLogo from '../assets/TechKeey.png';

export const RegistrationClosedSection: React.FC = () => {
  const { social, collaboration } = HACKATHON_CONFIG;

  return (
    <div className="section-block fade-in-slide">
      <div className="section-card" style={{ textAlign: 'center' }}>
        {/* Closed Lock Icon */}
        <div
          className="success-icon"
          style={{
            borderColor: 'var(--accent)',
            background: 'radial-gradient(circle, rgba(15, 122, 92, 0.2), transparent 70%)',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: 'var(--accent-deep)' }}
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="success-title" style={{ color: 'var(--charcoal)', marginBottom: '8px' }}>
          Registration Closed
        </h2>

        <p
          className="success-text"
          style={{
            color: 'var(--ink-muted)',
            fontSize: '16.5px',
            maxWidth: '520px',
            margin: '0 auto 10px',
            fontWeight: 700,
          }}
        >
          Registration for TechKeey is now closed.
        </p>

        <p
          style={{
            color: 'var(--ink-muted)',
            fontSize: '15px',
            maxWidth: '540px',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Thank you for your interest and participation.
        </p>

        {/* Social Media & Announcements Card */}
        <div
          className="instagram-cta-card success-notice"
          style={{ maxWidth: '640px', margin: '0 auto 28px', textAlign: 'left' }}
        >
          <div className="cta-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          <div className="cta-content">
            <h4 className="cta-title">Important Updates &amp; Announcements</h4>
            <ul
              style={{
                margin: '10px 0 16px',
                paddingLeft: '20px',
                color: 'var(--ink-muted)',
                fontSize: '14px',
                lineHeight: '1.75',
              }}
            >
              <li>Finalist and instructions will be announced on our Instagram. Follow us to stay updated.</li>
              <li>For further updates, please follow us on Instagram.</li>
              <li>Want to participate in more events like this? Follow us on Instagram and LinkedIn for future events and opportunities.</li>
            </ul>

            <div
              className="closed-social-buttons"
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '14px' }}
            >
              <a
                href={social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-instagram"
              >
                Follow LeSuccess on Instagram →
              </a>

              {social.linkedinUrl && (
                <a
                  href={social.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-linkedin"
                >
                  Follow on LinkedIn →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Process Roadmap */}
        <div className="process-row" style={{ marginTop: '24px', marginBottom: '24px' }}>
          <div
            className="process-step"
            style={{
              background: 'var(--charcoal)',
              color: '#7fd9b8',
              borderColor: 'var(--accent)',
            }}
          >
            Registration Closed
          </div>
          <div className="process-arrow">→</div>
          <div className="process-step">Idea Evaluation</div>
          <div className="process-arrow">→</div>
          <div className="process-step">Finalists Announcement</div>
          <div className="process-arrow">→</div>
          <div className="process-step">Grand Finale</div>
        </div>

        {/* Collaboration Logos */}
        <div className="hero-collaboration-group success-collab-group" style={{ marginTop: '30px' }}>
          <div className="collab-logo-card">
            <img
              src={LeSuccessLogo}
              alt="LeSuccess"
              className="collab-logo-img collab-lesuccess-img"
            />
          </div>
          <span className="collab-divider-symbol">
            {collaboration.dividerText}
          </span>
          <div className="collab-logo-card">
            <img
              src={TechKeeyLogo}
              alt="TechKeey"
              className="collab-logo-img collab-techkeey-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
