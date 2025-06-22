
import { Abi } from "viem";
import { CONTRACT_ADDRESS_PRICE_FEED_AVAX } from "@/utils/constants";
import { useReadContract } from "wagmi";
import { usePerpStore } from "@/store/PerpStore";
import { useShallow } from "zustand/react/shallow";
import { PRICE_ORACLE_ABI } from "@/components/ABI/PriceOracleABI";
import { NormalizeContractData } from "@/utils/helperFunction";

interface MarketData{
    price24hHigh:number,
    price24hLow:number,
    currentPrice:number,
    priceChange : number,
    changePercent: number
}

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
        refetchInterval:30000 
    }
  });

  console.log(data);

  const marketData:MarketData= !isLoading && !isError && data && Array.isArray(data) ?{
    currentPrice: NormalizeContractData((data as bigint[])[0]) as number || 0,
    price24hHigh: NormalizeContractData((data as bigint[])[1]) as number || 0,
    price24hLow: NormalizeContractData((data as bigint[])[2]) as number || 0,
    priceChange: NormalizeContractData((data as bigint[])[3]) as number || 0,
    changePercent: Number((data as bigint[])[4])/100 as number || 0,
  } : {currentPrice: 0,
    price24hHigh: 0,
    price24hLow: 0,
    priceChange: 0,
    changePercent: 0} as MarketData;

   return {
    marketData,
    error,
    isError,
    isLoading
   }   

}