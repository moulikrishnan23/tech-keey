import React from 'react';
import { ChallengeItem, ValidationErrors } from '../types';
import { LIMITS } from '../utils/validation';

interface ChallengesStepProps {
  challenges: ChallengeItem[];
  errors: ValidationErrors;
  onAddChallenge: () => void;
  onRemoveChallenge: (id: string) => void;
  onChangeChallengeField: (id: string, field: 'challenge' | 'solution', value: string) => void;
}

export const ChallengesStep: React.FC<ChallengesStepProps> = ({
  challenges,
  errors,
  onAddChallenge: _onAddChallenge,
  onRemoveChallenge: _onRemoveChallenge,
  onChangeChallengeField,
}) => {
  return (
    <div className="section-block">
      <div className="section-card">
        <div className="section-head">
          <div className="section-eyebrow">Step Four</div>
          <h2 className="section-title">Challenges &amp; Solutions</h2>
          <p className="section-sub">
            Tell us about the real challenges you experience and the ideas you believe could help solve them.
          </p>
        </div>

        <div id="challenges-container">
          {challenges.map((item) => {
            const label = 'Challenge:';
            const itemErrors = errors.challenges?.[item.id] || {};
            // const isRemovable = index > 0;

            const cLen = item.challenge.length;
            const sLen = item.solution.length;

            return (
              <div key={item.id} className="challenge-block" data-uid={item.id}>
                <div className="challenge-block-head">
                  <div className="challenge-label" data-role="label">
                    {label}
                  </div>
                  {/* 
                  {isRemovable && (
                    <button
                      type="button"
                      className="remove-challenge-btn"
                      onClick={() => onRemoveChallenge(item.id)}
                    >
                      Remove Challenge
                    </button>
                  )} 
                  */}
                </div>

                {/* Challenge field */}
                <div className="field">
                  <label className="field-label">
                    Challenge Statement<span className="req">*</span>
                  </label>
                  <textarea
                    className={`challenge-textarea challenge-input ${
                      itemErrors.challenge ? 'invalid' : ''
                    }`}
                    maxLength={LIMITS.challenge}
                    placeholder="Describe the specific bottleneck or issue clearly..."
                    value={item.challenge}
                    onChange={(e) => onChangeChallengeField(item.id, 'challenge', e.target.value)}
                  />
                  <div
                    className={`char-counter challenge-counter ${
                      cLen >= LIMITS.challenge
                        ? 'limit'
                        : cLen >= LIMITS.challenge * 0.85
                        ? 'warn'
                        : ''
                    }`}
                  >
                    {cLen} / {LIMITS.challenge}
                  </div>
                  <div
                    className={`error-msg challenge-error ${
                      itemErrors.challenge ? 'show' : ''
                    }`}
                  >
                    {itemErrors.challenge}
                  </div>
                </div>

                {/* Solution field */}
                <div className="field">
                  <label className="field-label">
                    Proposed Solution &amp; Approach<span className="req">*</span>
                  </label>
                  <textarea
                    className={`solution-textarea solution-input ${
                      itemErrors.solution ? 'invalid' : ''
                    }`}
                    maxLength={LIMITS.solution}
                    placeholder="Describe your concept, implementation idea, or practical approach..."
                    value={item.solution}
                    onChange={(e) => onChangeChallengeField(item.id, 'solution', e.target.value)}
                  />
                  <div
                    className={`char-counter solution-counter ${
                      sLen >= LIMITS.solution
                        ? 'limit'
                        : sLen >= LIMITS.solution * 0.85
                        ? 'warn'
                        : ''
                    }`}
                  >
                    {sLen} / {LIMITS.solution}
                  </div>
                  <div
                    className={`error-msg solution-error ${
                      itemErrors.solution ? 'show' : ''
                    }`}
                  >
                    {itemErrors.solution}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 
        <button
          type="button"
          className="add-challenge-btn"
          id="btn-add-challenge"
          onClick={onAddChallenge}
        >
          ＋ Add Another Challenge
        </button> 
        */}
      </div>
    </div>
  );
};
