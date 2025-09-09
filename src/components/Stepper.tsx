import React from "react";

interface StepperProps {
  steps: string[];
  current: number;
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300
              ${i < current ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg' :
                i === current ? 'bg-white border-blue-600 text-blue-700 scale-110 shadow' :
                'bg-white border-blue-200 text-blue-300'}
            `}
          >
            <span className="font-bold text-lg">{i + 1}</span>
          </div>
          <span className={`text-sm font-medium ${i === current ? 'text-blue-700' : 'text-blue-300'}`}>{step}</span>
          {i < steps.length - 1 && (
            <span className="w-8 h-1 bg-gradient-to-r from-blue-200 to-blue-600 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}
