/* eslint-disable @typescript-eslint/no-unused-vars */
import {useReadContracts } from "wagmi"
import { useAccount } from "wagmi";
import { useWalletStore } from "@/store/walletStore";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseEther } from "viem";
import { CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { useEffect, useState } from "react";

export const useFetchUserPosition=()=>{
  const [query, setQuery]=useState<boolean>(false);
  const {address, isConnected}=useAccount();
  const markets = [
    { symbol: 'ETH/USD', name: 'Ethereum Perpetual', logo:"/assets/eth.svg"},
    { symbol: 'BTC/USD', name: 'Bitcoin Perpetual', logo:"/assets/btc.svg"},
  ];
  const contractCalls = markets.map((market) => ({
    abi: PERPS_ABI as Abi,
    address: CONTRACT_ADDRESS_AVAX as `0x${string}`,
    functionName: 'getPosition',
    args: [
        address,
        market.symbol
    ],
  }));
  const {
    data,
    error,
    isLoading,
    isError,
  } = useReadContracts({
    contracts: contractCalls,
    allowFailure: false, 
    query:{
        enabled:isConnected && (address!==undefined)
    }
  });


   return {
    data,
    error,
    isError,
    isLoading
   }   

}