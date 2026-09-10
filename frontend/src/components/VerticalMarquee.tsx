import React from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';

export const VerticalMarquee: React.FC = () => {
  const marqueeItems = HACKATHON_CONFIG.marquee;

  const renderTrack = () => (
    <>
      {marqueeItems.map((item, idx) => (
        <span
          key={`m1-${idx}`}
          className="marquee-item"
          style={{ color: item.color }}
        >
          {item.text}
        </span>
      ))}
      {marqueeItems.map((item, idx) => (
        <span
          key={`m2-${idx}`}
          className="marquee-item"
          style={{ color: item.color }}
        >
          {item.text}
        </span>
      ))}
      {marqueeItems.map((item, idx) => (
        <span
          key={`m3-${idx}`}
          className="marquee-item"
          style={{ color: item.color }}
        >
          {item.text}
        </span>
      ))}
      {marqueeItems.map((item, idx) => (
        <span
          key={`m4-${idx}`}
          className="marquee-item"
          style={{ color: item.color }}
        >
          {item.text}
        </span>
      ))}
    </>
  );

  return (
    <div className="vertical-marquee-container" aria-hidden="true">
      {/* Left Marquee: Continuously scrolls downward */}
      <div className="vertical-marquee left-marquee">
        <div className="marquee-track scroll-down">
          {renderTrack()}
        </div>
      </div>

      {/* Right Marquee: Continuously scrolls upward */}
      <div className="vertical-marquee right-marquee">
        <div className="marquee-track scroll-up">
          {renderTrack()}
        </div>
      </div>
    </div>
  );
};
