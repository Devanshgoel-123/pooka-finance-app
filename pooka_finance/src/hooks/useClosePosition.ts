/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { useAccount } from "wagmi";
import { useWalletStore } from "@/store/walletStore";
import { POOKA_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseEther } from "viem";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS_AVAX } from "@/utils/constants";


export const useClosePosition=()=>{
  const [query, setQuery]=useState<boolean>(false);
  const {address}=useAccount();
   const {
    writeContract,
    data:hash,
    error,
    isPending
   }=useWriteContract();

   const {isLoading:isConfirming}=useWaitForTransactionReceipt({
    hash,
    query:{
        enabled:query
    }
   })

   useEffect(()=>{
    if(hash && isConfirming){
        alert(`Traxn sent successfully with hash:${hash} for closing user's Position`)
    }else if(error){
        alert(`Unable to send the traxn to close User's Position:${error.message}`)
    }
   },[error, hash, isConfirming])

   const closeUserPosition=async (
    symbol: string
   )=>{
    try{
    setQuery(true);
    writeContract({
            abi: POOKA_ABI as Abi,
            address:CONTRACT_ADDRESS_AVAX,
            functionName:"closePosition",
            args:
            [
                symbol,
            ]
    })
    }catch(err){
        setQuery(false);
        console.log("Error opening position for user", err)
    }
}

   return {
    closeUserPosition
   }

}