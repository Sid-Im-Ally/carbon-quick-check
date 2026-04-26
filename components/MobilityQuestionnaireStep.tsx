'use client';

import type { CarbonQuickCheckInput, MobilityQuestionnaireInput } from '@/types/carbon';

type Props = {
  data: Partial<CarbonQuickCheckInput>;
  onChange: (updates: Partial<CarbonQuickCheckInput>) => void;
  errors: Record<string, string>;
};

type QuestionOption = {
  score: 0 | 1 | 2 | 3;
  label: string;
  helpText?: string;
};

type Question = {
  key: keyof MobilityQuestionnaireInput;
  title: string;
  description: string;
  options: QuestionOption[];
};

const QUESTIONS: Question[] = [
  {
    key: 'parkingProvisionScore',
    title: 'Parking provision',
    description: 'How much parking is planned or expected for this project?',
    options: [
      { score: 0, label: 'Very high parking', helpText: 'Most users will drive — more than 2 spaces per unit typical' },
      { score: 1, label: 'Moderate parking', helpText: 'Parking available but not excessive' },
      { score: 2, label: 'Limited parking', helpText: 'Intentionally constrained or shared parking strategy' },
      { score: 3, label: 'Minimal / no parking', helpText: 'Very low parking supply or car-light planning' },
    ],
  },
  {
    key: 'transitAccessScore',
    title: 'Transit access',
    description: 'What level of public transit access exists within walking distance (approx. 800m)?',
    options: [
      { score: 0, label: 'No meaningful transit access', helpText: undefined },
      { score: 1, label: 'Basic bus service only', helpText: undefined },
      { score: 2, label: 'Frequent bus / BRT access', helpText: undefined },
      { score: 3, label: 'Rail / metro or multiple high-capacity transit options', helpText: undefined },
    ],
  },
  {
    key: 'mobilityCultureScore',
    title: 'Mobility culture and climate context',
    description: 'How would you describe the local mobility culture and conditions for walking and transit?',
    options: [
      { score: 0, label: 'Strongly car-dependent', helpText: 'Extreme heat, limited walkability, or very weak alternatives' },
      { score: 1, label: 'Mostly car-dependent, some alternatives', helpText: undefined },
      { score: 2, label: 'Mixed', helpText: 'Walking and transit are viable in some areas' },
      { score: 3, label: 'Transit- and walking-friendly', helpText: undefined },
    ],
  },
  {
    key: 'catchmentTypeScore',
    title: 'Catchment type',
    description: 'Where will most users come from?',
    options: [
      { score: 0, label: 'Mostly from outside the site', helpText: 'Regional commuters or visitors' },
      { score: 1, label: 'Mix of on-site and nearby neighborhoods', helpText: undefined },
      { score: 2, label: 'Mostly within or adjacent to the site', helpText: undefined },
      { score: 3, label: 'Primarily internal', helpText: 'Campus-like or self-contained travel patterns' },
    ],
  },
  {
    key: 'expectedArrivalModeScore',
    title: 'Expected arrival mode',
    description: 'How do you expect most people to arrive?',
    options: [
      { score: 0, label: 'Mostly private cars', helpText: undefined },
      { score: 1, label: 'Mostly cars with some transit', helpText: undefined },
      { score: 2, label: 'Balanced between car, transit, and walking', helpText: undefined },
      { score: 3, label: 'Mostly transit, walking, or cycling', helpText: undefined },
    ],
  },
];

export default function MobilityQuestionnaireStep({ data, onChange, errors }: Props) {
  const questionnaire = data.mobilityQuestionnaire;

  function setScore(key: keyof MobilityQuestionnaireInput, score: 0 | 1 | 2 | 3) {
    onChange({
      mobilityQuestionnaire: {
        parkingProvisionScore: questionnaire?.parkingProvisionScore ?? null as unknown as 0,
        transitAccessScore: questionnaire?.transitAccessScore ?? null as unknown as 0,
        mobilityCultureScore: questionnaire?.mobilityCultureScore ?? null as unknown as 0,
        catchmentTypeScore: questionnaire?.catchmentTypeScore ?? null as unknown as 0,
        expectedArrivalModeScore: questionnaire?.expectedArrivalModeScore ?? null as unknown as 0,
        [key]: score,
      },
    });
  }

  const answeredCount = QUESTIONS.filter(
    q => questionnaire?.[q.key] != null,
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Answer all 5 questions to assign a mobility profile.</p>
        <span className="text-sm font-medium text-gray-700 tabular-nums">
          {answeredCount} / {QUESTIONS.length} answered
        </span>
      </div>

      {QUESTIONS.map((question, qi) => {
        const currentScore = questionnaire?.[question.key];
        const hasError = errors[question.key];

        return (
          <div
            key={question.key}
            className={[
              'border rounded-xl p-5 transition-colors',
              hasError
                ? 'border-red-300 bg-red-50'
                : currentScore != null
                ? 'border-emerald-200 bg-emerald-50/30'
                : 'border-gray-200 bg-white',
            ].join(' ')}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={[
                'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5',
                currentScore != null
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-500',
              ].join(' ')}>
                {currentScore != null ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : qi + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{question.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{question.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-9">
              {question.options.map(option => {
                const isSelected = currentScore === option.score;
                return (
                  <button
                    key={option.score}
                    type="button"
                    onClick={() => setScore(question.key, option.score)}
                    className={[
                      'text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150',
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50',
                    ].join(' ')}
                  >
                    <span className="font-medium block">{option.label}</span>
                    {option.helpText && (
                      <span className={['text-xs mt-0.5 block', isSelected ? 'text-emerald-100' : 'text-gray-400'].join(' ')}>
                        {option.helpText}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {hasError && (
              <p className="text-xs text-red-600 mt-2 ml-9">{hasError}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
