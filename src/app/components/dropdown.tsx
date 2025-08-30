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
};

const sizeClasses = {
  small:
    'text-xs px-2 py-1 md:text-sm md:px-2 md:py-1 lg:text-base lg:px-4 lg:py-2 lg:pl-1',
  medium:
    'text-sm px-4 py-2 md:text-base md:px-4 md:py-2 lg:text-lg lg:px-6 lg:py-2 lg:pl-2',
  large:
    'text-base px-4 py-2 md:text-xl md:px-6 md:py-3 lg:text-2xl lg:px-10 lg:py-3 lg:pl-1',
  long: 'text-sm px-4 py-2 md:text-base md:px-4 md:py-2 lg:text-lg lg:px-4 lg:py-2 lg:pl-2',
};

const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  long: 20,
};

const textColorClasses = {
  black: 'text-black',
  gray: 'text-gray-500',
};

const bgColorClasses = {
  white: 'bg-white',
  gray: 'bg-gray-200',
};

const borderClasses = {
  none: 'border-none',
  gray: 'border border-gray-300',
  blue: 'border border-blue-500',
  black: 'border border-black',
};

const roundedBorderClasses = {
  true: 'rounded-full',
  false: 'rounded-md',
};

const AlignClasses = {
  small: 'ml-2',
  medium: 'ml-4',
  large: 'ml-2',
  long: 'ml-45',
};

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
}) => {
  const [open, setOpen] = useState(false);
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const iconSize = iconSizes[size];

  const colorText = textColorClasses[textColor];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className={`${colorText} ${bgColorClasses[bgColor]} ${borderClasses[border]} flex cursor-pointer items-center justify-start gap-2 pl-0 text-left whitespace-nowrap hover:bg-blue-100 ${sizeClasses[size]} ${roundedBorderClasses[String(roundedBorder) as 'true' | 'false']}`}
      >
        {icon && <span className="text-base md:text-lg">{icon}</span>}
        <span className="text-base md:text-lg lg:text-2xl">{label}</span>

        <ChevronDown
          size={iconSize}
          className={`${AlignClasses[size]} shrink-0 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'} ${colorText} text-base md:text-lg lg:text-2xl`}
        />
      </button>
      {open && (
        <div className="absolute w-full rounded-md bg-white shadow-lg">
          {items.map((item) => (
            <a
              key={item}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className={`block cursor-pointer px-4 py-2 text-base text-gray-500 hover:bg-gray-100 md:px-6 md:text-lg lg:text-2xl ${sizeClasses[size]}`}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
