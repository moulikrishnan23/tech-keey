import React from 'react';
import { UserType, ValidationErrors, YearOfStudy } from '../types';

interface CollegeInfoStepProps {
  userType: UserType;
  college: string;
  yearOfStudy: YearOfStudy;
  location: string;
  errors: ValidationErrors;
  onChangeCollege: (value: string) => void;
  onSelectYear: (year: YearOfStudy) => void;
  onChangeLocation: (value: string) => void;
}

const YEAR_OPTIONS: YearOfStudy[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const CollegeInfoStep: React.FC<CollegeInfoStepProps> = ({
  userType,
  college,
  yearOfStudy,
  location,
  errors,
  onChangeCollege,
  onSelectYear,
  onChangeLocation,
}) => {
  const isStudent = userType === 'Student';

  return (
    <div className="section-block">
      <div className="section-card">
        <div className="section-head">
          <div className="section-eyebrow">Step Three</div>
          <h2 className="section-title">Tell us about your college</h2>
          <p className="section-sub">Help us understand the environment in which the challenge occurs.</p>
        </div>

        {/* College Name */}
        <div className="field">
          <label className="field-label">
            College Name<span className="req">*</span>
          </label>
          <input
            type="text"
            id="input-college"
            maxLength={150}
            placeholder="Enter your college name"
            autoComplete="organization"
            value={college}
            className={errors.college ? 'invalid' : ''}
            onChange={(e) => onChangeCollege(e.target.value)}
          />
          <div className={`error-msg ${errors.college ? 'show' : ''}`} id="error-college">
            {errors.college}
          </div>
        </div>

        {/* Year of Study (Student only) */}
        {isStudent && (
          <div className="field" id="field-year">
            <label className="field-label">
              Year of Study<span className="req">*</span>
            </label>
            <div className="year-grid" id="year-grid">
              {YEAR_OPTIONS.map((year) => (
                <div
                  key={year}
                  className={`year-pill ${yearOfStudy === year ? 'selected' : ''}`}
                  data-year={year}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectYear(year)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectYear(year);
                    }
                  }}
                >
                  {year}
                </div>
              ))}
            </div>
            <div className={`error-msg ${errors.yearOfStudy ? 'show' : ''}`} id="error-year">
              {errors.yearOfStudy}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="field">
          <label className="field-label">
            Location<span className="req">*</span>
          </label>
          <input
            type="text"
            id="input-location"
            maxLength={100}
            placeholder="City / Town / District"
            value={location}
            className={errors.location ? 'invalid' : ''}
            onChange={(e) => onChangeLocation(e.target.value)}
          />
          <div className={`error-msg ${errors.location ? 'show' : ''}`} id="error-location">
            {errors.location}
          </div>
        </div>
      </div>
    </div>
  );
};
