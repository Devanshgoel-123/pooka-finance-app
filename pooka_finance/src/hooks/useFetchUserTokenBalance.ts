import {useReadContract } from "wagmi"
import { useAccount } from "wagmi";
import { ERC20_ABI } from "@/components/ABI/ERC20ABI";
import { Abi} from "viem";

export const useFetchUserTokenBalance = ({
    tokenAddress
}:{
  tokenAddress:string
}) =>{
  const { address, isConnected }=useAccount();
console.log("The balance is", tokenAddress)
  const {
    data,
  } = useReadContract({
    abi: ERC20_ABI as Abi,
    address: tokenAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [
        address
    ],
    query:{
      enabled:isConnected
    }
  });
   const userTokenBalance=Number(data)/10**6 || 0.00;
   return {
    userTokenBalance
   }   

}
