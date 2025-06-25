"use client";
import React, { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import "./styles.scss";
import axios from "axios";
import { OHLC_DATA } from "@/store/types/types";
import { usePerpStore } from "@/store/PerpStore";
import { useShallow } from "zustand/react/shallow";
import { TradingChartSkeleton } from "../LoadingComponents/GraphSkeleton";
import TimeSelector from "./TimeSelector";

export const TradingChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [ohlcData, setOhlcData] = useState<OHLC_DATA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedPerp, timeFrame } = usePerpStore(
    useShallow((state) => ({
      selectedPerp: state.selectedPerp,
      timeFrame: state.timeframe,
    }))
  );


  const myPriceFormatter = Intl.NumberFormat("US", {
    style: "currency",
    currency: "USD",
  }).format;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#000000" },
        textColor: "#E0E0E0",
      },
      grid: {
        vertLines: { color: "#1A1A1A" },
        horzLines: { color: "#1A1A1A" },
      },
      height: 400,
      // width:chartWidth,
      autoSize:true,
      localization: {
        priceFormatter: myPriceFormatter,
      },
    });

    chartRef.current.priceScale("right").applyOptions({
      borderColor: "#1e1e1e",
      autoScale: false,
      barSpacing: 50,
      textColor: "#E0E0E0",
    });

    chartRef.current.timeScale().applyOptions({
      borderColor: "#1e1e1e",
      scaleMargins: {
        top: 0.1,
        bottom: 0.2,
      },
      textColor: "#E0E0E0",
    });

    const candleStickSeries = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: true,
      wickUpColor: "#26a69a",
      width:"100%",
      wickDownColor: "#ef5350",
    });
    candleStickSeries.setData(ohlcData);
    chartRef.current.timeScale().fitContent();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [ohlcData]);

  useEffect(() => {
    setLoading(true);
    const fetchOHLCData = async () => {
      try {
        const res = await axios.get("/api/OHLCData", {
          params: {
            perp: selectedPerp,
            timeFrame: timeFrame.value,
          },
        });
        const data = await res.data;
        setOhlcData(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch OHLC data:", err);
      }
    };
    fetchOHLCData();
  }, [selectedPerp, timeFrame]);

  return loading ? (
    <TradingChartSkeleton />
  ) : (
    <div className="candlestickChartWrapper">
      <TimeSelector />
      <div ref={chartContainerRef} className="chart" />
    </div>
  );
};
