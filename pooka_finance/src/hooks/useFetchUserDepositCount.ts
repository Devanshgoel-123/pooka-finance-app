
import { Abi } from "viem";
import { CONTRACT_ADDRESS_AVAX} from "@/utils/constants";
import { useAccount, useReadContract } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";



export const useFetchUserDepositCount=()=>{
    const {
        address
    }=useAccount()
  
  const {
    data,
    error,
    isError,
    isLoading
  } = useReadContract({
    abi: PERPS_ABI as Abi,
    address:CONTRACT_ADDRESS_AVAX as `0x${string}`,
    functionName: 'userDepositCount',
    args: [
        address
    ],
    query:{
        enabled: address!==undefined,
    },
  });
  if(isError){
    console.log("Error fetching the deposit count for user",error)
  }
  console.log("userDeposit Count",data)
   const userDepositCount=Number(data) as number;
   return {
    userDepositCount,
    isLoading,
    isError
   }   

}