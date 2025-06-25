import { useAccount, useReadContract } from "wagmi";
import { PRICE_ORACLE_ABI } from "@/components/ABI/PriceOracleABI";
import {
  CONTRACT_ADDRESS_PRICE_FEED_AVAX,
  LINK_TOKEN_AVAX,
  NATIVE_TOKEN_AVAX,
  PRICE_MM_TOKEN,
  USDC_TOKEN_AVAX,
  USDC_TOKEN_SEPOLIA,
} from "@/utils/constants";

interface Props {
  token: string;
}

export const useFetchTokenPriceInUsd = ({ token }: Props) => {
  const { address } = useAccount();

  let feedName: string = "";

  if (token === NATIVE_TOKEN_AVAX) {
    feedName = PRICE_MM_TOKEN.NATIVE_TOKEN_AVAX;
  } else if (token === LINK_TOKEN_AVAX) {
    feedName = PRICE_MM_TOKEN.LINK_TOKEN_AVAX;
  } else if (!token.toLowerCase().includes("0x")){
    feedName = token
  }else{
    feedName = PRICE_MM_TOKEN.NATIVE_TOKEN_SEPOLIA;
  }

  const { data, error } = useReadContract({
    abi: PRICE_ORACLE_ABI,
    address: CONTRACT_ADDRESS_PRICE_FEED_AVAX,
    functionName: "getPrice",
    account: address,
    args: [feedName],
    query:{
        enabled:address !== undefined && token !== USDC_TOKEN_AVAX && token !== USDC_TOKEN_SEPOLIA
    }
  });
  console.log(data, error)
  let tokenPriceInUsd: number | undefined;

  if(Array.isArray(data) && data!==null) {
    tokenPriceInUsd=Number(data[0])/10**8;
  }else{
    tokenPriceInUsd=1;
  }
  return {
    tokenPriceInUsd,
    error,
  };
};
