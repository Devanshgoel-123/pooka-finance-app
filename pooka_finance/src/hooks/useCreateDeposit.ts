import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Abi, parseEther, parseUnits } from "viem";
import { POOL_MANAGER_ABI } from "@/components/ABI/PoolManagerABI";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import {
  AVALANCHE_CHAIN_ID,
  CONTRACT_ADDRESS_AVAX,
  CONTRACT_ADDRESS_POOL_MANAGER,
  LINK_TOKEN_AVAX,
  NATIVE_TOKEN_AVAX,
  USDC_TOKEN_AVAX,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { avalancheFuji } from "viem/chains";
import { DepositData } from "@/store/types/types";
import { useHandleToast } from "@/common/handleToast";
import { useRef } from "react";
import { DEPOSIT_PENDING, DEPOSIT_SUCCESS, TRANSACTION_FAILED, TRANSACTION_REJECTED } from "@/utils/ToastNames";
import { TOAST_TYPE } from "@/store/types/types";

export const useCreateDeposit = () => {
  const [query, setQuery] = useState<boolean>(false);
  const [amount, setAmount]=useState<number>(0);
  const [token, setToken]=useState<string>('');
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
  const { writeContract, data: hash, error, isPending, isError, reset } = useWriteContract();
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
          chain:avalancheFuji.id,
          token:token,
          address:address as string
        }
        existingDeposits.push(traxnDeposit);
        localStorage.setItem("deposits",JSON.stringify(existingDeposits));
      setTimeout(() => {
        reset()
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
    
  }, [error, hash, isConfirming, isPending, isSuccess]);

  const createDeposit = async (payToken:string, depositAmount:string) => {
    try {
      setQuery(true);
      setAmount(Number(depositAmount));
      setToken(payToken)
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
            parseUnits(depositAmount, 18)
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
    isDepositSuccess: isSuccess,
    isDepositError:isError
  };
};
