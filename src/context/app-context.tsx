"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { AppState, AppContextType, Transaction, VaultEntry } from '@/lib/types';
import { MOCK_DATA } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'smartguard_app_state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(MOCK_DATA);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        // Deep merge to ensure new mock data fields are included
        setState(prevState => ({
          ...prevState,
          ...parsedState,
          user: {...prevState.user, ...parsedState.user},
          settings: {...prevState.settings, ...parsedState.settings},
        }));
      }
    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [state, isInitialized]);
  
  useEffect(() => {
    if (isInitialized && !state.user.onboardingCompleted) {
        router.push('/onboarding');
    }
  }, [isInitialized, state.user.onboardingCompleted, router]);

  const connectWallet = () => {
    setState(prevState => ({
      ...prevState,
      user: { ...prevState.user, walletAddress: "0x742d...EbEb" }
    }));
    toast({
      title: "Wallet Connected",
      description: "Successfully connected to mock wallet.",
    });
  };

  const disconnectWallet = () => {
    setState(prevState => ({
      ...prevState,
      user: { ...prevState.user, walletAddress: null }
    }));
    toast({
      title: "Wallet Disconnected",
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    setState(prevState => {
      const newTransaction: Transaction = {
        ...transaction,
        id: `txn_${Date.now()}`,
        date: new Date().toISOString(),
      };
      const newBalance = prevState.user.balance - transaction.amount;
      return {
        ...prevState,
        user: {
            ...prevState.user,
            balance: newBalance
        },
        transactions: [newTransaction, ...prevState.transactions],
      };
    });
  };

  const addVaultEntry = (vaultEntry: Omit<VaultEntry, 'id'>) => {
    setState(prevState => ({
      ...prevState,
      vaultEntries: [
        { ...vaultEntry, id: `vault_${Date.now()}` },
        ...prevState.vaultEntries,
      ],
    }));
  };
  
  const updateBalance = (newBalance: number) => {
    setState(prevState => ({
        ...prevState,
        user: { ...prevState.user, balance: newBalance }
    }));
  };
  
  const setTier = (tier: 'free' | 'premium') => {
    setState(prevState => ({
      ...prevState,
      user: { ...prevState.user, tier }
    }));
    toast({
      title: `Switched to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`,
      description: tier === 'premium' ? "All premium features are now unlocked!" : "You are now on the free plan."
    })
  };

  const completeOnboarding = () => {
    setState(prevState => ({
        ...prevState,
        user: {...prevState.user, onboardingCompleted: true}
    }));
    router.push('/dashboard');
  }

  const value: AppContextType = {
    ...state,
    setState,
    connectWallet,
    disconnectWallet,
    addTransaction,
    addVaultEntry,
    updateBalance,
    setTier,
    completeOnboarding,
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }
  
  // Prevent rendering children if onboarding is not complete
  if (!state.user.onboardingCompleted && isInitialized) {
     return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
  }


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
