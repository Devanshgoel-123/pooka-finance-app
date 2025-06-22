"use client";

import type React from "react";
import { useEffect, useState } from "react";
import "./styles.scss";
import { useAccount, useBalance } from "wagmi";
import { useWalletStore } from "@/store/walletStore";
import { useShallow } from 'zustand/react/shallow'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { usePerpStore } from "@/store/PerpStore"
import { Loader2 } from "lucide-react"
import { useCreateDeposit } from "@/hooks/useCreateDeposit";
import { useOpenPosition } from "@/hooks/useOpenPosition";


export const OrderComponent: React.FC = () => {
  const [positionType, setPositionType]=useState<"Long" | "Short">("Long");
  const [leverageIndex, setLeverageIndex]=useState<number>(0);
  const {
    selectedPerp,
    leverage
  }=usePerpStore(useShallow((state)=>({
    selectedPerp:state.selectedPerp,
    leverage:state.leverage
  })))
  const {
    address
  }=useAccount()
  const {
    data,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address, // Only fetch when address exists
    },
  });
  console.error("Balance Error:" + balanceError);

  useEffect(() => {}, [address, selectedPerp]);

  const [collateralAmount, setCollateralAmount] = useState<string>("0");

  const leverageOptions = [1, 2, 3, 4, 5, 10, 15, 20];

  const {
    createDeposit,
    isDepositLoading
  }=useCreateDeposit();

  const {
    openPosition,
    isPositionLoading
  }=useOpenPosition()

  
  const handleCreateDeposit=()=>{
    try{
      createDeposit(
        collateralAmount,
      )
    }catch(err){
      console.log("Error occured",err)
    }
  };
  const handleOpenPosition = () => {
    const isLong = positionType === "Long";
    try {
      openPosition(
        selectedPerp,
        isLong,
        collateralAmount,
        leverage
      );
    } catch (err) {
      console.error("Error opening position", err);
    }
  };

  const formatBalance = () => {
    if (isBalanceLoading) return "Fetching Balance";
    if (!data) return "Balance: 0.0000";

    const balance = Number(data.value) / 10 ** Number(data.decimals);
    return `Your Balance: ${data.symbol} ${balance.toFixed(4)}`;
  };

  return (
    <div className="orderComponent">
      <div className="tabContainer">
        <div className="MarketTab">
          <button className="activeLong">Market</button>
        </div>
        <div className="PositionTab">
          <button
            className={positionType === "Long" ? "activeLong" : ""}
            onClick={() => setPositionType("Long")}
          >
            Long
          </button>
          <button
            className={positionType === "Short" ? "activeShort" : ""}
            onClick={() => setPositionType("Short")}
          >
            Short
          </button>
        </div>
      </div>

      <div className="orderForm">
        <div className="formRow">
          <label className="formLabel">You Pay</label>
          {!isBalanceLoading ? (
            <div className="availableBalance">{formatBalance()}</div>
          ) : (
            "Fetching Balance"
          )}
        </div>

        <div className="inputContainer">
          <input
            type="text"
            value={collateralAmount}
            onChange={(e) => setCollateralAmount(e.target.value)}
            className="orderInput"
            placeholder="0"
          />
          <button className="maxButton">
            MAX <span className="maxIcon">$</span>
          </button>
        </div>

        <div className="leverageSection">
          <label className="formLabel">Select Leverage upto 20X</label>
          <div className="leverageContainer">
            <div className="leverageProgressBar">
              <div className="leverageProgressLine"></div>
              <div
                className="leverageProgressFill"
                style={{
                  width: `${
                    (leverageIndex / (leverageOptions.length - 1)) * 100
                  }%`,
                }}
              ></div>
              {leverageOptions.map((option, index) => (
                <div
                  key={option}
                  className={`leverageDot ${
                    index === leverageIndex ? "active" : ""
                  } ${index <= leverageIndex ? "filled" : ""}`}
                  onClick={() => {
                    setLeverageIndex(index)
                    usePerpStore.getState().setLeverage(leverageOptions[index].toString())
                  }}
                />
              ))}
            </div>
            <div className="leverageLabels">
              {leverageOptions.map((option, index) => (
                <span
                  key={option}
                  className={`leverageLabel ${
                    index === leverageIndex ? "active" : ""
                  }`}
                  onClick={() => setLeverageIndex(index)}
                >
                  {option}x
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="orderDetails">
          <div className="detailRow">
            <span className="detailLabel">Est. Position Size</span>
            <span className="detailValue">--</span>
          </div>
          <div className="detailRow">
            <span className="detailLabel">Liq. Price</span>
            <span className="detailValue">--</span>
          </div>
          <div className="detailRow">
            <span className="detailLabel">Max. Slippage</span>
            <span className="detailValue">0.08%</span>
          </div>
          <div className="detailRow">
            <span className="detailLabel">Trading Fee</span>
            <span className="detailValue">--</span>
          </div>
        </div>
        {address !== undefined ? (
          <>
            {!isDepositLoading ? (
              <button
                className="connectWalletButton"
                onClick={handleCreateDeposit}
                style={{ marginBottom: "8px" }}
              >
                Deposit Collateral
              </button>
            ) : (
              <Loader2 style={{ marginBottom: "8px" }} />
            )}

            {!isPositionLoading ? (
              <button
                className="connectWalletButton"
                onClick={handleOpenPosition}
                disabled={!selectedPerp || collateralAmount === "0"}
              >
                Open {positionType} Position
              </button>
            ) : (
              <Loader2 />
            )}
          </>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal, account, authenticationStatus, mounted }) => {
              const ready = mounted && authenticationStatus !== "loading";
              return (
                <button
                  className="connectWalletButton"
                  onClick={() => {
                    openConnectModal();
                    useWalletStore
                      .getState()
                      .setUserWalletAddress(account?.address as string);
                  }}
                  disabled={!ready}
                >
                  Connect Wallet
                </button>
              );
            }}
          </ConnectButton.Custom>
        )}
      </div>
    </div>
  );
};

