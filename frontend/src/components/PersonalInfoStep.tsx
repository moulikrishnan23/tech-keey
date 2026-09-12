import React from 'react';
import { UserType, ValidationErrors } from '../types';
import { EDUCATION_LEVELS, EducationLevelOption, STREAMS, getCoursesByStream } from '../data/academicCourses';
import { SearchableSelect } from './SearchableSelect';

interface PersonalInfoStepProps {
  userType: UserType;
  name: string;
  registrationNumber: string;
  educationLevel: EducationLevelOption | '';
  educationLevelOther: string;
  stream: string;
  course: string;
  courseOther: string;
  email: string;
  mobile: string;
  errors: ValidationErrors;
  onChangeName: (value: string) => void;
  onChangeRegNo: (value: string) => void;
  onChangeEducationLevel: (value: EducationLevelOption) => void;
  onChangeEducationLevelOther: (value: string) => void;
  onChangeStream: (value: string) => void;
  onChangeCourse: (value: string) => void;
  onChangeCourseOther: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeMobile: (value: string) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  userType,
  name,
  registrationNumber,
  educationLevel,
  educationLevelOther,
  stream,
  course,
  courseOther,
  email,
  mobile,
  errors,
  onChangeName,
  onChangeRegNo,
  onChangeEducationLevel,
  onChangeEducationLevelOther,
  onChangeStream,
  onChangeCourse,
  onChangeCourseOther,
  onChangeEmail,
  onChangeMobile,
}) => {
  const isStudent = userType === 'Student';
  const availableCourses = isStudent && stream ? getCoursesByStream(stream, educationLevel) : [];

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    onChangeMobile(numericOnly);
  };

  return (
    <div className="section-block" id="step-personal-info">
      <div className="section-card">
        <div className="section-head">
          <div className="section-eyebrow">Step Two</div>
          <h2 className="section-title">Tell us about yourself</h2>
          <p className="section-sub">Tell us how we can identify and contact you regarding your submission.</p>
        </div>

        {/* Name */}
        <div className="field">
          <label className="field-label" id="label-name">
            {isStudent ? 'Student Name' : 'Faculty Name'}
            <span className="req">*</span>
          </label>
          <input
            type="text"
            id="input-name"
            maxLength={100}
            placeholder={isStudent ? 'Enter your student name' : 'Enter your faculty name'}
            autoComplete="name"
            value={name}
            className={errors.name ? 'invalid' : ''}
            onChange={(e) => onChangeName(e.target.value)}
          />
          <div className={`error-msg ${errors.name ? 'show' : ''}`} id="error-name">
            {errors.name}
          </div>
        </div>

        {/* Registration Number (Student only) */}
        {isStudent && (
          <div className="field" id="field-regno">
            <label className="field-label">
              Registration Number<span className="req">*</span>
            </label>
            <input
              type="text"
              id="input-regno"
              maxLength={30}
              placeholder="e.g. 22CS001"
              autoComplete="off"
              value={registrationNumber}
              className={errors.registrationNumber ? 'invalid' : ''}
              onChange={(e) => onChangeRegNo(e.target.value)}
            />
            <div
              className={`error-msg ${errors.registrationNumber ? 'show' : ''}`}
              id="error-regno"
            >
              {errors.registrationNumber}
            </div>
          </div>
        )}

        {/* Academic Details (Student only) */}
        {isStudent && (
          <>
            {/* Dropdown 1: Education Level */}
            <div className="field" id="field-education-level">
              <label className="field-label">
                Education Level<span className="req">*</span>
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                }}
              >
                {EDUCATION_LEVELS.map((level) => (
                  <div
                    key={level}
                    className={`year-pill ${educationLevel === level ? 'selected' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => onChangeEducationLevel(level)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChangeEducationLevel(level);
                      }
                    }}
                  >
                    {level}
                  </div>
                ))}
              </div>
              <div className={`error-msg ${errors.educationLevel ? 'show' : ''}`} id="error-education-level">
                {errors.educationLevel}
              </div>
            </div>

            {/* If Education Level is "Others" -> Please Specify */}
            {educationLevel === 'Others' && (
              <div className="field" id="field-education-level-other">
                <label className="field-label">
                  Please Specify Education Level / Qualification<span className="req">*</span>
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Ph.D, Integrated M.Tech, Certificate Course..."
                  value={educationLevelOther}
                  className={errors.educationLevelOther ? 'invalid' : ''}
                  onChange={(e) => onChangeEducationLevelOther(e.target.value)}
                />
                <div
                  className={`error-msg ${errors.educationLevelOther ? 'show' : ''}`}
                  id="error-education-level-other"
                >
                  {errors.educationLevelOther}
                </div>
              </div>
            )}

            {/* If Education Level is NOT "Others" and is selected -> Stream / Discipline */}
            {educationLevel && educationLevel !== 'Others' && (
              <>
                <div className="field" id="field-stream">
                  <label className="field-label">
                    Stream / Discipline<span className="req">*</span>
                  </label>
                  <SearchableSelect
                    id="select-stream"
                    options={[...STREAMS]}
                    value={stream}
                    placeholder="Select Stream / Discipline..."
                    searchPlaceholder="Search stream (e.g. Engineering, Arts & Science)..."
                    isInvalid={!!errors.stream}
                    onChange={(selectedStream) => {
                      onChangeStream(selectedStream);
                      onChangeCourse(''); // reset course when stream changes
                      onChangeCourseOther('');
                    }}
                  />
                  <div className={`error-msg ${errors.stream ? 'show' : ''}`} id="error-stream">
                    {errors.stream}
                  </div>
                </div>

                {/* Dropdown 2: Searchable Degree / Course */}
                {stream && stream !== 'Other / Not Listed' && (
                  <div className="field" id="field-course">
                    <label className="field-label">
                      Degree / Course<span className="req">*</span>
                    </label>
                    <SearchableSelect
                      id="select-course"
                      options={availableCourses}
                      value={course}
                      placeholder="Select or search Degree / Course..."
                      searchPlaceholder="Type to search course (e.g. CSE, BCA, Data Science)..."
                      isInvalid={!!errors.course}
                      onChange={(selectedCourse) => {
                        onChangeCourse(selectedCourse);
                        if (selectedCourse !== 'Other / Not Listed') {
                          onChangeCourseOther('');
                        }
                      }}
                    />
                    <div className={`error-msg ${errors.course ? 'show' : ''}`} id="error-course">
                      {errors.course}
                    </div>
                  </div>
                )}

                {/* If Stream is "Other / Not Listed" OR Course is "Other / Not Listed" -> Specify Course */}
                {(stream === 'Other / Not Listed' || course === 'Other / Not Listed') && (
                  <div className="field" id="field-course-other">
                    <label className="field-label">
                      Please Specify Degree / Course Name<span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={120}
                      placeholder="Enter your exact degree and department name..."
                      value={courseOther}
                      className={errors.courseOther ? 'invalid' : ''}
                      onChange={(e) => onChangeCourseOther(e.target.value)}
                    />
                    <div className={`error-msg ${errors.courseOther ? 'show' : ''}`} id="error-course-other">
                      {errors.courseOther}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Email & Mobile Grid */}
        <div className="grid-2">
          <div className="field">
            <label className="field-label">
              Email ID<span className="req">*</span>
            </label>
            <input
              type="email"
              id="input-email"
              maxLength={150}
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              className={errors.email ? 'invalid' : ''}
              onChange={(e) => onChangeEmail(e.target.value)}
            />
            <div className={`error-msg ${errors.email ? 'show' : ''}`} id="error-email">
              {errors.email}
            </div>
          </div>

          <div className="field">
            <label className="field-label">
              Mobile Number<span className="req">*</span>
            </label>
            <input
              type="tel"
              id="input-mobile"
              maxLength={10}
              placeholder="9876543210"
              autoComplete="tel"
              inputMode="numeric"
              value={mobile}
              className={errors.mobile ? 'invalid' : ''}
              onChange={handleMobileChange}
            />
            <div className={`error-msg ${errors.mobile ? 'show' : ''}`} id="error-mobile">
              {errors.mobile}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
