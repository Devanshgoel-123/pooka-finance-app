import {create} from "zustand";

interface WalletStore{
    userWalletAddress:string | undefined;
    setUserWalletAddress:(walletAddress : string | undefined)=>void;
    userDeposit:number;
    setUserDeposit:(deposit:number)=>void;
}


export const useWalletStore=create<WalletStore>((set) => ({
    userWalletAddress:undefined,
    setUserWalletAddress:(walletAddress:(string | undefined))=>{
    set(()=>({
        userWalletAddress:walletAddress
    }))
    },
    userDeposit:0,
    setUserDeposit:(deposit:number)=>{
        set(()=>({
            userDeposit:deposit
        }))
    }
}))