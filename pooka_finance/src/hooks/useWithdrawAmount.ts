
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseUnits } from "viem";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { avalancheFuji } from "viem/chains";

export const useWithdrawAmount = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error,isError, isPending, reset } = useWriteContract();
  const {
    address
  }=useAccount();
  const { isLoading: isConfirming, isSuccess:success } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });

  useEffect(() => {
    if (hash && isConfirming) {
      alert(
        `Traxn sent successfully with hash:${hash} for withdrawing user's Position`
      );
      reset()
      setQuery(false)
    } else if (error) {
      alert(
        `Unable to send the traxn to withdraw User's Position:${error.message}`
      );
      setQuery(false)
    }
  }, [error, hash, isConfirming]);

  const withdrawUserAmount = async (withdrawAmount: string) => {
    try {
      setQuery(true);
      writeContract({
        address: CONTRACT_ADDRESS_AVAX,
        abi: PERPS_ABI as Abi,
        functionName: "withdrawUSDC",
        args: [
            parseUnits(withdrawAmount, 6)
        ],
        account:address,
        chain:avalancheFuji
      });
    } catch (err) {
      setQuery(false);
      reset()
      console.error("Error opening position for user", err);
    }
  };

  return {
    withdrawUserAmount,
    isWithdrawError:isError, 
    isLoading:isPending || isConfirming,
    isWithdrawSuccess:success
  };
};
