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
        // Deep merge, but ensure onboarding is reset
        const initialUserState = {
          ...MOCK_DATA.user,
          walletAddress: parsedState.user.walletAddress,
          balance: parsedState.user.balance,
          connectedBanks: parsedState.user.connectedBanks
        };

        setState(prevState => ({
          ...prevState,
          ...parsedState,
          user: initialUserState,
        }));
      }
    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
       setState(MOCK_DATA);
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
    setState(MOCK_DATA); // Reset to initial mock data
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
    const wasFree = state.user.tier === 'free';
    setState(prevState => ({
      ...prevState,
      user: { ...prevState.user, tier }
    }));
    
    if (tier === 'premium' && wasFree) {
      toast({
        title: `Switched to Premium Plan`,
        description: "Let's set up your economic profile."
      })
      // The layout effect will handle redirection if contract isn't signed
      router.push('/onboarding/economic-profile');
    } else if (tier === 'premium') {
       if (!state.user.economicProfile.contractSignedAt) {
         router.push('/onboarding/economic-profile');
       }
    }
  };

  const value: AppContextType = {
    ...state,
    setState,
    connectWallet,
    disconnectWallet,
    addTransaction,
    addVaultEntry,
    updateBalance,
    setTier,
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
