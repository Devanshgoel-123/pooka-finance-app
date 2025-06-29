/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import "./styles.scss";
import { PERP_MM } from "@/utils/constants";
import { usePerpStore } from "@/store/PerpStore";
import Image from "next/image";
import { useUnifiedPriceFeeds } from "@/hooks/useUnifiedPriceFeeds";
import { useShallow } from "zustand/react/shallow";
import { markets } from "@/utils/constants";
import { Market } from "@/store/types/types";
import { useFetchUserDepositBalance } from "@/hooks/useFetchUserBalance";
import { LoadingText } from "@/common/LoadingText";

export const TradingHeader = ({
  priceChange = -1.074,
  priceChangePercent = -0.36,
}) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedMarket, setSelectedMarket] = useState<Market>(markets[1]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userDepositbalance, isLoading:isDepositLoading } = useFetchUserDepositBalance();
  const { 
    maintenanceMargin,
    perpInfo,
    tokenPrice
   } = usePerpStore(
    useShallow((state) => ({
      maintenanceMargin: state.maintenanceMargin,
      perpInfo:state.currentPerpOhlcData,
      tokenPrice:state.currentPerpPrice
    }))
  );
  const isPositive = priceChange >= 0;


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (market: Market) => {
    setSelectedMarket(market);
    usePerpStore.getState().setSelectedPerp(market.symbol);
    if (market.symbol.toLowerCase().includes("btc")) {
      usePerpStore.getState().setMaintenanceMargin(PERP_MM.BTC);
    } else {
      usePerpStore.getState().setMaintenanceMargin(PERP_MM.ETH);
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
            <Image
              height={30}
              width={30}
              src={selectedMarket.logo}
              alt="image"
              className="mt-2"
            />
          </div>
          <div className="symbolInfoDesktop" onClick={toggleDropdown}>
            <span className="symbolText">{selectedMarket.symbol}</span>
            <div className={`symbolDropdown ${showDropDown ? "open" : ""}`}>
              ▼
            </div>
          </div>

          {showDropDown && (
            <div className="dropdownMenuDesktop">
              {markets.map((market) => (
                <div
                  key={market.symbol}
                  className={`dropdownItem ${
                    selectedMarket.symbol === market.symbol ? "selected" : ""
                  }`}
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
          <div className="currentPrice">
            $
            {tokenPrice !==0 && tokenPrice!==undefined ? `${tokenPrice.toString().slice(0,3)},${tokenPrice.toFixed(2).toString().slice(3)}` : <LoadingText text="0.00" size={24}/>}
          </div>
          <div
            className={`priceChange ${isPositive ? "positive" : "negative"}`}
          >
           {
           priceChange 
           }
          </div>
        </div>
      </div>

      <div className="statsSectionTradingDesktop">
        <div className="statsData">
          <div className="statItem">
            <span className="statLabel">24H High</span>
            <span className="statValue">
              {perpInfo.high !== 0 ? `${perpInfo.high.toString().slice(0,3)},${perpInfo.high.toFixed(2).toString().slice(3)}` : <LoadingText text="0.00" size={14}/>}
            </span>
          </div>
          <div className="statItem">
            <span className="statLabel">24H Low</span>
            <span className="statValue">
              {perpInfo.low !==0 ? `${perpInfo.low.toString().slice(0,3)},${perpInfo.low.toFixed(2).toString().slice(3)}` : <LoadingText text="0.00" size={14}/>} 
            </span>
          </div>
          <div className="statItem">
            <span className="statLabel">Req. Maintenance</span>
            <span className="statValue">{maintenanceMargin.toFixed(1)}%</span>
          </div>
        </div>
        <div className="depositWrapper">
          <span className="depositHeader">YOUR DEPOSIT :</span>
          <div className="depositBalance">
            <Image
              src={"/assets/usdc.svg"}
              alt=""
              height={22}
              width={22}
              className="usdcLogo"
            />
            <span className="balanceText">
              
              {isDepositLoading ? <LoadingText text="0.00" size={22}/> :userDepositbalance === 0 
                ? userDepositbalance.toFixed(2)
                : userDepositbalance.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
