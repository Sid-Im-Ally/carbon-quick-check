// Shared infrastructure operational allowance as a percentage of building emissions.
// This represents an early-stage proxy for shared loads: lighting, pumping, controls,
// common systems, and public realm infrastructure.
//
// This is NOT embodied carbon. It is an operational allowance only.
//
// TODO: Replace with project-specific infrastructure energy modeling or validated
// benchmark data from comparable master plan projects.

export const DEFAULT_INFRA_ALLOWANCE_PERCENT = 10;

export const INFRA_ALLOWANCE_OPTIONS = [5, 10, 15, 20] as const;

export type InfraAllowanceOption = (typeof INFRA_ALLOWANCE_OPTIONS)[number];

export const INFRA_ALLOWANCE_LABELS: Record<number, string> = {
  5: '5% — Low-impact infrastructure',
  10: '10% — Typical shared infrastructure (default)',
  15: '15% — Higher-complexity public realm',
  20: '20% — Significant shared infrastructure',
};
