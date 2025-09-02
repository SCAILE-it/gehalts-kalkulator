// Global salary calculation constants and data

import type { Role, Country, City, CompanySize, Contract, SalaryData, CountryCode, RoleKey, CompanySizeKey } from '@/types';

export const roles: Role[] = [
  { key: "backend", label: "Backend-Entwickler:in" },
  { key: "frontend", label: "Frontend-Entwickler:in" },
  { key: "fullstack", label: "Full-Stack" },
  { key: "devops", label: "DevOps / SRE" },
  { key: "data", label: "Data (Engineer/Scientist)" },
  { key: "java", label: "Java-Entwickler:in" },
];

export const countries: Country[] = [
  { key: "DE", label: "Deutschland" },
  { key: "AT", label: "Österreich" },
  { key: "CH", label: "Schweiz" },
];

export const citiesByCountry: Record<CountryCode, City[]> = {
  DE: [
    { key: "berlin", label: "Berlin" },
    { key: "munich", label: "München" },
    { key: "hamburg", label: "Hamburg" },
    { key: "frankfurt", label: "Frankfurt" },
    { key: "cologne", label: "Köln" },
    { key: "remote", label: "Remote (DE)" },
  ],
  AT: [
    { key: "vienna", label: "Wien" },
    { key: "linz", label: "Linz" },
    { key: "graz", label: "Graz" },
    { key: "remote", label: "Remote (AT)" },
  ],
  CH: [
    { key: "zurich", label: "Zürich" },
    { key: "geneva", label: "Genf" },
    { key: "basel", label: "Basel" },
    { key: "bern", label: "Bern" },
    { key: "remote", label: "Remote (CH)" },
  ],
};

export const companySizes: CompanySize[] = [
  { key: "startup", label: "Startup" },
  { key: "sme", label: "Mittelstand/Scale-up" },
  { key: "enterprise", label: "Konzern" },
];

export const contracts: Contract[] = [
  { key: "perm", label: "Festanstellung" },
  { key: "contractor", label: "Freelance / Contract" },
];

// Base medians for DE in EUR (illustrative):
export const baseDE: Record<RoleKey, SalaryData> = {
  backend: { junior: 45000, mid: 60000, senior: 75000, lead: 90000 },
  frontend: { junior: 42000, mid: 58000, senior: 72000, lead: 85000 },
  fullstack: { junior: 46000, mid: 62000, senior: 78000, lead: 92000 },
  devops: { junior: 50000, mid: 70000, senior: 85000, lead: 100000 },
  data: { junior: 48000, mid: 68000, senior: 82000, lead: 95000 },
  java: { junior: 52500, mid: 67500, senior: 82500, lead: 100000 }, // Data from Melina (co-founder NS)
};

// Country multipliers vs. DE baseline
export const countryMultipliers: Record<CountryCode, number> = {
  DE: 1,
  AT: 0.95, // leicht darunter
  CH: 1.9, // CHF-Niveau (wird unten in CHF formatiert)
};

// City multipliers by country
export const cityMultipliers: Record<CountryCode, Record<string, number>> = {
  DE: {
    berlin: 0.95,
    munich: 1.15,
    hamburg: 1.05,
    frankfurt: 1.1,
    cologne: 1.0,
    remote: 1.0,
  },
  AT: {
    vienna: 1.05,
    linz: 0.95,
    graz: 0.9,
    remote: 1.0,
  },
  CH: {
    zurich: 1.1,
    geneva: 1.08,
    basel: 1.05,
    bern: 1.0,
    remote: 1.0,
  },
};

// Company size multipliers
export const sizeMultipliers: Record<CompanySizeKey, number> = {
  startup: 0.95,
  sme: 1.0,
  enterprise: 1.08,
};
