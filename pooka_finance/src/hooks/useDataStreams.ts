import { useState, useEffect } from "react";
import { dataStreamsService } from "@/services/dataStreams";

interface PriceData {
  symbol: string;
  price: number;
  timestamp: string;
  high24h: number;
  low24h: number;
}

interface UseDataStreamsReturn {
  ethPrice: number;
  btcPrice: number;
  ethData: PriceData | null;
  btcData: PriceData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDataStreams(): UseDataStreamsReturn {
  const [ethPrice, setEthPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [ethData, setEthData] = useState<PriceData | null>(null);
  const [btcData, setBtcData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    // Only show loading on first fetch, not on updates
    if (ethPrice === 0 && btcPrice === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const { eth, btc } = await dataStreamsService.getAllPrices();

      // Only update if we got valid prices
      if (eth.price > 0) {
        setEthPrice(eth.price);
        setEthData(eth);
      }

      if (btc.price > 0) {
        setBtcPrice(btc.price);
        setBtcData(btc);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch prices";
      setError(errorMessage);
      console.error("Failed to fetch prices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();

    // Update every 30 seconds for hackathon (more frequent than your 15 min)
    const interval = setInterval(fetchPrices, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    ethPrice,
    btcPrice,
    ethData,
    btcData,
    isLoading,
    error,
    refetch: fetchPrices,
  };
}
