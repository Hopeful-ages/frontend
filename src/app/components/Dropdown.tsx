'use client';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';

function cn(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(' ');
}

type BorderType = 'none' | 'gray' | 'blue' | 'black';

type dropdownProps = {
  label: string;
  items: string[];
  onSelect: (item: string) => void;
  size?: 'small' | 'medium' | 'large' | 'long';
  icon?: React.ReactNode;
  textColor?: 'black' | 'gray' | 'foreground';
  bgColor?: 'white' | 'gray' | 'surface';
  border?: BorderType;
  roundedBorder?: boolean;
  fullWidth?: boolean;
  maxItemsVisible?: number;
};

const rowHeights = { small: 32, medium: 40, large: 44, long: 40 } as const;
const chevronBySize = { small: 16, medium: 18, large: 20, long: 18 } as const;

const buttonClasses = cva(
  'flex items-center gap-2 cursor-pointer text-left whitespace-nowrap select-none hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400',
  {
    variants: {
      size: {
        small: 'h-8 text-sm px-3 w-28 md:w-32 lg:w-36',
        medium: 'h-10 text-base px-4 w-36 md:w-44 lg:w-56',
        large: 'h-11 text-lg px-5 w-48 md:w-60 lg:w-72',
        long: 'h-10 text-base px-4 w-64 md:w-80 lg:w-96',
      },
      bgColor: {
        white: 'bg-white',
        gray: 'bg-gray-200',
        surface: 'bg-background',
      },
      border: {
        none: 'border-none',
        gray: 'border border-gray-400',
        blue: 'border border-blue-500',
        black: 'border border-black',
      },
      radius: { md: 'rounded-md', full: 'rounded-full' },
      width: { auto: '', full: 'w-full' },
    },
    defaultVariants: {
      size: 'medium',
      bgColor: 'white',
      border: 'black',
      radius: 'md',
      width: 'auto',
    },
  },
);

const menuClasses = cva(
  'absolute left-0 right-0 z-20 mt-1 w-full overflow-y-auto overscroll-contain rounded-md border border-gray-400 bg-white shadow-lg',
);

const itemClasses = cva('w-full text-left px-4 hover:bg-gray-100', {
  variants: {
    size: {
      small: 'py-2 text-xs md:text-sm',
      medium: 'py-2.5 text-sm md:text-base',
      large: 'py-3 text-base',
      long: 'py-2.5 text-sm md:text-base',
    },
    selected: {
      true: 'font-medium text-gray-400',
      false: 'text-gray-400',
    },
  },
  defaultVariants: { size: 'medium', selected: false },
});

export const Dropdown: React.FC<dropdownProps> = ({
  label,
  items,
  onSelect,
  size = 'medium',
  icon,
  textColor = 'black',
  bgColor = 'white',
  border = 'black',
  roundedBorder = false,
  fullWidth = false,
  maxItemsVisible = 4,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const triggerId = useId();
  const menuId = `${triggerId}-menu`;

  useEffect(() => {
    const out = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', out);
    return () => document.removeEventListener('mousedown', out);
  }, []);

  const pick = (val: string) => {
    setSelected(val || null);
    onSelect(val);
    setOpen(false);
  };

  const maxH = `${rowHeights[size] * maxItemsVisible}px`;
  const toneByText = {
    black: 'text-black',
    gray: 'text-gray-400',
    foreground: 'text-foreground',
  } as const;

  const tone = toneByText[textColor];

  return (
    <div
      ref={ref}
      className={cn('relative inline-block', fullWidth && 'w-full')}
    >
      <button
        id={triggerId}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        className={buttonClasses({
          size,
          bgColor,
          border,
          radius: roundedBorder ? 'full' : 'md',
          width: fullWidth ? 'full' : 'auto',
        })}
      >
        {icon && <span className={cn('shrink-0', tone)}>{icon}</span>}

        <span className={cn('min-w-0 flex-1 truncate', tone)}>
          {selected ?? label}
        </span>

        <ChevronDown
          size={chevronBySize[size]}
          className={cn(
            'ml-auto shrink-0 transition-transform duration-200',
            open ? 'rotate-180' : 'rotate-0',
            tone,
          )}
        />
      </button>

      {open && (
        <ul
          id={menuId}
          role="listbox"
          aria-labelledby={triggerId}
          className={menuClasses()}
          style={{ maxHeight: maxH }}
        >
          {items.map((item, i) => {
            const isSelected = selected === item;
            const optionId = `${menuId}-option-${i}`;
            return (
              <li
                key={optionId}
                role="option"
                aria-selected={isSelected}
                id={optionId}
              >
                <button
                  type="button"
                  onClick={() => pick(item)}
                  className={itemClasses({
                    size,
                    selected: isSelected ? true : false,
                  })}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
