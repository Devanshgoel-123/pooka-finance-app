"use client"

import type React from "react"
import "./styles.scss"
import Link from "next/link";

interface NavigationProps {
  onLaunchApp?: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onLaunchApp }) => {
  return (
    <nav className="navigation">
      <div className="navContainer">
        <div className="logo">
          <div className="logoIcon">
            <span className="logoPlaceholder">LOGO</span>
          </div>
          <span className="logoText">PookaFinance</span>
        </div>

        <div className="navLinks">
          <a href="#docs" className="navLink">
            Docs
          </a>
          <a href="#blog" className="navLink">
            Blog
          </a>
          <a href="#products" className="navLink">
            Products
          </a>
          <a href="#community" className="navLink">
            Community
          </a>
        </div>

        <Link className="launchButton" onClick={onLaunchApp} href="/">Launch App</Link>
      </div>
    </nav>
  )
}
