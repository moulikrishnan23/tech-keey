import React from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';

export const InfoPanel: React.FC = () => {
  const { introParagraph, timeline, prizes, teamGuidelines } = HACKATHON_CONFIG;

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
              <span className="timeline-label">Finale Announced on:</span>{' '}
              <span className="timeline-val">{timeline.finaleAnnouncementDate}</span>
            </li>
            <li>
              <span className="timeline-label">Grand Finale:</span>{' '}
              <span className="timeline-val">{timeline.grandFinaleDate}</span>
            </li>
            <li>
              <span className="timeline-label">Team Formation Deadline:</span>{' '}
              <span className="timeline-val">{timeline.teamFormationDeadline}</span>
            </li>
          </ul>
        </div>

        {/* Prizes */}
        <div className="info-subcard full-width">
          <div className="info-subhead">
            <span className="info-icon">🏆</span>
            <strong>Prizes &amp; Rewards</strong>
          </div>
          <div className="prizes-tags">
            {prizes.map((prize, idx) => (
              <span key={idx} className="prize-tag">
                ✨ {prize}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

