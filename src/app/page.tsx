'use client';

import { useState, useEffect } from 'react';
import { Dropdown } from '@/components/Dropdown';
// import Header from '@/components/Header';
import { CobradeDTO, CityResponseDTO } from '@/lib/types';
// import { toastError } from '@/utils/toastError';

import { api } from '@/lib/api';

export default function PlanSearchPage() {
  const [cities, setCities] = useState<CityResponseDTO[]>([]);
  const [city, setCity] = useState<CityResponseDTO | null>(null);

  const [cobrade, setCobrade] = useState<CobradeDTO | null>(null);
  const [cobrades, setCobrades] = useState<CobradeDTO[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [citiesData, cobradesData] = await Promise.all([
          api.getAllCities(),
          api.getAllCobrades(),
        ]);
        setCities(citiesData);
        setCobrades(cobradesData);
      } catch (err) {
        console.error(err);
        // toastError('Erro ao carregar listas', 'Cidades ou COBRADE');
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!cobrade) {
      // warning('Por favor, selecione um COBRADE.');
      return;
    }
    if (!city) {
      // warning('Por favor, selecione uma cidade.');
      return;
    }
  };

  return (
    <main>
      {/* <Header /> */}
      <div>
        <h1>Planos de Contingência </h1>
        <Dropdown
          label="Selecione uma Cidade"
          items={cities.map((c) => `${c.name} - ${c.state}`)}
          size="large"
          fullWidth
          value={city ? `${city.name} - ${city.state}` : null}
          onSelect={(cityString) => {
            const cityName = cityString.split(' - ')[0];
            const selectedCity =
              cities.find((c) => c.name === cityName) || null;
            setCity(selectedCity);
          }}
        />
      </div>
    </main>
  );
}
