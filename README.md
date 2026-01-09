# 🛡️ SmartGuard - AI-Powered Financial Guardian

## 🎯 Competition Track: AI & Oracles

SmartGuard is an intelligent financial guardian designed to combat the "impulse spending" epidemic among digital consumers. By combining AI-driven sentiment analysis with decentralized blockchain enforcement, SmartGuard transforms passive budgeting into active financial discipline. 

The app uses a smartphone as an **Oracle** to scan real-world products, employs **AI** to categorize necessity, and utilizes **Blockchain Smart Contracts** to automatically lock "at-risk" funds into a time-locked cooling-off vault.

## ✨ Key Features
1. **AI-Powered Purchase Scanning**: Uses computer vision and LLMs to categorize purchases as "Needs" vs "Wants" based on user history.
2. **Oracle Price Verification**: Real-time market price validation via simulated decentralized oracles to ensure fair market value.
3. **Blockchain Savings Vault**: Secure, time-locked smart contracts that hold funds during "impulse" windows.
4. **Spending Analytics**: Recharts-powered visual insights into Needs vs. Wants ratios and prevented impulse buys.
5. **Impulse Protection**: Automated "Hard-coded discipline" that moves excess funds to a vault when spending thresholds are breached.

## 🏗️ Architecture
- **Frontend**: Next.js 15 (React 19) + Tailwind CSS
- **Web3 Integration**: Simulated for MVP
- **Blockchain**: Polygon Mumbai/Amoy Testnet (Simulated)
- **AI**: Purchase categorization engine using Genkit & Gemini.

## 🚀 Getting Started

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/smartguard-mvp.git
   cd smartguard-mvp
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment variables:**
   Create a `.env.local` file in the root directory and add your Google AI API Key (obtainable from Google AI Studio):
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

### How to run locally
To start the development server and view the app in your browser:
   ```bash
   npm run dev
   ```
The app will be available at http://localhost:9002.

### How to connect wallet
The wallet connection is simulated for this MVP.
1. Click the "Connect Wallet" button in the SmartGuard header.
2. The application will simulate a connection and display a mock wallet address and balance.

## 📜 Legal Compliance
**SmartGuard MVP - Competition Prototype**
- This project is a demonstration prototype.
- **Non-Custodial**: This is a decentralized tool. Users maintain full custody of their funds via their own private wallets.
- **Educational Purpose**: This is not a licensed financial service. All "locks" and "vaults" are performed on the Polygon Testnet using non-value test tokens.
- **Compliance**: Future production versions would require full KYC/AML integration and financial service licensing in the operating jurisdictions.
