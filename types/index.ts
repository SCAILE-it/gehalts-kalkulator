// Global TypeScript types for the salary calculator

export interface Role {
  key: string;
  label: string;
}

export interface Country {
  key: string;
  label: string;
}

export interface City {
  key: string;
  label: string;
}

export interface CompanySize {
  key: string;
  label: string;
}

export interface Contract {
  key: string;
  label: string;
}

export interface SalaryData {
  junior: number;
  mid: number;
  senior: number;
  lead: number;
}

export interface CalculationResult {
  level: string;
  median: number;
  p25: number;
  p75: number;
  dayRate: number;
}

export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';
export type CountryCode = 'DE' | 'AT' | 'CH';
export type RoleKey = 'backend' | 'frontend' | 'fullstack' | 'devops' | 'data';
export type CompanySizeKey = 'startup' | 'sme' | 'enterprise';
export type ContractKey = 'perm' | 'contractor';
