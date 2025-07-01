/* eslint-disable @typescript-eslint/no-unused-vars */
import {useReadContracts } from "wagmi"
import { useAccount } from "wagmi";
import { useWalletStore } from "@/store/walletStore";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseEther } from "viem";
import { CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { useEffect, useState } from "react";
import { PositionData } from "@/store/types/types";

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
    functionName: 'positions',
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
        enabled:isConnected && (address!==undefined),
        refetchInterval:5000,
        refetchIntervalInBackground:true
    },
    
  });

  const ETH=(data ?? [])[0];
  const BTC=(data ?? [])[1];

  const eth_positions = Array.isArray(ETH) ? [ETH] : [[ETH]];
  const btc_position = Array.isArray(BTC) ? [BTC] : [[BTC]];
  const formattedEthPositions: PositionData[] = eth_positions.map((item: unknown) => {
    const typedItem = item as [bigint, bigint, bigint, bigint, boolean, boolean, bigint, bigint];
    return {
      perpName:"ETH/USD",
      size: typedItem[0],
      collateral: typedItem[1],
      entryPrice: typedItem[2],
      leverage: typedItem[3],
      isLong: typedItem[4],
      isOpen: typedItem[5],
      openTime: typedItem[6],
      lastFeeTime: typedItem[7],
    };
  });
  const formattedBtcPositions:PositionData[] = btc_position.map((item: unknown) => {
    const typedItem = item as [bigint, bigint, bigint, bigint, boolean, boolean, bigint, bigint];
    return {
      perpName:"BTC/USD",
      size: typedItem[0],
      collateral: typedItem[1],
      entryPrice: typedItem[2],
      leverage: typedItem[3],
      isLong: typedItem[4],
      isOpen: typedItem[5],
      openTime: typedItem[6],
      lastFeeTime: typedItem[7],
    };
  });
 
  const openPositionsEth: PositionData[] = (formattedEthPositions as PositionData[]).filter((item)=>item.collateral > 0)
  const openPositionBtc: PositionData[] = (formattedBtcPositions as PositionData[]).filter((item)=>item.collateral > 0)
  
  const userPositions:PositionData[]=[...openPositionBtc, ...openPositionsEth].filter((item)=>item.isOpen);
   return {
      ETH: (data ?? [])[0] || [],
      BTC: (data ?? [])[1] || [],
      error,
      isError,
      isLoading,
      userPositions
   };   

}