# **App Name**: SmartGuard

## Core Features:

- Wallet Connection: Connect to wallets via @thirdweb-dev/react, supporting MetaMask, WalletConnect, and Coinbase Wallet.
- AI-Powered Purchase Scanner: Use a tool combining computer vision and a LLM to categorize purchases as 'Needs' vs 'Wants,' displayed with clear AI reasoning.
- Oracle Price Verification: Simulate fetching prices from an oracle to verify the market price of scanned products.
- Blockchain Savings Vault: Lock 'at-risk' funds into a savings vault using a smart contract on the Polygon Mumbai testnet, enforcing a time-locked cooling-off period.
- Spending Analytics Dashboard: Display spending analytics using Recharts, showing 'Needs' vs 'Wants' ratios and prevented impulse buys.
- Transaction History: Record transactions, categorize transactions with needs and wants tag, enable downloading a statement with the recorded transaction history
- Settings and Preferences: Customize spending rules, budget limits, vault settings, and AI preferences.

## Style Guidelines:

- Primary color: Neon blue (#3b82f6) for a professional fintech aesthetic.
- Background color: Deep navy (#0a0e1a) for a sophisticated feel.
- Accent color: Emerald green (#10b981) for success and positive actions.
- Body and headline font: 'Inter' (sans-serif) for a modern, neutral look. Note: currently only Google Fonts are supported.
- Use Lucide React icons for a consistent and clean interface.
- Implement a dark theme with glass-morphism cards for a modern and visually appealing design.
- Subtle animations for loading states, button hovers, and success actions to enhance UX.