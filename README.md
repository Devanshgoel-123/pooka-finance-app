Here’s an improved version of your `README.md` for **PookaFinance** that presents the project in a more polished, informative, and developer-friendly format:

---

# 🦊 PookaFinance

**PookaFinance** is a modern Web3 **Perpetual Trading Platform** that enables users to trade crypto assets across chains with ease. Built with **Next.js** and **Sass**, it features wallet integration, seamless UI, and powerful state management to offer a smooth user experience.

---

## 🚀 Features

* 🔄 **Cross-Chain Trading** (Sepolia ↔ AVAX)
* 💼 **Wallet Integration** with Wagmi + RainbowKit
* 📈 **Open/Close Positions** on Perpetual Contracts
* 💸 **Deposit & Withdraw Funds**
* ⚡️ Fast and responsive **UI/UX**
* 🔐 Environment-specific configuration

---

## 🛠️ Tech Stack

| Layer        | Tech                                                                  |
| ------------ | --------------------------------------------------------------------- |
| **Frontend** | [Next.js](https://nextjs.org/)                                        |
| **Styling**  | [Sass](https://sass-lang.com/)                                        |
| **State**    | [Zustand](https://github.com/pmndrs/zustand)                          |
| **Wallets**  | [Wagmi](https://wagmi.sh/), [RainbowKit](https://www.rainbowkit.com/) |

---

## 📁 Project Structure

```
pooka-finance-app/
├── components/
│   └── ComponentName/
│       ├── index.tsx
│       └── styles.scss
├── hooks/
│   └── useCustomHook.ts
├── pages/
│   ├── Agent/           # AI agent interface
│   └── Trade/           # Trading page
├── public/
│   └── assets/          # Static images and SVGs
├── store/
│   └── walletStore.ts   # Zustand store
├── utils/
│   ├── constants.ts     # Token & contract constants
│   └── helperFunction.ts
└── .env.example         # Env variable template
```

---

## 🔐 Supported Actions

PookaFinance supports the following actions on-chain:

* **Deposit**
* **Withdraw**
* **Open Position**
* **Close Position**

---

## Chain Support & Contract Addresses

### Sepolia Testnet

| Type                | Address                                      |
| ------------------- | -------------------------------------------- |
| USDC Token          | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |
| Native Token        | `0x0000000000000000000000000000000000000000` |
| Cross-Chain Manager | `0x0bb4543671f72a41efcaa6f089f421446264cc49` |

### Avalanche Fuji Testnet

| Type             | Address                                      |
| ---------------- | -------------------------------------------- |
| Contract (Perps) | `0x9d2b2005ec13fb8a7191b0df208dfbd541827c19` |
| Price Feed       | `0x9f2b180d135c46012c97f5beb02307cc7dc32cbd` |
| Pool Manager     | `0xb5abc3e5d2d3b243974f0a323c4f6514f70598cf` |
| USDC Token       | `0x5425890298aed601595a70AB815c96711a31Bc65` |
| LINK Token       | `0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846` |
| Native Token     | `0x0000000000000000000000000000000000000000` |

Supported markets:

```ts
export const MARKET_SYMBOLS = ["BTC/USD", "ETH/USD"];
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Dhruv-Varshney-developer/pooka-finance-app.git
cd pooka_finance
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Setup Environment

Create a `.env` file at the root based on `.env.example`:

```bash
cp .env.example .env
```

Fill in required API keys like:

```
API_KEY=your_polygon_api_key
STREAMS_API_KEY=your_username_from_chainlink
STREAMS_API_SECRET=your_password_from_chainlink
NEXT_PUBLIC_SERVER_URL=backend_url
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

App runs locally at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Live Demo

Try it live on Vercel:
🔗 [https://pooka-finance-app.vercel.app](https://pooka-finance-app.vercel.app)

---

## 📁 Public Assets

All logos, icons, and SVGs are stored in:

```
/public/assets/
```

---

## 🤝 Contributing

We welcome contributions!

```bash
# Fork the repository
# Create a new feature branch
git checkout -b feat/my-feature

# Commit your changes
git commit -m "Add: my feature"

# Push and open a PR
git push origin feat/my-feature
```

---

## 📄 License

Distributed under the [MIT License](./LICENSE).
Feel free to use and modify with attribution.

---

Let me know if you want badges, feature GIFs, or visuals added!
