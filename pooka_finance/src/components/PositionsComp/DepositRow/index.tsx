import Image from "next/image";
import "./styles.scss";
import { DepositData } from "@/store/types/types";
import { getChainImage, tokenImageForAddress, tokenNameForAddress } from "@/utils/helperFunction";
import { avalancheFuji, sepolia } from "viem/chains";
interface Props {
  userDeposit: DepositData;
}

export const DepositRow = ({ userDeposit }: Props) => {
  const chainName=userDeposit.chain=== avalancheFuji.id ? avalancheFuji.name : sepolia.name;
  return (
    <div className="positionRowDeposit">
      <div className="positionCell">
        <div className="cellValue">
          {Number(userDeposit.amount)}
        </div>
      </div>
      <div className="positionCell">
        <div className="cellValue">
          <Image src={getChainImage(chainName)} height={32} width={32} alt="" />
          <span>{chainName}</span>
        </div>
      </div>
      <div className="positionCell">
        <div className="cellValue">
        <Image src={tokenImageForAddress(userDeposit.token)} height={32} width={32} alt="" />
        <span>{tokenNameForAddress(userDeposit.token)}</span>
        </div>
      </div>
      <div className="positionCell">
        <div className="cellValue">
          {userDeposit.hash.slice(0,10)}...{userDeposit.hash.slice(-10)}
        </div>
      </div>
      <div className="positionCell">
        <div className="cellValue">
          {new Date(userDeposit.time * 1000).toISOString().split("T")[0]}
        </div>
      </div>
    </div>
  );
};
