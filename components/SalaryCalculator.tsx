"use client";

import React, { useMemo, useState, useEffect } from "react";

// Global imports for improved modularity
import type { CountryCode } from '@/types';
import { roles, countries, citiesByCountry, companySizes, contracts } from '@/constants/salaryData';
import { calculateSalary, formatCurrency } from '@/utils/salaryCalculations';
import { useClipboard } from '@/hooks/useClipboard';
import SelectField from '@/components/ui/SelectField';
import RangeSlider from '@/components/ui/RangeSlider';
import ButtonGroup from '@/components/ui/ButtonGroup';

export default function SalaryCalculator() {
  const [role, setRole] = useState("backend");
  const [country, setCountry] = useState<CountryCode>("DE");
  const [city, setCity] = useState(citiesByCountry["DE"][0].key);
  const [years, setYears] = useState(4);
  const [size, setSize] = useState("sme");
  const [contract, setContract] = useState("perm");
  const [remotePercent, setRemotePercent] = useState(40);

  // Use the improved clipboard hook
  const { copied, copyToClipboard, error: clipboardError } = useClipboard();

  // Keep city list in sync with chosen country
  useEffect(() => {
    if (!citiesByCountry[country].some((c) => c.key === city)) {
      setCity(citiesByCountry[country][0].key);
    }
  }, [country, city]);

  // Use the extracted calculation function
  const result = useMemo(() => {
    return calculateSalary(role, country, city, years, size, remotePercent);
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

  const handleCopySummary = async () => {
    await copyToClipboard(summaryText);
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

            {/* Screen-only interactive inputs using global components */}
            <div className="print:hidden">
              <SelectField
                label="Rolle"
                value={role}
                options={roles}
                onChange={setRole}
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Land"
                  value={country}
                  options={countries}
                  onChange={(value) => setCountry(value as CountryCode)}
                />
                <SelectField
                  label="Stadt"
                  value={city}
                  options={citiesByCountry[country]}
                  onChange={setCity}
                />
              </div>

              <RangeSlider
                label="Berufserfahrung (Jahre)"
                value={years}
                min={0}
                max={15}
                step={1}
                onChange={setYears}
              />

              <RangeSlider
                label="Remote-Anteil"
                value={remotePercent}
                min={0}
                max={100}
                step={5}
                onChange={setRemotePercent}
                displayValue={`${remotePercent}%`}
              />

              <ButtonGroup
                label="Unternehmensgröße"
                options={companySizes}
                value={size}
                onChange={setSize}
              />

              <ButtonGroup
                label="Vertragsart"
                options={contracts}
                value={contract}
                onChange={setContract}
              />

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
                onClick={handleCopySummary}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  copied 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {copied ? "✓ Kopiert!" : "In Zwischenablage kopieren"}
              </button>
              {clipboardError && (
                <span className="text-red-500 text-sm self-center">
                  Fehler beim Kopieren
                </span>
              )}
              <button
                onClick={() => {
                  // Quick print to save as PDF
                  window.print();
                }}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200"
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