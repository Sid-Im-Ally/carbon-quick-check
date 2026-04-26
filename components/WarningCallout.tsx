'use client';

type Props = {
  warnings: string[];
  title?: string;
};

export function WarningCallout({ warnings, title = 'Note' }: Props) {
  if (warnings.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-xs font-semibold text-amber-700 mb-1">{title}</p>
      <ul className="space-y-0.5">
        {warnings.map((w, i) => (
          <li key={i} className="text-xs text-amber-700 leading-relaxed">
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
}
