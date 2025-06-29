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
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });
  
  useEffect(() => {
    if (hash) {
      alert(`Traxn sent successfully with hash:${hash}`);
     
      if(isSuccess){
        alert(`Traxn completed successfully, your amount has been deposited`);
        const existingDeposits: DepositData[] = JSON.parse(localStorage.getItem("deposits") || "[]");
        const traxnDeposit:DepositData={
          hash:hash,
          time:Math.floor(new Date().getTime()/1000),
          amount:amount,
          chain:sepolia.id,
          token:token,
          address:address as string
        }
        existingDeposits.push(traxnDeposit);
        localStorage.setItem("deposits",JSON.stringify(existingDeposits));
        setQuery(false);
      }
    } else if (error) {
      alert(`Unable to send the traxn:${error.message}`);
      setQuery(false);
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
    isCrossChainDepositAvaxLoading: isSuccess,
    isCrossChainDepositAvaxError: isError,
  };
};
