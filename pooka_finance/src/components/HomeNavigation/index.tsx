"use client"

import type React from "react"
import "./styles.scss"
import Link from "next/link";
import Image from "next/image";

interface NavigationProps {
  onLaunchApp?: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onLaunchApp }) => {
 
  return (
    <nav className="navigation">
      <div className="navContainer">
        <div className="logo">
          <div className="logoIcon">
            <Image src={"/assets/logo.svg"} className="logoPlaceholder" height={45} width={45} alt="logo"/>
          </div>
          <span className="logoText">PookaFinance</span>
        </div>

        <div className="navLinks">
          <a href="https://pookafinance.gitbook.io/pookafinance-docs/" className="navLink">
            Docs
          </a>
          <a href="/Trade" className="navLink">
            Trade
          </a>
          <a href="/Agent" className="navLink">
            Agent
          </a>
        </div>

        <Link className="launchButton" onClick={onLaunchApp} href="/">Launch App</Link>
      </div>
    </nav>
  )
}
