export type Transaction = {
  id: string;
  date: string;
  product: string;
  amount: number;
  category: 'Need' | 'Want';
  aiReasoning: string;
  status: 'Approved' | 'Locked' | 'Refunded';
  oracleVerified: boolean;
  lockedAmount?: number;
  vaultUnlockDate?: string;
  blockchainTxHash?: string;
  productImage?: string;
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

export type User = {
  walletAddress: string | null;
  balance: number;
  connectedBanks: Array<{
    name: string;
    accountNumber: string;
    type: string;
  }>;
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
};
