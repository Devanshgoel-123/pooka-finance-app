import { PERP_MM } from "@/utils/constants";
import {create} from "zustand";
import { TimeFrame } from "./types/types";
interface PerpStore{
    selectedPerp:string;
    leverage:string;
    maintenanceMargin : number;
    timeframe:TimeFrame;
    actionType:string | undefined;
    setMaintenanceMargin: (maintenanceMargin : number) => void;
    setSelectedPerp:(perp:string)=>void;
    setLeverage:(leverage:string)=>void;
    setTimeFrame:(timeframe:TimeFrame)=>void;
    setActionType:(action:string)=>void;
}


export const usePerpStore=create<PerpStore>((set) => ({
    selectedPerp:"BTC/USD",
    leverage:"1",
    timeframe:{
        value:"day",
        label:"3D"
    },
    maintenanceMargin:PERP_MM.BTC,
    actionType:undefined,
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
    }
}))