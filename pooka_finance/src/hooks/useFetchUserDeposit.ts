import { useAccount} from "wagmi";
import { DepositData} from "@/store/types/types";
import { useState, useEffect } from "react";

export const useFetchUserDeposits = () => {
  const { address } = useAccount();
  const [userDeposits, setUserDeposits] = useState<DepositData[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!address) return;

    try {
      const storedDeposits: DepositData[] = JSON.parse(localStorage.getItem('deposits') || '[]');
      const filtered = storedDeposits.filter((deposit) => deposit.address === address);
      setUserDeposits(filtered);
    } catch (e) {
      console.error('Failed to parse deposits from localStorage:', e);
      setUserDeposits([]);
    } finally {
      setIsFetching(false);
    }
  }, [address]);

  return {
    userDeposits,
    isFetching,
  };
};
