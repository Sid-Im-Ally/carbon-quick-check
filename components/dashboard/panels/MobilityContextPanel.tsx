'use client';

import type { CarbonQuickCheckInput, MobilityQuestionnaireInput } from '@/types/carbon';

type Props = {
  data: Partial<CarbonQuickCheckInput>;
  onChange: (updates: Partial<CarbonQuickCheckInput>) => void;
  errors: Record<string, string>;
};

type QuestionOption = { score: 0 | 1 | 2 | 3; label: string };
type Question = { key: keyof MobilityQuestionnaireInput; title: string; options: QuestionOption[] };

const QUESTIONS: Question[] = [
  {
    key: 'parkingProvisionScore', title: 'Parking provision',
    options: [{ score: 0, label: 'Very high' }, { score: 1, label: 'Moderate' }, { score: 2, label: 'Limited' }, { score: 3, label: 'Minimal / none' }],
  },
  {
    key: 'transitAccessScore', title: 'Transit access (800m)',
    options: [{ score: 0, label: 'No transit' }, { score: 1, label: 'Basic bus' }, { score: 2, label: 'Frequent / BRT' }, { score: 3, label: 'Rail / metro' }],
  },
  {
    key: 'mobilityCultureScore', title: 'Mobility culture',
    options: [{ score: 0, label: 'Car-dependent' }, { score: 1, label: 'Mostly car' }, { score: 2, label: 'Mixed' }, { score: 3, label: 'Transit-friendly' }],
  },
  {
    key: 'catchmentTypeScore', title: 'Catchment type',
    options: [{ score: 0, label: 'Mostly external' }, { score: 1, label: 'Mixed' }, { score: 2, label: 'Mostly nearby' }, { score: 3, label: 'Primarily internal' }],
  },
  {
    key: 'expectedArrivalModeScore', title: 'Expected arrival mode',
    options: [{ score: 0, label: 'Mostly car' }, { score: 1, label: 'Car + some transit' }, { score: 2, label: 'Balanced' }, { score: 3, label: 'Transit / walk / bike' }],
  },
];

function predictProfile(q: Partial<MobilityQuestionnaireInput>): string | null {
  const vals = Object.values(q).filter(v => v != null);
  if (vals.length < 5) return null;
  const raw = (q.parkingProvisionScore ?? 0) * 2 + (q.transitAccessScore ?? 0) * 2 + (q.mobilityCultureScore ?? 0) + (q.catchmentTypeScore ?? 0) + (q.expectedArrivalModeScore ?? 0);
  const score = Math.max(0, raw);
  if (score <= 7) return 'Auto-Oriented';
  if (score < 15) return 'Balanced';
  return 'Transit-Oriented';
}

export default function MobilityContextPanel({ data, onChange, errors }: Props) {
  const q = data.mobilityQuestionnaire ?? {} as MobilityQuestionnaireInput;

  function setScore(key: keyof MobilityQuestionnaireInput, score: 0 | 1 | 2 | 3) {
    onChange({
      mobilityQuestionnaire: {
        parkingProvisionScore:    q.parkingProvisionScore    ?? null as unknown as 0,
        transitAccessScore:       q.transitAccessScore       ?? null as unknown as 0,
        mobilityCultureScore:     q.mobilityCultureScore     ?? null as unknown as 0,
        catchmentTypeScore:       q.catchmentTypeScore       ?? null as unknown as 0,
        expectedArrivalModeScore: q.expectedArrivalModeScore ?? null as unknown as 0,
        [key]: score,
      },
    });
  }

  const answeredCount = QUESTIONS.filter(qu => q[qu.key] != null).length;
  const predictedProfile = predictProfile(q);

  const profileColors: Record<string, { bg: string; text: string }> = {
    'Transit-Oriented': { bg: '#eef4ee', text: '#3a6b3a' },
    'Balanced':         { bg: '#e8f4fb', text: '#1a6b8a' },
    'Auto-Oriented':    { bg: '#fdf3ea', text: '#8a4a1a' },
  };

  return (
    <div style={{ padding: '10px 16px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: '#9aada4' }}>{answeredCount} / 5 answered</span>
        {predictedProfile && (
          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: profileColors[predictedProfile].bg, color: profileColors[predictedProfile].text, letterSpacing: 0.3 }}>
            {predictedProfile}
          </span>
        )}
      </div>

      {QUESTIONS.map(question => {
        const current = q[question.key];
        const answered = current != null;
        return (
          <div key={question.key} style={{ marginBottom: 10, padding: '10px 12px', borderRadius: 8, border: `1px solid ${answered ? '#d6e3d6' : 'rgba(31,38,34,0.08)'}`, background: answered ? '#f8fbf8' : '#fbfaf6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#3d4a44', margin: 0 }}>{question.title}</p>
              {answered && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a7a5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {question.options.map(opt => {
                const selected = current === opt.score;
                return (
                  <button
                    key={opt.score} type="button"
                    onClick={() => setScore(question.key, opt.score)}
                    style={{ padding: '5px 8px', fontSize: 11, fontWeight: 500, borderRadius: 6, border: '1px solid', cursor: 'pointer', transition: 'all .15s', textAlign: 'left', background: selected ? '#5a7a5a' : '#fff', color: selected ? '#fff' : '#3d4a44', borderColor: selected ? '#5a7a5a' : 'rgba(31,38,34,0.1)', fontFamily: 'inherit' }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {errors.mobilityQuestionnaire && (
        <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.mobilityQuestionnaire}</p>
      )}
    </div>
  );
}
