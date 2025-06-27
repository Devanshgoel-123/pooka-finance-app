import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

interface StreamsReport {
  feedID: string;
  validFromTimestamp: string;
  observationsTimestamp: string;
  fullReport: string;
}

interface StreamsResponse {
  report: StreamsReport;
}

interface BulkStreamsResponse {
  reports: StreamsReport[];
}

const FEED_IDS = {
  "ETH/USD":
    "0x000359843a543ee2fe414dc14c7e7920ef10f4372990b79d6361cdc0dd1ba782",
  "BTC/USD":
    "0x00037da06d56d083fe599397a4769a042d63aa73dc4ef57709d31e9971a5b439",
} as const;

const BASE_URL = "https://api.testnet-dataengine.chain.link";

function generateAuthHeaders(
  method: string,
  path: string,
  apiKey: string,
  apiSecret: string
) {
  const timestamp = Date.now();
  const bodyHash = crypto.createHash("sha256").update("").digest("hex");
  const stringToSign = `${method} ${path} ${bodyHash} ${apiKey} ${timestamp}`;
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(stringToSign)
    .digest("hex");

  return {
    Authorization: apiKey,
    "X-Authorization-Timestamp": timestamp.toString(),
    "X-Authorization-Signature-SHA256": signature,
  };
}

function extractPrice(fullReport: string): number {
  try {
    const buffer = Buffer.from(fullReport.slice(2), "hex");
    const priceStart = 32;
    const priceEnd = 64;

    if (buffer.length >= priceEnd) {
      const priceHex = buffer.slice(priceStart, priceEnd).toString("hex");
      const priceWei = BigInt("0x" + priceHex);

      return Number(priceWei) / 1e2;
    }

    return 0;
  } catch (error) {
    console.error("Error extracting price:", error);
    return 0;
  }
}

async function get24hHighLow(
  feedId: string,
  apiKey: string,
  apiSecret: string
) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const twentyFourHoursAgo = now - 24 * 60 * 60;

    const path = `/api/v1/reports/page?feedID=${feedId}&startTimestamp=${twentyFourHoursAgo}&limit=50`;
    const headers = generateAuthHeaders("GET", path, apiKey, apiSecret);

    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      console.warn("Failed to fetch 24h data, using simulation");
      return null;
    }

    const data: BulkStreamsResponse = await response.json();

    if (!data.reports || data.reports.length === 0) {
      return null;
    }

    const prices = data.reports
      .map((report) => extractPrice(report.fullReport))
      .filter((price) => price > 0);

    if (prices.length === 0) {
      return null;
    }

    return {
      high24h: Math.max(...prices),
      low24h: Math.min(...prices),
      dataPoints: prices.length,
    };
  } catch (error) {
    console.error("Error fetching 24h data:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol || !(symbol in FEED_IDS)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }

  const apiKey = process.env.STREAMS_API_KEY;
  const apiSecret = process.env.STREAMS_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "API credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const feedId = FEED_IDS[symbol as keyof typeof FEED_IDS];

    // Get current price
    const currentPath = `/api/v1/reports/latest?feedID=${feedId}`;
    const currentHeaders = generateAuthHeaders(
      "GET",
      currentPath,
      apiKey,
      apiSecret
    );

    const currentResponse = await fetch(`${BASE_URL}${currentPath}`, {
      method: "GET",
      headers: currentHeaders,
    });

    if (!currentResponse.ok) {
      throw new Error(`API responded with status: ${currentResponse.status}`);
    }

    const currentData: StreamsResponse = await currentResponse.json();
    const currentPrice = extractPrice(currentData.report.fullReport);

    // Try to get real 24h high/low
    const historical = await get24hHighLow(feedId, apiKey, apiSecret);

    let high24h: number;
    let low24h: number;
    let dataSource: string;

    if (historical && historical.dataPoints > 5) {
      // Use real data if we have enough points
      high24h = historical.high24h;
      low24h = historical.low24h;
      dataSource = `real_${historical.dataPoints}_points`;
    } else {
      // Fallback to realistic simulation
      high24h = currentPrice * 1.02; // +2%
      low24h = currentPrice * 0.98; // -2%
      dataSource = "simulated";
    }

    return NextResponse.json({
      symbol,
      price: currentPrice,
      timestamp: currentData.report.observationsTimestamp,
      high24h,
      low24h,
      dataSource,
    });
  } catch (error) {
    console.error("Error fetching data streams:", error);
    return NextResponse.json(
      { error: "Failed to fetch price data" },
      { status: 500 }
    );
  }
}
