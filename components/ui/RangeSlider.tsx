// Global reusable RangeSlider component

import React from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  displayValue?: string;
  className?: string;
}

export default function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
  className = ""
}: RangeSliderProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {label}: {displayValue || value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full mb-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <style jsx>{`
        .slider {
          background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%);
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: #2563eb;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          background: #2563eb;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }
        .slider::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
