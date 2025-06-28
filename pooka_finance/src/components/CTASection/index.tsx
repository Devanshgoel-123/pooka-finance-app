"use client"

import type React from "react"
import "./styles.scss"
import Image from "next/image"

interface CTASectionProps {
  onLaunchApp?: () => void
}

export const CTASection: React.FC<CTASectionProps> = ({ onLaunchApp }) => {
  return (
    <section className="ctaSection">
      <div className="ctaContainer">
        <h2 className="ctaTitle">Ready to Start Trading?</h2>
        <p className="ctaSubtitle">Join thousands of traders on PookaFinance</p>

        
        <div className="ctaImagePlaceholder">
        {/* //  <Image src={"/assets/tradingPanel.svg"} height={45} width={45} className="homePageTradingView" alt=""/> */}
        </div>

        <button className="ctaButton" onClick={onLaunchApp}>
          Launch App
        </button>
      </div>
    </section>
  )
}


