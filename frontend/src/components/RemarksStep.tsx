import React from 'react';
import { LIMITS } from '../utils/validation';

interface RemarksStepProps {
  remarks: string;
  error?: string;
  onChangeRemarks: (value: string) => void;
}

export const RemarksStep: React.FC<RemarksStepProps> = ({
  remarks,
  error,
  onChangeRemarks,
}) => {
  const len = remarks.length;

  return (
    <div className="section-block">
      <div className="section-card">
        <div className="section-head">
          <div className="section-eyebrow">Step Five</div>
          <h2 className="section-title">Additional Remarks</h2>
          <p className="section-sub">Optional — anything else you'd like to mention.</p>
        </div>
        <div className="field">
          <label className="field-label">
            Remarks <span style={{ color: 'var(--ink-faint)', fontWeight: 600 }}>(optional)</span>
          </label>
          <textarea
            id="input-remarks"
            maxLength={LIMITS.remarks}
            placeholder="Any additional remarks..."
            style={{ minHeight: '100px' }}
            value={remarks}
            className={error ? 'invalid' : ''}
            onChange={(e) => onChangeRemarks(e.target.value)}
          />
          <div
            className={`char-counter ${
              len >= LIMITS.remarks ? 'limit' : len >= LIMITS.remarks * 0.85 ? 'warn' : ''
            }`}
            id="counter-remarks"
          >
            {len} / {LIMITS.remarks}
          </div>
          <div className={`error-msg ${error ? 'show' : ''}`} id="error-remarks">
            {error}
          </div>
        </div>
      </div>
    </div>
  );
};
