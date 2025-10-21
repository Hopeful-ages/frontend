'use client';

import { useState, useEffect } from 'react';
import { Dropdown } from '@/components/Dropdown';
import { CobradeDTO, CityResponseDTO } from '@/lib/types';
// import { toastError } from '@/utils/toastError';

import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import PlanCard from '@/components/PlanCard';
import { Download } from 'lucide-react';

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

  const handleSearch = async () => {
    if (!city || !cobrade) {
      // toastWarning('Por favor, selecione uma cidade e um COBRADE.');
      console.log('Por favor, selecione uma cidade e um COBRADE.');
      return;
    }

    // const handleClear = () => {
    // setCity(null);
    // setCobrade(null);
    // setPlans([]);
    // };

    if (!city) {
      // warning('Por favor, selecione uma cidade.');
      return;
    }
  };

  return (
    <main>
      <div className="container mx-auto mt-16 p-4 md:p-8">
        <h1 className="mb-6 text-3xl font-bold">Planos de Contingência</h1>

        <div className="mb-8 hidden items-center gap-4 md:flex">
          <div className="flex-1">
            <Dropdown
              border="gray"
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
          <div className="flex-1">
            <Dropdown
              border="gray"
              label="Selecionar COBRADE"
              items={cobrades.map(
                (c) => `${c.code} - ${c.subType || c.type || c.subgroup}`,
              )}
              size="large"
              fullWidth
              value={
                cobrade
                  ? `${cobrade.code} - ${cobrade.subType || cobrade.type || cobrade.subgroup}`
                  : null
              }
              onSelect={async (desc) => {
                const selectedCobrade =
                  cobrades.find(
                    (c) =>
                      `${c.code} - ${c.subType || c.type || c.subgroup}` ===
                      desc,
                  ) || null;
                setCobrade(selectedCobrade);
              }}
              useAutoComplete
            />
          </div>

          <Button
            variant={'terciary'}
            // onClick={handleClear}
          >
            Limpar Filtro
          </Button>
          <Button variant={'secondary'} onClick={handleSearch}>
            Buscar
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-4 md:hidden">
          <Button variant={'terciary'} className="flex-1">
            Filtrar
          </Button>
          <Button
            variant={'secondary'}
            onClick={handleSearch}
            className="flex-1"
          >
            Buscar
          </Button>
        </div>

        {/* Tabela para Desktop */}
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-4 font-normal">Cidade</th>
                <th className="p-4 font-normal">Cobrade</th>
                <th className="p-4 font-normal">Última Atualização</th>
                <th className="font-normals flex justify-center p-4">
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Usando os dados do PlanCard fixo como exemplo */}
              <tr className="border-b">
                <td className="p-4 font-medium">São Paulo - SP</td>
                <td className="p-4">COBRADE ABC</td>
                <td className="p-4">15/06/2024</td>
                <td className="flex justify-center p-4 text-gray-600">
                  <Download size={20} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          <PlanCard
            city="São Paulo - SP"
            category="COBRADE ABC"
            lastUpdate="2024-06-15"
          />
        </div>
      </div>
    </main>
  );
}
