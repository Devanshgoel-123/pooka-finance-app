
import { Abi } from "viem";
import { CONTRACT_ADDRESS_AVAX} from "@/utils/constants";
import { useAccount, useReadContract } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { UserDeposit } from "@/store/types/types";

interface Props{
    index:number;
}

export const useFetchParticularUserDeposit=({
    index
}:Props)=>{
    const {
        address
    }=useAccount()
  
  const {
    data,
    error,
    isError,
    isFetching
  } = useReadContract({
    abi: PERPS_ABI as Abi,
    address:CONTRACT_ADDRESS_AVAX as `0x${string}`,
    functionName: 'deposits',
    args: [
        address,
        index
    ],
    query:{
        enabled: address!==undefined,
    },
  });
  console.log(data);
  if(isError){
    console.log("Error fetching the deposit count for user",error)
  }
   console.log("The user deposit is", data)
   const userDeposit=data as UserDeposit;
   return {
    userDeposit,
    isFetching
   }   

}