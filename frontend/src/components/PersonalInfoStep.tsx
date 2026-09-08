import React from 'react';
import { UserType, ValidationErrors } from '../types';

interface PersonalInfoStepProps {
  userType: UserType;
  name: string;
  registrationNumber: string;
  email: string;
  mobile: string;
  errors: ValidationErrors;
  onChangeName: (value: string) => void;
  onChangeRegNo: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeMobile: (value: string) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  userType,
  name,
  registrationNumber,
  email,
  mobile,
  errors,
  onChangeName,
  onChangeRegNo,
  onChangeEmail,
  onChangeMobile,
}) => {
  const isStudent = userType === 'Student';

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    onChangeMobile(numericOnly);
  };

  return (
    <div className="section-block">
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
