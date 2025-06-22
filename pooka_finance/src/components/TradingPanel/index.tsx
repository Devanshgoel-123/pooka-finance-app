"use client"

import type React from "react"
import { useEffect, useState } from "react"
import "./styles.scss"
import { useBalance } from "wagmi"
import { useWalletStore } from "@/store/walletStore";
import { useShallow } from 'zustand/react/shallow'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { usePerpStore } from "@/store/PerpStore"
import { Loader2 } from "lucide-react"
import { useCreateDeposit } from "@/hooks/useCreateDeposit";


export const OrderComponent: React.FC = () => {
  const [positionType, setPositionType]=useState<"Long" | "Short">("Long");
  const {
    address
  }=useWalletStore(useShallow((state)=>({
    address:state.userWalletAddress
  })))
  const {
    selectedPerp,
  }=usePerpStore(useShallow((state)=>({
    selectedPerp:state.selectedPerp,
    leverage:state.leverage
  })))

  const {data, isLoading:isBalanceLoading}=useBalance({
    address:address as `0x${string}`
  })

  useEffect(()=>{
  },[address, selectedPerp])

  const [collateralAmount, setCollateralAmount] = useState<string>("0")
  const [leverageIndex, setLeverageIndex] = useState<number>(0);

  const leverageOptions = [1,2,3,4,5,10,15,20]

  const {
    createDeposit,
    isLoading
  }=useCreateDeposit();

  const handleCreateDeposit=()=>{
    try{
      createDeposit(
        collateralAmount,
      )
    }catch(err){
      console.log("Error occured",err)
    }
  }


  return (
    <div className="orderComponent">
      <div className="tabContainer">
        <div  className="MarketTab">
        <button className="activeLong">
          Market
        </button>
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
          {!isBalanceLoading ?<div className="availableBalance">Your Balance : {data?.symbol} {(Number(data?.value)/(10**Number(data?.decimals))).toFixed(4)}</div> : "Fetching Balance"}
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
                style={{ width: `${(leverageIndex / (leverageOptions.length - 1)) * 100}%` }}
              ></div>
              {leverageOptions.map((option, index) => (
                <div
                  key={option}
                  className={`leverageDot ${index === leverageIndex ? "active" : ""} ${index <= leverageIndex ? "filled" : ""}`}
                  onClick={() => setLeverageIndex(index)}
                />
              ))}
            </div>
            <div className="leverageLabels">
              {leverageOptions.map((option, index) => (
                <span
                  key={option}
                  className={`leverageLabel ${index === leverageIndex ? "active" : ""}`}
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
        {
  address !== undefined ? (
    !isLoading ? (
      <button className="connectWalletButton" onClick={handleCreateDeposit}>
        Deposit
      </button>
    ) : (
      <Loader2 />
    )
  ) : (
    <ConnectButton.Custom>
      {({ openConnectModal, account, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading";
        return (
          <button
            className="connectWalletButton"
            onClick={() => {
              openConnectModal();
              useWalletStore.getState().setUserWalletAddress(account?.address as string);
            }}
            disabled={!ready}
          >
            Connect Wallet
          </button>
        );
      }}
    </ConnectButton.Custom>
  )
}
      </div>
    </div>
  )
}

