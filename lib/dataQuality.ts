export type DataConfidence = 'high' | 'medium' | 'low' | 'fallback' | 'manual';

export type DataQualityAssessment = {
  confidence: DataConfidence;
  label: string;
  description: string;
  color: string;
};

export function assessDataQuality(confidence: DataConfidence): DataQualityAssessment {
  const map: Record<DataConfidence, DataQualityAssessment> = {
    high: {
      confidence: 'high',
      label: 'High confidence',
      description: 'Data from a validated, high-quality source.',
      color: 'emerald',
    },
    medium: {
      confidence: 'medium',
      label: 'Medium confidence',
      description: 'Best available data; some uncertainty remains.',
      color: 'sky',
    },
    low: {
      confidence: 'low',
      label: 'Low confidence',
      description: 'Approximate or estimated data. Use with caution.',
      color: 'amber',
    },
    fallback: {
      confidence: 'fallback',
      label: 'Fallback used',
      description: 'No data available for this location. A global fallback was applied.',
      color: 'orange',
    },
    manual: {
      confidence: 'manual',
      label: 'Manual entry',
      description: 'Köppen zone entered manually by the user.',
      color: 'amber',
    },
  };
  return map[confidence];
}

export function worstConfidence(levels: DataConfidence[]): DataConfidence {
  const order: DataConfidence[] = ['high', 'medium', 'low', 'fallback', 'manual'];
  let worst: DataConfidence = 'high';
  for (const level of levels) {
    if (order.indexOf(level) > order.indexOf(worst)) {
      worst = level;
    }
  }
  return worst;
}
