'use client';

import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import { ReactNode } from 'react';

export function ApiErrorHandler({ children }: { children: ReactNode }) {
  useApiErrorHandler();
  return <>{children}</>;
}
