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
          'Content-Type': 'text/plain;charset=utf-8' // Text/plain avoids pre-flight CORS in Apps Script
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
      console.error('Fetch submission error:', err);
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
