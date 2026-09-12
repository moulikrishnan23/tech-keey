import React from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';
import PrizeImage from '../assets/prize.jpg';

export const InfoPanel: React.FC = () => {
  const { introParagraph, timeline, prizes, teamGuidelines, social } = HACKATHON_CONFIG;

  // Array of repeated prize images for continuous horizontal marquee
  const marqueeImages = Array.from({ length: 12 });

  return (
    <div className="info-panel hackathon-info-card">
      <div className="info-header">
        <div className="info-badge">Hackathon for Students &amp; Faculty</div>
        <h3 className="info-title">Before You Begin</h3>
      </div>

      <p className="info-intro">{introParagraph}</p>

      <div className="hackathon-details-grid">
        {/* Participation & Teams */}
        <div className="info-subcard">
          <div className="info-subhead">
            <span className="info-icon">💡</span>
            <strong>Prototype Initiative</strong>
          </div>
          <ul className="info-list">
            <li>{teamGuidelines.individualSubmission}</li>
            <li>{teamGuidelines.teamFormation}</li>
          </ul>
        </div>

        {/* Timeline */}
        <div className="info-subcard">
          <div className="info-subhead">
            <span className="info-icon">📅</span>
            <strong>Important Dates</strong>
          </div>
          <ul className="info-list timeline-list">
            <li>
              <span className="timeline-label">Start Date:</span>{' '}
              <span className="timeline-val">{timeline.startDate}</span>
            </li>
            <li>
              <span className="timeline-label">Last Date for Submission:</span>{' '}
              <span className="timeline-val">{timeline.lastDateForSubmission}</span>
            </li>
            <li>
              <span className="timeline-label">Finalists Announced on:</span>{' '}
              <span className="timeline-val">
                25th Sept at{' '}
                <a
                  href={social.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-link-accent"
                >
                  LeSuccess
                </a>
              </span>
            </li>
            <li>
              <span className="timeline-label">Grand Finale:</span>{' '}
              <span className="timeline-val">{timeline.grandFinaleDate}</span>
            </li>
          </ul>
        </div>

        {/* Prize & Rewards Section */}
        <div className="info-subcard full-width prize-section-card">
          <div className="info-subhead">
            <span className="info-icon">🏆</span>
            <strong>Prize &amp; Rewards:</strong>
          </div>

          {/* <div className="prize-banner-wrap">
            <img src={PrizeImage} alt="Prize and Rewards" className="prize-main-img" />
          </div> */}

          <div className="prizes-tags">
            {prizes.map((prize, idx) => (
              <span key={idx} className="prize-tag">
                ✨ {prize}
              </span>
            ))}
          </div>

          {/* Horizontal Prize Image Marquee - Seamless Infinite Scrolling */}
          <div className="prize-marquee-container" aria-hidden="true">
            <div className="prize-marquee-inner">
              <div className="prize-marquee-group">
                {marqueeImages.map((_, idx) => (
                  <div key={`g1-${idx}`} className="prize-marquee-item">
                    <img src={PrizeImage} alt="Prize" className="prize-marquee-img" loading="eager" />
                  </div>
                ))}
              </div>
              <div className="prize-marquee-group" aria-hidden="true">
                {marqueeImages.map((_, idx) => (
                  <div key={`g2-${idx}`} className="prize-marquee-item">
                    <img src={PrizeImage} alt="Prize" className="prize-marquee-img" loading="eager" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


