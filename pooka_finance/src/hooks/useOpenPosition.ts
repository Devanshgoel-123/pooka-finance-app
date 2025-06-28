import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi,parseUnits } from "viem";
import { CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { useEffect, useState } from "react";
import { avalancheFuji } from "viem/chains";

export const useOpenPosition = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const {
    address
  }=useAccount();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });

  useEffect(() => {
    if (hash) {
      if (isConfirming) {
        alert(`Transaction sent successfully with hash: ${hash}`);
      }
      
      if (isSuccess) {
        alert(`Transaction confirmed successfully!`);
      }
    } else if (error) {
      alert(`Unable to open position:${error.message}`);
    }
  }, [error, hash, isConfirming]);

  const openPosition = async (
    symbol: string,
    isLong: boolean,
    collateralAmount: string,
    leverage: string
  ) => {
    try {
      setQuery(true);
      writeContract({
        abi: PERPS_ABI as Abi,
        address: CONTRACT_ADDRESS_AVAX,
        functionName: "openPosition",
        args: [symbol, parseUnits(collateralAmount,6), BigInt(leverage), isLong],
        chain:avalancheFuji,
        account:address
      });
    } catch (err) {
      setQuery(false);
      console.log("Error opening position for user", err);
    }
  };

  return {
    openPosition,
    isPositionLoading: isPending || isConfirming,
    success:isSuccess
  };
};
