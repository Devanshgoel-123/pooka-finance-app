"use client"

import type React from "react"
import "./styles.scss"
import Link from "next/link"
import { DOCS_LINK } from "@/utils/constants"

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="footerContent">
          <div className="footerSection">
            <h4 className="footerTitle">Trade Anything on PookaFinance © 2025</h4>
          </div>

          <div className="footerLinks">
            <div className="footerColumn">
              <h5 className="footerColumnTitle">Resources</h5>
              <a href="#blog" className="footerLink">
                Blog
              </a>
              <a href={DOCS_LINK} className="footerLink">
                Docs
              </a>
              <a href="#brand" className="footerLink">
                Brand Kit 
              </a>
            </div>

            <div className="footerColumn">
              <h5 className="footerColumnTitle">Community</h5>
              <Link href="#twitter" className="footerLink">
                Twitter 
              </Link>
              <Link href="#telegram" className="footerLink">
                Telegram 
              </Link>

            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}
