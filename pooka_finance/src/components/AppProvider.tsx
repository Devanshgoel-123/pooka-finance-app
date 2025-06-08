"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { createConfig, WagmiProvider } from 'wagmi';
import { ReactNode } from 'react';
import { metaMaskWallet, rabbyWallet, bybitWallet} from '@rainbow-me/rainbowkit/wallets';
import {
  mainnet,
  sepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import React from 'react';



const queryClient = new QueryClient();


const connectors=connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, rabbyWallet, bybitWallet],
    },
  ],
  {
    appName:"ChromiumHack",
    projectId:"fbb7dd672f032c12e043457e516544f4",
  }
)

export const config=createConfig({
  connectors,
  chains: [mainnet, sepolia],
  ssr:true,
  transports:{
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
})

export const AppKitProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          borderRadius: 'small',
          accentColorForeground: 'white',
        })} 
        modalSize='compact'
        initialChain={sepolia}
        showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};