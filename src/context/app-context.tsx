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
          user: {...prevState.user, ...parsedState.user, economicProfile: {...prevState.user.economicProfile, ...parsedState.user.economicProfile}},
          settings: {...prevState.settings, ...parsedState.settings},
          dniEngine: {...prevState.dniEngine, ...parsedState.dniEngine}
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
    if (isInitialized) {
        if (!state.user.onboardingCompleted) {
            router.push('/onboarding');
        } else if (state.user.tier === 'premium' && !state.user.economicProfile.contractSignedAt) {
            router.push('/onboarding/economic-profile');
        }
    }
  }, [isInitialized, state.user.onboardingCompleted, state.user.tier, state.user.economicProfile.contractSignedAt, router]);

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
      user: { ...MOCK_DATA.user } // Reset user state completely on disconnect
    }));
    router.push('/onboarding');
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
      
      const updatedBalance = prevState.user.tier === 'premium' ? prevState.user.balance + newTransaction.amount : prevState.user.balance;

      return {
        ...prevState,
        user: {
            ...prevState.user,
            balance: updatedBalance
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
    if (tier === 'premium' && !state.user.onboardingCompleted) {
        // If they are upgrading during onboarding, move them to wallet connect
    } else if (tier === 'premium') {
      toast({
        title: `Switched to Premium Plan`,
        description: "All premium features are now unlocked!"
      })
      if (!state.user.economicProfile.contractSignedAt) {
        router.push('/onboarding/economic-profile');
      }
    }
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
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
