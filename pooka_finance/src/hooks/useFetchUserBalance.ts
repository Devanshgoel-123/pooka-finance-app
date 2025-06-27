import {useReadContract } from "wagmi"
import { useAccount } from "wagmi";
import {PERPS_ABI} from "@/components/ABI/PookaFinanceABI";
import { Abi} from "viem";
import { CONTRACT_ADDRESS_AVAX} from "@/utils/constants";

export const useFetchUserDepositBalance = () =>{
  const {address, isConnected}=useAccount();

  const {
    data,
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
   const userDepositbalance=Number(data)/10**6 || 0;
   console.log(userDepositbalance)
   return {
    userDepositbalance
   }   

}