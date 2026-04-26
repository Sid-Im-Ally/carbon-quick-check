'use client';

import { useState, useRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
  description?: string;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  helpText?: string;
  placeholder?: string;
  id?: string;
};

export default function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  helpText,
  placeholder = 'Select an option...',
  id,
}: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(optValue: string) {
    onChange(optValue);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {helpText && <p className="text-xs text-gray-500 leading-relaxed">{helpText}</p>}

      <div className="relative">
        <button
          type="button"
          id={inputId}
          onClick={() => setOpen(o => !o)}
          className={[
            'w-full border rounded-lg px-3 py-2 text-sm text-left bg-white flex items-center justify-between gap-2',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
            error ? 'border-red-400 bg-red-50' : 'border-gray-200',
          ].join(' ')}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption?.label ?? placeholder}
          </span>
          <svg
            className={['w-4 h-4 text-gray-400 shrink-0 transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={[
                  'w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-0',
                  opt.value === value ? 'bg-emerald-50' : '',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                  {opt.value === value && (
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {opt.description && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.description}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
    </div>
  );
}
