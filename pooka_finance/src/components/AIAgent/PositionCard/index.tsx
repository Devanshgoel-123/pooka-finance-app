"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import "./styles.scss"

export type PositionParams = {
  perpName?: string
  leverage?: number
  collateral?: number
  payToken?: "USDC" | "ETH"
  positionType?: "long" | "short"
  chainName: string
}

interface PositionCardProps {
  params: PositionParams
  onOpenPosition?: (params: PositionParams) => void
  isLoading?: boolean
}

export const PositionCard: React.FC<PositionCardProps> = ({ params, onOpenPosition, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getTokenImage = (token: "USDC" | "ETH" | undefined) => {
    switch (token) {
      case "USDC":
        return "/placeholder.svg?height=24&width=24" // Replace with actual USDC logo
      case "ETH":
        return "/placeholder.svg?height=24&width=24" // Replace with actual ETH logo
      default:
        return "/placeholder.svg?height=24&width=24"
    }
  }

  const getChainImage = (chainName: string) => {
    switch (chainName.toLowerCase()) {
      case "avax":
      case "avalanche":
        return "/placeholder.svg?height=20&width=20" // Replace with actual Avalanche logo
      case "ethereum":
        return "/placeholder.svg?height=20&width=20" // Replace with actual Ethereum logo
      default:
        return "/placeholder.svg?height=20&width=20"
    }
  }

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "0"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const handleOpenPosition = () => {
    if (!isLoading && onOpenPosition) {
      onOpenPosition(params)
    }
  }

  return (
    <div
      className={`positionCard ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cardHeader">
        <div className="positionInfo">
          <div className="perpName">{params.perpName || "Unknown Perpetual"}</div>
          <div className="positionType">
            <span className={`typeIndicator ${params.positionType}`}>
              {params.positionType?.toUpperCase() || "UNKNOWN"}
            </span>
          </div>
        </div>
        <div className="chainInfo">
          <Image
            src={getChainImage(params.chainName) || "/placeholder.svg"}
            alt={params.chainName}
            width={20}
            height={20}
            className="chainIcon"
          />
          <span className="chainName">{params.chainName.toUpperCase()}</span>
        </div>
      </div>

      <div className="cardBody">
        <div className="parameterGrid">
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
                  src={getTokenImage(params.payToken) || "/placeholder.svg"}
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
      </div>

      <div className="cardFooter">
        <button
          className={`openPositionBtn ${isLoading ? "loading" : ""}`}
          onClick={handleOpenPosition}
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
