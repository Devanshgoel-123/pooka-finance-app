/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useWalletStore } from "@/store/walletStore";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseEther } from "viem";
import { PERPS_AVAX } from "@/utils/constants";
import { useEffect, useState } from "react";

export const useOpenPosition = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { address } = useAccount();
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
    leverage: number
  ) => {
    console.log(symbol, isLong, collateralAmount, leverage);
    try {
      setQuery(true);
      writeContract({
        abi: PERPS_ABI as Abi,
        address: PERPS_AVAX,
        functionName: "openPosition",
        args: [symbol, parseEther(collateralAmount), BigInt(leverage), isLong],
      });
    } catch (err) {
      setQuery(false);
      console.error("Error opening position for user", err);
    }
  };

  return {
    openPosition,
    isPending: isPending || isConfirming,
  };
};
