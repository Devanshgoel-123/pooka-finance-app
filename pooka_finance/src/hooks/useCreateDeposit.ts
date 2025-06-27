import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Abi, parseEther, parseUnits } from "viem";
import { POOL_MANAGER_ABI } from "@/components/ABI/PoolManagerABI";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import {
  CONTRACT_ADDRESS_AVAX,
  CONTRACT_ADDRESS_POOL_MANAGER,
  LINK_TOKEN_AVAX,
  NATIVE_TOKEN_AVAX,
  USDC_TOKEN_AVAX,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { avalancheFuji } from "viem/chains";

export const useCreateDeposit = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error, isPending, isError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });
  const {
    address
  }=useAccount();
  useEffect(() => {
    if (hash && isConfirming) {
      alert(`Traxn sent successfully with hash:${hash}`);
      if(isSuccess){
        alert(`Traxn completed successfully, your amount has been deposited`);
        setQuery(false);
      }
    } else if (error) {
      alert(`Unable to send the traxn:${error.message}`);
      setQuery(false)
    }
  }, [error, hash, isConfirming, isPending, isSuccess]);

  const createDeposit = async (payToken:string, depositAmount:string) => {
    try {
      setQuery(true);
      if (payToken === USDC_TOKEN_AVAX) {
        writeContract({
          abi: PERPS_ABI as Abi,
          address: CONTRACT_ADDRESS_AVAX,
          functionName: "depositUSDC",
          args: [parseUnits(depositAmount, 6)],
          account:address,
          chain:avalancheFuji
        });
      } else if(payToken === LINK_TOKEN_AVAX){
        writeContract({
          abi: POOL_MANAGER_ABI as Abi,
          address: CONTRACT_ADDRESS_POOL_MANAGER,
          functionName: "depositDirect",
          args: [
            LINK_TOKEN_AVAX,
            parseUnits(depositAmount, 6)
          ],
          account:address,
          chain:avalancheFuji
        });
      }else {
        writeContract({
          abi: POOL_MANAGER_ABI as Abi,
          address: CONTRACT_ADDRESS_POOL_MANAGER,
          functionName: "depositDirect",
          args: [
            NATIVE_TOKEN_AVAX,
            parseUnits(depositAmount, 18)
          ],
          value: parseEther(depositAmount),
          account:address,
          chain:avalancheFuji
        });
      }
    } catch (err) {
      setQuery(false);
      console.error("Error depositing for user", err);
    }
  };


  return {
    createDeposit,
    isDepositLoading: isSuccess,
    isDepositError:isError
  };
};
