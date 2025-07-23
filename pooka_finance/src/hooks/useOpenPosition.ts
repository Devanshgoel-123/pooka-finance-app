import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import { Abi,parseUnits } from "viem";
import { AVALANCHE_CHAIN_ID, CONTRACT_ADDRESS_AVAX } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { avalancheFuji } from "viem/chains";
import { useHandleToast } from "@/common/handleToast";
import { OPEN_PENDING, OPEN_SUCCESS, TRANSACTION_FAILED, TRANSACTION_REJECTED } from "@/utils/ToastNames";
import { TOAST_TYPE } from "@/store/types/types";

export const useOpenPosition = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error, isPending, reset } = useWriteContract();
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
  const {
    address
  }=useAccount();

  const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });

  useEffect(() => {
    if (hash && isConfirming) {
      handleToastRef.current(
        OPEN_PENDING.heading,
        OPEN_PENDING.subHeading,
        TOAST_TYPE.INFO,
        hash,
        AVALANCHE_CHAIN_ID
      );
    }
    if (isSuccess) {
      handleToastRef.current(
        OPEN_SUCCESS.heading,
        OPEN_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        hash,
        AVALANCHE_CHAIN_ID,
      )
      reset()
      setTimeout(() => {
        setQuery(false);
      }, 200);
    }
    if (
      error || isError
    ) {
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
  }, [error, hash, isConfirming, isSuccess, isError]);

  const openPosition = async (
    symbol: string,
    isLong: boolean,
    collateralAmount: string,
    leverage: string
  ) => {
    try {
      setQuery(true);
      writeContract({
        abi: PERPS_ABI as Abi,
        address: CONTRACT_ADDRESS_AVAX,
        functionName: "openPosition",
        args: [symbol, parseUnits(collateralAmount,6), BigInt(leverage), isLong],
        chain:avalancheFuji,
        account:address
      });
    } catch (err) {
      setQuery(false);
      console.log("Error opening position for user", err);
    }
  };

  return {
    openPosition,
    isPositionLoading: isPending || isConfirming,
    success:isSuccess
  };
};
