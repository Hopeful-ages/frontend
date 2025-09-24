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
  'px-4 py-3 font-semibold transition-colors select-none whitespace-nowrap', // fonte mais forte + padding maior
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
      className="flex overflow-hidden rounded-md border border-gray-300" // rounded-md para ficar mais parecido
      role="tablist"
      aria-label="Etapas do Plano"
    >
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isFirst = index === 0;

        const borderClass = !isFirst ? 'border-l border-gray-300' : '';

        return (
          <button
            key={step}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`panel-${step.replace(/\s+/g, '-')}`}
            onClick={() => onChange(step)}
            className={cn(tabClasses({ active: isActive, size }), borderClass)}
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
