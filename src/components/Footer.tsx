import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-black px-4 py-1 text-white">
      <div className="mx-auto ml-0 max-w-7xl md:ml-8">
        <div>
          <a
            className="inline-flex cursor-pointer items-center text-base font-bold transition-opacity hover:opacity-80"
            href="https://www.hopeful.pro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hopeful
          </a>
        </div>
        <div className="text-xs">
          TECNOPUC | Prédio 96A | Sala 215 | Av. Ipiranga, 6681 - Partenon,
          Porto Alegre - RS, 90619-900
        </div>
        <div className="text-xs">&copy; Copyright 2025 Hopeful.</div>
      </div>
    </footer>
  );
};
