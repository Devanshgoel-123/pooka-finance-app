/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseEther } from "viem";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { avalancheFuji } from "viem/chains";
import { useRef } from "react";
import { useHandleToast } from "@/common/handleToast";
import { CLOSE_PENDING, CLOSE_SUCCESS, TRANSACTION_FAILED, TRANSACTION_REJECTED } from "@/utils/ToastNames";
import { TOAST_TYPE } from "@/store/types/types";
import { AVALANCHE_CHAIN_ID } from "@/utils/constants";

export const useClosePosition = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { address } = useAccount();
  const { writeContract, data: hash, error, isPending, reset} = useWriteContract();

  const { isLoading: isConfirming, isSuccess:success, isError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });
  const {
    handleToast
  }=useHandleToast();
  const handleToastRef =
    useRef<
      (
        heading: string,
        subHeading: string,
        type: string,
        hash?: string | undefined,
        chainId?: number | undefined
      ) => void
    >(handleToast);

  useEffect(() => {
    if (hash && isConfirming) {
      handleToastRef.current(
        CLOSE_PENDING.heading,
        CLOSE_PENDING.subHeading,
        TOAST_TYPE.INFO,
        hash,
        AVALANCHE_CHAIN_ID
      );
    }
    if (success) {
      handleToastRef.current(
        CLOSE_SUCCESS.heading,
        CLOSE_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        hash,
        AVALANCHE_CHAIN_ID
      )
      reset()
      setTimeout(() => {
        setQuery(false);
      }, 200);
    }
   if (error || isError) {
    setQuery(false);
    if (
     error?.message.includes(
        "User rejected the request."
      )
    ) {
      handleToastRef.current(
        TRANSACTION_REJECTED.heading,
        TRANSACTION_REJECTED.subHeading,
        TOAST_TYPE.ERROR
      );
    } else {
      handleToastRef.current(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR,
        hash,
        AVALANCHE_CHAIN_ID
      );
    }
    }
  }, [error, hash, isConfirming]);

  const closeUserPosition = async (symbol: string) => {
    try {
      setQuery(true);
      writeContract({
        address: CONTRACT_ADDRESS_AVAX,
        abi: PERPS_ABI as Abi,
        functionName: "closePosition",
        args: [symbol],
        account:address,
        chain:avalancheFuji
      });
    } catch (err) {
      setQuery(false);
      console.error("Error opening position for user", err);
    }
  };

  return {
    closeUserPosition,
    isConfirming, 
    isPending,
    success
  };
};
