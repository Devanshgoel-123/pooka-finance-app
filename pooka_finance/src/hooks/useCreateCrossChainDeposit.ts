import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CROSS_CHAIN_MANAGER_ABI } from "@/components/ABI/Cross_Chain_manager_ABI";
import { Abi, parseUnits } from "viem";
import {
  CROSS_CHAIN_MANAGER_SEPOLIA,
  USDC_TOKEN_SEPOLIA,
} from "@/utils/constants";
import { useEffect, useState } from "react";

export const useCreateCrossChainDeposit = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error, isPending, isError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });

  useEffect(() => {
    if (hash && isConfirming){
      alert(`Traxn sent successfully with hash:${hash}`);
      setQuery(false)
    } else if (error) {
      alert(`Unable to send the traxn:${error.message}`);
      setQuery(false)
    }
  }, [error, hash, isConfirming, isSuccess, isPending]);

  const createCrossChainDeposit = async (depositAmount: string) => {
    console.log("Calling cross chain Deposit", depositAmount)
    try {
      setQuery(true);
      setTimeout(() => {
        writeContract({
          abi: CROSS_CHAIN_MANAGER_ABI as Abi,
          address: CROSS_CHAIN_MANAGER_SEPOLIA as `0x${string}`,
          functionName: "depositAndSend",
          args: [
            USDC_TOKEN_SEPOLIA,
            parseUnits(depositAmount, 6) 
          ],
        });
      }, 2000); 
    } catch (err) {
      setQuery(false);
      console.error("Error depositing for user", err);
    }
  };
  return {
    createCrossChainDeposit,
    isCrossChainDepositLoading: isSuccess,
    isCrossChainError:isError
  };
};
