'use client';

import { useEffect, useState } from 'react';

type Props = {
  onComplete: () => void;
};

const MESSAGES = [
  'Mapping your project location...',
  'Assigning climate and grid assumptions...',
  'Calculating building energy use...',
  'Estimating mobility emissions...',
  'Preparing your Carbon Quick Check...',
];

const TOTAL_DURATION = 1800;

export default function LoadingCalculation({ onComplete }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [progressWidth, setProgressWidth] = useState('0%');

  // Complete after total duration
  useEffect(() => {
    const timeout = setTimeout(onComplete, TOTAL_DURATION);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  // Animate progress bar
  useEffect(() => {
    const t = setTimeout(() => setProgressWidth('100%'), 50);
    return () => clearTimeout(t);
  }, []);

  // Cycle messages
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setMessageIndex(i => (i + 1) % MESSAGES.length);
        setFadeIn(true);
      }, 150);
    }, TOTAL_DURATION / MESSAGES.length);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-8">
      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
        <div className="absolute inset-3 rounded-full bg-emerald-400 opacity-30 animate-ping" style={{ animationDelay: '150ms' }} />
        <div className="relative w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M3 12h2m14 0h2M5.636 5.636l1.414 1.414M16.95 16.95l1.414 1.414M5.636 18.364l1.414-1.414M16.95 7.05l1.414-1.414" />
          </svg>
        </div>
      </div>

      {/* Status message */}
      <div className="h-8 flex items-center justify-center mb-6">
        <p
          className={[
            'text-base text-gray-600 font-medium text-center transition-opacity duration-150',
            fadeIn ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          {MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all ease-linear"
          style={{ width: progressWidth, transitionDuration: `${TOTAL_DURATION}ms` }}
        />
      </div>

      <p className="mt-4 text-xs text-gray-400">Running calculations...</p>
    </div>
  );
}
