'use client';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type BorderType = keyof typeof borderClasses;

type dropdownProps = {
  label: string;
  items: string[];
  onSelect: (item: string) => void;
  size?: 'small' | 'medium' | 'large' | 'long';
  icon?: React.ReactNode;
  textColor?: 'black' | 'gray';
  bgColor?: 'white' | 'gray';
  border?: BorderType;
  roundedBorder?: boolean;
  fullWidth?: boolean;
  maxItemsVisible?: number;
  useAutoComplete?: boolean;
};

const sizeStyles = {
  small: {
    btn: 'h-8 text-sm px-3 w-28 md:w-32 lg:w-36',
    item: 'py-2 text-xs md:text-sm',
    icon: 16,
  },
  medium: {
    btn: 'h-10 text-base px-4 w-36 md:w-44 lg:w-56',
    item: 'py-2.5 text-sm md:text-base',
    icon: 18,
  },
  large: {
    btn: 'h-11 text-lg px-5 w-48 md:w-60 lg:w-72',
    item: 'py-3 text-base',
    icon: 20,
  },
  long: {
    btn: 'h-10 text-base px-4 w-64 md:w-80 lg:w-96',
    item: 'py-2.5 text-sm md:text-base',
    icon: 18,
  },
};

const rowHeights = { small: 32, medium: 40, large: 44, long: 40 } as const;

const textColorClasses = { black: 'text-black', gray: 'text-gray-500' };
const bgColorClasses = { white: 'bg-white', gray: 'bg-gray-200' };
const borderClasses = {
  none: 'border-none',
  gray: 'border border-gray-300',
  blue: 'border border-blue-500',
  black: 'border border-black',
};
const roundedBorderClasses = { true: 'rounded-full', false: 'rounded-md' };

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
  useAutoComplete = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { btn, item, icon: chevronSize } = sizeStyles[size];
  const colorText = textColorClasses[textColor];
  const maxH = `${rowHeights[size] * maxItemsVisible}px`;

  const pick = (val: string) => {
    setSelected(val || null);
    onSelect(val);
    setOpen(false);
    if (useAutoComplete) setFilterText(val);
  };

  const filteredItems = useAutoComplete
    ? items.filter((it) => it.toLowerCase().includes(filterText.toLowerCase()))
    : items;

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${fullWidth ? 'w-full' : ''}`}
    >
      {useAutoComplete ? (
        <div
          className={[
            'flex items-center gap-2',
            bgColorClasses[bgColor],
            borderClasses[border],
            roundedBorderClasses[String(roundedBorder) as 'true' | 'false'],
            colorText,
            btn,
            fullWidth ? 'w-full' : '',
            'focus-within:ring-2 focus-within:ring-blue-400 hover:bg-blue-50',
          ].join(' ')}
          onClick={() => setOpen((prev) => !prev)}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <input
            type="text"
            value={filterText}
            placeholder={selected ?? label}
            onChange={(e) => {
              setFilterText(e.target.value);
              setOpen(true);
            }}
            className="min-w-0 flex-grow bg-transparent placeholder-gray-500 outline-none"
          />
          <ChevronDown
            size={chevronSize}
            className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={[
            'flex cursor-pointer items-center gap-2 text-left whitespace-nowrap select-none',
            bgColorClasses[bgColor],
            borderClasses[border],
            roundedBorderClasses[String(roundedBorder) as 'true' | 'false'],
            colorText,
            btn,
            fullWidth ? 'w-full' : '',
            'hover:bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none',
          ].join(' ')}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <span
            className={`min-w-0 flex-1 truncate ${selected ? 'text-black' : 'text-gray-500'}`}
          >
            {selected ?? label}
          </span>
          <ChevronDown
            size={chevronSize}
            className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
      )}

      {open && (
        <div
          style={{ maxHeight: maxH }}
          className="absolute right-0 left-0 z-20 mt-1 w-full overflow-y-auto overscroll-contain rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {filteredItems.length === 0 ? (
            <div className={`px-4 ${item} text-gray-400 select-none`}>
              Sem resultados
            </div>
          ) : (
            filteredItems.map((itemText) => (
              <button
                type="button"
                key={itemText}
                onClick={() => pick(itemText)}
                className={`block w-full cursor-pointer px-4 text-left ${item} ${
                  selected === itemText
                    ? 'font-medium text-gray-500'
                    : 'text-gray-500'
                } hover:bg-gray-100`}
              >
                {itemText}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
