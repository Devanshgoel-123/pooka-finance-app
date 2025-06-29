/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Abi, parseUnits } from "viem";
import {
  CONTRACT_ADDRESS_AVAX,
    CONTRACT_ADDRESS_POOL_MANAGER,
  CROSS_CHAIN_MANAGER_SEPOLIA,
  USDC_TOKEN_AVAX,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { ERC20_ABI } from "@/components/ABI/ERC20ABI";
import { avalancheFuji, sepolia } from "viem/chains";
import { useRef } from "react";
import { usePerpStore } from "@/store/PerpStore";
import { useShallow } from "zustand/react/shallow";
interface Props {
  callBackFunction: () => void;
}

export const useSendApprovalTraxn = ({callBackFunction}:Props) => {
  const [query, setQuery] = useState<boolean>(false);
  let success_approve:boolean=false;
  const {
    address
  }=useAccount();
  const { writeContract, data: hash, error, isPending, isError } = useWriteContract();
  const {
    approvalToken,
    approvalChain
  }=usePerpStore(useShallow((state)=>({
    approvalToken:state.payToken,
    approvalChain:state.payChain
  })))
  const {
    data
  }=useReadContract({
    abi:ERC20_ABI,
    functionName:'allowance',
    args:[
      address,
      approvalToken
    ],
    chainId:approvalChain
  })
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

  const sendApprovalTraxn = async (payToken:string, payChain:number, depositAmount:string) => {
  
    let contractAddress: string;
    let decimalUnits:number;
    if (payChain === sepolia.id) {
      contractAddress = CROSS_CHAIN_MANAGER_SEPOLIA;
      decimalUnits=7;
    } else{
       if(payToken===USDC_TOKEN_AVAX){
        contractAddress= CONTRACT_ADDRESS_AVAX;
        decimalUnits=7;
       }else{
        decimalUnits=19;
        contractAddress = CONTRACT_ADDRESS_POOL_MANAGER;
       }     
    }
    try {
      setQuery(true);
      const amount = parseUnits(depositAmount, decimalUnits);
      const chain=payChain===avalancheFuji.id ? avalancheFuji : sepolia;

      if( data===undefined || data as bigint < parseUnits(depositAmount, 7)){
        writeContract({
        abi: ERC20_ABI,
        address: payToken as `0x${string}`,
        functionName: "approve",
        args: [contractAddress, amount]
      });
      success_approve=isSuccess;
    }else{
      success_approve=true;
      callBackFunctionRef.current()
      setQuery(false);
    }
    } catch (err) {
      console.error("Error in approval transaction", err);
      setQuery(false);
      alert(`Error initiating approval: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return {
    sendApprovalTraxn,
    isSuccess:success_approve,
    isError,
    hash
  };
};