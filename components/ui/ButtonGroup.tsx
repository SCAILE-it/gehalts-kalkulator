// Global reusable ButtonGroup component

import React from 'react';

interface Option {
  key: string;
  label: string;
}

interface ButtonGroupProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ButtonGroup({
  label,
  options,
  value,
  onChange,
  className = ""
}: ButtonGroupProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2 mb-4 flex-wrap">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
              value === option.key
                ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105"
                : "bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
