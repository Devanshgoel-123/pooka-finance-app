/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { useAccount } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseEther } from "viem";
import { CONTRACT_ADDRESS_AVAX} from "@/utils/constants";
import { useEffect, useState } from "react";


export const useCreateDeposit=()=>{
  const [query, setQuery]=useState<boolean>(false);
  const {address}=useAccount();
   const {
    writeContract,
    data:hash,
    error,
    isPending,
   }=useWriteContract();

   const {isLoading:isConfirming}=useWaitForTransactionReceipt({
    hash,
    query:{
        enabled:query
    }
   })

   useEffect(()=>{
    if(hash && isConfirming){
        alert(`Traxn sent successfully with hash:${hash}`)
    }else if(error){
        alert(`Unable to send the traxn:${error.message}`)
    }
   },[error, hash, isConfirming])

   const createDeposit=async (
    depositAmount:string
   )=>{
    try{
    setQuery(true);
    writeContract({
            abi: PERPS_ABI as Abi,
            address:CONTRACT_ADDRESS_AVAX,
            functionName:"createDeposit",
            args:
            [
               parseEther(depositAmount)
            ],
            value:parseEther(depositAmount)
    })
    }catch(err){
        setQuery(false);
        console.error("Error depositing for user", err)
    }
}

   return {
    createDeposit,
    isDepositLoading:isPending
   }

}