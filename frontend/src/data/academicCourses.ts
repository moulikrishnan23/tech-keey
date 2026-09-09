export type EducationLevelOption = 'UG' | 'PG' | 'Diploma' | 'Others';

export const EDUCATION_LEVELS: EducationLevelOption[] = ['UG', 'PG', 'Diploma', 'Others'];

export const STREAMS = [
  'Engineering',
  'Arts & Science',
  'Computer Applications',
  'Management',
  'Commerce',
  'Polytechnic / Diploma',
  'Other / Not Listed'
] as const;

export type StreamOption = typeof STREAMS[number];

export interface CourseData {
  name: string;
  stream: StreamOption;
  levels?: EducationLevelOption[];
}

export const ENGINEERING_COURSES: string[] = [
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical and Electronics Engineering (EEE)',
  'Electronics and Communication Engineering (ECE)',
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Automobile Engineering',
  'Mechatronics Engineering',
  'Biomedical Engineering',
  'Biotechnology Engineering',
  'Industrial Engineering',
  'Production Engineering',
  'Environmental Engineering',
  'Food Technology',
  'Agricultural Engineering',
  'Marine Engineering',
  'Mining Engineering',
  'Metallurgical and Materials Engineering',
  'Textile Technology',
  'Petroleum Engineering',
  'Instrumentation and Control Engineering',
  'Robotics and Automation Engineering',
  'Artificial Intelligence and Data Science (AI & DS)',
  'Artificial Intelligence and Machine Learning (AI & ML)',
  'Internet of Things (IoT)',
  'Computer Science and Business Systems (CSBS)',
  'Cyber Security / Cybersecurity'
];

export const ARTS_AND_SCIENCE_COURSES: string[] = [
  'Computer Science',
  'Information Technology',
  'Computer Applications (BCA)',
  'Computer Science with Data Science',
  'Computer Science with Artificial Intelligence',
  'Computer Science with Cyber Security',
  'Artificial Intelligence & Machine Learning',
  'Data Science',
  'Information Systems / Information Systems Management',
  'Mathematics',
  'Statistics',
  'Physics',
  'Chemistry',
  'Biotechnology',
  'Microbiology',
  'Biochemistry',
  'Zoology',
  'Botany',
  'Bioinformatics',
  'Electronics',
  'Electronics & Communication',
  'Commerce',
  'Commerce with Computer Applications',
  'Commerce with Corporate Secretaryship',
  'Commerce with Banking & Insurance',
  'Commerce with Accounting & Finance',
  'Business Administration (BBA)',
  'Business Administration with Computer Applications',
  'Business Management',
  'Economics',
  'English',
  'Tamil',
  'Hindi',
  'Malayalam',
  'Psychology',
  'Social Work',
  'Sociology',
  'Visual Communication',
  'Journalism & Mass Communication',
  'Animation & Multimedia',
  'Fashion Design / Fashion Technology',
  'Hotel Management & Catering Science',
  'Tourism & Travel Management',
  'Physical Education',
  'Geography',
  'History',
  'Political Science',
  'Corporate Economics',
  'International Business',
  'Logistics & Supply Chain Management'
];

export const COMPUTER_APPLICATIONS_COURSES: string[] = [
  'Computer Applications (BCA)',
  'Master of Computer Applications (MCA)',
  'B.Sc Computer Science',
  'M.Sc Computer Science',
  'B.Sc Information Technology',
  'M.Sc Information Technology',
  'B.Sc Data Science',
  'M.Sc Data Science',
  'B.Sc Artificial Intelligence & Machine Learning',
  'M.Sc Artificial Intelligence & Machine Learning',
  'B.Sc Cyber Security',
  'M.Sc Cyber Security',
  'B.Sc Computer Technology',
  'B.Sc Software Systems'
];

export const MANAGEMENT_COURSES: string[] = [
  'Bachelor of Business Administration (BBA)',
  'Master of Business Administration (MBA)',
  'BBA with Computer Applications',
  'BBA in Aviation Management',
  'BBA in Hospital / Healthcare Management',
  'BBA in International Business',
  'BBA in Logistics & Supply Chain Management',
  'MBA in Finance',
  'MBA in Marketing',
  'MBA in Human Resource Management (HR)',
  'MBA in Operations & Supply Chain Management',
  'MBA in Business Analytics',
  'MBA in Systems / IT Management'
];

export const COMMERCE_COURSES: string[] = [
  'Bachelor of Commerce (B.Com)',
  'Master of Commerce (M.Com)',
  'B.Com with Computer Applications',
  'B.Com with Accounting & Finance',
  'B.Com with Corporate Secretaryship',
  'B.Com with Banking & Insurance',
  'B.Com with Professional Accounting',
  'B.Com with Information Technology',
  'B.Com with Business Analytics',
  'B.Com with Honours',
  'M.Com with Computer Applications',
  'M.Com with Corporate Secretaryship'
];

export const POLYTECHNIC_DIPLOMA_COURSES: string[] = [
  'Diploma in Computer Engineering',
  'Diploma in Information Technology',
  'Diploma in Mechanical Engineering',
  'Diploma in Civil Engineering',
  'Diploma in Electrical and Electronics Engineering (EEE)',
  'Diploma in Electronics and Communication Engineering (ECE)',
  'Diploma in Automobile Engineering',
  'Diploma in Mechatronics Engineering',
  'Diploma in Chemical Engineering',
  'Diploma in Agricultural Engineering',
  'Diploma in Artificial Intelligence & Machine Learning',
  'Diploma in Robotics & Automation'
];

export function getCoursesByStream(stream: StreamOption | string, level?: EducationLevelOption | string): string[] {
  let courses: string[] = [];

  switch (stream) {
    case 'Engineering':
      courses = [...ENGINEERING_COURSES];
      break;
    case 'Arts & Science':
      courses = [...ARTS_AND_SCIENCE_COURSES];
      break;
    case 'Computer Applications':
      courses = [...COMPUTER_APPLICATIONS_COURSES];
      break;
    case 'Management':
      courses = [...MANAGEMENT_COURSES];
      break;
    case 'Commerce':
      courses = [...COMMERCE_COURSES];
      break;
    case 'Polytechnic / Diploma':
      courses = [...POLYTECHNIC_DIPLOMA_COURSES];
      break;
    case 'Other / Not Listed':
      return ['Other / Not Listed'];
    default:
      // If no specific stream, return merged list
      if (level === 'Diploma') {
        courses = [...POLYTECHNIC_DIPLOMA_COURSES];
      } else {
        courses = [
          ...ENGINEERING_COURSES,
          ...ARTS_AND_SCIENCE_COURSES,
          ...COMPUTER_APPLICATIONS_COURSES,
          ...MANAGEMENT_COURSES,
          ...COMMERCE_COURSES
        ];
      }
      break;
  }

  // Deduplicate and append 'Other / Not Listed'
  const uniqueCourses = Array.from(new Set(courses));
  uniqueCourses.push('Other / Not Listed');
  return uniqueCourses;
}
