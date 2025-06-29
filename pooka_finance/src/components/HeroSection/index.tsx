"use client"

import type React from "react"
import "./styles.scss"
import Image from "next/image"
import { BTC_TOKEN, ETH_TOKEN, SOL_TOKEN } from "@/utils/constants"

interface HeroSectionProps {
  onTradeNow?: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTradeNow }) => {
  return (
    <div className="heroSection">
      <div className="heroContainer">
        <div className="statusBadge">
          <div className="statusDot"></div>
          Testnet Live
        </div>

        <h1 className="heroTitle">
          Long or Short <span className="fireEmoji">🔥</span> Assets
        </h1>

        <button className="tradeNowButton" onClick={onTradeNow}>
          Trade Now
        </button>

        <div className="curveContainer">
        <svg className="curveSvg" viewBox="0 0 1200 300" fill="none" preserveAspectRatio="none">
            <path
              d="M0 250 Q300 100 600 150 Q900 200 1200 50"
              stroke="#7bf179"
              strokeWidth="3"
              fill="none"
              className="animatedCurve"
            />
          </svg>
          <div className="curveText">
            <span className="curveTextLine1">& Everything</span>
            <span className="curveTextLine2">in Between</span>
          </div>
        </div>
      </div>

      <div className="floatingIcons">
        <Image className="floatingIcon bitcoin" src={BTC_TOKEN} height={45} width={45} alt="btc"/>
        <Image className="floatingIcon ethereum" src={ETH_TOKEN} height={45} width={45} alt="btc"/>
        <Image className="floatingIcon solana" src={SOL_TOKEN} height={45} width={45} alt="btc"/>
      </div>
    </div>
  )
}

