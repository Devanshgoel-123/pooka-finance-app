import {CONTRACT_ADDRESS_AVAX, FALLBACK_VALUES, PERP_MM, USDC_TOKEN_AVAX } from "@/utils/constants";
import {create} from "zustand";
import { PerpPriceInfo, TimeFrame } from "./types/types";
import { avalancheFuji } from "viem/chains";
interface PerpStore{
    selectedPerp:string;
    leverage:string;
    maintenanceMargin : number;
    timeframe:TimeFrame;
    actionType:string | undefined;
    mobileOption:string;
    perps_contract_address:string;
    payToken:string;
    payChain:number;
    currentPerpPrice:number;
    collateralAmount:string;
    currentPerpOhlcData:PerpPriceInfo;
    setMaintenanceMargin: (maintenanceMargin : number) => void;
    setSelectedPerp:(perp:string)=>void;
    setLeverage:(leverage:string)=>void;
    setTimeFrame:(timeframe:TimeFrame)=>void;
    setActionType:(action:string)=>void;
    setMobileOption:(name:string)=>void;
    setPayToken:(address:string)=>void;
    setPerpsContractAddress:(address:string)=>void;
    setPayChain:(chainId:number)=>void;
    setCollateralAmount:(amount:string)=>void;
    setCurrentPerpPrice:(amount:number)=>void;
    setCurrentPerpOhlcData:(data:PerpPriceInfo)=>void;
}


export const usePerpStore=create<PerpStore>((set) => ({
    selectedPerp:"BTC/USD",
    leverage:"1",
    timeframe:{
        value:"day",
        label:"3D"
    },
    currentPerpPrice:FALLBACK_VALUES.BTC.price,
    currentPerpOhlcData: {
        high: 0,
        low: 0,
        time: 0,
        price:0
    },
    collateralAmount:"0.00",
    payChain:avalancheFuji.id,
    payToken:USDC_TOKEN_AVAX,
    perps_contract_address:CONTRACT_ADDRESS_AVAX,
    mobileOption:"chart",
    maintenanceMargin:PERP_MM.BTC,
    actionType:undefined,
    setPerpsContractAddress:(address:string)=>{
        set(()=>({
            perps_contract_address:address
        }))
    },
    setSelectedPerp: (perp:string)=>{
    set(()=>({
        selectedPerp:perp
    }))
    },
    setLeverage:(leverage:string)=>{
        set(()=>({
            leverage:leverage
    }))
    },
    setMaintenanceMargin:(margin:number)=>{
        set(()=>({
            maintenanceMargin:margin
        }))
    },
    setTimeFrame:(timeframe:TimeFrame)=>{
        set(()=>({
            timeframe:timeframe
        }))
    },
    setActionType:(action:string)=>{
        set(()=>({
            actionType:action
        }))
    },
    setMobileOption:(name:string)=>{
        set(()=>({
            mobileOption:name
        }))
    },
    setPayToken:(address:string)=>{
       set(()=>({
        payToken:address
       }))
    },
    setPayChain:(chainId:number)=>{
        set(()=>({
            payChain:chainId
        }))
    },
    setCollateralAmount:(amount:string)=>{
        set(()=>({
            collateralAmount:amount
        }))
    },
    setCurrentPerpPrice:(amount:number)=>{
        set(()=>({
            currentPerpPrice:amount
        }))
    },
    setCurrentPerpOhlcData:(data:PerpPriceInfo)=>{
        set(()=>({
          currentPerpOhlcData:data
        }))
    }
}))