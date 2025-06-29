import {useReadContract } from "wagmi"
import { useAccount } from "wagmi";
import { ERC20_ABI } from "@/components/ABI/ERC20ABI";
import { Abi} from "viem";
import {USDC_TOKEN_AVAX } from "@/utils/constants";
import { avalancheFuji } from "viem/chains";

export const useFetchUserTokenBalance = ({
    tokenAddress,
    payChain
}:{
  tokenAddress:string;
  payChain:number
}) =>{
  const { address, isConnected }=useAccount();
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
    },
    chainId:payChain
  });
   const userTokenBalance= payChain === avalancheFuji.id ? tokenAddress === USDC_TOKEN_AVAX ?  Number(data)/10**6 : Number(data)/10**18 :Number(data)/10**6 || 0.00;
   return {
    userTokenBalance
   }   

}
