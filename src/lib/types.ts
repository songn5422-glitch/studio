export type Transaction = {
  id: string;
  date: string;
  product: string;
  amount: number;
  category: 'Need' | 'Want' | string; // Allow general strings for free tier
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
  amount: number;
  lockedDate: string;
  unlockDate: string;
  status: 'Locked' | 'Unlockable';
  originTransactionId: string;
};

export type Settings = {
  wantsBudget: number;
  needsBudget: number;
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
  balance: number;
};

export type User = {
  walletAddress: string | null;
  balance: number;
  tier: 'free' | 'premium';
  onboardingCompleted: boolean;
  connectedBanks: ConnectedAccount[];
};

export type AppState = {
  user: User;
  settings: Settings;
  transactions: Transaction[];
  vaultEntries: VaultEntry[];
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
