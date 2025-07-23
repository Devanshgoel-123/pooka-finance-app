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
import { useHandleToast } from "@/common/handleToast";
import { APPROVAL_PENDING, APPROVAL_SUCCESS } from "@/utils/ToastNames";
import { TOAST_TYPE } from "@/store/types/types";
import { TRANSACTION_FAILED, TRANSACTION_REJECTED } from "@/utils/ToastNames";
interface Props {
  callBackFunction: () => void;
}

export const useSendApprovalTraxn = ({callBackFunction}:Props) => {
  const [query, setQuery] = useState<boolean>(false);
  let success_approve:boolean=false;
  const {
    address
  }=useAccount();
  const {handleToast}=useHandleToast();
  const handleToastRef =
  useRef<
    (
      heading: string,
      subHeading: string,
      type: string,
      hash?: string | undefined,
      chainId?: number | undefined
    ) => void
  >(handleToast);
  const { writeContract, data: hash, error, isPending, reset } = useWriteContract();
  const {
    approvalToken,
    approvalChain
  }=usePerpStore(useShallow((state)=>({
    approvalToken:state.payToken,
    approvalChain:state.payChain
  })));

  const payChainRef=useRef<number>(0);

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
  const { isLoading: isConfirming, isSuccess, isError} = useWaitForTransactionReceipt({
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
    if (hash && isConfirming) {
      handleToastRef.current(
       APPROVAL_PENDING.heading,
      APPROVAL_PENDING.subHeading,
      TOAST_TYPE.INFO,
        hash,
        payChainRef.current
      );
    }
    if(isSuccess){
      handleToastRef.current(
        APPROVAL_SUCCESS.heading,
        APPROVAL_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        hash,
        payChainRef.current
      )
      setTimeout(() => {
        setQuery(false);
        callBackFunctionRef.current();
        reset();
      }, 200);
    }
    
    if (error || isError) {
      setQuery(false);
      if (
        error?.message.includes(
           "User rejected the request."
         )
       ) {
         handleToastRef.current(
           TRANSACTION_REJECTED.heading,
           TRANSACTION_REJECTED.subHeading,
           TOAST_TYPE.ERROR
         );
       } else {
         handleToastRef.current(
           TRANSACTION_FAILED.heading,
           TRANSACTION_FAILED.subHeading,
           TOAST_TYPE.ERROR,
           hash,
           payChainRef.current
         );
       }
    }
  }, [error, hash, isConfirming, isSuccess, isError]);

  const sendApprovalTraxn = async (payToken:string, payChain:number, depositAmount:string) => {
    
    let contractAddress: string;
    let decimalUnits:number;
    payChainRef.current=payChain;
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