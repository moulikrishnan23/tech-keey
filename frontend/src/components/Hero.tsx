import React from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';
import LeSuccessLogo from '../assets/LeSuccess.png';
import TechKeeyLogo from '../assets/TechKeey.png';
import EventNameLogo from '../assets/eventname.png';

export const Hero: React.FC = () => {
  const { dividerText } = HACKATHON_CONFIG.collaboration;
  const { ribbonTitle, aboutTitle, aboutText, steps } = HACKATHON_CONFIG.journey;

  return (
    <div className="hero">
      {/* Collaboration Logos - Separate White Backgrounds */}
      <div className="hero-collaboration-group">
        <div className="collab-logo-card">
          <img src={LeSuccessLogo} alt="LeSuccess" className="collab-logo-img collab-lesuccess-img" />
        </div>
        <span className="collab-divider-symbol">{dividerText}</span>
        <div className="collab-logo-card">
          <img src={TechKeeyLogo} alt="TechKeey" className="collab-logo-img collab-techkeey-img" />
        </div>
      </div>

      {/* Hero Event Graphic */}
      <div className="hero-event-wrapper hero-eduthon-wrapper">
        <div className="hero-event-card">
          <img
            src={EventNameLogo}
            alt={HACKATHON_CONFIG.eventName}
            className="hero-event-img hero-eduthon-img"
          />
        </div>
      </div>

      {/* Journey from Ideas to Impact Section */}
      <div className="journey-section-wrapper">
        <div className="journey-ribbon-badge">{ribbonTitle}</div>
        <div className="journey-card">
          <div className="journey-about-box">
            <h3 className="journey-about-title">{aboutTitle}</h3>
            <p className="journey-about-text">{aboutText}</p>
          </div>

          <div className="journey-steps-track">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="journey-step-item">
                  <div className="journey-icon-circle">{step.icon}</div>
                  <div className="journey-step-title">{step.title}</div>
                  <div className="journey-step-desc">{step.desc}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="journey-step-arrow" aria-hidden="true">
                    ›
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


