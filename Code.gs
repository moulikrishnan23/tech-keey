/**
 * ============================================================================
 *  TechKeey — Problem & Solution Registration System
 *  Backend: Code.gs (Google Apps Script)
 *  Version: 1.4 (Real-time Sheet-backed Verification & Duplicate Management)
 * ============================================================================
 *
 *  SETUP:
 *  1. Replace SPREADSHEET_ID below with your actual Google Sheet ID.
 *  2. Deploy this project as a Web App (see project README / instructions).
 * ============================================================================
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'TechKeey_Submissions';

const HEADERS = [
  'SNo',
  'Timestamp',
  'Submission ID',
  'User Type',
  'Name',
  'Education Level',
  'Stream / Discipline',
  'Degree / Course',
  'Registration Number',
  'Email ID',
  'Mobile Number',
  'College Name',
  'Year of Study',
  'Location',
  'Challenges & Solutions',
  'Remarks'
];

const LIMITS = {
  name: 100,
  registrationNumber: 30,
  educationLevel: 100,
  stream: 100,
  course: 150,
  email: 150,
  mobile: 10,
  college: 150,
  location: 100,
  challenge: 100,
  solution: 1000,
  remarks: 500
};

const MAX_CHALLENGES = 10; // sanity ceiling

const VALID_USER_TYPES = ['Student', 'Faculty'];
const VALID_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const NAME_REGEX = /^[A-Za-z][A-Za-z.\s]*$/;
const EMAIL_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
const MOBILE_REGEX = /^[6-9][0-9]{9}$/;

// Registration Cutoff: 21 September 2026, 12:00:00 AM IST (Midnight / UTC+5:30)
const REGISTRATION_DEADLINE_ISO = '2026-09-21T00:00:00+05:30';
const REGISTRATION_DEADLINE_MS = new Date(REGISTRATION_DEADLINE_ISO).getTime();

/* ---------------------------------------------------------------------- */
/* Web app entry points                                                   */
/* ---------------------------------------------------------------------- */

function doGet(e) {
  if (e && e.parameter) {
    // 1. Health check ping
    if (e.parameter.action === 'ping') {
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Verify if a Submission ID exists in the active Google Sheet
    if (e.parameter.action === 'verifySubmission') {
      const subId = String(e.parameter.submissionId || '').trim();
      const isValid = verifySubmissionExists_(subId);
      return ContentService.createTextOutput(JSON.stringify({ valid: isValid, submissionId: subId }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Check registration status by email / mobile / regNo in the active Sheet
    if (e.parameter.action === 'checkStatus') {
      const email = String(e.parameter.email || '').trim().toLowerCase();
      const mobile = String(e.parameter.mobile || '').replace(/\D/g, '');
      const regNo = String(e.parameter.registrationNumber || e.parameter.regNo || '').trim().toLowerCase();

      const result = findRegistrationInSheet_(email, mobile, regNo);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Check if React app output file exists, otherwise serve index.html
  let htmlFile = 'react_app';
  try {
    return HtmlService.createHtmlOutputFromFile(htmlFile)
      .setTitle('TechKeey — Problem & Solution Registration')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('TechKeey — Problem & Solution Registration')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

function doPost(e) {
  try {
    let payload = null;
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter;
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const result = submitRegistration(payload);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error('doPost error: ' + (err && err.stack ? err.stack : err));
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'An unexpected server error occurred: ' + (err && err.message ? err.message : String(err))
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Public method for Apps Script HTML service (window.google.script.run)
 * to verify if a submission ID is active in the Google Sheet.
 */
function verifySubmission(submissionId) {
  return {
    valid: verifySubmissionExists_(submissionId),
    submissionId: submissionId
  };
}

/* ---------------------------------------------------------------------- */
/* Spreadsheet / sheet handling                                            */
/* ---------------------------------------------------------------------- */

function getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID' && SPREADSHEET_ID.trim() !== '') {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (err) {
      console.warn('Could not open spreadsheet with ID "' + SPREADSHEET_ID + '": ' + err);
    }
  }

  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (err) {
    console.warn('Could not access active spreadsheet: ' + err);
  }

  throw new Error('Google Spreadsheet not found. Please configure SPREADSHEET_ID in Code.gs or bind this script to a Google Sheet.');
}

function getOrCreateSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    ensureHeaders_(sheet);
  }

  return sheet;
}

function ensureHeaders_(sheet) {
  const numHeaders = HEADERS.length;
  sheet.getRange(1, 1, 1, numHeaders).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, numHeaders)
    .setFontWeight('bold')
    .setBackground('#14171a')
    .setFontColor('#7fd9b8');
  sheet.setFrozenRows(1);
  for (let c = 1; c <= numHeaders; c++) {
    sheet.autoResizeColumn(c);
  }

  // Format Column A (SNo) as plain number and Column B (Timestamp) as text
  sheet.getRange('A:A').setNumberFormat('0');
  sheet.getRange('B:B').setNumberFormat('@');
  sheet.getRange('K:K').setNumberFormat('@'); // Column K is Mobile Number
}

/**
 * Checks if a specific Submission ID exists in the active Google Sheet.
 * If the row was deleted from the Sheet, this returns false immediately.
 */
function verifySubmissionExists_(submissionId) {
  if (!submissionId) return false;
  try {
    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return false;

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return false;

    // Column 3 is Submission ID
    const data = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    const targetId = String(submissionId).trim().toLowerCase();

    for (let i = 0; i < data.length; i++) {
      const currentId = String(data[i][0] || '').trim().toLowerCase();
      if (currentId && currentId === targetId) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('verifySubmissionExists_ error: ' + err);
    return false;
  }
}

/**
 * Helper to look up an existing registration directly in TechKeey_Submissions.
 * If the user was deleted from the Sheet, this returns { registered: false }.
 */
function findRegistrationInSheet_(email, mobile, regNo) {
  try {
    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return { registered: false };

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { registered: false };

    // Col 3: Submission ID, Col 9: Registration Number, Col 10: Email ID, Col 11: Mobile Number
    // Range starts at row 2, col 3, with 9 columns (Col 3 to 11)
    const data = sheet.getRange(2, 3, lastRow - 1, 9).getValues();
    for (let i = data.length - 1; i >= 0; i--) {
      const rowSubId = String(data[i][0] || '').trim();
      const rowReg = String(data[i][6] || '').trim().toLowerCase();
      const rowEm = String(data[i][7] || '').trim().toLowerCase();
      const rowMob = String(data[i][8] || '').replace(/\D/g, '');

      if ((email && rowEm && rowEm === email) ||
          (mobile && rowMob && rowMob === mobile) ||
          (regNo && rowReg && rowReg === regNo)) {
        return {
          registered: true,
          status: 'success',
          submissionId: rowSubId
        };
      }
    }
    return { registered: false };
  } catch (err) {
    console.error('findRegistrationInSheet_ error: ' + err);
    return { registered: false, error: String(err) };
  }
}

/* ---------------------------------------------------------------------- */
/* Public entry point called from frontend (google.script.run or doPost)  */
/* ---------------------------------------------------------------------- */

function submitRegistration(payload) {
  try {
    // Cutoff check: 21 September 2026, 12:00:00 AM IST
    if (new Date().getTime() >= REGISTRATION_DEADLINE_MS) {
      return {
        status: 'error',
        isClosed: true,
        message: 'Registration for TechKeey is now closed (Deadline: 21 September 2026, 12:00 AM IST). Submissions are no longer accepted.'
      };
    }

    const validation = validatePayload_(payload);

    if (!validation.valid) {
      return {
        status: 'error',
        message: validation.message
      };
    }

    const clean = validation.data;

    // OPTIMIZATION: Acquire lock to prevent concurrency collisions
    const lock = LockService.getScriptLock();
    const gotLock = lock.tryLock(8000); 

    if (!gotLock) {
      return {
        status: 'error',
        message: 'High traffic! You are in a queue. Please click Submit again in 5 seconds.'
      };
    }

    let submissionId;
    try {
      const sheet = getOrCreateSheet_();

      // Check for duplicate registration directly in active Google Sheet
      const duplicateCheck = checkDuplicateRegistration_(
        sheet,
        clean.userType,
        clean.email,
        clean.registrationNumber,
        clean.mobile
      );

      if (duplicateCheck.isDuplicate) {
        return {
          status: 'error',
          isDuplicate: true,
          submissionId: duplicateCheck.submissionId || '',
          message: duplicateCheck.message
        };
      }

      const timeZone = getTimeZone_();
      const now = new Date();
      submissionId = generateSubmissionId_(timeZone, now);
      const timestampStr = Utilities.formatDate(now, timeZone, 'yyyy-MM-dd HH:mm:ss');
      const challengesText = formatChallenges_(clean.challenges);
      const sNo = Math.max(1, sheet.getLastRow()); // Row 1 is header, Row 2 is SNo 1

      // Append new registration to active Google Sheet
      sheet.appendRow([
        sNo,
        timestampStr,
        submissionId,
        clean.userType,
        clean.name,
        clean.educationLevel,
        clean.stream,
        clean.course,
        clean.registrationNumber,
        clean.email,
        clean.mobile,
        clean.college,
        clean.yearOfStudy,
        clean.location,
        challengesText,
        clean.remarks
      ]);

      const newRow = sheet.getLastRow();
      sheet.getRange(newRow, 1, 1, 2).setNumberFormats([['0', '@']]);
      sheet.getRange(newRow, 11, 1, 1).setNumberFormat('@');
      
    } finally {
      lock.releaseLock();
    }

    return {
      status: 'success',
      submissionId: submissionId
    };

  } catch (err) {
    console.error('submitRegistration error: ' + (err && err.stack ? err.stack : err));
    return {
      status: 'error',
      message: 'An unexpected error occurred while processing your submission: ' + (err && err.message ? err.message : 'Please try again.')
    };
  }
}

/**
 * Checks active sheet data (TechKeey_Submissions) for duplicate registrations.
 * Validates Email ID (all), Mobile Number (all), and Registration Number (students).
 * If a row was deleted from the Sheet, it will not be matched, allowing re-registration.
 */
function checkDuplicateRegistration_(sheet, userType, email, registrationNumber, mobile) {
  const normEmail = String(email || '').trim().toLowerCase();
  const normRegNo = String(registrationNumber || '').trim().toLowerCase();
  const normMobile = String(mobile || '').replace(/\D/g, ''); // Extract digits
  const isStudent = userType === 'Student';
  
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    // Col 3: Submission ID, Col 9: Registration Number, Col 10: Email ID, Col 11: Mobile Number
    // Range starts at row 2, col 3, with 9 columns (Col 3 to 11)
    const data = sheet.getRange(2, 3, lastRow - 1, 9).getValues();
    for (let i = data.length - 1; i >= 0; i--) {
      const subId = String(data[i][0] || '').trim();
      const reg = String(data[i][6] || '').trim().toLowerCase();
      const em = String(data[i][7] || '').trim().toLowerCase();
      const mob = String(data[i][8] || '').replace(/\D/g, '');

      // 1. Check Email duplicate
      if (normEmail && em && em === normEmail) {
        return {
          isDuplicate: true,
          submissionId: subId,
          message: 'You have already registered for this hackathon using this Email ID. Duplicate registration is not allowed.'
        };
      }

      // 2. Check Mobile duplicate
      if (normMobile && mob && mob === normMobile) {
        return {
          isDuplicate: true,
          submissionId: subId,
          message: 'You have already registered for this hackathon using this Mobile Number. Duplicate registration is not allowed.'
        };
      }

      // 3. Check Registration Number duplicate (students only)
      if (isStudent && normRegNo && reg && reg === normRegNo) {
        return {
          isDuplicate: true,
          submissionId: subId,
          message: 'You have already registered for this hackathon using this Registration Number. Duplicate registration is not allowed.'
        };
      }
    }
  }

  return { 
    isDuplicate: false
  };
}

/* ---------------------------------------------------------------------- */
/* Timezone and Submission ID generation (concurrency-safe, resets daily) */
/* ---------------------------------------------------------------------- */

function getTimeZone_() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) {
      const tz = active.getSpreadsheetTimeZone();
      if (tz && tz !== 'Etc/GMT' && tz !== 'Etc/UTC') return tz;
    }
  } catch (e) {}
  try {
    const tz = Session.getScriptTimeZone();
    if (tz && tz !== 'Etc/GMT' && tz !== 'Etc/UTC') return tz;
  } catch (e) {}
  return 'Asia/Kolkata'; // Event timezone (IST) default
}

function generateSubmissionId_(timeZone, now) {
  const tz = timeZone || getTimeZone_();
  const dateObj = now || new Date();
  const today = Utilities.formatDate(dateObj, tz, 'yyyyMMdd');
  const key = 'TK_COUNTER_' + today;

  let counter = 1;
  try {
    const props = PropertiesService.getScriptProperties();
    if (props) {
      const current = parseInt(props.getProperty(key), 10);
      counter = isNaN(current) ? 1 : current + 1;
      props.setProperty(key, String(counter));
    }
  } catch (err) {
    console.warn('Script properties counter warning: ' + err);
    counter = Math.floor(Math.random() * 9000) + 1000;
  }

  const padded = ('0000' + counter).slice(-4);
  return 'TK-' + today + '-' + padded;
}

/* ---------------------------------------------------------------------- */
/* Challenge/Solution formatting — preserves 1:1 pairing in one cell       */
/* ---------------------------------------------------------------------- */

function formatChallenges_(challenges) {
  return challenges.map(function (pair) {
    return 'Challenge:\n' + pair.challenge + '\n\n' +
           'Suggested Solution:\n' + pair.solution;
  }).join('\n\n');
}

/* ---------------------------------------------------------------------- */
/* Validation (mirrors frontend rules — never trust the client)            */
/* ---------------------------------------------------------------------- */

function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, message: 'Invalid submission data.' };
  }

  const rawUserType = String(payload.userType || '').trim();
  if (VALID_USER_TYPES.indexOf(rawUserType) === -1) {
    return { valid: false, message: 'Please select a valid user type (Student or Faculty).' };
  }
  const isStudent = rawUserType === 'Student';

  const rawName = String(payload.name || '').trim();
  if (!rawName || rawName.length > LIMITS.name || !NAME_REGEX.test(rawName) || rawName.indexOf('..') !== -1) {
    return { valid: false, message: 'Please enter a valid name (letters only, max ' + LIMITS.name + ' characters).' };
  }

  let rawRegNo = String(payload.registrationNumber || '').trim();
  let rawEducationLevel = String(payload.educationLevel || '').trim();
  let rawStream = String(payload.stream || '').trim();
  let rawCourse = String(payload.course || '').trim();
  let rawYear = String(payload.yearOfStudy || '').trim();

  if (isStudent) {
    if (!rawRegNo) {
      return { valid: false, message: 'Registration number is required for students.' };
    }
    if (rawRegNo.length > LIMITS.registrationNumber) {
      return { valid: false, message: 'Registration number cannot exceed ' + LIMITS.registrationNumber + ' characters.' };
    }
    if (VALID_YEARS.indexOf(rawYear) === -1) {
      return { valid: false, message: 'Please select a valid year of study.' };
    }
  } else {
    // Faculty must NOT submit these — force blank regardless of client input.
    rawRegNo = '';
    rawEducationLevel = '';
    rawStream = '';
    rawCourse = '';
    rawYear = '';
  }

  const rawEmail = String(payload.email || '').trim();
  if (!rawEmail || rawEmail.length > LIMITS.email || !isValidEmail_(rawEmail)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }

  const rawMobile = String(payload.mobile || '').trim();
  if (!MOBILE_REGEX.test(rawMobile)) {
    return { valid: false, message: 'Please enter a valid 10-digit mobile number.' };
  }

  const rawCollege = String(payload.college || '').trim();
  if (!rawCollege || rawCollege.length > LIMITS.college) {
    return { valid: false, message: 'Please enter a valid college name (max ' + LIMITS.college + ' characters).' };
  }

  const rawLocation = String(payload.location || '').trim();
  if (!rawLocation || rawLocation.length > LIMITS.location) {
    return { valid: false, message: 'Please enter a valid location (max ' + LIMITS.location + ' characters).' };
  }

  if (!Array.isArray(payload.challenges) || payload.challenges.length === 0) {
    return { valid: false, message: 'Please provide at least one challenge statement / problem identified.' };
  }
  if (payload.challenges.length > MAX_CHALLENGES) {
    return { valid: false, message: 'Too many challenges submitted at once (maximum ' + MAX_CHALLENGES + ').' };
  }

  const cleanChallenges = [];
  for (let i = 0; i < payload.challenges.length; i++) {
    const pair = payload.challenges[i] || {};
    const challenge = String(pair.challenge || '').trim();
    let solution = String(pair.solution || '').trim();

    if (!challenge || challenge.length > LIMITS.challenge) {
      return { valid: false, message: 'Challenge Statement / Problem Identified is required and cannot exceed ' + LIMITS.challenge + ' characters.' };
    }
    if (!solution) {
      return { valid: false, message: 'Proposed Solution & Approach is required.' };
    }
    if (solution.length > LIMITS.solution) {
      return { valid: false, message: 'Proposed Solution cannot exceed ' + LIMITS.solution + ' characters.' };
    }
    cleanChallenges.push({
      challenge: sanitizeForSheet_(challenge),
      solution: sanitizeForSheet_(solution)
    });
  }

  const rawRemarks = String(payload.remarks || '').trim();
  if (rawRemarks.length > LIMITS.remarks) {
    return { valid: false, message: 'Remarks cannot exceed ' + LIMITS.remarks + ' characters.' };
  }

  return {
    valid: true,
    data: {
      userType: sanitizeForSheet_(rawUserType),
      name: sanitizeForSheet_(rawName),
      registrationNumber: sanitizeForSheet_(rawRegNo),
      educationLevel: sanitizeForSheet_(rawEducationLevel),
      stream: sanitizeForSheet_(rawStream),
      course: sanitizeForSheet_(rawCourse),
      email: sanitizeForSheet_(rawEmail),
      mobile: sanitizeForSheet_(rawMobile),
      college: sanitizeForSheet_(rawCollege),
      yearOfStudy: sanitizeForSheet_(rawYear),
      location: sanitizeForSheet_(rawLocation),
      challenges: cleanChallenges,
      remarks: sanitizeForSheet_(rawRemarks)
    }
  };
}

function isValidEmail_(email) {
  if (email.indexOf(' ') !== -1) return false;
  if ((email.match(/@/g) || []).length !== 1) return false;
  if (email.charAt(0) === '.' || email.charAt(email.length - 1) === '.') return false;
  if (email.indexOf('..') !== -1) return false;
  return EMAIL_REGEX.test(email);
}

/**
 * Trims whitespace and neutralizes leading characters that Google Sheets
 * would otherwise interpret as the start of a formula (formula injection).
 */
function sanitizeForSheet_(value) {
  if (value === null || value === undefined) return '';
  let text = String(value).trim();

  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  return text;
}

/**
 * Utility function to set spreadsheet timezone to Asia/Kolkata (IST)
 * and synchronize timestamp formatting.
 */
function fixSpreadsheetTimezoneAndTimestamps() {
  const ss = getSpreadsheet_();
  ss.setSpreadsheetTimeZone('Asia/Kolkata');
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      const range = sheet.getRange(2, 2, lastRow - 1, 2); // Column B (Timestamp) and Column C (Submission ID)
      const values = range.getValues();

      for (let i = 0; i < values.length; i++) {
        const ts = values[i][0];
        const subId = String(values[i][1] || '');

        // Extract date from Submission ID e.g. TK-20260914-0001 -> 2026-09-14
        const match = subId.match(/TK-(\d{4})(\d{2})(\d{2})-/);
        if (match && ts instanceof Date) {
          const targetDatePrefix = `${match[1]}-${match[2]}-${match[3]}`;
          const timePart = Utilities.formatDate(ts, 'Asia/Kolkata', 'HH:mm:ss');
          values[i][0] = `${targetDatePrefix} ${timePart}`;
        } else if (ts instanceof Date) {
          values[i][0] = Utilities.formatDate(ts, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
        }
      }

      sheet.getRange(2, 2, lastRow - 1, 1).setNumberFormat('@').setValues(values.map(function(r) { return [r[0]]; }));
      sheet.getRange(2, 11, lastRow - 1, 1).setNumberFormat('@'); // Mobile as text
    }
  }

  console.log('Successfully updated timestamps and synchronized timezone to Asia/Kolkata!');
}

