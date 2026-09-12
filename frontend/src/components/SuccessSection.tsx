import React, { useState, useEffect } from "react";
import { HACKATHON_CONFIG } from "../data/hackathonConfig";
import LeSuccessLogo from "../assets/LeSuccess.png";
import TechKeeyLogo from "../assets/TechKeey.png";
import confetti from "canvas-confetti";

interface SuccessSectionProps {
  submissionId: string;
  onRestart: () => void;
}

export const SuccessSection: React.FC<SuccessSectionProps> = ({
  submissionId,
  onRestart,
}) => {
  useEffect(() => {
    // Fire a single realistic confetti burst when success page loads
    const count = 150;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#0f7a5c', '#E1306C', '#f09433', '#7fd9b8', '#faf9f4']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!submissionId || submissionId === "—") return;

    const onCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(submissionId)
        .then(onCopied)
        .catch(onCopied);
    } else {
      const ta = document.createElement("textarea");
      ta.value = submissionId;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch (e) {
        console.warn("Copy fallback failed:", e);
      }
      document.body.removeChild(ta);
      onCopied();
    }
  };

  return (
    <div className="section-block fade-in-slide">
      <div className="section-card" style={{ textAlign: "center" }}>
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
            className={`copy-btn ${copied ? "copied" : ""}`}
            id="btn-copy-id"
            onClick={handleCopy}
          >
            {copied ? "Copied" : "Copy ID"}
          </button>
        </div>
        <div className="success-note">
          Please keep this Tracking ID for future reference.
        </div>

        {/* Prevent Re-submission Note */}
        <div className="resubmission-block-notice">
          <span className="notice-icon">ℹ️</span>
          <span>
            If you have already submitted your response, you cannot submit
            another response.
          </span>
        </div>

        {/* Post-Submission Instagram Announcement Section */}
        <div className="instagram-cta-card success-notice">
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
            <h4 className="cta-title">Stay Updated!</h4>
            <p className="cta-text">
              Important notifications and announcements will be posted on our Instagram page.
            </p>
            <a
              href={HACKATHON_CONFIG.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-instagram"
            >
              Follow LeSuccess on Instagram →
            </a>
          </div>
        </div>

        <p className="after-note">
          Your submission has been successfully recorded. TechKeey will review
          the challenges and suggested solutions. If further information is
          required, the team may contact you using the details provided.
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

        {/* Collaboration Logos - Separate White Backgrounds */}
        <div className="hero-collaboration-group success-collab-group" style={{marginTop:"30px"}}>
          <div className="collab-logo-card">
            <img
              src={LeSuccessLogo}
              alt="LeSuccess"
              className="collab-logo-img collab-lesuccess-img"
            />
          </div>
          <span className="collab-divider-symbol">
            {HACKATHON_CONFIG.collaboration.dividerText}
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
