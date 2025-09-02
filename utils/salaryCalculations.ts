// Global utility functions for salary calculations

import type { ExperienceLevel, CountryCode, CalculationResult } from '@/types';
import { baseDE, countryMultipliers, cityMultipliers, sizeMultipliers } from '@/constants/salaryData';

export function yearsToLevel(years: number): ExperienceLevel {
  if (years <= 1) return "junior";
  if (years <= 4) return "mid";
  if (years <= 8) return "senior";
  return "lead";
}

export function formatCurrency(value: number, country: CountryCode): string {
  const currency = country === "CH" ? "CHF" : "EUR";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function calculateSalary(
  role: string,
  country: CountryCode,
  city: string,
  years: number,
  size: string,
  remotePercent: number
): CalculationResult {
  const level = yearsToLevel(years);
  const base = baseDE[role as keyof typeof baseDE]?.[level] ?? 50000;

  const cMult = countryMultipliers[country] ?? 1;
  const cityMult = cityMultipliers[country]?.[city] ?? 1;
  const sizeMult = sizeMultipliers[size as keyof typeof sizeMultipliers] ?? 1;

  // Remote adjustment: heavy remote can soften extremes a bit
  const remoteAdj = 1 - (remotePercent / 100) * 0.03; // up to -3%

  const median = base * cMult * cityMult * sizeMult * remoteAdj;

  // Provide a sensible range around the median
  const p25 = median * 0.9;
  const p75 = median * 1.12; // leicht asymmetrisch nach oben

  // Contractor day rate (rough conversion)
  const dayRate = (median * 1.45) / 220; // 220 Arbeitstage

  return {
    level,
    median,
    p25,
    p75,
    dayRate,
  };
}
