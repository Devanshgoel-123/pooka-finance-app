
import { Abi } from "viem";
import { CONTRACT_ADDRESS_PRICE_FEED_AVAX } from "@/utils/constants";
import { useReadContract } from "wagmi";
import { usePerpStore } from "@/store/PerpStore";
import { useShallow } from "zustand/react/shallow";
import { PRICE_ORACLE_ABI } from "@/components/ABI/PriceOracleABI";
import { NormalizeContractData } from "@/utils/helperFunction";
import { MarketData } from "@/store/types/types";


export const useFetchMarketData=()=>{
  const {
    selectedPerp
  }=usePerpStore(useShallow((state)=>({
    selectedPerp: state.selectedPerp
  })))
  
  const {
    data,
    error,
    isLoading,
    isError,
  } = useReadContract({
    abi: PRICE_ORACLE_ABI as Abi,
    address:CONTRACT_ADDRESS_PRICE_FEED_AVAX as `0x${string}`,
    functionName: 'getPrice',
    args: [
        selectedPerp
    ],
    query:{
        enabled: selectedPerp!=="",
    },
  });

  const marketData:MarketData= !isLoading && !isError && data && Array.isArray(data) ? 
     NormalizeContractData((data as bigint[])[0])
   : {
    currentPrice: 0,
    price24hHigh: 0,
    price24hLow: 0,
    priceChange: 0,
    changePercent: 0
  } as MarketData;

   return {
    marketData,
    error,
    isError,
    isLoading
   }   

}