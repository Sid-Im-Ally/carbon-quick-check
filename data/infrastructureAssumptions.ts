// Infrastructure operational allowance applied to (AdjustedBuilding + Mobility) emissions.
// Represents a proxy for shared public-realm loads: lighting, pumping, controls, services.
//
// Factor is auto-derived from project type per spec:
//   Infill / Redevelopment     → 5%
//   Campus / Planned District  → 10%
//   Greenfield / Peri-Urban    → 15%
//
// This is NOT embodied carbon. Operational allowance only.

import type { ProjectType } from '@/types/carbon';

export const DEFAULT_INFRA_ALLOWANCE_PERCENT = 10;

export const INFRA_ALLOWANCE_OPTIONS = [5, 10, 15, 20] as const;

export type InfraAllowanceOption = (typeof INFRA_ALLOWANCE_OPTIONS)[number];

export const INFRA_ALLOWANCE_LABELS: Record<number, string> = {
  5: '5% — Infill / Redevelopment',
  10: '10% — Campus / Planned District',
  15: '15% — Greenfield / Peri-Urban Expansion',
  20: '20% — Significant shared infrastructure',
};

export const INFRA_FACTOR_BY_PROJECT_TYPE: Record<ProjectType, number> = {
  infill_redevelopment: 0.05,
  campus_planned_district: 0.10,
  greenfield_development: 0.15,
};
