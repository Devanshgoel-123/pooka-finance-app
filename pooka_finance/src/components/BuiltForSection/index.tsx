"use client"

import type React from "react"
import "./styles.scss"

export const BuiltForSection: React.FC = () => {

  return (
    <section className="builtForSection">
      <h2 className="builtForTitle">
        Built for <span className="highlightText">You</span>
      </h2>

      <div className="featuresGrid">
        <div className="featureCard">
          <div className="featureImagePlaceholder">
            <span className="imagePlaceholderText">One Click Icon</span>
          </div>
          <h3 className="featureTitle">One Click Trading</h3>
          <p className="featureDesc">Execute trades instantly with our streamlined interface</p>
        </div>

        <div className="featureCard">
          <div className="featureImagePlaceholder">
            <span className="imagePlaceholderText">AI Powered</span>
          </div>
          <h3 className="featureTitle">AI Powered</h3>
          <p className="featureDesc">Execute Trades Instantly With Our Advanced Infrastructure</p>
        </div>

        <div className="featureCard">
          <div className="featureImagePlaceholder">
            <span className="imagePlaceholderText">Cross Chain Deposits</span>
          </div>
          <h3 className="featureTitle">Cross Chain Deposits</h3>
          <p className="featureDesc">Create Advanced Orders Like TP and SL to Manage Your Risk Efficiently</p>
        </div>
      </div>
    </section>
  )
}

