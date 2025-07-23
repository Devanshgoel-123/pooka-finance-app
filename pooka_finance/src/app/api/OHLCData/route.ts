import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios from "axios";
import dotenv from "dotenv";
import { returnFormattedDate, getPastDate } from "@/utils/helperFunction";
dotenv.config();

interface ApiData {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
  n: number;
}

const getAPIKey=(retryId:number):string=>{
  switch (retryId) {
    case 0:
      return process.env.API_KEY as string;
    case 1:
      return process.env.API_KEY1 as string;
    case 2:
      return process.env.API_KEY2 as string;
    default:
      return process.env.API_KEY as string;
  }
}

async function fetchDataWithRetries(url: string, retries = 3, delayMs = 1000) {
  
  

  for (let i = 0; i < retries; i++) {
    const API_KEY:string =getAPIKey(i);
    try {
      const result = await axios.get(`${url}=${API_KEY}`);
      return result;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const perp = searchParams.get("perp");
    const timeFrame = searchParams.get("timeFrame") as
      | "minute"
      | "day"
      | "month"
      | "week"
      | "hour"
      | "quarter";

    if (!perp) {
      return NextResponse.json(
        {
          error: `Error fetching data from Polygon API because of invalid perp name: ${perp}`,
        },
        { status: 400 }
      );
    }

    const DATE_NOW = returnFormattedDate(new Date()) || "2024-08-09";
    const DATE_TO = getPastDate() || "2025-06-05";
   
    const CURRENCY_TICKER: string = perp.toString().replace("/", "");
    const PARTS =
      timeFrame !== null ? timeFrame : "day";

    const URL_POLYGON = `https://api.polygon.io/v2/aggs/ticker/X:${CURRENCY_TICKER}/range/1/${PARTS}/${DATE_TO}/${DATE_NOW}?adjusted=true&sort=asc&apiKey`;

    const result = await fetchDataWithRetries(URL_POLYGON, 3);
    if(result===undefined){
      return NextResponse.json(
        { error: "Error fetching data from Polygon API" },
        { status: 400 }
      );
    }
    const ohlcData = result.data.results.map((item: ApiData) => ({
      time: Math.floor(new Date(item.t).getTime() / 1000),
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
    }));

    return NextResponse.json({ data: ohlcData }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error fetching data from Polygon API" },
      { status: 400 }
    );
  }
}
