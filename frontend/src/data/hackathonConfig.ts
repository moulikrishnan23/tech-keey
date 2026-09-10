/**
 * ============================================================================
 *  TechKeey & LeSuccess — Hackathon Configuration & Central Data
 * ============================================================================
 *  Update all event dates, social links, prizes, and copy here.
 *  Changes made here will instantly reflect across the entire application.
 * ============================================================================
 */

export interface HackathonTimeline {
  startDate: string;
  finaleAnnouncementDate: string;
  grandFinaleDate: string;
  teamFormationDeadline: string;
}

export interface MarqueeItem {
  text: string;
  color: string;
}

export interface HackathonConfig {
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
  introParagraph: string;
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
  collaboration: {
    partnerOne: {
      name: 'LeSuccess',
      logoUrl: '',
    },
    partnerTwo: {
      name: 'Techkeey',
      logoUrl: '',
    },
    dividerText: '×',
  },
  introParagraph:
    'Welcome to the joint innovation hackathon initiative by LeSuccess and Techkeey. This platform empowers students and faculty members to highlight real campus bottlenecks and turn them into functional prototypes with industry mentorship.',
  timeline: {
    startDate: 'To be announced',
    finaleAnnouncementDate: 'To be announced',
    grandFinaleDate: 'To be announced (at LeSuccess)',
    teamFormationDeadline: 'To be announced',
  },
  prizes: [
    'Cash prizes for winners',
    'Goodies',
    'Surprise gifts',
    'Internship / Pre-Placement Offer',
  ],
  teamGuidelines: {
    individualSubmission:
      'Individual students/faculty can submit a challenge that needs to be converted into a prototype',
    teamFormation:
      'Shortlisted candidates can form a team of up to 4 members',
    maxTeamSize: 4,
  },
  social: {
    instagramUrl: 'https://www.instagram.com/',
    instagramHandle: 'Instagram Page',
    notificationMessage:
      'Notifications / announcements will be posted on our Instagram page. Kindly follow our Instagram page for updates.',
  },
  marquee: [
    { text: 'LESUCCESS', color: '#1d2c2d' },
    { text: '×', color: '#1d2c2d' },
    { text: 'TECHKEEY', color: '#1d2c2d' },
    { text: '•', color: '#1d2c2d' },
    { text: 'HACKATHON', color: '#1d2c2d' },
    { text: '•', color: '#1d2c2d' },
    { text: 'PROTOTYPE', color: '#1d2c2d' },
    { text: '•', color: '#1d2c2d' },
    { text: 'INNOVATION', color: '#1d2c2d' },
    { text: '•', color: '#1d2c2d' },
  ],
};
