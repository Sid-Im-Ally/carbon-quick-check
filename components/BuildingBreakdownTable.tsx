'use client';

import type { BuildingResult } from '@/types/carbon';
import { formatAreaShort, formatEuiShort, formatEnergyShort, formatEmissionsShort } from '@/lib/formatting';

const PROGRAM_LABELS: Record<string, string> = {
  residential_single_family: 'Residential — Single-Family',
  residential_multifamily: 'Residential — Multifamily',
  office: 'Office',
  retail: 'Retail',
  hospitality: 'Hospitality',
  educational: 'Educational',
  healthcare: 'Healthcare',
  industrial: 'Industrial',
  institutional: 'Institutional / Other',
};

type Props = {
  buildings: BuildingResult[];
};

export default function BuildingBreakdownTable({ buildings }: Props) {
  const sorted = [...buildings].sort((a, b) => b.emissionsTCO2e - a.emissionsTCO2e);
  const totalEmissions = buildings.reduce((s, r) => s + r.emissionsTCO2e, 0);
  const totalEnergy = buildings.reduce((s, r) => s + r.annualEnergyKwh, 0);
  const totalArea = buildings.reduce((s, r) => s + r.areaM2, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2.5 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Program</th>
            <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Area (m²)</th>
            <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">EUI (kWh/m²/yr)</th>
            <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Energy (kWh/yr)</th>
            <th className="text-right py-2.5 pl-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">tCO2e/yr</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr key={row.programType} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2.5 pr-4 text-gray-700 font-medium">
                {PROGRAM_LABELS[row.programType] ?? row.programType}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-600 tabular-nums">{formatAreaShort(row.areaM2)}</td>
              <td className="py-2.5 px-3 text-right text-gray-600 tabular-nums">{formatEuiShort(row.euiKwhPerM2Year)}</td>
              <td className="py-2.5 px-3 text-right text-gray-600 tabular-nums">{formatEnergyShort(row.annualEnergyKwh)}</td>
              <td className="py-2.5 pl-3 text-right font-semibold text-gray-800 tabular-nums">{formatEmissionsShort(row.emissionsTCO2e)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-300 bg-gray-50">
            <td className="py-2.5 pr-4 text-sm font-semibold text-gray-800">Total</td>
            <td className="py-2.5 px-3 text-right text-sm font-semibold text-gray-800 tabular-nums">{formatAreaShort(totalArea)}</td>
            <td className="py-2.5 px-3 text-right text-gray-400">—</td>
            <td className="py-2.5 px-3 text-right text-sm font-semibold text-gray-800 tabular-nums">{formatEnergyShort(totalEnergy)}</td>
            <td className="py-2.5 pl-3 text-right text-sm font-semibold text-emerald-600 tabular-nums">{formatEmissionsShort(totalEmissions)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
