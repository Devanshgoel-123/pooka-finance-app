/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import { dataStreamsService } from "@/services/dataStreams";
import { useFetchMarketData } from "./useFetchMarketData";
import { usePerpStore } from "@/store/PerpStore";
import { useShallow } from "zustand/react/shallow";

interface PriceData {
  symbol: string;
  price: number;
  timestamp: string | number;
  high24h: number;
  low24h: number;
  dataSource:
    | "datastreams"
    | "avalanche_contract"
    | "ohlc_polygon"
    | "last_known"
    | "none"
    | "fallback_hardcoded";
  error?: string;
}

interface UseUnifiedPriceFeedsReturn {
  ethPrice: number;
  btcPrice: number;
  ethData: PriceData | null;
  btcData: PriceData | null;
  isLoading: boolean;
  error: string | null;
  dataSource: string;
  refetch: () => Promise<void>;
}

// OHLC Service for Polygon API fallback
class OHLCService {
  private static async fetchOHLCData(symbol: string): Promise<any[]> {
    const response = await fetch(`/api/OHLCData?perp=${symbol}&timeFrame=day`);
    if (!response.ok) throw new Error("OHLC API failed");
    const data = await response.json();
    return data.data || [];
  }

  static async getPrice(symbol: string): Promise<PriceData> {
    try {
      const ohlcData = await this.fetchOHLCData(symbol);

      if (!ohlcData || ohlcData.length === 0) {
        throw new Error("No OHLC data available");
      }

      // Get latest data point
      const latest = ohlcData[ohlcData.length - 1];
      const price = latest.close;

      // Calculate 24h high/low from recent data
      const recent24h = ohlcData.slice(-24); // Last 24 data points
      const high24h = Math.max(...recent24h.map((d: any) => d.high));
      const low24h = Math.min(...recent24h.map((d: any) => d.low));

      return {
        symbol,
        price,
        timestamp: latest.time,
        high24h,
        low24h,
        dataSource: "ohlc_polygon",
      };
    } catch (error) {
      throw new Error(`OHLC fetch failed: ${error}`);
    }
  }
}

// Data corruption detection
const isDataCorrupted = (symbol: string, price: number): boolean => {
  if (symbol.includes("ETH") && price > 50000) return true; // ETH showing BTC price
  if (symbol.includes("BTC") && price < 10000) return true; // BTC showing ETH price
  if (price <= 0) return true; // Invalid price
  return false;
};

// Hardcoded fallback values
const FALLBACK_VALUES = {
  ETH: {
    symbol: "ETH/USD",
    price: 2439,
    timestamp: Date.now(),
    high24h: 2490,
    low24h: 2380,
    dataSource: "fallback_hardcoded" as const,
  },
  BTC: {
    symbol: "BTC/USD",
    price: 109012,
    timestamp: Date.now(),
    high24h: 111000,
    low24h: 107000,
    dataSource: "fallback_hardcoded" as const,
  },
};

export function useUnifiedPriceFeeds(): UseUnifiedPriceFeedsReturn {
  const [ethPrice, setEthPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [ethData, setEthData] = useState<PriceData | null>(null);
  const [btcData, setBtcData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("none");

  // Store last known good values
  const [lastKnownEthData, setLastKnownEthData] = useState<PriceData | null>(
    null
  );
  const [lastKnownBtcData, setLastKnownBtcData] = useState<PriceData | null>(
    null
  );
  const { selectedPerp } = usePerpStore(
    useShallow((state) => ({
      selectedPerp: state.selectedPerp,
    }))
  );

  // Get Avalanche contract data as fallback
  const {
    marketData: avaxMarketData,
    isLoading: avaxLoading,
    isError: avaxError,
  } = useFetchMarketData();
  // Helper function to update data and store as last known good values
  const updatePriceData = (
    ethResult: PriceData,
    btcResult: PriceData,
    source: string
  ) => {
    setEthData(ethResult);
    setBtcData(btcResult);
    setEthPrice(ethResult.price);
    setBtcPrice(btcResult.price);
    setDataSource(source);

    // Store as last known good values
    setLastKnownEthData(ethResult);
    setLastKnownBtcData(btcResult);

    setIsLoading(false);
    setError(null);
  };

  // Helper function to use fallback values
  const useFallbackValues = () => {
    // Try last known values first
    if (lastKnownEthData && lastKnownBtcData) {
      console.log("📦 Using last known values");
      setEthData({ ...lastKnownEthData, dataSource: "last_known" });
      setBtcData({ ...lastKnownBtcData, dataSource: "last_known" });
      setEthPrice(lastKnownEthData.price);
      setBtcPrice(lastKnownBtcData.price);
      setDataSource("Last Known Values");
    } else {
      // Use hardcoded fallback values
      console.log("🔧 Using hardcoded fallback values");
      setEthData(FALLBACK_VALUES.ETH);
      setBtcData(FALLBACK_VALUES.BTC);
      setEthPrice(FALLBACK_VALUES.ETH.price);
      setBtcPrice(FALLBACK_VALUES.BTC.price);
      setDataSource("Hardcoded Fallback");
    }
    setIsLoading(false);
    setError(null);
  };

  // Fetch from DataStreams (Tier 1)
  const fetchDataStreams = async (): Promise<{
    eth: PriceData | null;
    btc: PriceData | null;
  }> => {
    try {
      const { eth, btc } = await dataStreamsService.getAllPrices();

      // Check for corruption
      const ethCorrupted = isDataCorrupted("ETH/USD", eth.price);
      const btcCorrupted = isDataCorrupted("BTC/USD", btc.price);

      if (ethCorrupted || btcCorrupted) {
        console.warn("🚨 DataStreams corruption detected:", {
          ethPrice: eth.price,
          btcPrice: btc.price,
          ethCorrupted,
          btcCorrupted,
        });
        throw new Error("DataStreams data corruption detected");
      }

      return {
        eth: { ...eth, dataSource: "datastreams" as const },
        btc: { ...btc, dataSource: "datastreams" as const },
      };
    } catch (error) {
      console.warn("DataStreams failed:", error);
      throw error;
    }
  };

  // Convert Avalanche contract data to our format (Tier 2)
  const getAvaxContractData = useCallback(
    (symbol: string): PriceData | null => {
      if (avaxLoading || avaxError || !avaxMarketData) return null;

      // VALIDATE AVALANCHE CONTRACT DATA
      const price = avaxMarketData.currentPrice;

      // Check for zero/invalid prices
      if (price <= 0) {
        console.warn(
          `🚨 Avalanche contract returned invalid price: ${price} for ${symbol}`
        );
        return null;
      }

      // Check if data is corrupted (same validation as DataStreams)
      if (isDataCorrupted(symbol, price)) {
        console.warn(
          `🚨 Avalanche contract corruption detected for ${symbol}: ${price}`
        );
        return null;
      }

      // Validate 24h data too
      if (avaxMarketData.price24hHigh <= 0 || avaxMarketData.price24hLow <= 0) {
        console.warn(`🚨 Avalanche contract invalid 24h data for ${symbol}`);
        return null;
      }

      return {
        symbol,
        price: avaxMarketData.currentPrice,
        timestamp: Date.now(),
        high24h: avaxMarketData.price24hHigh,
        low24h: avaxMarketData.price24hLow,
        dataSource: "avalanche_contract",
      };
    },
    [avaxMarketData, avaxLoading, avaxError]
  );

  // Fetch from OHLC API (Tier 3)
  const fetchOHLCData = async (): Promise<{
    eth: PriceData | null;
    btc: PriceData | null;
  }> => {
    try {
      const [eth, btc] = await Promise.all([
        OHLCService.getPrice("ETH/USD"),
        OHLCService.getPrice("BTC/USD"),
      ]);

      return { eth, btc };
    } catch (error) {
      console.warn("OHLC API failed:", error);
      throw error;
    }
  };

  // Main fetch logic with cascading fallbacks
  const fetchPrices = async () => {
    if (ethPrice === 0 && btcPrice === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      // TIER 1: Try DataStreams first
      console.log("🚀 Attempting DataStreams...");
      const datastreamResult = await fetchDataStreams();

      if (datastreamResult.eth && datastreamResult.btc) {
        console.log("✅ DataStreams success");
        updatePriceData(
          datastreamResult.eth,
          datastreamResult.btc,
          "DataStreams (Chainlink)"
        );
        return;
      }
    } catch (error) {
      console.log("❌ DataStreams failed, trying Avalanche contract...");
    }

    try {
      // TIER 2: Try Avalanche Contract
      const ethContractData = getAvaxContractData("ETH/USD");
      const btcContractData = getAvaxContractData("BTC/USD");

      if (ethContractData && btcContractData) {
        console.log("✅ Avalanche contract success");
        updatePriceData(ethContractData, btcContractData, "Avalanche Contract");
        return;
      }
    } catch (error) {
      console.log("❌ Avalanche contract failed, trying OHLC...");
    }

    try {
      // TIER 3: Try OHLC API as final fallback
      console.log("🔄 Attempting OHLC API fallback...");
      const ohlcResult = await fetchOHLCData();

      if (ohlcResult.eth && ohlcResult.btc) {
        console.log("✅ OHLC API success");
        updatePriceData(ohlcResult.eth, ohlcResult.btc, "OHLC (Polygon.io)");
        return;
      }
    } catch (error) {
      console.error("❌ All price feed sources failed");
    }

    // All sources failed - use fallback values
    console.log("🔄 All sources failed, using fallback values");
    useFallbackValues();
  };

  useEffect(() => {
    fetchPrices();

    // Update every 30 seconds
    const interval = setInterval(fetchPrices, 30 * 1000);
    return () => clearInterval(interval);
  }, [selectedPerp]); // Re-fetch when selected perp changes

  return {
    ethPrice,
    btcPrice,
    ethData,
    btcData,
    isLoading,
    error,
    dataSource,
    refetch: fetchPrices,
  };
}
