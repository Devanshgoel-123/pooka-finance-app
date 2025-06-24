import { AVAX_TOKEN, ETH_TOKEN, NATIVE_TOKEN_AVAX, NATIVE_TOKEN_SEPOLIA, PERP_MM, USDC_TOKEN, USDC_TOKEN_AVAX, USDC_TOKEN_SEPOLIA } from "./constants";

export const NormalizeContractData=(value:bigint)=>{
    return Number(value)/10**8;
}

export const getPastDate = (): string => {
    const now = new Date();
    now.setFullYear(now.getFullYear() - 1);
    now.setMonth(now.getMonth() - 5);
    now.setDate(now.getDate() - 29);
    const result=returnFormattedDate(now)
    return result
};

export const returnFormattedDate=(now:Date):string=>{
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0"); 
    const dd = String(now.getDate()).padStart(2, "0");
  
    return `${yyyy}-${mm}-${dd}`;
}


export const getPerpName=(name:string)=>{
    if(name.toLowerCase().includes("eth")){
        return "ETH/USD"
    }else if(name.toLowerCase().includes('btc') || (name.toLowerCase().includes("bit"))){
        return "BTC/USD"
    }else{
        return "BTC/USD"
    }
}

export const getPerpImage=(name:string)=>{
    if(name.toLowerCase().includes("eth")){
        return "/assets/eth.svg"
    }else if(name.toLowerCase().includes('btc') || (name.toLowerCase().includes("bit"))){
        return "/assets/btc.svg"
    }else{
        return "/assets/btc.svg"
    }
}

export const getChainImage=(chainName:string)=>{
    if(chainName.toLowerCase().includes("eth")){
        return '/assets/eth.svg'
    }else{
        return '/assets/avax.svg'
    }
}


export const tokenImageForAddress=(address:string)=>{
    if(address === USDC_TOKEN_SEPOLIA || address===USDC_TOKEN_AVAX){
        return USDC_TOKEN
    }else if(address === NATIVE_TOKEN_AVAX){
        return AVAX_TOKEN
    }else if(address === NATIVE_TOKEN_SEPOLIA){
        return ETH_TOKEN
    }else{
        return ETH_TOKEN
    }
}
export const getTokenImage=(token:string)=>{
    if(token.toLowerCase().includes('u')){
        return '/assets/usdc.svg'
    }else{
        return '/assets/eth.svg'
    }
}


export const getPositionSize=(leverage:string, collateral:string)=>{
   return Number(leverage)*Number(collateral);
}

export const getLiquidationPrice=(collateral:string, leverage:string, perpName:string)=>{
    const maintenance_margin=getMaintenanceMargin(perpName);
    const positionAmount=Number(collateral)*Number(leverage);
    const liquidationPrice=positionAmount*(maintenance_margin);
    return liquidationPrice
}

export const getMaintenanceMargin=(perpName:string)=>{
    if(perpName.toLowerCase().includes("eth")){
        return (PERP_MM.ETH/100)
    }else{
        return (PERP_MM.BTC/100)
    }
}