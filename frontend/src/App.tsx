import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Topbar } from './components/Topbar';
import { Hero } from './components/Hero';
// import { HowItWorks } from './components/HowItWorks';
import { InfoPanel } from './components/InfoPanel';
import { RoleSelector } from './components/RoleSelector';
import { PersonalInfoStep } from './components/PersonalInfoStep';
import { CollegeInfoStep } from './components/CollegeInfoStep';
import { ChallengesStep } from './components/ChallengesStep';
import { RemarksStep } from './components/RemarksStep';
import { ReviewSection } from './components/ReviewSection';
import { SuccessSection } from './components/SuccessSection';
import { VerticalMarquee } from './components/VerticalMarquee';
import { RegistrationFormData, ValidationErrors, YearOfStudy } from './types';
import { EducationLevelOption } from './data/academicCourses';
import { validateForm } from './utils/validation';
import { submitRegistrationApi } from './services/api';

const initialFormData: RegistrationFormData = {
  userType: '',
  name: '',
  registrationNumber: '',
  educationLevel: '',
  educationLevelOther: '',
  stream: '',
  course: '',
  courseOther: '',
  email: '',
  mobile: '',
  college: '',
  yearOfStudy: '',
  location: '',
  challenges: [{ id: 'c1', challenge: '', solution: '' }],
  remarks: '',
};

const STORAGE_KEY_SUBMISSION_ID = 'techkeey_registered_submission_id';
const STORAGE_KEY_FORM_DRAFT = 'techkeey_form_draft';

export const App: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY_FORM_DRAFT);
      if (draft) return JSON.parse(draft);
    } catch {}
    return initialFormData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM_DRAFT, JSON.stringify(formData));
  }, [formData]);
  const [challengeSeq, setChallengeSeq] = useState<number>(1);
  const [submissionId, setSubmissionId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SUBMISSION_ID) || '';
    } catch {
      return '';
    }
  });
  const [mode, setMode] = useState<'form' | 'review' | 'success'>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_SUBMISSION_ID);
      return savedId ? 'success' : 'form';
    } catch {
      return 'form';
    }
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [topErrorBanner, setTopErrorBanner] = useState<string>('');
  const [reviewErrorBanner, setReviewErrorBanner] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const formStepsRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  // Role Selection
  const handleSelectRole = (role: 'Student' | 'Faculty') => {
    setFormData((prev) => ({
      ...prev,
      userType: role,
      registrationNumber: role === 'Faculty' ? '' : prev.registrationNumber,
      educationLevel: role === 'Faculty' ? '' : prev.educationLevel,
      educationLevelOther: role === 'Faculty' ? '' : prev.educationLevelOther,
      stream: role === 'Faculty' ? '' : prev.stream,
      course: role === 'Faculty' ? '' : prev.course,
      courseOther: role === 'Faculty' ? '' : prev.courseOther,
      yearOfStudy: role === 'Faculty' ? '' : prev.yearOfStudy,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next.name;
      delete next.registrationNumber;
      delete next.educationLevel;
      delete next.educationLevelOther;
      delete next.stream;
      delete next.course;
      delete next.courseOther;
      delete next.yearOfStudy;
      return next;
    });

    const scrollToForm = () => {
      const target = document.getElementById('step-personal-info') || formStepsRef.current;
      if (target) {
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - 28;
        if (targetY > 100) {
          window.scrollTo({
            top: targetY,
            behavior: 'smooth',
          });
        }
      }
    };

    requestAnimationFrame(() => {
      setTimeout(scrollToForm, 100);
    });
  };

  // Field change handlers
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({ ...prev, name: val }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleRegNoChange = (val: string) => {
    setFormData((prev) => ({ ...prev, registrationNumber: val }));
    if (errors.registrationNumber) setErrors((prev) => ({ ...prev, registrationNumber: undefined }));
  };

  const handleEducationLevelChange = (level: EducationLevelOption) => {
    setFormData((prev) => ({
      ...prev,
      educationLevel: level,
      educationLevelOther: level === 'Others' ? prev.educationLevelOther : '',
      stream: level === 'Others' ? '' : prev.stream,
      course: level === 'Others' ? '' : prev.course,
      courseOther: level === 'Others' ? '' : prev.courseOther,
    }));

    setErrors((prev) => ({
      ...prev,
      educationLevel: undefined,
      educationLevelOther: undefined,
      stream: undefined,
      course: undefined,
      courseOther: undefined,
    }));
  };

  const handleEducationLevelOtherChange = (val: string) => {
    setFormData((prev) => ({ ...prev, educationLevelOther: val }));
    if (errors.educationLevelOther) setErrors((prev) => ({ ...prev, educationLevelOther: undefined }));
  };

  const handleStreamChange = (val: string) => {
    setFormData((prev) => ({ ...prev, stream: val }));
    if (errors.stream) setErrors((prev) => ({ ...prev, stream: undefined }));
  };

  const handleCourseChange = (val: string) => {
    setFormData((prev) => ({ ...prev, course: val }));
    if (errors.course) setErrors((prev) => ({ ...prev, course: undefined }));
  };

  const handleCourseOtherChange = (val: string) => {
    setFormData((prev) => ({ ...prev, courseOther: val }));
    if (errors.courseOther) setErrors((prev) => ({ ...prev, courseOther: undefined }));
  };

  const handleEmailChange = (val: string) => {
    setFormData((prev) => ({ ...prev, email: val }));
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleMobileChange = (val: string) => {
    setFormData((prev) => ({ ...prev, mobile: val }));
    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
  };

  const handleCollegeChange = (val: string) => {
    setFormData((prev) => ({ ...prev, college: val }));
    if (errors.college) setErrors((prev) => ({ ...prev, college: undefined }));
  };

  const handleYearChange = (year: YearOfStudy) => {
    setFormData((prev) => ({ ...prev, yearOfStudy: year }));
    if (errors.yearOfStudy) setErrors((prev) => ({ ...prev, yearOfStudy: undefined }));
  };

  const handleLocationChange = (val: string) => {
    setFormData((prev) => ({ ...prev, location: val }));
    if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
  };

  const handleRemarksChange = (val: string) => {
    setFormData((prev) => ({ ...prev, remarks: val }));
    if (errors.remarks) setErrors((prev) => ({ ...prev, remarks: undefined }));
  };

  // Dynamic Challenges (preserved for code integrity)
  const handleAddChallenge = () => {
    setFormData((prev) => ({
      ...prev,
      challenges: [
        ...prev.challenges,
        { id: `c-${Date.now()}-${challengeSeq}`, challenge: '', solution: '' },
      ],
    }));
    setChallengeSeq((s) => s + 1);
  };

  const handleRemoveChallenge = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges.filter((c) => c.id !== id),
    }));

    if (errors.challenges?.[id]) {
      setErrors((prev) => {
        const nextChallenges = { ...(prev.challenges || {}) };
        delete nextChallenges[id];
        return { ...prev, challenges: nextChallenges };
      });
    }
  };

  const handleChangeChallengeField = (
    id: string,
    field: 'challenge' | 'solution',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));

    if (errors.challenges?.[id]?.[field]) {
      setErrors((prev) => {
        const nextChallenges = { ...(prev.challenges || {}) };
        if (nextChallenges[id]) {
          nextChallenges[id] = { ...nextChallenges[id], [field]: undefined };
        }
        return { ...prev, challenges: nextChallenges };
      });
    }
  };

  const handleReview = () => {
    const { isValid, errors: validationErrors } = validateForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      setTopErrorBanner('Please fix the highlighted fields before reviewing your submission.');
      setTimeout(() => {
        const firstInvalid = document.querySelector('.invalid');
        if (firstInvalid) {
          const formInputs = document.querySelectorAll('.invalid');
          formInputs.forEach(el => {
            el.classList.remove('shake-animation');
            void (el as HTMLElement).offsetWidth;
            el.classList.add('shake-animation');
          });
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return false;
    }

    setErrors({});
    setTopErrorBanner('');
    setMode('review');

    setTimeout(() => {
      if (reviewRef.current) {
        reviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const { isValid, errors: validationErrors } = validateForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      setReviewErrorBanner('Please fix the highlighted fields before submitting.');
      return false;
    }

    setReviewErrorBanner('');
    setSubmitting(true);

    try {
      const response = await submitRegistrationApi(formData);
      if (response && response.status === 'success' && response.submissionId) {
        setSubmissionId(response.submissionId);
        try {
          localStorage.setItem(STORAGE_KEY_SUBMISSION_ID, response.submissionId);
          localStorage.removeItem(STORAGE_KEY_FORM_DRAFT);
        } catch (e) {
          console.warn('Could not save submission ID to localStorage:', e);
        }
        setMode('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setReviewErrorBanner(
          response?.message || 'An unexpected error occurred while processing your submission. Please try again.'
        );
      }
    } catch (err) {
      console.error('Submission error:', err);
      setReviewErrorBanner('Network error: could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_SUBMISSION_ID);
      localStorage.removeItem(STORAGE_KEY_FORM_DRAFT);
    } catch {}
    setFormData(initialFormData);
    setChallengeSeq(1);
    setMode('form');
    setErrors({});
    setTopErrorBanner('');
    setReviewErrorBanner('');
    setSubmissionId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderFormFields = () => (
    <>
      <PersonalInfoStep
        userType={formData.userType}
        name={formData.name}
        registrationNumber={formData.registrationNumber}
        educationLevel={formData.educationLevel}
        educationLevelOther={formData.educationLevelOther}
        stream={formData.stream}
        course={formData.course}
        courseOther={formData.courseOther}
        email={formData.email}
        mobile={formData.mobile}
        errors={errors}
        onChangeName={handleNameChange}
        onChangeRegNo={handleRegNoChange}
        onChangeEducationLevel={handleEducationLevelChange}
        onChangeEducationLevelOther={handleEducationLevelOtherChange}
        onChangeStream={handleStreamChange}
        onChangeCourse={handleCourseChange}
        onChangeCourseOther={handleCourseOtherChange}
        onChangeEmail={handleEmailChange}
        onChangeMobile={handleMobileChange}
      />

      <CollegeInfoStep
        userType={formData.userType}
        college={formData.college}
        yearOfStudy={formData.yearOfStudy}
        location={formData.location}
        errors={errors}
        onChangeCollege={handleCollegeChange}
        onSelectYear={handleYearChange}
        onChangeLocation={handleLocationChange}
      />

      <ChallengesStep
        challenges={formData.challenges}
        errors={errors}
        onAddChallenge={handleAddChallenge}
        onRemoveChallenge={handleRemoveChallenge}
        onChangeChallengeField={handleChangeChallengeField}
      />

      <RemarksStep
        remarks={formData.remarks}
        error={errors.remarks}
        onChangeRemarks={handleRemarksChange}
      />

      {topErrorBanner && (
        <div className="top-error-banner show" id="top-error-banner">
          {topErrorBanner}
        </div>
      )}
    </>
  );

  return (
    <>
      <VerticalMarquee />
      <div className="wrap">
        <Topbar />

        <main className="main-content">
          {mode !== 'success' ? (
            <>
              <Hero />
              <InfoPanel />

              <div className="section-block">
                <RoleSelector
                  selectedRole={formData.userType}
                  onSelectRole={handleSelectRole}
                />
              </div>

              {formData.userType && mode === 'form' && (
                <div id="rest-of-form" ref={formStepsRef} className="fade-in-slide">
                  <div className="sticky-role-badge">
                    <div className="sticky-role-badge-inner">
                      Registering as: {formData.userType}
                      <button 
                        type="button" 
                        className="edit-btn" 
                        onClick={() => {
                          setFormData(prev => ({...prev, userType: ''}));
                          setTimeout(() => {
                            const roleSection = document.getElementById('role-selector-section');
                            if (roleSection) {
                              const rect = roleSection.getBoundingClientRect();
                              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                              window.scrollTo({ top: Math.max(0, rect.top + scrollTop - 20), behavior: 'smooth' });
                            }
                          }, 50);
                        }}
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {renderFormFields()}

                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="btn-review"
                      onClick={handleReview}
                    >
                      Review Submission
                    </button>
                  </div>
                </div>
              )}

              {mode === 'review' && (
                <div ref={reviewRef} className="fade-in-slide">
                  <ReviewSection
                    formData={formData}
                    submitting={submitting}
                    errorMessage={reviewErrorBanner}
                    onSubmit={handleSubmit}
                    onSaveEdit={handleReview}
                  >
                    {renderFormFields()}
                  </ReviewSection>
                </div>
              )}
            </>
          ) : (
            <div className="success-page-wrapper">
              <SuccessSection submissionId={submissionId} onRestart={handleRestart} />
            </div>
          )}
        </main>

        <div className="footer-note">
          Tech<span className="accent">Keey</span> &middot; Campus Innovation &amp; Problem-Solving Platform
        </div>
      </div>
    </>
  );
};
