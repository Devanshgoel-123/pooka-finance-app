
import { useAccount, useReadContract } from "wagmi"
import { PRICE_ORACLE_ABI } from "@/components/ABI/PriceOracleABI"
import { CONTRACT_ADDRESS_PRICE_FEED_AVAX } from "@/utils/constants"

interface Props{
    tokenName:string
}

export const useFetchTokenPriceInUsd=({
    tokenName
}:Props)=>{
    const {
        address
    }=useAccount();
    const {
        data,
        isError,
        isSuccess,
        isFetching
    }=useReadContract({
        abi:PRICE_ORACLE_ABI,
        address:CONTRACT_ADDRESS_PRICE_FEED_AVAX,
        account:address,
        args:[
            tokenName
        ]
    });

    console.log(`The price for ${tokenName} is ${data}`);
    return {
        data,
        isError,
        isSuccess,
        isFetching
    }

}