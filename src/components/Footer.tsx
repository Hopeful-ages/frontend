import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black px-4 py-3 text-white">
      <div className="mx-auto ml-8 max-w-7xl">
        <div className="mb-2">
          <h1 className="mb-1 text-2xl font-bold">Hopeful</h1>
          <div className="mt-2">
            <select className="rounded border border-white bg-black px-2 py-0.5 text-sm text-white">
              <option>Português</option>
              <option>English</option>
            </select>
          </div>
        </div>

        <div className="mb-1 text-xs">
          TECNOPUC | Prédio 96A | Sala 215 | Av. Ipiranga, 6681 - Partenon,
          Porto Alegre - RS, 90619-900
        </div>

        <div className="mb-1 flex flex-wrap gap-x-3 text-xs">
          <a href="#" className="hover:underline">
            Hopeful
          </a>
          <a href="#" className="hover:underline">
            Defesa Civil
          </a>
          <a href="#" className="hover:underline">
            Desastres
          </a>
          <a href="#" className="hover:underline">
            Serviços
          </a>
          <a href="#" className="hover:underline">
            Shop
          </a>
          <a href="#" className="hover:underline">
            Cursos
          </a>
          <a href="#" className="hover:underline">
            Podcasts
          </a>
          <a href="#" className="hover:underline">
            Eventos
          </a>
          <a href="#" className="hover:underline">
            Bibliotecas
          </a>
          <a href="#" className="hover:underline">
            Produtos
          </a>
          <a href="#" className="hover:underline">
            Grupos
          </a>
          <a href="#" className="hover:underline">
            Benefícios
          </a>
        </div>

        <div className="text-xs">&copy; Copyright 2025 Hopeful.</div>
      </div>
    </footer>
  );
};
