"use client";

import type React from "react";
import { useEffect, useState } from "react";
import "./styles.scss";
import { useAccount, useBalance} from "wagmi";
import { useWalletStore } from "@/store/walletStore";
import { useShallow } from 'zustand/react/shallow'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { usePerpStore } from "@/store/PerpStore"
import { Loader2 } from "lucide-react"
import { useOpenPosition } from "@/hooks/useOpenPosition";
import { useFetchUserDepositBalance} from "@/hooks/useFetchUserBalance";
import { getLiquidationPrice, getPositionSize, tokenImageForAddress } from "@/utils/helperFunction";
import { FEE_PERCENTAGE, USDC_TOKEN } from "@/utils/constants";
import { avalancheFuji} from "viem/chains";
import Image from "next/image";
import { TokenSelector } from "./TokenSelector";
import { useCreateDeposit } from "@/hooks/useCreateDeposit";

export const OrderComponent: React.FC = () => {
  const {
     chainId
  }=useAccount();
  const [positionType, setPositionType]=useState<"Long" | "Short">("Long");
  const [leverageIndex, setLeverageIndex]=useState<number>(0);
  const [activeTab, setActiveTab]=useState<number>(0);
  const {
    selectedPerp,
    leverage,
    payToken
  }=usePerpStore(useShallow((state)=>({
    selectedPerp:state.selectedPerp,
    leverage:state.leverage,
    payToken:state.payToken
  })))
  const {
    address
  }=useAccount();

  const {
    data,
    isLoading: isBalanceLoading,
  } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address,
    },
  });

  const {
    userDepositbalance
  }=useFetchUserDepositBalance();

  useEffect(() => {}, [address, selectedPerp]);

  const [collateralAmount, setCollateralAmount] = useState<string>("0");

  const leverageOptions = [1, 2, 3];

 

  const {
    openPosition,
    isPositionLoading
  }=useOpenPosition()

  const {
    createDeposit,
    createCrossChainDeposit,
  }=useCreateDeposit()

  
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
      <Image src={tokenImageForAddress(payToken)} height={14} width={14} alt="" className="tokenLogo"/>
     <span>{balance.toFixed(4)};</span>
    </div>
  };


  const RenderButtonText=()=>{
    const collateral=Number(collateralAmount);
    const userBalance=Number(userDepositbalance);
    if( collateral > userBalance){
      return <button
      className="insufficientDepositBtn"
      onClick={()=>setActiveTab(1)}
      >
        Insufficient Deposit
      </button>
    }else{
      return <button
      className={collateral===0 ? `insufficientDepositBtn` : `connectWalletButton`}
      onClick={()=>{
        if(collateral===0 || userBalance === 0){
          setActiveTab(1)
        }else{
          handleOpenPosition()
        }
      }}
      disabled={!selectedPerp}
    >
      {collateral === 0 || userBalance === 0 ? "Deposit First" : `Open ${positionType} Position`}
    </button>
    }
  }

  const RenderButtonTextDepositTab=()=>{
      return <button
      className="connectWalletButton"
      disabled={Number(collateralAmount)===0}
      onClick={async ()=>{
        if(chainId===avalancheFuji.id){
          await createDeposit(collateralAmount, payToken)
        }else{
          await createCrossChainDeposit(collateralAmount)
        }
      }}
      >
      Deposit
      </button>
  }

  return (
    <div className="orderComponent">
      {/* TabContainer */}
      <div className="tabContainer">
        <div className="MarketTab">
          <button className={!activeTab ? "activeLong" : "inActiveBtn"} onClick={()=>setActiveTab(0)}>Market</button>
          <button className={activeTab ? "activeLong" : "inActiveBtn"} onClick={()=>setActiveTab(1)}>Deposit</button>
        </div>
      </div>
      {/* Market Compoenent */}
     {activeTab === 0 ? <div className="orderForm">
        <div className="formRow">
          <label className="formLabel">You Pay</label>
          {!isBalanceLoading ? (
            <div className="availableBalance">{formatBalance()}</div>
          ) : (
            "Fetching Balance"
          )}
        </div>

        <div className="inputContainer">
          <TokenSelector/>
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
      :
      <div className="DepositComponent">
        <div className="formRow">
          <label className="formLabel">You Pay</label>
          {!isBalanceLoading ? (
            <div className="availableBalance">{formatBalance()}</div>
          ) : (
            "Fetching Balance"
          )}
        </div>

        <div className="inputContainer">
          <TokenSelector/>
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
        {address !== undefined ? (
          <>
            {!isPositionLoading ? (
              RenderButtonTextDepositTab()
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
    }
    </div>
  );
};

