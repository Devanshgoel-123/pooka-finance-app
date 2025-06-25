/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import "./styles.scss"
import { MARKET_SYMBOLS, PERP_MM } from "@/utils/constants"
import { usePerpStore } from "@/store/PerpStore"
import Image from "next/image"
import { useFetchMarketData } from "@/hooks/useFetchMarketData"
import { useShallow } from "zustand/react/shallow"
import { markets } from "@/utils/constants"
import { Market } from "@/store/types/types";
import { useFetchUserDepositBalance } from "@/hooks/useFetchUserBalance";
import { useAccount } from "wagmi"
import { useCreateDeposit } from "@/hooks/useCreateDeposit"
import { useFetchTokenPriceInUsd } from "@/hooks/useFetchPriceInUsd"


export const TradingHeader = ({
  priceChange = -374.74,
  priceChangePercent = -0.36,
}) => {
  const {
    address
  }=useAccount();
  const {
    createDeposit
  }=useCreateDeposit();


  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedMarket, setSelectedMarket] = useState<Market>(markets[1]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    userDepositbalance
  }=useFetchUserDepositBalance();
  const {
    maintenanceMargin
  }=usePerpStore(useShallow((state)=>({
    maintenanceMargin:state.maintenanceMargin
  })))
  const isPositive = priceChange >= 0;

  const {
    marketData,
    error,
    isLoading
  }=useFetchMarketData();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (market: Market) => {
    setSelectedMarket(market);
    usePerpStore.getState().setSelectedPerp(market.symbol);
    if(market.symbol.toLowerCase().includes("btc")){
      usePerpStore.getState().setMaintenanceMargin(PERP_MM.BTC)
    }else{
      usePerpStore.getState().setMaintenanceMargin(PERP_MM.ETH)
    }
    setShowDropDown(false);
  };

  const toggleDropdown = () => {
    setShowDropDown(!showDropDown);
  };

  return (
    <div className="tradingHeader">
      <div className="priceSection">
        <div className="symbolContainerDesktop" ref={dropdownRef}>
          <div className="symbolIcon">
            <Image height={30} width={30} src={selectedMarket.logo} alt="image" className="tokenLogoPerp"/>
            </div>
          <div className="symbolInfoDesktop" onClick={toggleDropdown}>
            <span className="symbolText">{selectedMarket.symbol}</span>
            <div className={`symbolDropdown ${showDropDown ? 'open' : ''}`}>▼</div>
          </div>
          
          {showDropDown && (
            <div className="dropdownMenuDesktop">
              {markets.map((market) => (
                <div
                  key={market.symbol}
                  className={`dropdownItem ${selectedMarket.symbol === market.symbol ? 'selected' : ''}`}
                  onClick={() => handleSelect(market)}
                >
                   <span className="marketName">{market.name}</span>
                  <span className="marketSymbol">{market.symbol}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="priceInfoDesktop">
          <div className="currentPrice">${isLoading ? "0.00" : marketData.currentPrice.toLocaleString()}</div>
          <div className={`priceChange ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? "+" : ""}
            {priceChangePercent}%
          </div>
        </div>
      </div>

      <div className="statsSectionTradingDesktop">
        <div className="statsData">
        <div className="statItem">
          <span className="statLabel">24H High</span>
          <span className="statValue">${isLoading ? "0.00" : marketData.price24hHigh.toLocaleString()}</span>
        </div>
        <div className="statItem">
          <span className="statLabel">24H Low</span>
          <span className="statValue">${isLoading ? "0.00" : marketData.price24hLow.toLocaleString()}</span>
        </div>
        <div className="statItem">
          <span className="statLabel">Req. Maintenance</span>
          <span className="statValue">{isLoading ? "0.00" : maintenanceMargin.toFixed(1)}%</span>
        </div>
        </div>
        <div className="depositWrapper">
          <span className="depositHeader">YOUR DEPOSIT :</span>
          <div className="depositBalance">
            <Image src={"/assets/usdc.svg"} alt="" height={22} width={22} className="usdcLogo"/>
          <span>${userDepositbalance===0 ? userDepositbalance.toFixed(2) : userDepositbalance.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}