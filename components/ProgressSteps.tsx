'use client';

type Props = {
  currentStep: number;
  steps: string[];
};

export default function ProgressSteps({ currentStep, steps }: Props) {
  return (
    <div className="w-full">
      {/* Mobile: compact label */}
      <div className="sm:hidden text-sm text-gray-500 text-center mb-4">
        Step {currentStep + 1} of {steps.length} — {steps[currentStep]}
      </div>

      {/* Desktop: full stepper */}
      <div className="hidden sm:flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200',
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                      : 'bg-gray-100 text-gray-400',
                  ].join(' ')}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={[
                    'text-xs whitespace-nowrap',
                    isCurrent ? 'text-emerald-600 font-medium' : isCompleted ? 'text-gray-600' : 'text-gray-400',
                  ].join(' ')}
                >
                  {step}
                </span>
              </div>

              {!isLast && (
                <div
                  className={[
                    'h-px w-16 mx-2 mt-[-14px] transition-all duration-200',
                    isCompleted ? 'bg-emerald-400' : 'bg-gray-200',
                  ].join(' ')}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
