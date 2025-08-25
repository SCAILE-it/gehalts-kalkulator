"use client";

import React, { useMemo, useState, useEffect } from "react";

// Single-file React component (Tailwind CSS for styling)
// Designed for fast embedding on a landing page.
// Assumptions: ballpark Benchmarks for DACH tech roles (2025-ish, illustrative only).

const roles = [
  { key: "backend", label: "Backend-Entwickler:in" },
  { key: "frontend", label: "Frontend-Entwickler:in" },
  { key: "fullstack", label: "Full-Stack" },
  { key: "devops", label: "DevOps / SRE" },
  { key: "data", label: "Data (Engineer/Scientist)" },
];

const countries = [
  { key: "DE", label: "Deutschland" },
  { key: "AT", label: "Österreich" },
  { key: "CH", label: "Schweiz" },
];

const citiesByCountry: Record<string, { key: string; label: string }[]> = {
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

const companySizes = [
  { key: "startup", label: "Startup" },
  { key: "sme", label: "Mittelstand/Scale-up" },
  { key: "enterprise", label: "Konzern" },
];

const contracts = [
  { key: "perm", label: "Festanstellung" },
  { key: "contractor", label: "Freelance / Contract" },
];

// Base medians for DE in EUR (illustrative):
const baseDE: Record<string, Record<string, number>> = {
  backend: { junior: 45000, mid: 60000, senior: 75000, lead: 90000 },
  frontend: { junior: 42000, mid: 58000, senior: 72000, lead: 85000 },
  fullstack: { junior: 46000, mid: 62000, senior: 78000, lead: 92000 },
  devops: { junior: 50000, mid: 70000, senior: 85000, lead: 100000 },
  data: { junior: 48000, mid: 68000, senior: 82000, lead: 95000 },
};

// Country multipliers vs. DE baseline
const countryMultipliers: Record<string, number> = {
  DE: 1,
  AT: 0.95, // leicht darunter
  CH: 1.9, // CHF-Niveau (wird unten in CHF formatiert)
};

// City multipliers by country
const cityMultipliers: Record<string, Record<string, number>> = {
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
const sizeMultipliers: Record<string, number> = {
  startup: 0.95,
  sme: 1.0,
  enterprise: 1.08,
};

function yearsToLevel(years: number) {
  if (years <= 1) return "junior";
  if (years <= 4) return "mid";
  if (years <= 8) return "senior";
  return "lead";
}

function formatCurrency(v: number, country: string) {
  const currency = country === "CH" ? "CHF" : "EUR";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(v);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SalaryCalculator() {
  const [role, setRole] = useState("backend");
  const [country, setCountry] = useState("DE");
  const [city, setCity] = useState(citiesByCountry["DE"][0].key);
  const [years, setYears] = useState(4);
  const [size, setSize] = useState("sme");
  const [contract, setContract] = useState("perm");
  const [remotePercent, setRemotePercent] = useState(40);

  // Keep city list in sync with chosen country
  useEffect(() => {
    if (!citiesByCountry[country].some((c) => c.key === city)) {
      setCity(citiesByCountry[country][0].key);
    }
  }, [country, city]);

  const result = useMemo(() => {
    const level = yearsToLevel(years);
    const base = baseDE[role][level];

    const cMult = countryMultipliers[country] ?? 1;
    const cityMult = cityMultipliers[country]?.[city] ?? 1;
    const sizeMult = sizeMultipliers[size] ?? 1;

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
  }, [role, country, city, years, size, remotePercent]);

  const summaryText = useMemo(() => {
    const cityLabel = citiesByCountry[country].find((c) => c.key === city)?.label;
    const countryLabel = countries.find((c) => c.key === country)?.label;
    const roleLabel = roles.find((r) => r.key === role)?.label;
    const sizeLabel = companySizes.find((s) => s.key === size)?.label;

    const lines = [
      `Rolle: ${roleLabel}`,
      `Level: ${result.level.toUpperCase()}`,
      `Standort: ${cityLabel}, ${countryLabel}`,
      `Remote: ${remotePercent}%`,
      `Unternehmensgröße: ${sizeLabel}`,
      contract === "perm"
        ? `Zielgehalt (Median): ${formatCurrency(result.median, country)} (Range: ${formatCurrency(
            result.p25,
            country
          )} – ${formatCurrency(result.p75, country)})`
        : `Ziel-Tagessatz: ${formatCurrency(result.dayRate, country)} (entspricht Median Gehalt: ${formatCurrency(
            result.median,
            country
          )})`,
    ];
    return lines.join("\n");
  }, [result, country, city, role, size, remotePercent, contract]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {}
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 print-container">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6 print-header">
          <h1 className="text-2xl md:text-3xl font-bold">Gehaltskalkulator (DACH · Tech)</h1>
          <p className="text-sm text-gray-600 mt-1">
            Schnelle Orientierung für Angebote & Erwartungen. Werte sind Richtwerte und ersetzen keine individuelle
            Marktanalyse.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4 print-single-column">
          <div className="bg-white rounded-2xl shadow p-4 md:p-6 print-inputs">
            <h3 className="font-semibold mb-4">Eingaben</h3>
            
            {/* Print-only input summary table */}
            <div className="hidden print:block">
              <table className="print-input-table">
                <tbody>
                  <tr>
                    <td>Rolle:</td>
                    <td>{roles.find((r) => r.key === role)?.label}</td>
                  </tr>
                  <tr>
                    <td>Land:</td>
                    <td>{countries.find((c) => c.key === country)?.label}</td>
                  </tr>
                  <tr>
                    <td>Stadt:</td>
                    <td>{citiesByCountry[country].find((c) => c.key === city)?.label}</td>
                  </tr>
                  <tr>
                    <td>Berufserfahrung:</td>
                    <td>{years} Jahre ({result.level.toUpperCase()})</td>
                  </tr>
                  <tr>
                    <td>Remote-Anteil:</td>
                    <td>{remotePercent}%</td>
                  </tr>
                  <tr>
                    <td>Unternehmensgröße:</td>
                    <td>{companySizes.find((s) => s.key === size)?.label}</td>
                  </tr>
                  <tr>
                    <td>Vertragsart:</td>
                    <td>{contracts.find((c) => c.key === contract)?.label}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Screen-only interactive inputs */}
            <div className="print:hidden">
              <label className="block text-sm font-medium mb-1">Rolle</label>
            <select
              className="w-full mb-3 rounded-xl border border-gray-300 p-2 focus:outline-none focus:ring"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Land</label>
                <select
                  className="w-full mb-3 rounded-xl border border-gray-300 p-2 focus:outline-none focus:ring"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countries.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stadt</label>
                <select
                  className="w-full mb-3 rounded-xl border border-gray-300 p-2 focus:outline-none focus:ring"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {citiesByCountry[country].map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="block text-sm font-medium mb-1">Berufserfahrung (Jahre): {years}</label>
            <input
              type="range"
              min={0}
              max={15}
              step={1}
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-full mb-3"
            />

            <label className="block text-sm font-medium mb-1">Remote-Anteil: {remotePercent}%</label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={remotePercent}
              onChange={(e) => setRemotePercent(parseInt(e.target.value))}
              className="w-full mb-3"
            />

            <label className="block text-sm font-medium mb-1">Unternehmensgröße</label>
            <div className="flex gap-2 mb-4 flex-wrap">
              {companySizes.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSize(s.key)}
                  className={
                    "px-3 py-2 rounded-xl border " +
                    (size === s.key
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-800 border-gray-300")
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium mb-1">Vertragsart</label>
            <div className="flex gap-2 mb-2">
              {contracts.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setContract(c.key)}
                  className={
                    "px-3 py-2 rounded-xl border " +
                    (contract === c.key
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-800 border-gray-300")
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500">Hinweis: Freelance-Berechnung basiert auf grober Umrechnung (220 AT/Jahr, Faktor 1.45).</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col justify-between print-results">
            <div>
              <h2 className="font-semibold mb-4">Ergebnis</h2>
              {contract === "perm" ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 print-salary-label">Zielgehalt (Brutto/Jahr)</div>
                  <div className="text-3xl font-bold print-salary-main">
                    <div className="print-salary-amount">{formatCurrency(result.median, country)}</div>
                  </div>
                  <div className="text-sm text-gray-600 print-salary-label">Orientierungsbereich (25.–75. Perzentil)</div>
                  <div className="text-lg font-medium print-salary-range">
                    {formatCurrency(result.p25, country)} – {formatCurrency(result.p75, country)}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 print-salary-label">Ziel-Tagessatz (Freelance)</div>
                  <div className="text-3xl font-bold print-salary-main">
                    <div className="print-salary-amount">{formatCurrency(result.dayRate, country)}</div>
                  </div>
                  <div className="text-sm text-gray-600 print-salary-label">(entspricht Median-Festanstellung: {formatCurrency(result.median, country)})</div>
                </div>
              )}

              <div className="mt-6 print-summary">
                <h3 className="font-semibold mb-2">Zusammenfassung</h3>
                <pre className="bg-gray-100 rounded-xl p-3 text-sm whitespace-pre-wrap print-summary-content">{summaryText}</pre>
              </div>
            </div>

            <div className="mt-6 flex gap-2 no-print">
              <button
                onClick={copySummary}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90"
              >
                In Zwischenablage kopieren
              </button>
              <button
                onClick={() => {
                  // Quick print to save as PDF
                  window.print();
                }}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
              >
                Als PDF drucken
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-6 text-xs text-gray-500 print-footer">
          © {new Date().getFullYear()} Nova Search · Richtwerte ohne Gewähr. Für exakte Benchmarks: Marktanalyse & Kandidaten-/Kundeninterviews.
        </footer>
      </div>
    </div>
  );
}