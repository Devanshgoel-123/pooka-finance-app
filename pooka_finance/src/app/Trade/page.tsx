"use client";

import React from "react";
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

const Index = () => {
  const { mobileOption } = usePerpStore(
    useShallow((state) => ({
      mobileOption: state.mobileOption,
    }))
  );
  const screenWidth: number = window.innerWidth;

  return (
    <div className="tradingAppWrapper">
      <Navbar />
      <div className="tradingLayoutWrapper">
        {screenWidth > 768 ? <TradingHeader /> : <TradingHeaderMobile />}
        {screenWidth > 768 ? (
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
