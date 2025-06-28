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
import { metaMaskWallet, rabbyWallet, bybitWallet, coreWallet} from '@rainbow-me/rainbowkit/wallets';
import {
  avalancheFuji,
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
      wallets: [metaMaskWallet, rabbyWallet, bybitWallet, coreWallet],
    },
  ],
  {
    appName:"ChromiumHack",
    projectId:"fbb7dd672f032c12e043457e516544f4",
  }
)

export const config=createConfig({
  connectors,
  chains: [avalancheFuji, sepolia],
  ssr:true,
  transports:{
    [avalancheFuji.id]: http(),
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
        initialChain={avalancheFuji}
        showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};