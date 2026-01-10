import type { AppState } from '@/lib/types';

const now = new Date();
const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));

export const MOCK_DATA: AppState = {
  user: {
    walletAddress: null,
    balance: 2450.0,
    tier: 'premium', // Default to premium for existing setup
    onboardingCompleted: false, // Will be set to true after onboarding
    connectedBanks: [
      { id: 'bank1', name: 'Chase Bank', accountNumber: '****1234', type: 'Checking', balance: 3250.00 },
      { id: 'bank2', name: 'Wells Fargo', accountNumber: '****5678', type: 'Savings', balance: 12500.00 },
      { id: 'bank3', name: 'Chase Bank', accountNumber: '****9012', type: 'Credit Card', balance: -1450.00 },
    ],
  },
  settings: {
    wantsBudget: 600,
    needsBudget: 1500,
    totalBudget: 2500,
    alertThreshold: 75,
    lockDuration: 30,
    autoLockEnabled: true,
    categorizationSensitivity: 'Balanced',
  },
  transactions: [
    {
      id: 'txn_001',
      date: new Date(now.setDate(now.getDate() - 1)).toISOString(),
      product: 'Whole Foods Groceries',
      amount: -125.5,
      category: 'Need',
      aiReasoning: 'Essential food items for daily consumption.',
      status: 'Approved',
      oracleVerified: true,
      productImage: 'groceries'
    },
    {
      id: 'txn_002',
      date: new Date(now.setDate(now.getDate() - 2)).toISOString(),
      product: 'PlayStation 5 Game',
      amount: -69.99,
      category: 'Want',
      aiReasoning: 'Entertainment purchase, non-essential luxury item.',
      status: 'Approved',
      oracleVerified: true,
      productImage: 'ps5-game'
    },
    {
      id: 'txn_003',
      date: new Date(now.setDate(now.getDate() - 3)).toISOString(),
      product: 'Monthly Rent',
      amount: -1200,
      category: 'Need',
      aiReasoning: 'Essential housing expense.',
      status: 'Approved',
      oracleVerified: false,
    },
    {
      id: 'txn_004',
      date: new Date(now.setDate(now.getDate() - 4)).toISOString(),
      product: 'Zara - Winter Coat',
      amount: -150.0,
      category: 'Want',
      aiReasoning: 'Fashion item, can be considered a want if not replacing a critical item.',
      status: 'Approved',
      oracleVerified: true,
      productImage: 'clothing'
    },
    {
      id: 'txn_005',
      date: new Date(now.setDate(now.getDate() - 5)).toISOString(),
      product: 'Netflix Subscription',
      amount: -15.49,
      category: 'bills-utilities',
      aiReasoning: 'Recurring entertainment subscription.',
      status: 'Posted',
      oracleVerified: true,
    },
    {
      id: 'txn_006',
      date: new Date(now.setDate(now.getDate() - 6)).toISOString(),
      product: 'Sony WH-1000XM5 Headphones',
      amount: -399.99,
      category: 'Want',
      aiReasoning: 'Luxury electronic item, non-essential.',
      status: 'Locked',
      lockedAmount: 199.99,
      vaultUnlockDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      blockchainTxHash: '0x123abcde789fgh...',
      oracleVerified: true,
      productImage: 'sony-headphones',
    },
     {
      id: 'txn_007',
      date: new Date(now.setDate(now.getDate() - 10)).toISOString(),
      product: 'Dinner at Nobu',
      amount: -250.75,
      category: 'food-dining',
      aiReasoning: 'Luxury dining experience, considered a want.',
      status: 'Posted',
      oracleVerified: true,
      productImage: 'dining'
    },
    {
      id: 'txn_008',
      date: new Date(now.setDate(now.getDate() - 12)).toISOString(),
      product: 'Gasoline',
      amount: -55.20,
      category: 'transportation',
      status: 'Posted',
      oracleVerified: true,
      productImage: 'transport'
    },
     {
      id: 'txn_009',
      date: new Date(now.setDate(now.getDate() - 15)).toISOString(),
      product: 'Amazon.com Purchase',
      amount: -87.43,
      category: 'shopping',
      status: 'Posted',
      oracleVerified: true,
      productImage: 'shopping'
    },
    {
      id: 'txn_010',
      date: new Date(now.setDate(now.getDate() - 16)).toISOString(),
      product: 'Paycheck Deposit',
      amount: 2200.00,
      category: 'income',
      status: 'Posted',
      oracleVerified: true,
    },
  ],
  vaultEntries: [
    {
      id: 'vault_001',
      amount: 199.99,
      lockedDate: new Date(now.setDate(now.getDate() - 6)).toISOString(),
      unlockDate: new Date(new Date().getTime() + 24 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Locked',
      originTransactionId: 'txn_006',
    },
    {
      id: 'vault_002',
      amount: 250,
      lockedDate: new Date(oneMonthAgo.setDate(oneMonthAgo.getDate() - 15)).toISOString(),
      unlockDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Locked',
      originTransactionId: 'txn_prev_001',
    },
    {
      id: 'vault_003',
      amount: 100,
      lockedDate: new Date(oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)).toISOString(),
      unlockDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Unlockable',
      originTransactionId: 'txn_prev_002',
    },
  ],
};
