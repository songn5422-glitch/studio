"use client";

import { useContext } from 'react';
import { AppContext } from '@/context/app-context';
import type { AppContextType } from '@/lib/types';

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
