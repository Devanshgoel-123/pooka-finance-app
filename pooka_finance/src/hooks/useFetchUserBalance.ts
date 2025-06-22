import {useReadContract } from "wagmi"
import { useAccount } from "wagmi";
import {PERPS_ABI} from "@/components/ABI/PookaFinanceABI";
import { Abi} from "viem";
import { CONTRACT_ADDRESS_AVAX} from "@/utils/constants";

export const useFetchUserBalance = () =>{
  const {address, isConnected}=useAccount();

  const {
    data,
    isSuccess,
    isError
  } = useReadContract({
    abi: PERPS_ABI as Abi,
    address: CONTRACT_ADDRESS_AVAX as `0x${string}`,
    functionName: 'balances',
    args: [
        address
    ],
    query:{
      enabled:isConnected
    }
  });

  console.log("The balance of user is", data, isSuccess, isError);
   const userDepositbalance=Number(data)/10**18 || 0;
   return {
    userDepositbalance
   }   

}