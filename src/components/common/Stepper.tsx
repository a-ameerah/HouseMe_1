import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  return (
    <div className={`w-full py-2 ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-line z-0" />
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-brand-600 transition-all duration-300 z-0"
          style={{
            width: `${(currentStep / Math.max(1, steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-brand-700 text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-brand-700 text-brand-700 shadow-sm'
                    : 'bg-white border border-line text-ink-700'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] font-semibold mt-1 max-w-[64px] text-center truncate ${
                  isCurrent ? 'text-brand-900' : 'text-ink-700'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
