import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseEther } from "viem";
import { CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { useEffect, useState } from "react";

export const useOpenPosition = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });

  useEffect(() => {
    if (hash && isConfirming) {
      alert(`Position opened successfully with hash:${hash}`);
    } else if (error) {
      alert(`Unable to open position:${error.message}`);
    }
  }, [error, hash, isConfirming]);

  const openPosition = async (
    symbol: string,
    isLong: boolean,
    collateralAmount: string,
    leverage: string
   )=>{
    try{
    setQuery(true);
    writeContract({
            abi: PERPS_ABI as Abi,
            address:CONTRACT_ADDRESS_AVAX,
            functionName:"openPosition",
            args:
            [
                symbol,
                parseEther(collateralAmount),
                BigInt(leverage),
                isLong
            ],
            value:parseEther(collateralAmount)
    })
    }catch(err){
        setQuery(false);
        console.log("Error opening position for user", err)
    }
  };

  return {
    openPosition,
    isPositionLoading: isPending || isConfirming,
  };
};
