'use client';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';

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
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: 'white' | 'gray' | 'surface';
  border?: BorderType;
  roundedBorder?: 'md' | 'lg' | 'full';
  fullWidth?: boolean;
  maxItemsVisible?: number;
  value?: string | null;
  useAutoComplete?: boolean;
};

const rowHeights = { small: 32, medium: 40, large: 44, long: 40 } as const;
const chevronBySize = { small: 16, medium: 18, large: 20, long: 18 } as const;

const buttonClasses = cva(
  'flex items-center gap-2 cursor-pointer text-left whitespace-nowrap select-none hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300',
  {
    variants: {
      size: {
        small: 'h-8 px-3 w-26 md:w-28 lg:w-30',
        medium: 'h-10 px-4 w-40 md:w-50 lg:w-62',
        large: 'h-11 px-5 w-52 md:w-60 lg:w-72',
        long: 'h-10 px-4 w-64 md:w-80 lg:w-96',
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
      radius: { md: 'rounded-md', lg: 'rounded-xl', full: 'rounded-full' },
      width: { auto: '', full: '!w-full' },
      textSize: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
    },
    defaultVariants: {
      size: 'medium',
      bgColor: 'white',
      border: 'black',
      radius: 'md',
      width: 'auto',
      textSize: 'md',
    },
  },
);

const menuClasses = cva(
  'absolute left-0 right-0 z-20 mt-1 w-full overflow-y-auto overscroll-contain rounded-md shadow-lg',
  {
    variants: {
      bgColor: {
        white: 'bg-white',
        gray: 'bg-gray-200',
        surface: 'bg-background',
      },
      border: {
        none: 'border-0',
        gray: 'border border-gray-400',
        blue: 'border border-blue-500',
        black: 'border border-black',
      },
    },
    defaultVariants: { bgColor: 'white', border: 'black' },
  },
);

const itemClasses = cva(
  'w-full text-left px-4 rounded-none first:rounded-t-md last:rounded-b-md transition-colors focus:outline-none ring-inset focus-visible:ring-1',
  {
    variants: {
      size: {
        small: 'py-2',
        medium: 'py-2.5',
        large: 'py-3',
        long: 'py-2.5',
      },
      selected: {
        true: 'text-gray-400',
        false: 'text-gray-400',
      },
      tone: {
        white: 'bg-white hover:bg-gray-100',
        gray: 'bg-gray-200 hover:bg-gray-300',
        surface: 'bg-background hover:bg-foreground/10',
      },
      ringTone: {
        none: 'focus-visible:ring-0',
        gray: 'focus-visible:ring-gray-400',
        blue: 'focus-visible:ring-blue-500',
        black: 'focus-visible:ring-black',
      },
      textSize: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
    },
    defaultVariants: {
      size: 'medium',
      selected: false,
      tone: 'white',
      ringTone: 'gray',
      textSize: 'md',
    },
  },
);

export const Dropdown: React.FC<dropdownProps> = ({
  label,
  items,
  onSelect,
  size = 'medium',
  icon,
  textColor = 'black',
  textSize = 'md',
  bgColor = 'white',
  border = 'black',
  roundedBorder = 'md',
  fullWidth = false,
  maxItemsVisible = 4,
  value,
  useAutoComplete = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const triggerId = useId();
  const menuId = `${triggerId}-menu`;

  useEffect(() => {
    if (typeof value !== 'undefined') {
      setSelected(value ?? null);
      if (useAutoComplete) setFilterText(value ?? '');
    }
  }, [value, useAutoComplete]);

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
    if (useAutoComplete) setFilterText(val);
  };

  const maxH = `${rowHeights[size] * maxItemsVisible}px`;
  const toneByText = {
    black: 'text-black',
    gray: 'text-gray-400',
    foreground: 'text-foreground',
  } as const;

  const tone = toneByText[textColor];

  const filteredItems = useAutoComplete
    ? items.filter((it) => it.toLowerCase().includes(filterText.toLowerCase()))
    : items;

  return (
    <div
      ref={ref}
      className={cn('relative inline-block', fullWidth && 'w-full')}
    >
      {useAutoComplete ? (
        <div
          id={triggerId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={menuId}
          className={buttonClasses({
            size,
            bgColor,
            border,
            radius: roundedBorder,
            width: fullWidth ? 'full' : 'auto',
            textSize,
          })}
          onClick={() => setOpen((o) => !o)}
        >
          {icon && <span className={cn('shrink-0', tone)}>{icon}</span>}
          <input
            type="text"
            value={filterText}
            placeholder={selected ?? label}
            onChange={(e) => {
              setFilterText(e.target.value);
              setOpen(true);
            }}
            className={cn(
              'min-w-0 flex-1 truncate bg-transparent outline-none',
              selected ? 'text-black' : tone,
            )}
          />
          <ChevronDown
            size={chevronBySize[size]}
            className={cn(
              'ml-auto shrink-0 transition-transform duration-200',
              open ? 'rotate-180' : 'rotate-0',
              tone,
            )}
          />
        </div>
      ) : (
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
            radius: roundedBorder,
            width: fullWidth ? 'full' : 'auto',
            textSize,
          })}
        >
          {icon && <span className={cn('shrink-0', tone)}>{icon}</span>}

          <span
            className={cn(
              'min-w-0 flex-1 truncate',
              selected ? 'text-black' : tone,
            )}
          >
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
      )}

      {open && (
        <ul
          id={menuId}
          role="listbox"
          aria-labelledby={triggerId}
          className={menuClasses({ bgColor, border })}
          style={{ maxHeight: `${maxH}` }}
        >
          {filteredItems.length === 0 ? (
            <li className="px-4 py-2 text-gray-400 select-none">
              Sem resultados
            </li>
          ) : (
            filteredItems.map((item, i) => {
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
                      tone: bgColor,
                      ringTone: border,
                      textSize,
                    })}
                  >
                    {item}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};
