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
import { useOpenPosition } from "@/hooks/useOpenPosition";
import { useFetchUserBalance } from "@/hooks/useFetchUserBalance";
import { getLiquidationPrice, getPositionSize } from "@/utils/helperFunction";
import { AVAX_TOKEN, FEE_PERCENTAGE, USDC_TOKEN } from "@/utils/constants";
import Image from "next/image";

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
  }=useAccount();

  const {
    data,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address,
    },
  });

  const {
    userDepositbalance
  }=useFetchUserBalance();

  console.error("Balance Error:" + balanceError);

  useEffect(() => {}, [address, selectedPerp]);

  const [collateralAmount, setCollateralAmount] = useState<string>("0");

  const leverageOptions = [1, 2, 3];

 

  const {
    openPosition,
    isPositionLoading
  }=useOpenPosition()

  
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

  const handleMaxPosition=()=>{
    if(!userDepositbalance) return;
    const userMaxDeposit=userDepositbalance.toString();
    setCollateralAmount(userMaxDeposit)
  }

  const formatBalance = () => {
    if (isBalanceLoading) return "Fetching Balance";
    if (!data) return "Balance: 0.0000";

    const balance = Number(data.value) / 10 ** Number(data.decimals);
    return <div className="balanceContainer">
      <span>Your Balance:</span>
      <Image src={AVAX_TOKEN} height={14} width={14} alt=""/>
     <span>{balance.toFixed(4)};</span>
    </div>
  };


  const RenderButtonText=()=>{
    const collateral=Number(collateralAmount);
    if( collateral > Number(userDepositbalance)){
      return <button
      className="insufficientDepositBtn"
      onClick={handleOpenPosition}
      disabled={true}
      >
        Insufficient Deposit
      </button>
    }else{
      return <button
      className="connectWalletButton"
      onClick={handleOpenPosition}
      disabled={!selectedPerp || collateralAmount === "0"}
    >
      {collateral === 0 ? "Enter Amount" : `Open ${positionType} Position`}
    </button>
    }
  }

  return (
    <div className="orderComponent">
      <div className="tabContainer">
        <div className="MarketTab">
          <button className="activeLong">Market</button>
        </div>
        <div className="PositionTab">
          <button
            className={positionType === "Long" ? "activeLong" : "long"}
            onClick={() => setPositionType("Long")}
          >
            Long
          </button>
          <button
            className={positionType === "Short" ? "activeShort" : "short"}
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
          <button className="maxButton" onClick={()=>{
            handleMaxPosition()
          }}>
            MAX
          </button>
        </div>

        <div className="leverageSection">
          <label className="formLabel">Select Leverage upto 3X</label>
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
            <span className="detailValue">
            <Image src={USDC_TOKEN} height={18} width={18} alt="" className="usdcLogoTradingPanel"/>
              {
                getPositionSize(leverage, collateralAmount).toFixed(4)
              }
            </span>
          </div>
          <div className="detailRow">
            <span className="detailLabel">Liq. Price</span>
            <span className="detailValue">
              <Image src={USDC_TOKEN} height={18} width={18} alt="" className="usdcLogoTradingPanel"/>
              {
                getLiquidationPrice(collateralAmount, leverage, selectedPerp).toFixed(4)
              }
              </span>
          </div>
          <div className="detailRow">
            <span className="detailLabel">Trading Fee (1%)</span>
            <span className="detailValue">
            <Image src={USDC_TOKEN} height={18} width={18} alt="" className="usdcLogoTradingPanel"/>
              {
               (FEE_PERCENTAGE*getPositionSize(leverage, collateralAmount)).toFixed(4)
              }
            </span>
          </div>
        </div>
        {address !== undefined ? (
          <>
            {!isPositionLoading ? (
              RenderButtonText()
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

