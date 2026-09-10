import React from 'react';
import { RegistrationFormData } from '../types';
import { HACKATHON_CONFIG } from '../data/hackathonConfig';

interface ReviewSectionProps {
  formData: RegistrationFormData;
  submitting: boolean;
  errorMessage?: string;
  onEdit: () => void;
  onSubmit: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  formData,
  submitting,
  errorMessage,
  onEdit,
  onSubmit,
}) => {
  const isStudent = formData.userType === 'Student';

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
            onClick={onEdit}
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
        <div className="submission-notice-card">
          <div className="notice-icon">📢</div>
          <div className="notice-content">
            <p className="notice-text">
              Notifications / announcements will be posted on our Instagram page. Kindly follow our{' '}
              <a
                href={HACKATHON_CONFIG.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="notice-link"
              >
                Instagram page
              </a>{' '}
              for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

