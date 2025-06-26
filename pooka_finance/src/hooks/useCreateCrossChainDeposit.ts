import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CROSS_CHAIN_MANAGER_ABI } from "@/components/ABI/Cross_Chain_manager_ABI";
import { Abi, parseUnits } from "viem";
import {
  CROSS_CHAIN_MANAGER_SEPOLIA,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { sepolia } from "viem/chains";
interface Props {
  callBackFunction: () => void;
}


export const useCreateCrossChainDeposit = ({callBackFunction}:Props) => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error, isPending, isError } = useWriteContract();
 
  const {
    address
  }=useAccount();
  
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
  }, [error, hash, isConfirming, isSuccess, isPending]);

  const createCrossChainDeposit = async (depositAmount: string) => {
    console.log("Calling cross chain Deposit", depositAmount, CROSS_CHAIN_MANAGER_SEPOLIA)
    try {
      setQuery(true);
      setTimeout(() => {
        writeContract({
          abi: CROSS_CHAIN_MANAGER_ABI as Abi,
          address: CROSS_CHAIN_MANAGER_SEPOLIA as `0x${string}`,
          functionName: "depositAndSend",
          args: [
            parseUnits(depositAmount, 6) 
          ],
          account:address,
          chain:sepolia
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
