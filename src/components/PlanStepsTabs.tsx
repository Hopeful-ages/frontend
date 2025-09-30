'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

export type Step = string;

export interface PlanStepsTabsProps extends VariantProps<typeof tabClasses> {
  steps: Step[];
  currentStep: Step;
  onChange: (step: Step) => void;
}

const tabClasses = cva(
  'px-4 py-3 font-semibold transition-colors select-none text-center rounded-sm flex-1',
  {
    variants: {
      active: {
        true: 'bg-black text-white border-black',
        false: 'bg-white text-black hover:bg-gray-100',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      active: false,
      size: 'md',
    },
  },
);

export const PlanStepsTabs: React.FC<PlanStepsTabsProps> = ({
  steps,
  currentStep,
  onChange,
  size = 'md',
  ...rest
}) => {
  return (
    <div
      className="flex ml-4 mr-4 overflow-hidden rounded-md border border-gray-300"
      role="tablist"
      aria-label="Etapas do Plano"
    >
      {steps.map((step) => {
        const isActive = step === currentStep;

        return (
          <button
            key={step}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`panel-${step.replace(/\s+/g, '-')}`}
            onClick={() => onChange(step)}
            className={cn(tabClasses({ active: isActive, size }))}
            {...rest}
          >
            {step}
          </button>
        );
      })}
    </div>
  );
};

PlanStepsTabs.displayName = 'PlanStepsTabs';
