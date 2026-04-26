'use client';

type Props = {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  unit?: string;
  min?: number;
  max?: number;
  error?: string;
  helpText?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
};

export default function NumberInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  error,
  helpText,
  placeholder,
  disabled = false,
  id,
}: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {helpText && <p className="text-xs text-gray-500 leading-relaxed">{helpText}</p>}
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="number"
          value={value}
          min={min}
          max={max}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => {
            const raw = e.target.value;
            if (raw === '' || raw === '-') {
              onChange('');
            } else {
              const parsed = parseFloat(raw);
              if (!isNaN(parsed)) onChange(parsed);
            }
          }}
          className={[
            'flex-1 border rounded-lg px-3 py-2 text-sm text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white',
          ].join(' ')}
        />
        {unit && (
          <span className="text-sm text-gray-500 shrink-0 min-w-8">{unit}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
    </div>
  );
}
