"use client"

import type React from "react"
import "./styles.scss"
import Image from "next/image";
import { POOKA_LOGO } from "@/utils/constants";
import { DOCS_LINK } from "@/utils/constants";
import Link from "next/link";
interface NavigationProps {
  onLaunchApp?: () => void
}

export const Navigation: React.FC<NavigationProps> = () => {
  return (
    <nav className="navigation">
      <div className="navContainer">
        <div className="logo">
          <div className="logoIcon">
            <Image src={POOKA_LOGO} className="logoPlaceholder" height={45} width={45} alt="logo"/>
          </div>
          <span className="logoText">PookaFinance</span>
        </div>

        <div className="navLinks">
          <a href={DOCS_LINK} className="navLink">
            Docs
          </a>
          <a href="/Trade" className="navLink">
            Trade
          </a>
          <a href="/Agent" className="navLink">
            Agent
          </a>
        </div>
        <Link className="launchButton" href="/Trade">Launch App</Link>

      </div>
    </nav>
  )
}
