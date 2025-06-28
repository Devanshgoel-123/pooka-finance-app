import { useEffect, useCallback, useState } from "react";
import { dataStreamsService } from "@/services/dataStreams";
import { useFetchMarketData } from "./useFetchMarketData";
import { usePerpStore } from "@/store/PerpStore";
import { useShallow } from "zustand/react/shallow";
import { FALLBACK_VALUES } from "@/utils/constants";
import axios from "axios";
import { OHLC_DATA, PerpPriceInfo, PriceData } from "@/store/types/types";
import { isDataCorrupted } from "@/utils/helperFunction";
class OHLCService {
  static async fetchOHLCData(symbol: string): Promise<OHLC_DATA | null> {
    const response = await axios.get(
      `/api/OHLCData?perp=${symbol}&timeFrame=day`
    );
    if (!response.data) throw new Error("OHLC API failed");
    console.log("Data from polygon api",response.data.data[response.data.data.length - 1])
    const dataElement=response.data.data[response.data.data.length - 1];
    return dataElement || null;
  }
}



export function useUnifiedPriceFeeds(){
  const [ethPrice, setEthPrice]=useState<number>(FALLBACK_VALUES.ETH.price);
  const [btcPrice, setBtcPrice]=useState<number>(FALLBACK_VALUES.BTC.price);
  const { selectedPerp } = usePerpStore(
    useShallow((state) => ({
      selectedPerp: state.selectedPerp,
    }))
  );

  const {
    marketData: avaxMarketData,
    isLoading: avaxLoading,
    isError: avaxError,
  } = useFetchMarketData();

  const updatePriceData = (perpData: PriceData, setPrice:boolean) => {
    const ohlcData:PerpPriceInfo={
      time:perpData.timestamp,
      low:perpData.low24h,
      high:perpData.high24h,
      price:perpData.price
    }
    if(setPrice && selectedPerp.toLowerCase().includes("eth")){
      setEthPrice(ohlcData.price)
    }
    if(setPrice && selectedPerp.toLowerCase().includes("btc")){
      setBtcPrice(ohlcData.price)
    }
    usePerpStore.getState().setCurrentPerpOhlcData(ohlcData)
    if(setPrice){
      usePerpStore.getState().setCurrentPerpPrice(perpData.price)
    }
   
  };

  // Helper function to use fallback values
  const callFallbackValues = () => {
    console.log("🔧 Using hardcoded fallback values");
    const fallBackValue = selectedPerp.toLowerCase().includes("eth") ? FALLBACK_VALUES.ETH : FALLBACK_VALUES.BTC;

    const ohlcData:PerpPriceInfo={
      time:fallBackValue.timestamp,
      low:fallBackValue.low24h,
      high:fallBackValue.high24h,
      price:fallBackValue.price
    }
    usePerpStore.getState().setCurrentPerpOhlcData(ohlcData)
    usePerpStore.getState().setCurrentPerpPrice(fallBackValue.price)
  };

  // Fetch from DataStreams (Tier 1)
  const fetchDataStreams = async (): Promise<PriceData> => {
    try {
      const data: PriceData = await dataStreamsService.getLatestPrice(
        selectedPerp
      );
      console.log("The data received in streams",data);
      const corruptedData = isDataCorrupted(selectedPerp, data.price);

      if (corruptedData) {
        console.warn("🚨 DataStreams corruption detected: for ", {
          data,
        });
        throw new Error("DataStreams data corruption detected");
      }

      return data;
    } catch (error) {
      console.warn("DataStreams failed:", error);
      throw error;
    }
  };

  const getAvaxContractData = useCallback(
    (symbol: string): PriceData | null => {
      if (avaxLoading || avaxError || !avaxMarketData) return null;

      // VALIDATE AVALANCHE CONTRACT DATA
      const price = avaxMarketData.currentPrice;

      // Check for zero/invalid prices
      if (price <= 0) {
        console.warn(
          `Avalanche contract returned invalid price: ${price} for ${symbol}`
        );
        return null;
      }

      // Check if data is corrupted (same validation as DataStreams)
      if (isDataCorrupted(symbol, price)) {
        console.warn(
          `Avalanche contract corruption detected for ${symbol}: ${price}`
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
      };
    },
    [avaxMarketData, avaxLoading, avaxError]
  );

  // Fetch from OHLC API (Tier 3)
  const fetchOHLCData = async (): Promise<PriceData | null> => {
    try {
      const perpData = await OHLCService.fetchOHLCData(selectedPerp);
      if (perpData === null) return null;
      const priceDataObject:PriceData={
        symbol:selectedPerp,
        price:perpData?.open || 0.00,
        timestamp:perpData?.time,
        high24h:perpData.high,
        low24h:perpData.low
      }
      return priceDataObject;
    } catch (error) {
      console.warn("OHLC API failed:", error);
      throw error;
    }
  };

  const fetchPrices = async () => {

    try {
      // TIER 2: Try Avalanche Contract
      const contractOracleData = getAvaxContractData(selectedPerp);
      if (contractOracleData !== null) {
        console.log("✅ Avalanche contract success");
        updatePriceData(contractOracleData, true);
      const datastreamResult = await fetchDataStreams();
      if(dataStreamsService !==undefined){
        updatePriceData(datastreamResult, false)
      }else{
        console.log("🔄 Attempting OHLC API fallback...");
        const ohlcResult = await fetchOHLCData();
        if(ohlcResult !== null){
          updatePriceData(ohlcResult, false)
        }else{
          callFallbackValues()
        }
      }
    }else{
      const ohlcResult = await fetchOHLCData();
        if(ohlcResult !== null){
          updatePriceData(ohlcResult, true)
        }else{
          callFallbackValues()
        }
    }
    } catch (error) {
      console.log("Avalanche contract failed, trying OHLC...", error);
    }

    // try {
    //   // TIER 3: Try OHLC API as final fallback
    

    //   if (ohlcResult !== null) {
    //     console.log("✅ OHLC API success");
    //     updatePriceData(ohlcResult);
    //     return;
    //   }
    // } catch (error) {
    //   console.error("❌ All price feed sources failed", error);
    // }

    // try {
    //   // TIER 1: Try DataStreams first
    //   console.log("🚀 Attempting DataStreams...");
     

    //   if (datastreamResult.price) {
    //     console.log("✅ DataStreams success");
    //     updatePriceData(datastreamResult);
    //     return;
    //   }
    // } catch (error) {
    //   console.log("DataStreams failed, trying Avalanche contract...", error);
    // }
    
    
    console.log("🔄 All sources failed, using fallback values");
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 45 * 1000);
    return () => clearInterval(interval);
  }, [selectedPerp]);

  return {
    refetch: fetchPrices,
    ethPrice,
    btcPrice
  };
}
