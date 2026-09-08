/**
 * ============================================================================
 *  TechKeey — Problem & Solution Registration System
 *  Backend: Code.gs (Google Apps Script)
 *  Version: 1.0 (single-page, multiple challenge/solution pairs)
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
  'Timestamp',
  'Submission ID',
  'User Type',
  'Name',
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
  email: 150,
  mobile: 10,
  college: 150,
  location: 100,
  challenge: 100,
  solution: 1000,
  remarks: 500
};

const MAX_CHALLENGES = 10; // sanity ceiling — UI supports 5+ comfortably

const VALID_USER_TYPES = ['Student', 'Faculty'];
const VALID_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const NAME_REGEX = /^[A-Za-z][A-Za-z.\s]*$/;
const EMAIL_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
const MOBILE_REGEX = /^[6-9][0-9]{9}$/;

/* ---------------------------------------------------------------------- */
/* Web app entry points                                                   */
/* ---------------------------------------------------------------------- */

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
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
  }

  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const headersMatch = HEADERS.every(function (h, i) { return existing[i] === h; });

  if (!headersMatch) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#14171a')
      .setFontColor('#7fd9b8');
    sheet.setFrozenRows(1);
    for (let c = 1; c <= HEADERS.length; c++) {
      sheet.autoResizeColumn(c);
    }
  }
}

/* ---------------------------------------------------------------------- */
/* Public entry point called from frontend (google.script.run or doPost)  */
/* ---------------------------------------------------------------------- */

function submitRegistration(payload) {
  try {
    const validation = validatePayload_(payload);

    if (!validation.valid) {
      return {
        status: 'error',
        message: validation.message
      };
    }

    const clean = validation.data;

    const lock = LockService.getScriptLock();
    const gotLock = lock.tryLock(15000);

    if (!gotLock) {
      return {
        status: 'error',
        message: 'The system is busy processing another submission. Please try again in a moment.'
      };
    }

    let submissionId;
    try {
      const sheet = getOrCreateSheet_();
      submissionId = generateSubmissionId_();
      const timestamp = new Date();
      const challengesText = formatChallenges_(clean.challenges);

      sheet.appendRow([
        timestamp,
        submissionId,
        clean.userType,
        clean.name,
        clean.registrationNumber,
        clean.email,
        clean.mobile,
        clean.college,
        clean.yearOfStudy,
        clean.location,
        challengesText,
        clean.remarks
      ]);
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

/* ---------------------------------------------------------------------- */
/* Submission ID generation (concurrency-safe, resets daily)               */
/* ---------------------------------------------------------------------- */

function generateSubmissionId_() {
  let timeZone = 'Etc/UTC';
  try {
    timeZone = Session.getScriptTimeZone() || 'Etc/UTC';
  } catch (e) {}

  const today = Utilities.formatDate(new Date(), timeZone, 'yyyyMMdd');
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
  return challenges.map(function (pair, idx) {
    const n = idx + 1;
    return 'Challenge ' + n + ': ' + pair.challenge + '\n' +
           'Suggested Solution ' + n + ': ' + pair.solution;
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
    return { valid: false, message: 'Please provide at least one challenge and suggested solution.' };
  }
  if (payload.challenges.length > MAX_CHALLENGES) {
    return { valid: false, message: 'Too many challenges submitted at once (maximum ' + MAX_CHALLENGES + ').' };
  }

  const cleanChallenges = [];
  for (let i = 0; i < payload.challenges.length; i++) {
    const pair = payload.challenges[i] || {};
    const challenge = String(pair.challenge || '').trim();
    const solution = String(pair.solution || '').trim();

    if (!challenge || challenge.length > LIMITS.challenge) {
      return { valid: false, message: 'Challenge ' + (i + 1) + ' is required and cannot exceed ' + LIMITS.challenge + ' characters.' };
    }
    if (!solution || solution.length > LIMITS.solution) {
      return { valid: false, message: 'Suggested Solution ' + (i + 1) + ' is required and cannot exceed ' + LIMITS.solution + ' characters.' };
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
