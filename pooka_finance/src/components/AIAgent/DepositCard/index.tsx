/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import "./styles.scss"
import { getChainId, getTokenAddressForName, getTokenImage } from "@/utils/helperFunction"
import { getChainImage } from "@/utils/helperFunction"
import { DepositParams } from "@/store/types/types"
import { LoadingSpinner } from "@/common/LoadingSpinner"
import { useCreateDeposit } from "@/hooks/useCreateDeposit"
import { useCreateCrossChainDeposit } from "@/hooks/useCreateCrossChainDeposit";
import { useSendApprovalTraxn } from "@/hooks/useSendApproval";
import { useCreateCrossChainDepositOnAvax } from "@/hooks/useCrossChainDepositAvax";
import { avalancheFuji, sepolia } from "viem/chains"
import { usePerpStore } from "@/store/PerpStore"
import { useShallow } from "zustand/react/shallow"

interface DepositCardProps {
  params: DepositParams
  isLoading?: boolean
}

export const DepositCard: React.FC<DepositCardProps> = ({ params, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "0"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatTokenAmount = (amount: number | undefined, token: string | undefined) => {
    if (!amount || !token) return "0"
    return `${amount.toLocaleString()} ${token.toUpperCase()}`
  }

 

  const {
    createDeposit,
    isDepositLoading,
    isDepositError
  }=useCreateDeposit();

  const handleCrossChainDepositOnAvax=()=>{
    if(params.chainName === undefined || params.collateral===undefined || params.payToken===undefined) return;
    const payToken=params.payToken
    createCrossChainDepositAvax(payToken, params.collateral.toString())
  } 

  const {
    createCrossChainDepositAvax
   }=useCreateCrossChainDepositOnAvax();

   const {
    createCrossChainDeposit,
    isCrossChainDepositLoading,
    isCrossChainError
  }=useCreateCrossChainDeposit({
    callBackFunction:handleCrossChainDepositOnAvax
  });

  const handleApprovalCallBack = async () => {
    if(params.chainName === undefined || params.collateral===undefined || params.payToken===undefined) return;
    if (getChainId(params.chainName) === avalancheFuji.id) {
      const tokenAddress=getTokenAddressForName(params.payToken, avalancheFuji.id);
      await createDeposit(tokenAddress, params.collateral.toString());
    } else if (getChainId(params.chainName) === sepolia.id) {
      await createCrossChainDeposit(params.collateral.toString());
    } else {
      console.error('Unsupported chain selected');
    }
  };

  const {
    sendApprovalTraxn,
    isError
  }=useSendApprovalTraxn({
    callBackFunction:handleApprovalCallBack
  })

  

  const handleDeposit = () => {
   if(params.collateral===undefined || params.payToken===undefined || params.chainName === undefined) return;
   const chainId=getChainId(params.chainName);
   const tokenAddress=getTokenAddressForName(params.payToken, chainId);
   sendApprovalTraxn(tokenAddress, chainId, params.collateral.toString())
  }

  return (
    <div
      className={`depositCard ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cardHeader">
        <div className="depositTitle">Deposit Collateral</div>
        <div className="chainInfo">
          <Image
            src={getChainImage(params.chainName || "eth")}
            alt={params.chainName || "eth"}
            width={20}
            height={20}
            className="chainIcon"
          />
          <span className="chainName">{params?.chainName?.toUpperCase()}</span>
        </div>
      </div>

      <div className="cardBodyDeposit">
          <div className="parameter mainParameter">
            <div className="paramLabel">Deposit Amount</div>
            <div className="paramValue">
              <div className="tokenDisplay">
                {params.payToken && (
                  <Image
                    src={getTokenImage(params.payToken) || "/placeholder.svg"}
                    alt={params.payToken}
                    width={32}
                    height={32}
                    className="tokenIcon large"
                  />
                )}
                <div className="amountInfo">
                  <span className="tokenAmount">{formatTokenAmount(params.collateral, params.payToken)}</span>
                  <span className="usdValue">{formatCurrency(params.collateral)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="parameter">
            <div className="paramLabel">Token</div>
            <div className="paramValue tokenValue">
              {params.payToken && (
                <Image
                  src={getTokenImage(params.payToken) || "/placeholder.svg"}
                  alt={params.payToken}
                  width={24}
                  height={24}
                  className="tokenIcon"
                />
              )}
              <span className="tokenName">{params.payToken?.toUpperCase() || "Unknown"}</span>
            </div>
          </div>

          <div className="parameter">
            <div className="paramLabel">Network</div>
            <div className="paramValue networkValue">
              <Image
                src={getChainImage(params.chainName || "eth") || "/placeholder.svg"}
                alt={params.chainName || 'ethereum'}
                width={24}
                height={24}
                className="networkIcon"
              />
              <span className="networkName">{params?.chainName?.toUpperCase()}</span>
            </div>
          </div>
      </div>

      <div className="cardFooter">
        <button
          className={`depositBtn ${isLoading ? "loading" : ""}`}
          onClick={handleDeposit}
          disabled={isLoading || !params.collateral || params.collateral <= 0}
        >
          {isDepositLoading ? (
            <>
              <LoadingSpinner/>
            </>
          ) : (
           "Confirm Deposit"
          )}
        </button>
      </div>
    </div>
  )
}
