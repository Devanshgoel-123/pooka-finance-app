interface PriceData {
  symbol: string;
  price: number;
  timestamp: string;
  high24h: number;
  low24h: number;
}

export class DataStreamsService {
  async getLatestPrice(symbol: string): Promise<PriceData> {
    const response = await fetch(`/api/dataStreams?symbol=${symbol}`);
 
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${symbol} price: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as PriceData;
  }

}

export const dataStreamsService = new DataStreamsService();
