"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import "./styles.scss"
import { getTokenImage } from "@/utils/helperFunction"
import { getChainImage } from "@/utils/helperFunction"
import { DepositParams } from "@/store/types/types"

interface DepositCardProps {
  params: DepositParams
  isLoading?: boolean
}

export const DepositCard: React.FC<DepositCardProps> = ({ params, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState(false)

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

  const handleDeposit = () => {
  }

  return (
    <div
      className={`depositCard ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cardHeader">
        <div className="depositInfo">
          <div className="depositTitle">Deposit Collateral</div>
          <div className="depositSubtitle">Add funds to your trading account</div>
        </div>
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

      <div className="cardBody">
        <div className="parameterGrid">
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

        <div className="depositSummary">
          <div className="summaryItem">
            <span className="summaryLabel">{"You're depositing"}</span>
            <span className="summaryValue">{formatTokenAmount(params.collateral, params.payToken)}</span>
          </div>
          <div className="summaryItem">
            <span className="summaryLabel">Estimated value</span>
            <span className="summaryValue">{formatCurrency(params.collateral)}</span>
          </div>
        </div>
      </div>

      <div className="cardFooter">
        <button
          className={`depositBtn ${isLoading ? "loading" : ""}`}
          onClick={handleDeposit}
          disabled={isLoading || !params.collateral || params.collateral <= 0}
        >
          {isLoading ? (
            <>
              <div className="loadingSpinner"></div>
              <span>Processing Deposit...</span>
            </>
          ) : (
            <>
              <span>Confirm Deposit</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H5M17 19H7"
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
