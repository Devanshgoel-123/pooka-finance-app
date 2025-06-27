interface PriceData {
  symbol: string;
  price: number;
  timestamp: string;
  high24h: number;
  low24h: number;
}

export class DataStreamsService {
  async getLatestPrice(symbol: "ETH/USD" | "BTC/USD"): Promise<PriceData> {
    const response = await fetch(`/api/dataStreams?symbol=${symbol}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${symbol} price: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as PriceData;
  }

  async getAllPrices(): Promise<{ eth: PriceData; btc: PriceData }> {
    const [eth, btc] = await Promise.all([
      this.getLatestPrice("ETH/USD"),
      this.getLatestPrice("BTC/USD"),
    ]);

    return { eth, btc };
  }
}

export const dataStreamsService = new DataStreamsService();
