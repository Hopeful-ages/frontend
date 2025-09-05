'use client';

import Loading from '@/app/components/Loading';
import { AnimatePresence } from 'framer-motion';
import { createContext, ReactNode, useContext, useState } from 'react';

interface LoadingContextType {
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string>('Carregando...');

  const showLoading = (newText?: string) => {
    if (newText) setText(newText);
    setLoading(true);
  };

  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <AnimatePresence>{loading && <Loading text={text} />}</AnimatePresence>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
