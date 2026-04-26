'use client';

import type { DataConfidence } from '@/lib/dataQuality';
import { assessDataQuality } from '@/lib/dataQuality';

type Props = {
  confidence: DataConfidence;
  showDescription?: boolean;
};

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
};

export function DataQualityBadge({ confidence, showDescription = false }: Props) {
  const assessment = assessDataQuality(confidence);
  const colorClass = colorMap[assessment.color] ?? colorMap.orange;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {assessment.label}
      {showDescription && (
        <span className="ml-1 font-normal opacity-80">— {assessment.description}</span>
      )}
    </span>
  );
}
