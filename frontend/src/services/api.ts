import { BackendResponse, RegistrationFormData, SubmissionPayload } from '../types';

declare global {
  interface Window {
    google?: {
      script?: {
        run: {
          withSuccessHandler: (onSuccess: (res: BackendResponse) => void) => {
            withFailureHandler: (onFailure: (err: Error | unknown) => void) => {
              submitRegistration: (payload: SubmissionPayload) => void;
            };
          };
        };
      };
    };
    __TECHKEY_WEBAPP_URL__?: string;
  }
}

export function formatPayload(data: RegistrationFormData): SubmissionPayload {
  const isStudent = data.userType === 'Student';

  let educationLevel = '';
  let stream = '';
  let course = '';

  if (isStudent) {
    educationLevel =
      data.educationLevel === 'Others'
        ? `Others - ${data.educationLevelOther.trim()}`
        : data.educationLevel;

    stream = data.stream || '';

    if (data.course === 'Other / Not Listed' || data.stream === 'Other / Not Listed') {
      course = data.courseOther ? `Other - ${data.courseOther.trim()}` : data.course || '';
    } else {
      course = data.course || '';
    }
  }

  return {
    userType: data.userType,
    name: data.name.trim(),
    registrationNumber: isStudent ? data.registrationNumber.trim() : '',
    educationLevel: educationLevel,
    stream: stream,
    course: course,
    email: data.email.trim(),
    mobile: data.mobile.trim(),
    college: data.college.trim(),
    yearOfStudy: isStudent ? data.yearOfStudy : '',
    location: data.location.trim(),
    challenges: data.challenges.map((c) => ({
      challenge: c.challenge.trim(),
      solution: c.solution.trim()
    })),
    remarks: data.remarks.trim()
  };
}

export async function submitRegistrationApi(data: RegistrationFormData): Promise<BackendResponse> {
  const payload = formatPayload(data);

  // 1. If running inside Google Apps Script (HTML Service)
  if (typeof window !== 'undefined' && window.google?.script?.run) {
    return new Promise((resolve) => {
      try {
        window.google!.script!.run
          .withSuccessHandler((response: BackendResponse) => {
            if (response && response.status === 'success') {
              resolve(response);
            } else {
              resolve({
                status: 'error',
                isDuplicate: response?.isDuplicate,
                submissionId: response?.submissionId,
                message: response?.message || 'Submission was rejected by the server.'
              });
            }
          })
          .withFailureHandler((error: unknown) => {
            console.error('Google Apps Script submission failure:', error);
            const errMsg = error instanceof Error ? error.message : String(error);
            resolve({
              status: 'error',
              message: `Server connection error: ${errMsg}`
            });
          })
          .submitRegistration(payload);
      } catch (e) {
        console.error('Apps Script execution error:', e);
        resolve({
          status: 'error',
          message: 'Failed to invoke Google Apps Script backend.'
        });
      }
    });
  }

  // 2. If an explicit Web App URL is provided via env or window global
  const webAppUrl =
    (typeof window !== 'undefined' && window.__TECHKEY_WEBAPP_URL__) ||
    import.meta.env.VITE_APPS_SCRIPT_URL;

  if (webAppUrl) {
    try {
      const response = await fetch(webAppUrl, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain' // Plain text avoids CORS pre-flight in Apps Script
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      // Check if Apps Script returned a Google login HTML redirect
      if (responseText.includes('accounts.google.com') || responseText.includes('ServiceLogin')) {
        throw new Error(
          'Google Apps Script requires authentication. In Apps Script, go to Deploy > Manage deployments, edit the deployment, and set "Who has access" to "Anyone".'
        );
      }

      let result: BackendResponse;
      try {
        result = JSON.parse(responseText) as BackendResponse;
      } catch (jsonErr) {
        throw new Error(`Unexpected server response format. Server returned: ${responseText.slice(0, 150)}`);
      }

      return result;
    } catch (err) {
      console.warn('Fetch POST submission warning/error, attempting fallback verification:', err);

      // FALLBACK VERIFICATION:
      // In cross-origin Apps Script POST requests, some browsers drop the 302 redirect response
      // even after Apps Script has successfully received and saved the data.
      // We check via GET whether the submission was actually recorded in Google Sheets.
      try {
        const checkUrl = new URL(webAppUrl);
        checkUrl.searchParams.set('action', 'checkStatus');
        checkUrl.searchParams.set('email', data.email.trim());
        checkUrl.searchParams.set('mobile', data.mobile.trim());
        if (data.userType === 'Student' && data.registrationNumber) {
          checkUrl.searchParams.set('regNo', data.registrationNumber.trim());
        }

        const checkRes = await fetch(checkUrl.toString(), {
          method: 'GET',
          mode: 'cors',
          redirect: 'follow'
        });

        const checkText = await checkRes.text();
        const checkData = JSON.parse(checkText);

        if (checkData && checkData.registered && checkData.submissionId) {
          return {
            status: 'success',
            submissionId: checkData.submissionId
          };
        }
      } catch (verifyErr) {
        console.warn('Fallback verification also failed:', verifyErr);
      }

      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS')) {
        return {
          status: 'error',
          message:
            'Could not reach Google Apps Script. Please verify that the Web App deployment has "Who has access" set to "Anyone", and that the deployment URL is correct.'
        };
      }
      return {
        status: 'error',
        message: msg
      };
    }
  }

  // 3. Local Development Simulation Fallback
  console.info('[TechKeey API] No Google Apps Script runtime or VITE_APPS_SCRIPT_URL found. Running local development simulation.');
  await new Promise((r) => setTimeout(r, 900));

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const randNum = String(Math.floor(Math.random() * 900) + 100).padStart(4, '0');

  return {
    status: 'success',
    submissionId: `TK-${yyyy}${mm}${dd}-${randNum}`
  };
}

/**
 * Checks whether a given submission ID is currently active in the Google Sheet.
 * If the user/row was deleted from the Sheet, this returns { valid: false }.
 */
export async function verifySubmissionApi(submissionId: string): Promise<{ valid: boolean }> {
  if (!submissionId || submissionId === '—' || submissionId.trim() === '') {
    return { valid: false };
  }

  // 1. If running inside Google Apps Script (HTML Service)
  if (typeof window !== 'undefined' && window.google?.script?.run) {
    return new Promise((resolve) => {
      try {
        (window.google!.script!.run as any)
          .withSuccessHandler((res: { valid: boolean }) => {
            resolve({ valid: Boolean(res && res.valid) });
          })
          .withFailureHandler(() => {
            resolve({ valid: false });
          })
          .verifySubmission(submissionId.trim());
      } catch {
        resolve({ valid: false });
      }
    });
  }

  // 2. If Web App URL is configured
  const webAppUrl =
    (typeof window !== 'undefined' && window.__TECHKEY_WEBAPP_URL__) ||
    import.meta.env.VITE_APPS_SCRIPT_URL;

  if (webAppUrl) {
    try {
      const url = new URL(webAppUrl);
      url.searchParams.set('action', 'verifySubmission');
      url.searchParams.set('submissionId', submissionId.trim());

      const res = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow'
      });

      const text = await res.text();
      const data = JSON.parse(text);
      return { valid: Boolean(data && data.valid) };
    } catch (err) {
      console.warn('verifySubmissionApi network warning:', err);
      // In case of network interruption, don't aggressively invalidate
      return { valid: true };
    }
  }

  // Local development fallback
  return { valid: true };
}

