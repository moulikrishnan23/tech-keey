import React, { useState, useRef } from 'react';
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
import { ChallengeItem, RegistrationFormData, ValidationErrors, YearOfStudy } from './types';
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

export const App: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [challengeSeq, setChallengeSeq] = useState<number>(1);
  const [mode, setMode] = useState<'form' | 'review' | 'success'>('form');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [topErrorBanner, setTopErrorBanner] = useState<string>('');
  const [reviewErrorBanner, setReviewErrorBanner] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>('');

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

    setTimeout(() => {
      if (formStepsRef.current) {
        formStepsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
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
    const nextSeq = challengeSeq + 1;
    setChallengeSeq(nextSeq);
    const newChallenge: ChallengeItem = {
      id: `c${nextSeq}`,
      challenge: '',
      solution: '',
    };
    setFormData((prev) => ({
      ...prev,
      challenges: [...prev.challenges, newChallenge],
    }));
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

  // Review & Submit
  const handleReview = () => {
    const { isValid, errors: validationErrors } = validateForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      setTopErrorBanner('Please fix the highlighted fields before reviewing your submission.');
      setTimeout(() => {
        const firstInvalid = document.querySelector('.invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
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

  const handleEditSubmission = () => {
    setMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const { isValid, errors: validationErrors } = validateForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      setReviewErrorBanner('Please fix the highlighted fields before submitting.');
      return;
    }

    setReviewErrorBanner('');
    setSubmitting(true);

    try {
      const response = await submitRegistrationApi(formData);
      if (response && response.status === 'success' && response.submissionId) {
        setSubmissionId(response.submissionId);
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
    setFormData(initialFormData);
    setChallengeSeq(1);
    setMode('form');
    setErrors({});
    setTopErrorBanner('');
    setReviewErrorBanner('');
    setSubmissionId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="wrap">
      <Topbar />

      {mode !== 'success' && (
        <div id="main-content">
          <Hero />
          {/* <HowItWorks /> */}
          <InfoPanel />

          {/* Step 1: Role Selection */}
          <RoleSelector
            selectedRole={formData.userType}
            onSelectRole={handleSelectRole}
          />

          {/* Steps 2-5: Form fields */}
          {formData.userType && (
            <div id="rest-of-form" ref={formStepsRef}>
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

              {mode === 'form' && (
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
              )}

              {/* Review Section */}
              {mode === 'review' && (
                <div ref={reviewRef}>
                  <ReviewSection
                    formData={formData}
                    submitting={submitting}
                    errorMessage={reviewErrorBanner}
                    onEdit={handleEditSubmission}
                    onSubmit={handleSubmit}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Success View */}
      {mode === 'success' && (
        <SuccessSection submissionId={submissionId} onRestart={handleRestart} />
      )}

      <div className="footer-note">
        Tech<span className="accent">Keey</span> &middot; Campus Innovation &amp; Problem-Solving Platform
      </div>
    </div>
  );
};
