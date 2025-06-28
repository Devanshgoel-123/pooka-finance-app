/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseEther } from "viem";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { avalancheFuji } from "viem/chains";

export const useClosePosition = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { address } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess:success } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });

  useEffect(() => {
    if (hash && isConfirming) {
      alert(
        `Traxn sent successfully with hash:${hash} for closing user's Position`
      );
    } else if (error) {
      alert(
        `Unable to send the traxn to close User's Position:${error.message}`
      );
    }
  }, [error, hash, isConfirming]);

  const closeUserPosition = async (symbol: string) => {
    try {
      setQuery(true);
      writeContract({
        address: CONTRACT_ADDRESS_AVAX,
        abi: PERPS_ABI as Abi,
        functionName: "closePosition",
        args: [symbol],
        account:address,
        chain:avalancheFuji
      });
    } catch (err) {
      setQuery(false);
      console.error("Error opening position for user", err);
    }
  };

  return {
    closeUserPosition,
    isConfirming, 
    isPending,
    success
  };
};
