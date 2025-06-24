import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CROSS_CHAIN_MANAGER_ABI } from "@/components/ABI/Cross_Chain_manager_ABI";
import { Abi, parseEther, parseUnits } from "viem";
import { POOL_MANAGER_ABI } from "@/components/ABI/PoolManagerABI";
import { PERPS_ABI } from "@/components/ABI/PookaFinanceABI";
import {
  CONTRACT_ADDRESS_AVAX,
  CONTRACT_ADDRESS_POOL_MANAGER,
  CROSS_CHAIN_MANAGER_SEPOLIA,
  LINK_TOKEN_AVAX,
  NATIVE_TOKEN_AVAX,
  USDC_TOKEN_AVAX,
  USDC_TOKEN_SEPOLIA,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { ERC20_ABI } from "@/components/ABI/ERC20ABI";
import { avalancheFuji } from "viem/chains";

export const useCreateDeposit = () => {
  const [query, setQuery] = useState<boolean>(false);
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: query,
    },
  });

  useEffect(() => {
    if (hash && isConfirming) {
      alert(`Traxn sent successfully with hash:${hash}`);
    } else if (error) {
      alert(`Unable to send the traxn:${error.message}`);
    }
  }, [error, hash, isConfirming]);

  const createDeposit = async (depositAmount: string, payToken: string) => {
    try {
      setQuery(true);
      if (payToken === USDC_TOKEN_AVAX) {
        await writeContract({
          abi: ERC20_ABI as Abi,
          address: payToken,
          functionName: "approve",
          args: [
            CONTRACT_ADDRESS_AVAX,
            parseUnits(depositAmount, 8)
          ],
          chainId:avalancheFuji.id
        });
        writeContract({
          abi: PERPS_ABI as Abi,
          address: CONTRACT_ADDRESS_AVAX,
          functionName: "depositUSDC",
          args: [parseUnits(depositAmount, 6)],
        });
      } else if(payToken === LINK_TOKEN_AVAX){
        writeContract({
          abi: ERC20_ABI as Abi,
          address: payToken,
          functionName: "approve",
          args: [
            CONTRACT_ADDRESS_POOL_MANAGER,
            parseUnits(depositAmount, 8)
          ],
          chainId:avalancheFuji.id
        });
        writeContract({
          abi: POOL_MANAGER_ABI as Abi,
          address: CONTRACT_ADDRESS_POOL_MANAGER,
          functionName: "depositDirect",
          args: [
            LINK_TOKEN_AVAX,
            parseUnits(depositAmount, 6)
          ],
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
        });
      }
    } catch (err) {
      setQuery(false);
      console.error("Error depositing for user", err);
    }
  };

  const createCrossChainDeposit = async (depositAmount: string) => {
    try {
      setQuery(true);
      writeContract({
        abi: ERC20_ABI,
        address: USDC_TOKEN_SEPOLIA as `0x${string}`,
        functionName: "approve",
        args: [
          CROSS_CHAIN_MANAGER_SEPOLIA,
          parseUnits(depositAmount, 8)
        ]
      });
      writeContract({
        abi: CROSS_CHAIN_MANAGER_ABI as Abi,
        address: CROSS_CHAIN_MANAGER_SEPOLIA as `0x${string}`,
        functionName: "depositAndSend",
        args: [
          USDC_TOKEN_SEPOLIA,
          parseUnits(depositAmount, 6)],
        value: parseEther(depositAmount),
      });
    } catch (err) {
      setQuery(false);
      console.error("Error depositing for user", err);
    }
  };
  return {
    createDeposit,
    createCrossChainDeposit,
    isDepositLoading: isPending,
  };
};
