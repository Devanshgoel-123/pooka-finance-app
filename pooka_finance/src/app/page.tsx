"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/HomeNavigation"
import { CryptoTicker } from "@/components/CryptoTicker"
import { HeroSection } from "@/components/HeroSection"
import { StatsSection } from "@/components/StatsSection"
import { BuiltForSection } from "@/components/BuiltForSection"
import { Footer } from "@/components/HomeFooter"
import { CTASection } from "@/components/CTASection"
import "./styles.scss"
import { useRouter } from "next/navigation"

const LandingPage= () => {
  const [currentVolume, setCurrentVolume] = useState<number>(15000000)
  const [currentUsers, setCurrentUsers] = useState<number>(7200)

  const router=useRouter();

  useEffect(() => {
    const volumeInterval = setInterval(() => {
      setCurrentVolume((prev) => prev + Math.floor(Math.random() * 10000))
    }, 3000)

    const usersInterval = setInterval(() => {
      setCurrentUsers((prev) => prev + Math.floor(Math.random() * 10))
    }, 5000)

    return () => {
      clearInterval(volumeInterval)
      clearInterval(usersInterval)
    }
  }, [])

  const handleTradeNow = () => {
    router.push("/Trade")
  }

  return (
    <div className="HomeWrapper">
      <Navigation onLaunchApp={handleTradeNow} />
      <HeroSection onTradeNow={handleTradeNow} />
      <StatsSection volume={currentVolume} users={currentUsers} />
      <CryptoTicker />
      <BuiltForSection />
      <CTASection onLaunchApp={handleTradeNow} />
      <Footer />
    </div>
  )
}

export default LandingPage
