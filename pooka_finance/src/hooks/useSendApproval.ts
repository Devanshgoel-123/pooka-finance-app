import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import {
    CONTRACT_ADDRESS_POOL_MANAGER,
  CROSS_CHAIN_MANAGER_SEPOLIA,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { ERC20_ABI } from "@/components/ABI/ERC20ABI";
import { sepolia } from "viem/chains";
import { useRef } from "react";

interface Props {
  callBackFunction: () => void;
}

export const useSendApprovalTraxn = ({callBackFunction}:Props) => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error, isPending, isError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });

  const callBackFunctionRef = useRef<() => void>(callBackFunction);
  
  useEffect(() => {
    callBackFunctionRef.current = callBackFunction;
  }, [callBackFunction]);

  useEffect(() => {
    if (hash) {
      if (isConfirming) {
        alert(`Transaction sent successfully with hash: ${hash}`);
      }
      
      if (isSuccess) {
        alert(`Transaction confirmed successfully!`);
        setTimeout(() => {
          setQuery(false);
          callBackFunctionRef.current();
        }, 200);
      }
    }
    
    if (error) {
      alert(`Unable to send the transaction: ${error.message}`);
      setQuery(false);
    }
  }, [error, hash, isConfirming, isSuccess]);

  const sendApprovalTraxn = async (
    depositAmount: string, 
    payToken: string, 
    chainId: number,
  ) => {
    console.log("Calling approval transaction", depositAmount);
    
    let contractAddress: string;
    if (chainId === sepolia.id) {
      contractAddress = CROSS_CHAIN_MANAGER_SEPOLIA;
    } else {
      contractAddress = CONTRACT_ADDRESS_POOL_MANAGER;
    }

    try {
      setQuery(true);
      
      const amount = parseUnits(depositAmount, 8);
      console.log(`Approving ${amount} tokens for ${contractAddress}`);
      
      writeContract({
        abi: ERC20_ABI,
        address: payToken as `0x${string}`,
        functionName: "approve",
        args: [contractAddress, amount],
        chainId: chainId
      });
      
    } catch (err) {
      console.error("Error in approval transaction", err);
      setQuery(false);
      alert(`Error initiating approval: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return {
    sendApprovalTraxn,
    isSuccess,
    isError,
    isPending,
    isConfirming,
    hash
  };
};