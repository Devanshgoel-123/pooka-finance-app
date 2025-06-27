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

export const TradingHeader = ({
  priceChange = -374.74,
  priceChangePercent = -0.36,
}) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedMarket, setSelectedMarket] = useState<Market>(markets[1]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userDepositbalance } = useFetchUserDepositBalance();
  const { maintenanceMargin } = usePerpStore(
    useShallow((state) => ({
      maintenanceMargin: state.maintenanceMargin,
    }))
  );
  const isPositive = priceChange >= 0;

  // Use Unified Price Feeds with 3-tier fallback system
  const { ethData, btcData, isLoading, error } = useUnifiedPriceFeeds();

  // Get current market data based on selection
  const getCurrentMarketData = () => {
    const isETH = selectedMarket.symbol.toLowerCase().includes("eth");
    const currentData = isETH ? ethData : btcData;

    return {
      currentPrice: currentData?.price || 0,
      price24hHigh: currentData?.high24h || 0,
      price24hLow: currentData?.low24h || 0,
    };
  };

  const marketData = getCurrentMarketData();

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

  // Show error state only if all sources fail
  if (error && error.includes("unavailable")) {
    return (
      <div className="tradingHeader">
        <div className="error-message">
          All price feed sources unavailable. Please try again later.
        </div>
      </div>
    );
  }

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
          <div className="symbolInfo" onClick={toggleDropdown}>
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
            {marketData.currentPrice > 0
              ? marketData.currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : isLoading
              ? "Loading..."
              : "0.00"}
          </div>
          <div
            className={`priceChange ${isPositive ? "positive" : "negative"}`}
          >
            {marketData.currentPrice > 0
              ? `${isPositive ? "+" : ""}${priceChangePercent}%`
              : isLoading
              ? "--"
              : "0.00%"}
          </div>
        </div>
      </div>

      <div className="statsSectionTradingDesktop">
        <div className="statsData">
          <div className="statItem">
            <span className="statLabel">24H High</span>
            <span className="statValue">
              $
              {marketData.price24hHigh > 0
                ? marketData.price24hHigh.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : isLoading
                ? "Loading..."
                : "0.00"}
            </span>
          </div>
          <div className="statItem">
            <span className="statLabel">24H Low</span>
            <span className="statValue">
              $
              {marketData.price24hLow > 0
                ? marketData.price24hLow.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : isLoading
                ? "Loading..."
                : "0.00"}
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
            <span>
              $
              {userDepositbalance === 0
                ? userDepositbalance.toFixed(2)
                : userDepositbalance.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
