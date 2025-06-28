import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios from "axios";
import dotenv from "dotenv";
import { returnFormattedDate, getPastDate } from "@/utils/helperFunction";
dotenv.config()

interface ApiData{
    v:number,
    vw: number,
    o: number,
    c: number,
    h: number,
    l: number,
    t: number,
    n: number
}



export async function GET(request:NextRequest) {
    try{
      const { searchParams } = new URL(request.url);
      const perp = searchParams.get("perp");
      const timeFrame = searchParams.get("timeFrame") as "minute" | "day" | "month" | "week" | "hour" | "quarter";
     if(perp===undefined || perp==="" || perp===null) {
      return NextResponse.json(
        { error: `Error fetching data from Polygon API because of invalid perp name: ${perp}` },
        { status: 400 }
      );
     }
     const DATE_NOW=returnFormattedDate(new Date()) || "2024-08-09";
   
     const BASE_URL="https://api.polygon.io/v2/aggs/ticker";
     const DATE_TO= getPastDate() || "2025-06-05";
     const API_KEY=process.env.API_KEY;
     const CURRENCY_TICKER:string=perp.toString().replace("/","");
     const PARTS:"minute" | "day" | "month" | "week" | "hour" | "quarter"= timeFrame !==null ? timeFrame : "day";
     const URL_POLYGON=`${BASE_URL}/X:${CURRENCY_TICKER}/range/1/${PARTS}/${DATE_TO}/${DATE_NOW}?adjusted=true&sort=asc&apiKey=${API_KEY}`;
     const result=await axios.get(URL_POLYGON)

     const ohlcData = result.data.results.map((item:ApiData) => ({
        time: Math.floor(new Date(item.t).getTime() / 1000),
        open: item.o, 
        high: item.h, 
        low: item.l, 
        close: item.c, 
      }));
   return NextResponse.json(
        { data: ohlcData },
        { status: 200 }
      );
    }catch(err){
        console.error(err)
        return NextResponse.json(
            { error: "Error fetching data from Polygon API" },
            { status: 400 }
          );
    }

}

