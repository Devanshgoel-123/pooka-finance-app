"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import "./styles.scss"
import { getChainImage, getPerpImage, getPerpName } from "@/utils/helperFunction"
import { getTokenImage } from "@/utils/helperFunction"

export type PositionParams = {
  perpName?: string
  leverage?: number
  collateral?: number
  payToken?: string;
  positionType?: string;
  chainName?: string
}

interface PositionCardProps {
  params: PositionParams
  isLoading?: boolean
}

export const PositionCard: React.FC<PositionCardProps> = ({ params, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);


  useEffect(()=>{
  if(params.chainName===undefined || !params.perpName || !params.payToken){
    return 
  }
  },[params.chainName, params.payToken, params.perpName])


  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "0"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
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
          
        </div>
        <div className="chainInfo">
          <Image
            src={getChainImage(params.chainName || "eth")}
            alt={params.chainName || "eth"}
            width={20}
            height={20}
            className="chainIcon"
          />
          <span className="chainName">{params.chainName || "Avalanche"}</span>
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
            <div className="paramLabel">Pay Token</div>
            <div className="paramValue tokenValue">
              {params.payToken && (
                <Image
                  src={getTokenImage(params.payToken) || "/usdc.svg"}
                  alt={params.payToken}
                  width={24}
                  height={24}
                  className="tokenIcon"
                />
              )}
              <span className="tokenName">{params.payToken || "Unknown"}</span>
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
          className={`openPositionBtn ${isLoading ? "loading" : ""}`}
          // onClick={handleOpenPosition}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loadingSpinner"></div>
              <span>Opening Position...</span>
            </>
          ) : (
            <>
              <span>Open Position</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
