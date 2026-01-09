import type { AppState } from '@/lib/types';
import { format } from 'date-fns';

const now = new Date();

export const MOCK_DATA: AppState = {
  user: {
    walletAddress: null,
    balance: 2450.0,
    connectedBanks: [
      { name: 'Chase Bank', accountNumber: '****1234', type: 'Checking' },
      { name: 'Wells Fargo', accountNumber: '****5678', type: 'Savings' },
    ],
  },
  settings: {
    wantsBudget: 600,
    needsBudget: 1500,
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
      amount: 125.5,
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
      amount: 69.99,
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
      amount: 1200,
      category: 'Need',
      aiReasoning: 'Essential housing expense.',
      status: 'Approved',
      oracleVerified: false,
    },
    {
      id: 'txn_004',
      date: new Date(now.setDate(now.getDate() - 4)).toISOString(),
      product: 'Zara - Winter Coat',
      amount: 150.0,
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
      amount: 15.49,
      category: 'Want',
      aiReasoning: 'Recurring entertainment subscription.',
      status: 'Approved',
      oracleVerified: false,
    },
    {
      id: 'txn_006',
      date: new Date(now.setDate(now.getDate() - 6)).toISOString(),
      product: 'Sony WH-1000XM5 Headphones',
      amount: 399.99,
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
      amount: 250.75,
      category: 'Want',
      aiReasoning: 'Luxury dining experience, considered a want.',
      status: 'Approved',
      oracleVerified: false,
      productImage: 'dining'
    },
    {
      id: 'txn_008',
      date: new Date(now.setDate(now.getDate() - 12)).toISOString(),
      product: 'Gasoline',
      amount: 55.20,
      category: 'Need',
      aiReasoning: 'Essential for transportation.',
      status: 'Approved',
      oracleVerified: true,
      productImage: 'transport'
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
      lockedDate: '2024-12-15T12:00:00Z',
      unlockDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Locked',
      originTransactionId: 'txn_prev_001',
    },
    {
      id: 'vault_003',
      amount: 100,
      lockedDate: '2024-11-20T12:00:00Z',
      unlockDate: '2024-12-20T12:00:00Z',
      status: 'Unlockable',
      originTransactionId: 'txn_prev_002',
    },
  ],
};
