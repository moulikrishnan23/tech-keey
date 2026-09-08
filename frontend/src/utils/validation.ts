import { RegistrationFormData, ValidationErrors } from '../types';

export const NAME_REGEX = /^[A-Za-z][A-Za-z.\s]*$/;
export const EMAIL_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
export const MOBILE_REGEX = /^[6-9][0-9]{9}$/;

export const LIMITS = {
  name: 100,
  registrationNumber: 30,
  email: 150,
  mobile: 10,
  college: 150,
  location: 100,
  challenge: 100,
  solution: 1000,
  remarks: 500
};

export function isValidName(v: string): boolean {
  const t = v.trim();
  if (!t || t.length > LIMITS.name) return false;
  if (t.indexOf('..') !== -1) return false;
  return NAME_REGEX.test(t);
}

export function isValidEmail(v: string): boolean {
  const t = v.trim();
  if (!t || t.length > LIMITS.email) return false;
  if (t.indexOf(' ') !== -1) return false;
  if ((t.match(/@/g) || []).length !== 1) return false;
  if (t.charAt(0) === '.' || t.charAt(t.length - 1) === '.') return false;
  if (t.indexOf('..') !== -1) return false;
  return EMAIL_REGEX.test(t);
}

export function isValidMobile(v: string): boolean {
  return MOBILE_REGEX.test(v.trim());
}

export function validateForm(data: RegistrationFormData): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};
  let isValid = true;
  const isStudent = data.userType === 'Student';

  // Name validation
  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = 'Please enter your name.';
    isValid = false;
  } else if (!isValidName(trimmedName)) {
    errors.name = `Please enter a valid name (letters only, max ${LIMITS.name} characters).`;
    isValid = false;
  }

  // Registration Number (Student only)
  if (isStudent) {
    const trimmedRegNo = data.registrationNumber.trim();
    if (!trimmedRegNo) {
      errors.registrationNumber = 'Please enter your registration number.';
      isValid = false;
    } else if (trimmedRegNo.length > LIMITS.registrationNumber) {
      errors.registrationNumber = `Registration number cannot exceed ${LIMITS.registrationNumber} characters.`;
      isValid = false;
    }
  }

  // Email validation
  const trimmedEmail = data.email.trim();
  if (!trimmedEmail) {
    errors.email = 'Please enter your email address.';
    isValid = false;
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
    isValid = false;
  }

  // Mobile validation
  const trimmedMobile = data.mobile.trim();
  if (!trimmedMobile) {
    errors.mobile = 'Please enter your mobile number.';
    isValid = false;
  } else if (!isValidMobile(trimmedMobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number.';
    isValid = false;
  }

  // College validation
  const trimmedCollege = data.college.trim();
  if (!trimmedCollege) {
    errors.college = 'Please enter your college name.';
    isValid = false;
  } else if (trimmedCollege.length > LIMITS.college) {
    errors.college = `College name cannot exceed ${LIMITS.college} characters.`;
    isValid = false;
  }

  // Year of Study (Student only)
  if (isStudent && !data.yearOfStudy) {
    errors.yearOfStudy = 'Please select your year of study.';
    isValid = false;
  }

  // Location validation
  const trimmedLocation = data.location.trim();
  if (!trimmedLocation) {
    errors.location = 'Please enter your location.';
    isValid = false;
  } else if (trimmedLocation.length > LIMITS.location) {
    errors.location = `Location cannot exceed ${LIMITS.location} characters.`;
    isValid = false;
  }

  // Challenges validation
  const challengeErrors: Record<string, { challenge?: string; solution?: string }> = {};
  if (!data.challenges || data.challenges.length === 0) {
    errors.general = 'Please provide at least one challenge and suggested solution.';
    isValid = false;
  } else {
    data.challenges.forEach((item) => {
      const itemErr: { challenge?: string; solution?: string } = {};
      const cVal = item.challenge.trim();
      const sVal = item.solution.trim();

      if (!cVal) {
        itemErr.challenge = 'Please describe the challenge.';
        isValid = false;
      } else if (cVal.length > LIMITS.challenge) {
        itemErr.challenge = `Challenge cannot exceed ${LIMITS.challenge} characters.`;
        isValid = false;
      }

      if (!sVal) {
        itemErr.solution = 'Please suggest a solution.';
        isValid = false;
      } else if (sVal.length > LIMITS.solution) {
        itemErr.solution = `Suggested Solution cannot exceed ${LIMITS.solution} characters.`;
        isValid = false;
      }

      if (itemErr.challenge || itemErr.solution) {
        challengeErrors[item.id] = itemErr;
      }
    });

    if (Object.keys(challengeErrors).length > 0) {
      errors.challenges = challengeErrors;
    }
  }

  // Remarks validation
  if (data.remarks.trim().length > LIMITS.remarks) {
    errors.remarks = `Remarks cannot exceed ${LIMITS.remarks} characters.`;
    isValid = false;
  }

  return { isValid, errors };
}
