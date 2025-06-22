"use client"

import React from "react";
import { Navbar } from "@/components/Navbar";
import { TradingChart } from "@/components/TradingChart";
import { TradingHeader } from "@/components/TradingHeader";
import { PriceTickerComponent } from "@/components/PriceTicker";
import { OrderComponent } from "@/components/TradingPanel";
import "../global.css";
import "./styles.scss";
import { PositionsComponent } from "@/components/PositionsComp";
import { useFetchUserBalance } from "@/hooks/useFetchUserBalance";

const Index = () => {
  const {
    userDepositBalance
  }=useFetchUserBalance();
  return (
    <div className="tradingAppWrapper">
      <Navbar />
      <div className="tradingLayoutWrapper">
        <TradingHeader />
        <div className="MidComponentWrapper">
          <TradingChart />
          <div className="OrderPlacingColumn">
            <OrderComponent />
          </div>
        </div>
        <PositionsComponent/>
      </div>
      <PriceTickerComponent />
    </div>
  );
};

export default Index;

