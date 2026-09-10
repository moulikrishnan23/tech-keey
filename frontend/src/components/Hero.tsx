import React from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';

export const Hero: React.FC = () => {
  const { partnerOne, partnerTwo, dividerText } = HACKATHON_CONFIG.collaboration;

  return (
    <div className="hero">
      <div className="hero-collaboration-badge">
        <div className="collab-partner">
          {partnerOne.logoUrl ? (
            <img src={partnerOne.logoUrl} alt={partnerOne.name} className="collab-logo" />
          ) : (
            <span className="collab-name">{partnerOne.name}</span>
          )}
        </div>
        <span className="collab-divider">{dividerText}</span>
        <div className="collab-partner">
          {partnerTwo.logoUrl ? (
            <img src={partnerTwo.logoUrl} alt={partnerTwo.name} className="collab-logo" />
          ) : (
            <span className="collab-name collab-accent">{partnerTwo.name}</span>
          )}
        </div>
      </div>
      <h1 className="hero-title">
        Transforming Campus Bottlenecks Into <span className="accent">Innovative Solutions</span>
      </h1>
      <p className="hero-text">
        Empowering students and faculty to voice real campus challenges and propose thoughtful solutions that drive positive change across academic environments.
      </p>
    </div>
  );
};

