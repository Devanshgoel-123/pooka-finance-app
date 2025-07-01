import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Abi,parseUnits } from "viem";
import { POOL_MANAGER_ABI } from "@/components/ABI/PoolManagerABI";
import {
  CONTRACT_ADDRESS_POOL_MANAGER,
  USDC_TOKEN_AVAX,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { DepositData } from "@/store/types/types";
import { sepolia } from "viem/chains";
import { useHandleToast } from "@/common/handleToast";
import { useRef } from "react";
import { DEPOSIT_PENDING, DEPOSIT_SUCCESS, TRANSACTION_FAILED, TRANSACTION_REJECTED } from "@/utils/ToastNames";
import { TOAST_TYPE } from "@/store/types/types";
import { AVALANCHE_CHAIN_ID } from "@/utils/constants";
export const useCreateCrossChainDepositOnAvax = () => {
  const [query, setQuery] = useState<boolean>(false);
  const [amount, setAmount]=useState<number>(0);
  const [token, setToken]=useState<string>('');
  const {
    address
  }=useAccount();
  const {
    writeContract,
    data: hash,
    error,
    isPending,
    isError,
    reset
  } = useWriteContract();
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

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });
  
  useEffect(() => {
    if (hash && isConfirming) {
      handleToastRef.current(
       DEPOSIT_PENDING.heading,
      DEPOSIT_PENDING.subHeading,
      TOAST_TYPE.INFO,
        hash,
        AVALANCHE_CHAIN_ID
      );
    }
    if(isSuccess){
      handleToastRef.current(
        DEPOSIT_SUCCESS.heading,
        DEPOSIT_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        hash,
        AVALANCHE_CHAIN_ID
      )
      const existingDeposits: DepositData[] = JSON.parse(localStorage.getItem("deposits") || "[]");
      const traxnDeposit:DepositData={
        hash:hash as string,
        time:Math.floor(new Date().getTime()/1000),
        amount:amount,
        chain:sepolia.id,
        token:token,
        address:address as string
      }
      existingDeposits.push(traxnDeposit);
      localStorage.setItem("deposits",JSON.stringify(existingDeposits));
      reset()
      setQuery(false);
    }
    if (
      error || isError
    ) {
      reset()
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
    
    
  }, [error, hash, isConfirming, isPending, isSuccess]);

  const createCrossChainDepositAvax = async (payToken:string, depositAmount:string) => {
    try {
      setQuery(true);
      setAmount(Number(depositAmount))
      setToken(payToken)
      writeContract({
        abi: POOL_MANAGER_ABI as Abi,
        address: CONTRACT_ADDRESS_POOL_MANAGER,
        functionName: "depositDirect",
        args: [
            USDC_TOKEN_AVAX,
            parseUnits(depositAmount, 6)
        ]
      });
    } catch (err) {
      setQuery(false);
      console.error("Error depositing for user", err);
    }
  };

  return {
    createCrossChainDepositAvax,
    isCrossChainDepositAvaxSuccess: isSuccess,
    isCrossChainDepositAvaxError: isError,
  };
};
