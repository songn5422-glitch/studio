
export type Transaction = {
  id: string;
  date: string;
  product: string;
  amount: number;
  category: 'Need' | 'Want' | 'food-dining' | 'transportation' | 'shopping' | 'bills-utilities' | 'entertainment' | 'income' | 'clothing' | 'subscriptions' | string;
  aiReasoning?: string;
  status: 'Approved' | 'Locked' | 'Refunded' | 'Posted';
  oracleVerified: boolean;
  lockedAmount?: number;
  vaultUnlockDate?: string;
  blockchainTxHash?: string;
  productImage?: string;
  accountId?: string;
};

export type VaultEntry = {
  id: string;
  principal: number;
  amount: number;
  lockedDate: string;
  unlockDate: string;
  status: 'Locked' | 'Unlockable' | 'Earning';
  originTransactionId: string;
  protocol?: 'Aave' | 'Compound';
  apy?: number;
  accruedInterest?: number;
};

export type Settings = {
  wantsBudget: number;
  needsBudget: number;
  totalBudget: number;
  alertThreshold: number;
  lockDuration: 7 | 14 | 30 | 60 | 90;
  autoLockEnabled: boolean;
  categorizationSensitivity: 'Lenient' | 'Balanced' | 'Strict';
};

export type ConnectedAccount = {
  id: string;
  name: string;
  accountNumber: string;
  type: string;
  balance?: number;
};

export type EconomicProfile = {
  occupation: string;
  incomeLevel: 'low' | 'mid' | 'high' | null;
  dependents: number;
  guardianEnabled: boolean;
  guardianAddress: string | null;
  disciplineContractHash: string | null;
  contractSignedAt: string | null;
}

export type DNI_Engine = {
  currentScore: number;
  occupationMultipliers: Record<string, Record<string, number>>;
  categoryBaselineNecessity: Record<string, number>;
}

export type User = {
  walletAddress: string | null;
  balance: number;
  tier: 'free' | 'premium';
  onboardingCompleted: boolean;
  connectedBanks: ConnectedAccount[];
  economicProfile: EconomicProfile;
};

export type AppState = {
  user: User;
  settings: Settings;
  transactions: Transaction[];
  vaultEntries: VaultEntry[];
  dniEngine: DNI_Engine;
};

export type Language = 'en' | 'vi';

export type Dictionary = {
  [key: string]: { [key: string]: string };
};

export type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

export type AppContextType = AppState & {
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  connectWallet: () => void;
  disconnectWallet: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  addVaultEntry: (vaultEntry: Omit<VaultEntry, 'id'>) => void;
  updateBalance: (newBalance: number) => void;
  setTier: (tier: 'free' | 'premium') => void;
  completeOnboarding: () => void;
};
