import React from 'react';
import { RegistrationFormData } from '../types';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';

interface ReviewSectionProps {
  formData: RegistrationFormData;
  submitting: boolean;
  errorMessage?: string;
  
  onSubmit: () => void;
  onSaveEdit?: () => boolean | void;
  children?: React.ReactNode;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  formData,
  submitting,
  errorMessage,
  onSubmit,
  onSaveEdit,
  children,
}) => {
  const isStudent = formData.userType === 'Student';
  const [isEditing, setIsEditing] = React.useState(false);

  if (isEditing) {
    return (
      <div className="section-block" id="review-section">
        <div className="section-card">
          <div className="section-head">
            <div className="section-eyebrow">Edit</div>
            <h2 className="section-title">Edit your submission</h2>
            <p className="section-sub">Update your information below.</p>
          </div>
          
          {children}

          <div className="btn-row" style={{ marginTop: '32px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const success = onSaveEdit ? onSaveEdit() : true;
                if (success !== false) setIsEditing(false);
              }}
            >
              Save & Return to Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-block" id="review-section">
      <div className="section-card">
        <div className="section-head">
          <div className="section-eyebrow">Final Step</div>
          <h2 className="section-title">Review your submission</h2>
          <p className="section-sub">
            Check your information and ideas before submitting them to TechKeey.
          </p>
        </div>

        <div id="review-content">
          {/* Your Information Card */}
          <div className="review-card">
            <div className="review-heading">Your Information</div>
            <div className="review-row">
              <div className="review-key">Name</div>
              <div className="review-val">{formData.name || '—'}</div>
            </div>
            {isStudent && (
              <>
                <div className="review-row">
                  <div className="review-key">Registration Number</div>
                  <div className="review-val">{formData.registrationNumber || '—'}</div>
                </div>
                <div className="review-row">
                  <div className="review-key">Education Level</div>
                  <div className="review-val">
                    {formData.educationLevel === 'Others'
                      ? `Others (${formData.educationLevelOther || 'Specified'})`
                      : formData.educationLevel || '—'}
                  </div>
                </div>
                {formData.educationLevel !== 'Others' && (
                  <>
                    <div className="review-row">
                      <div className="review-key">Stream / Discipline</div>
                      <div className="review-val">{formData.stream || '—'}</div>
                    </div>
                    <div className="review-row">
                      <div className="review-key">Degree / Course</div>
                      <div className="review-val">
                        {formData.course === 'Other / Not Listed' || formData.stream === 'Other / Not Listed'
                          ? formData.courseOther || 'Other / Not Listed'
                          : formData.course || '—'}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="review-row">
              <div className="review-key">Email</div>
              <div className="review-val">{formData.email || '—'}</div>
            </div>
            <div className="review-row">
              <div className="review-key">Mobile</div>
              <div className="review-val">{formData.mobile || '—'}</div>
            </div>
          </div>

          {/* College Information Card */}
          <div className="review-card">
            <div className="review-heading">College Information</div>
            <div className="review-row">
              <div className="review-key">College</div>
              <div className="review-val">{formData.college || '—'}</div>
            </div>
            {isStudent && (
              <div className="review-row">
                <div className="review-key">Year</div>
                <div className="review-val">{formData.yearOfStudy || '—'}</div>
              </div>
            )}
            <div className="review-row">
              <div className="review-key">Location</div>
              <div className="review-val">{formData.location || '—'}</div>
            </div>
          </div>

          {/* Challenges & Solutions Card */}
          <div className="review-card">
            <div className="review-heading">Challenge &amp; Solutions</div>
            {formData.challenges.map((pair) => {
              return (
                <div key={pair.id} className="review-pair">
                  <div className="review-pair-label">Challenge:</div>
                  <div className="review-block-val">{pair.challenge || '—'}</div>
                  <div className="review-solution-label">Suggested Solution:</div>
                  <div className="review-block-val" style={{ marginBottom: 0 }}>
                    {pair.solution && pair.solution.trim() ? pair.solution : 'N/A'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remarks Card */}
          {formData.remarks.trim() && (
            <div className="review-card">
              <div className="review-heading">Additional Remarks</div>
              <div className="review-block-val" style={{ marginBottom: 0 }}>
                {formData.remarks}
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="top-error-banner show" id="review-error-banner" style={{ marginTop: '24px' }}>
            {errorMessage}
          </div>
        )}

        <div className="btn-row split" style={{ marginTop: '28px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            id="btn-edit-submission"
            disabled={submitting}
            onClick={() => setIsEditing(true)}
          >
            Edit Submission
          </button>
          <button
            type="button"
            className="btn btn-primary"
            id="btn-submit"
            disabled={submitting}
            onClick={onSubmit}
          >
            {submitting ? (
              <>
                <span className="spinner" /> Submitting...
              </>
            ) : (
              <span id="submit-btn-text">Submit Registration</span>
            )}
          </button>
        </div>

        {/* Post-Submission Instagram Announcement Section */}
        <div className="instagram-cta-card">
          <div className="cta-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          <div className="cta-content">
            <h4 className="cta-title">Stay Updated!</h4>
            <p className="cta-text">
              Important notifications and announcements will be posted on our Instagram page.
            </p>
            <a
              href={HACKATHON_CONFIG.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-instagram"
            >
              Follow LeSuccess on Instagram →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

