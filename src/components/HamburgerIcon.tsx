'use client';

type HamburgerIconProps = {
  onClick: () => void;
};

export function HamburgerIcon({ onClick }: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-y-1.5 rounded-md p-2 transition hover:bg-gray-100 md:hidden"
      aria-label="Abrir menu"
    >
      <span className="block h-0.5 w-6 bg-white"></span>
      <span className="block h-0.5 w-6 bg-white"></span>
      <span className="block h-0.5 w-6 bg-white"></span>
    </button>
  );
}
