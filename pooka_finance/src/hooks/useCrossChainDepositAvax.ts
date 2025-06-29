import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Abi,parseUnits } from "viem";
import { POOL_MANAGER_ABI } from "@/components/ABI/PoolManagerABI";
import {
  CONTRACT_ADDRESS_POOL_MANAGER,
  USDC_TOKEN_AVAX,
} from "@/utils/constants";
import { useEffect, useState } from "react";

export const useCreateCrossChainDepositOnAvax = () => {
  const [query, setQuery] = useState<boolean>(false);
  const {
    writeContract,
    data: hash,
    error,
    isPending,
    isError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });
  
  useEffect(() => {
    if (hash) {
      alert(`Traxn sent successfully with hash:${hash}`);
     
      if(isSuccess){
        alert(`Traxn completed successfully, your amount has been deposited`);
        setQuery(false);
      }
    } else if (error) {
      alert(`Unable to send the traxn:${error.message}`);
      setQuery(false);
    }
  }, [error, hash, isConfirming, isPending, isSuccess]);

  const createCrossChainDepositAvax = async (payToken:string, depositAmount:string) => {
    try {
      setQuery(true);
      writeContract({
        abi: POOL_MANAGER_ABI as Abi,
        address: CONTRACT_ADDRESS_POOL_MANAGER,
        functionName: "depositDirect",
        args: [
            USDC_TOKEN_AVAX,
            parseUnits(depositAmount, 6)
        ]
      });
    } catch (err) {
      setQuery(false);
      console.error("Error depositing for user", err);
    }
  };

  return {
    createCrossChainDepositAvax,
    isCrossChainDepositAvaxLoading: isSuccess,
    isCrossChainDepositAvaxError: isError,
  };
};
