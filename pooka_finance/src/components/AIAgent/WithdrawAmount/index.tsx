"use client"

import type React from "react"
import { useState } from "react"
import "./styles.scss"
import { LoadingSpinner } from "@/common/LoadingSpinner";
import Image from "next/image";
import { useWithdrawAmount } from "@/hooks/useWithdrawAmount";
import { getTokenImage } from "@/utils/helperFunction";
import { WithdrawPositionParams } from "@/store/types/types";

interface Props{
  params : WithdrawPositionParams;
  isLoading : boolean;
}

export const WithdrawAmountCard= ({ params }:Props) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  console.log("I am being rendered")
  const {
    withdrawUserAmount,
    isWithdrawError,
    isWithdrawSuccess,
    isLoading
  }=useWithdrawAmount();
  

  if(params.amount === undefined) return;

  const handleWithdrawal = async () => {
    if(params.amount === undefined ) return;
   await withdrawUserAmount(params.amount)
  }


  return (
    <div
      className={`WithdrawCard ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cardHeader">
        <div className="depositTitle">Withdraw USDC</div>
      </div>

          <div className="parameter mainParameter">
            <div className="paramLabel">Withdrawal Amount</div>
            <div className="paramValue">
                <Image src={getTokenImage("usdc")} height={25} width={25} className="perpIcon" alt="perpImg"/>
                <span className="perpName">{params.amount} USDC</span>
            </div>
          </div>

      <div className="cardFooter">
        <button
          className={`closeBtn ${isLoading ? "loading" : ""}`}
          onClick={handleWithdrawal}
          disabled={params.amount === undefined || isLoading}
        >
          {isLoading && !isWithdrawSuccess && !isWithdrawError ? (
            <>
              <LoadingSpinner/>
            </>
          ) : (
           "Withdraw Amount"
          )}
        </button>
      </div>
    </div>
  )
}
