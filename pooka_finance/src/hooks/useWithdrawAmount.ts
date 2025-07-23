
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi, parseUnits } from "viem";
import { useEffect, useState } from "react";
import { AVALANCHE_CHAIN_ID, CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { avalancheFuji } from "viem/chains";
import { useHandleToast } from "@/common/handleToast";
import { useRef } from "react";
import { WITHDRAW_PENDING, WITHDRAW_SUCCESS, TRANSACTION_FAILED, TRANSACTION_REJECTED } from "@/utils/ToastNames";
import { TOAST_TYPE } from "@/store/types/types";

export const useWithdrawAmount = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error,isError, isPending, reset } = useWriteContract();
  const {
    address
  }=useAccount();
  const { isLoading: isConfirming, isSuccess:success, isError:finalError } = useWaitForTransactionReceipt({
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
        WITHDRAW_PENDING.heading,
        WITHDRAW_PENDING.subHeading,
        TOAST_TYPE.INFO,
        hash,
        AVALANCHE_CHAIN_ID
      );
    }
    if (success) {
      handleToastRef.current(
        WITHDRAW_SUCCESS.heading,
        WITHDRAW_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        hash,
        AVALANCHE_CHAIN_ID
      )
      reset()
      setTimeout(() => {
        setQuery(false);
      }, 200);
    }
    if (error || finalError) {
      setQuery(false);
      reset()
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
  }, [error, hash, isConfirming, finalError, success]);

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
    isWithdrawError:isError || finalError, 
    isLoading:isPending || isConfirming,
    isWithdrawSuccess:success
  };
};
