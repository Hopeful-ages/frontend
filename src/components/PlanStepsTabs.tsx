'use client';
import React, { useState } from 'react';

const steps = ["antes", "durante", "depois"];

export const StepSelector: React.FC = () => {
  const [currentStep, setCurrentStep] = useState("antes");

  const handleChangeStep = (step: string) => {
    if (steps.includes(step)) {
      setCurrentStep(step);
    } else {
      //alert("Etapa inválida!");
      // add opcao com outra legenda 
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Etapas do plano:</h2>
      <ul className="space-y-1">
        {steps.map((step) => (
          <li key={step}>
            <button
              className={`px-3 py-1 rounded ${
                step === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleChangeStep(step)}
            >
              {step} {step === currentStep && "(ativo)"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
