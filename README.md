

# 🦊 PookaFinance

**PookaFinance** is a modern Web3 Perps trading Platform built with **Next.js** and **Sass**, offering a seamless crypto cross chain trading experience with wallet integration and dynamic UI components.

---

## 🔧 Tech Stack

* **Frontend Framework**: [Next.js](https://nextjs.org/)
* **Styling**: [Sass](https://sass-lang.com/)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **Wallet Integration**: [Wagmi](https://wagmi.sh/), [RainbowKit](https://www.rainbowkit.com/)

---

## 📁 Project Structure

```
/components
  └── ComponentName/
        ├── index.tsx
        └── styles.scss

/hooks
  └── useCustomHook.ts

/pages
  └── Home/
        └── index.tsx

/public
  └── assets/
        └── *.svg

/store
  └── walletStore.ts

/utils
  ├── constants.ts
  └── helperFunction.ts

.env
  => API_KEY="... Your Polygon's API KEY"
```

---


## 🛠️ Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/Devanshgoel-123/pooka-finance-app.git
cd pooka_finance
```

2. **Install Dependencies**

```bash
npm install
# or
yarn
```

3. **Setup Environment**

Create a `.env` file at the root:

```
API_KEY=""
```

4. **Run the Development Server**

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 📁 Public Assets

All SVG and image assets are stored in:

```
/public/assets
```
---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feat/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE)

