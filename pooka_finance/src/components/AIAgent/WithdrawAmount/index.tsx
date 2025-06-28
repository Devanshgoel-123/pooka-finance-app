"use client"

import type React from "react"
import { useState } from "react"
import "./styles.scss"
import { LoadingSpinner } from "@/common/LoadingSpinner";
import Image from "next/image";
import { useWithdrawAmount } from "@/hooks/useWithdrawAmount";
import { getTokenImage } from "@/utils/helperFunction";
import { WithdrawPositionParams } from "@/store/types/types";
import { useFetchUserDepositBalance } from "@/hooks/useFetchUserBalance";
import { LoadingText } from "@/common/LoadingText";
import { useChainId, useSwitchChain } from "wagmi";
import { avalancheFuji } from "viem/chains";


interface Props{
  params : WithdrawPositionParams;
  isLoading : boolean;
}

export const WithdrawAmountCard= ({ params }:Props) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const chainId=useChainId();
  const {
    switchChain
  }=useSwitchChain();

  const handleSwitchChain=()=>{
    switchChain({
      chainId:avalancheFuji.id
    })
}
  const {
    userDepositbalance,
    isLoading:isDepositLoading
  }=useFetchUserDepositBalance()

  const {
    withdrawUserAmount,
    isWithdrawError,
    isWithdrawSuccess,
    isLoading
  }=useWithdrawAmount();
  

  if(params.withdrawAmount === undefined) return;

  const handleWithdrawal = async () => {
    if(params.withdrawAmount === undefined ) return;
   await withdrawUserAmount(params.withdrawAmount)
  }


  return (
    <div
      className={`WithdrawCard ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cardHeader">
        <div className="depositTitle">Withdraw USDC</div>
        <div className="depositTitleBalance">
        <span>Your Deposits  :</span>
        <span> <Image src={getTokenImage("usdc")} height={25} width={25} className="perpTcon" alt="perpImg" style={{
          borderRadius:"50%"
        }} />{isDepositLoading ? <LoadingText text="0.00" size={16}/> : userDepositbalance}</span>
        </div>
      
      </div>

          <div className="parameter mainParameter">
            <div className="paramLabel">Withdrawal Amount</div>
            <div className="paramValue">
                <Image src={getTokenImage("usdc")} height={25} width={25} className="perpIcon" alt="perpImg"/>
                <span className="perpName">{params.withdrawAmount} USDC</span>
            </div>
          </div>

      <div className="cardFooter">
        <button
          className={`closeBtn ${isLoading ? "loading" : ""}`}
          onClick={chainId=== avalancheFuji.id ? handleWithdrawal : handleSwitchChain}
          disabled={params.withdrawAmount === undefined || isLoading || Number(params.withdrawAmount) > userDepositbalance}
        >
          {isLoading && !isWithdrawSuccess && !isWithdrawError ? (
            <>
              <LoadingSpinner/>
            </>
          ) : (
           Number(params.withdrawAmount) > userDepositbalance ? "Insufficient Deposits" : "Withdraw Amount"
          )}
        </button>
      </div>
    </div>
  )
}
