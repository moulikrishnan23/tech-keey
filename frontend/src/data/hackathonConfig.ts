/**
 * ============================================================================
 *  TechKeey & LeSuccess — Hackathon Configuration & Central Data
 * ============================================================================
 */

export interface HackathonTimeline {
  startDate: string;
  lastDateForSubmission: string;
  finaleAnnouncementDate: string;
  grandFinaleDate: string;
}

export interface MarqueeItem {
  type?: 'text' | 'logo';
  logo?: 'lesuccess' | 'techkeey';
  text?: string;
  color?: string;
}

export interface JourneyStep {
  icon: string;
  title: string;
  desc: string;
}

export interface HackathonConfig {
  eventName: string;
  introParagraph: string;
  collaboration: {
    partnerOne: {
      name: string;
      logoUrl?: string;
    };
    partnerTwo: {
      name: string;
      logoUrl?: string;
    };
    dividerText: string;
  };
  journey: {
    ribbonTitle: string;
    aboutTitle: string;
    aboutText: string;
    steps: JourneyStep[];
  };
  timeline: HackathonTimeline;
  prizes: string[];
  teamGuidelines: {
    individualSubmission: string;
    teamFormation: string;
    maxTeamSize: number;
  };
  social: {
    instagramUrl: string;
    instagramHandle: string;
    notificationMessage: string;
  };
  marquee: MarqueeItem[];
}

export const HACKATHON_CONFIG: HackathonConfig = {
  eventName: 'Idea2Success',
  introParagraph:
    'An initiative to identify challenges faced in technical and professional education, build innovative solutions, and transform impactful ideas into functional prototypes.',
  collaboration: {
    partnerOne: {
      name: 'LeSuccess',
      logoUrl: '/LeSuccess.png',
    },
    partnerTwo: {
      name: 'TechKeey',
      logoUrl: '/TechKeey.png',
    },
    dividerText: '×',
  },
  journey: {
    ribbonTitle: 'JOURNEY FROM IDEAS TO IMPACT',
    aboutTitle: 'About Idea2Success',
    aboutText:
      'An Innovation Challenge for faculty and students to ideate, design and prototype solutions that address real-world EduTech problems.',
    steps: [
      {
        icon: '🎯',
        title: 'Find Problems',
        desc: 'Real World Edutech Problems',
      },
      {
        icon: '💡',
        title: 'Build Solutions',
        desc: 'Innovative / Expected Solutions',
      },
      {
        icon: '🏆',
        title: 'Top 25 Teams',
        desc: 'Based on Performance for Finalists',
      },
      {
        icon: '💼',
        title: 'Internship / PPO offer',
        desc: 'For best solutions',
      },
    ],
  },
  timeline: {
    startDate: '14th Sept 2026',
    lastDateForSubmission: '20th Sept 2026',
    finaleAnnouncementDate: '25th Sept at LeSuccess',
    grandFinaleDate: '5th Oct – 10th Oct',
  },
  prizes: [
    'Cash prizes for winners',
    'Goodies will be provided',
    'Surprise Gifts',
    'Internship / Pre-Placement Offer',
  ],
  teamGuidelines: {
    individualSubmission:
      'Individual students / faculty can submit challenges or ideas and turn them into innovative prototypes that break boundaries and shape the future.',
    teamFormation:
      'Shortlisted candidates / finalists can form a team of up to 4 members ( Solo participants are welcome )',
    maxTeamSize: 4,
  },
  social: {
    instagramUrl: 'https://www.instagram.com/lesuccess_official?stkn=cDR6YWRqdzU1aTVo',
    instagramHandle: 'LeSuccess Official Instagram',
    notificationMessage:
      'Notifications / announcements will be posted on our Instagram page. Kindly follow our Instagram page for updates.',
  },
  marquee: [
    { type: 'logo', logo: 'lesuccess' },
    { type: 'text', text: '×', color: '#1d2c2d' },
    { type: 'logo', logo: 'techkeey' },
    { type: 'text', text: '•', color: '#1d2c2d' },
    { type: 'text', text: 'HACKATHON', color: '#1d2c2d' },
    { type: 'text', text: '•', color: '#1d2c2d' },
    { type: 'text', text: 'PROTOTYPE', color: '#1d2c2d' },
    { type: 'text', text: '•', color: '#1d2c2d' },
    { type: 'text', text: 'INNOVATION', color: '#1d2c2d' },
    { type: 'text', text: '•', color: '#1d2c2d' },
  ],
};
