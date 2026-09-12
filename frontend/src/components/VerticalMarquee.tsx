import React from 'react';
import { HACKATHON_CONFIG, MarqueeItem } from '../data/hackathonConfig';
import LeSuccessLogo from '../assets/LeSuccess.png';
import TechKeeyLogo from '../assets/TechKeey.png';

export const VerticalMarquee: React.FC = () => {
  const marqueeItems = HACKATHON_CONFIG.marquee;

  const renderItem = (item: MarqueeItem, key: string) => {
    if (item.type === 'logo') {
      const isLeSuccess = item.logo === 'lesuccess';
      const src = isLeSuccess ? LeSuccessLogo : TechKeeyLogo;
      const alt = isLeSuccess ? 'LeSuccess' : 'TechKeey';
      const logoClass = isLeSuccess ? 'marquee-logo-lesuccess' : 'marquee-logo-techkeey';

      return (
        <div key={key} className={`marquee-logo-wrap ${logoClass}`}>
          <img src={src} alt={alt} className="marquee-logo-img" />
        </div>
      );
    }

    return (
      <span
        key={key}
        className="marquee-item"
        style={{ color: item.color }}
      >
        {item.text}
      </span>
    );
  };

  const renderGroup = (prefix: string) => (
    <div className="vertical-marquee-group" aria-hidden={prefix !== 'g1' ? true : undefined}>
      {marqueeItems.map((item, idx) => renderItem(item, `${prefix}-${idx}`))}
    </div>
  );

  return (
    <div className="vertical-marquee-container" aria-hidden="true">
      {/* Left Marquee: Continuously scrolls downward in a true seamless infinite loop */}
      <div className="vertical-marquee left-marquee">
        <div className="vertical-marquee-track scroll-down">
          {renderGroup('l1')}
          {renderGroup('l2')}
          {renderGroup('l3')}
          {renderGroup('l4')}
        </div>
      </div>

      {/* Right Marquee: Continuously scrolls upward in a true seamless infinite loop */}
      <div className="vertical-marquee right-marquee">
        <div className="vertical-marquee-track scroll-up">
          {renderGroup('r1')}
          {renderGroup('r2')}
          {renderGroup('r3')}
          {renderGroup('r4')}
        </div>
      </div>
    </div>
  );
};
