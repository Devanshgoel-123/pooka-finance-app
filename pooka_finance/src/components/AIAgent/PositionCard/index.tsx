/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import "./styles.scss"
import { getChainImage, getPerpImage, getPerpName } from "@/utils/helperFunction"
import { getTokenImage } from "@/utils/helperFunction"
import { useOpenPosition } from "@/hooks/useOpenPosition"
import { LoadingSpinner } from "@/common/LoadingSpinner"
import { useFetchUserDepositBalance } from "@/hooks/useFetchUserBalance"
import { USDC_TOKEN } from "@/utils/constants"
import { useChainId, useSwitchChain } from "wagmi"
import { avalancheFuji } from "viem/chains"
export type PositionParams = {
  perpName?: string
  leverage?: number
  collateral?: number
  positionType?: string;
}

interface PositionCardProps {
  params: PositionParams
  isLoading?: boolean
}

export const PositionCard: React.FC<PositionCardProps> = ({ params, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [forceDisable, setForceDisable]=useState<boolean>(false);
  const chainId= useChainId();
  const {
    switchChain
  }=useSwitchChain()
 
  const {
    openPosition,
    isPositionLoading,
    success
  }=useOpenPosition();

  useEffect(()=>{
    if(success){
      setForceDisable(true)
    }
  },[success])

  useEffect(()=>{
  if(params.collateral === null || params.perpName===null || !params.positionType === null){
    return
  }
  },[params.collateral, params.perpName, params.positionType])

  

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "0"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)

  }

  const {
    userDepositbalance,
    isLoading:isDepositLoading
  }=useFetchUserDepositBalance()

  const handleOpenPosition=()=>{

    if(!params.perpName || !params.positionType || !params.positionType || !params.collateral || !params.leverage) return; 

    openPosition(
      params.perpName,
      params.positionType?.toLowerCase().includes("long"),
      params.collateral.toString(),
      params.leverage?.toString()
    )
  }

  const handleSwitchChain=()=>{
      switchChain({
        chainId:avalancheFuji.id
      })

  }
 

  return (
    <div
      className={`positionCard ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cardHeader">
        <div className="positionInfo">
          <div className="perpWrapper">
          <Image src={getPerpImage(params.perpName || 'btc')} height={35} width={35} alt=""/>
          <span className="perpName">{getPerpName(params.perpName || "eth")}</span>
          <div className="positionType">
            <span className={`typeIndicator ${params.positionType}`}>
              {params.positionType?.toUpperCase() || "UNKNOWN"}
            </span>
          </div>
          </div>
          <div className="userDepositBalance">
            <span>
              <Image src={USDC_TOKEN} height={22} width={22} alt="" className="perpIcon"/>
              {userDepositbalance}
            </span>
          </div>
          
        </div>
      </div>

      <div className="cardBodyPosition">

        <div className="parameter">
        <div className="paramLabel">Leverage</div>
            <div className="paramValue">
              <span className="leverageValue">{params.leverage || 1}x</span>
            </div>
        </div>
          
          <div className="parameter">
            <div className="paramLabel">Collateral</div>
            <div className="paramValue">
              <span className="collateralValue">{formatCurrency(params.collateral)}</span>
            </div>
          </div>

          <div className="parameter">
            <div className="paramLabel">Position Size</div>
            <div className="paramValue">
              <span className="positionSize">{formatCurrency((params.collateral || 0) * (params.leverage || 1))}</span>
            </div>
          </div>
        </div>

      <div className="cardFooter">
        <button
         disabled={forceDisable || params.collateral === null || (userDepositbalance < Number(params.collateral) && chainId === avalancheFuji.id)}
          className={`openPositionBtn ${isLoading ? "loading" : ""}`}
          onClick={()=>{
            if(chainId !== avalancheFuji.id){
              handleSwitchChain()
            }else{
              handleOpenPosition()
            }
          }}
        >
          {isPositionLoading && !success ? (
            <>
              <LoadingSpinner/>
            </>
          ) : (
            <>    
            {chainId !== avalancheFuji.id ? "Switch Chain" : "Open Position"}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
