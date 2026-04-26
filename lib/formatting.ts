const intlWhole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const intlOne = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const intlTwo = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatEmissions(tco2e: number): string {
  return `${intlWhole.format(Math.round(tco2e))} tCO2e/yr`;
}

export function formatEmissionsShort(tco2e: number): string {
  return intlWhole.format(Math.round(tco2e));
}

export function formatGhgPerCapita(tco2e: number): string {
  return `${intlTwo.format(tco2e)} tCO2e/person/yr`;
}

export function formatGhgPerCapitaShort(tco2e: number): string {
  return intlTwo.format(tco2e);
}

export function formatPercent(value: number): string {
  return `${intlOne.format(value)}%`;
}

export function formatArea(m2: number): string {
  return `${intlWhole.format(Math.round(m2))} m²`;
}

export function formatAreaShort(m2: number): string {
  return intlWhole.format(Math.round(m2));
}

export function formatDensity(pplPerHa: number): string {
  return `${intlOne.format(pplPerHa)} ppl/ha`;
}

export function formatEui(kwh: number): string {
  return `${intlOne.format(kwh)} kWh/m²/yr`;
}

export function formatEuiShort(kwh: number): string {
  return intlOne.format(kwh);
}

export function formatEnergy(kwh: number): string {
  return `${intlWhole.format(Math.round(kwh))} kWh/yr`;
}

export function formatEnergyShort(kwh: number): string {
  return intlWhole.format(Math.round(kwh));
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatGridFactor(factor: number): string {
  return `${factor.toFixed(3)} kgCO2e/kWh`;
}

export function formatModeShare(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function formatDistance(km: number): string {
  return `${intlOne.format(km)} km`;
}
