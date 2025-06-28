"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TradingChart } from "@/components/TradingChart";
import { TradingHeader } from "@/components/TradingHeader";
import { PriceTickerComponent } from "@/components/PriceTicker";
import { OrderComponent } from "@/components/TradingPanel";
import "../global.css";
import "./styles.scss";
import { PositionsComponent } from "@/components/PositionsComp";
import { TradingHeaderMobile } from "@/components/TradingHeaderMobile";
import { usePerpStore } from "@/store/PerpStore";
import { useShallow } from "zustand/react/shallow";
import { useUnifiedPriceFeeds } from "@/hooks/useUnifiedPriceFeeds";

const Index = () => {
  useUnifiedPriceFeeds();
  const { mobileOption } = usePerpStore(
    useShallow((state) => ({
      mobileOption: state.mobileOption,
    }))
  );
  const [screenWidth, setScreenWidth]=useState<number>(1025);

  useEffect(()=>{
    if(window.innerWidth === undefined) return;
    setScreenWidth(window.innerWidth)
  },[])

  return (
    <div className="tradingAppWrapper">
      <Navbar />
      <div className="tradingLayoutWrapper">
        {screenWidth > 1024 ? <TradingHeader /> : <TradingHeaderMobile />}
        {screenWidth > 1024 ? (
          <div className="MidComponentWrapper">
            <TradingChart />
            <div className="OrderPlacingColumn">
              <OrderComponent />
            </div>
          </div>
        ) : (
          <div className="MidComponentWrapper">
            {mobileOption === "chart" ? (
              <TradingChart />
            ) : (
              <div className="OrderPlacingColumn">
                <OrderComponent />
              </div>
            )}
          </div>
        )}
        <PositionsComponent />
      </div>
      <PriceTickerComponent />
    </div>
  );
};

export default Index;
