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
import { SnackbarProvider } from 'notistack'
import CustomToast from '@/common/CustomToasts';



const queryClient = new QueryClient();

declare module "notistack" {
  interface VariantOverrides {
    custom:true
  }
}


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
        <SnackbarProvider
         maxSnack={2} 
         autoHideDuration={120000}
         anchorOrigin={{
          vertical:'top',
          horizontal:'right'
         }}
         transitionDuration={{
          enter:300,
          exit:200
         }}
         Components={{
          custom:CustomToast
         }}
        >
          {children}
        </SnackbarProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};