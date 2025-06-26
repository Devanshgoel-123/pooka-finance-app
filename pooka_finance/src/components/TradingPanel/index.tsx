"use client";

import type React from "react";
import { useEffect, useState } from "react";
import "./styles.scss";
import { useAccount, useBalance, useSwitchChain} from "wagmi";
import { useWalletStore } from "@/store/walletStore";
import { useShallow } from 'zustand/react/shallow'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { usePerpStore } from "@/store/PerpStore"
import { useOpenPosition } from "@/hooks/useOpenPosition";
import { useFetchUserDepositBalance} from "@/hooks/useFetchUserBalance";
import { getLiquidationPrice, getPositionSize, tokenImageForAddress } from "@/utils/helperFunction";
import { FEE_PERCENTAGE, USDC_TOKEN, USDC_TOKEN_AVAX, USDC_TOKEN_SEPOLIA } from "@/utils/constants";
import { avalancheFuji, sepolia} from "viem/chains";
import Image from "next/image";
import { TokenSelector } from "./TokenSelector";
import { useCreateDeposit } from "@/hooks/useCreateDeposit";
import { useFetchTokenPriceInUsd } from "@/hooks/useFetchPriceInUsd";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { ChainSelector } from "./ChainSelector";
import { useFetchUserTokenBalance } from "@/hooks/useFetchUserTokenBalance";
import { handleCheckNativeToken } from "@/utils/helperFunction";
import { useCreateCrossChainDeposit } from "@/hooks/useCreateCrossChainDeposit";
import { useSendApprovalTraxn } from "@/hooks/useSendApproval";
import { useWithdrawAmount } from "@/hooks/useWithdrawAmount";
import { useCreateCrossChainDepositOnAvax } from "@/hooks/useCrossChainDepositAvax";
export const OrderComponent: React.FC = () => {
  const {
     chainId,
  }=useAccount();
  const {
    switchChain
  }=useSwitchChain()
  const [positionType, setPositionType]=useState<"Long" | "Short">("Long");
  const [leverageIndex, setLeverageIndex]=useState<number>(0);
  const [activeTab, setActiveTab]=useState<number>(0);
  const [estimatedPrice, setEstimatedPrice]=useState<number>(0);
  const [loading, setIsLoading]=useState<boolean>(false);
  const [depositTab, setDepositTab]=useState<boolean>(true);
  const [withdrawAmount, setWithDrawAmount]=useState<string>("");
  const [collateralAmount, setCollateralAmount] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const leverageOptions = [1, 2, 3];
  const [withdrawLoader, setWithdrawLoader]=useState<boolean>(false);

  const {
    selectedPerp,
    leverage,
    payToken,
    payChain
  }=usePerpStore(useShallow((state)=>({
    selectedPerp:state.selectedPerp,
    leverage:state.leverage,
    payToken:state.payToken,
    payChain:state.payChain
  })))

  const {
    address, isConnected
  }=useAccount();

  const {
    userTokenBalance
  }=useFetchUserTokenBalance({
    tokenAddress:payToken
  })
  
  const handleApprovalCallBack = async () => {
    if (payChain === avalancheFuji.id) {
        await createDeposit(payToken, collateralAmount);
    } else if (payChain === sepolia.id) {
      await createCrossChainDeposit(collateralAmount);
    } else {
      console.error('Unsupported chain selected');
    }
  };


  const {
    data:userNativeBalance
  }=useBalance({
    address:payToken as `0x${string}`,
    chainId:payChain,
    query:{
      enabled:handleCheckNativeToken(payToken)
    }
  })
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

  const {
    openPosition,
    isPositionLoading
  }=useOpenPosition();

  const {
    sendApprovalTraxn,
    isError,
    isSuccess
  }=useSendApprovalTraxn({
    callBackFunction:handleApprovalCallBack
  })

  const {
    createDeposit,
    isDepositLoading,
    isDepositError
  }=useCreateDeposit();

  const {
   createCrossChainDepositAvax,
   isCrossChainDepositAvaxError,
   isCrossChainDepositAvaxLoading
  }=useCreateCrossChainDepositOnAvax();


  const handleCrossChainDepositOnAvax=()=>{
    if (chainId !== avalancheFuji.id) {
      switchChain({ chainId: avalancheFuji.id })
       setTimeout(() => {
        console.log("calling cross chain deposit 1", payToken, collateralAmount)
        createCrossChainDepositAvax(payToken, collateralAmount);
      },1000)
    } else {
      console.log("calling cross chain deposit 2", payToken, collateralAmount)
      createCrossChainDepositAvax(payToken, collateralAmount);
    }
  } 

  const {
    createCrossChainDeposit,
    isCrossChainDepositLoading,
    isCrossChainError
  }=useCreateCrossChainDeposit({
    callBackFunction:handleCrossChainDepositOnAvax
  });

  const {
    tokenPriceInUsd
  }=useFetchTokenPriceInUsd({
    token:payToken
  })

  const {
    withdrawUserAmount,
    isWithdrawError, 
    isWithdrawSuccess
  }=useWithdrawAmount()

  useEffect(()=>{
    if(!tokenPriceInUsd || !payToken || !payChain) return;
    if(payToken === USDC_TOKEN_SEPOLIA || payToken === USDC_TOKEN_AVAX){
      setEstimatedPrice(Number(collateralAmount))
      return;
    }
    const priceOfToken=Number(tokenPriceInUsd)*Number(collateralAmount);
    setEstimatedPrice(priceOfToken)
  },[tokenPriceInUsd, payToken, collateralAmount, payChain])

  
  useEffect(() => {
    if (!loading) return; // Don't process if not currently loading
    
    // Check if any operation has failed
    const hasAnyError = isDepositError || isCrossChainError || isCrossChainDepositAvaxError || isError;
    console.log("The has any error", hasAnyError, isDepositError, isCrossChainError, isCrossChainError, isError);
    
    // Check if all operations are completed (not loading)
    const allOperationsCompleted = isDepositLoading || isCrossChainDepositLoading || isCrossChainDepositAvaxLoading || isSuccess;
    console.log("The operations is", allOperationsCompleted, isDepositLoading, isCrossChainDepositLoading, isCrossChainDepositAvaxLoading, isSuccess);
    
    // Set loading to false if:
    // 1. Any operation fails (immediate failure) OR
    // 2. All operations are completed successfully
    if (hasAnyError || allOperationsCompleted) {
      setIsLoading(false);
    }
  }, [
    isDepositLoading, 
    isDepositError, 
    isCrossChainDepositLoading, 
    isCrossChainError, 
    isCrossChainDepositAvaxLoading, 
    isCrossChainDepositAvaxError, 
    isError,
    loading
  ]);

  // Fixed loading state management for withdraw operations
  useEffect(() => {
    // Only set loading to false when withdraw operation is complete (success or error)
    if (!withdrawLoader) return; // Don't process if not currently loading
    
    if (isWithdrawError || isWithdrawSuccess) {
      setWithdrawLoader(false);
    }
  }, [isWithdrawError, isWithdrawSuccess, withdrawLoader]);

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

  const handleSelect = (option:string) => {
    if (option === "Deposit") {
      setDepositTab(true);
    } else {
      setDepositTab(false);
    }
    setActiveTab(1);
    setShowDropdown(false);
  };

  const handleMaxWithdraw=()=>{
    if(!userDepositbalance) return;
    setWithDrawAmount(userDepositbalance.toString());
  }

  const formatBalance = () => {
    if (isBalanceLoading) return "Fetching Balance";
    if (!data) return "Balance: 0.0000";

    return <div className="balanceContainer">
      <span>Your Balance:</span>
      <Image src={tokenImageForAddress(payToken)} height={14} width={14} alt="" className="tokenLogo"/>
     <span>{handleCheckNativeToken(payToken) ? userNativeBalance?.value :userTokenBalance.toFixed(4)};</span>
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
      {userBalance === 0 ? "Deposit First" : collateral === 0 ? "Enter Amount" : `Open ${positionType} Position`}
    </button>
    }
  }
  

const renderDepositButton=()=>{
  return (
    loading ?
    <div className="bg-[#7bf179] p-[12px] w-[100%] flex flex-row justify-center rounded-[12px]">
    <LoadingSpinner/>
    </div> :
  <button
  className={Number(collateralAmount)===0 ? `insufficientDepositBtn` : `connectWalletButton`}
  disabled={Number(collateralAmount)===0 }
  onClick={async ()=>{
    if(payChain !== chainId){
      switchChain({
        chainId:payChain
      })
      return 
    }
    console.log(payChain, payToken, chainId)
    setIsLoading(true);
    try {
      if (payChain === avalancheFuji.id) {
        if(handleCheckNativeToken(payToken)){
          await createDeposit(payToken, collateralAmount);
        }else{
          await sendApprovalTraxn(payToken, payChain, collateralAmount);
        }
      } else if (payChain === sepolia.id) {
        await sendApprovalTraxn(payToken,payChain,collateralAmount);
      } else {
        console.error('Unsupported chain selected');
      }
    } catch (error) {
      console.error('Error during deposit:', error);
    }
  }}
  >
 {Number(collateralAmount)===0 ? `Enter Amount` : payChain === chainId ? Number(collateralAmount) > userTokenBalance ? "Insufficient Balance" : `Deposit` : `Switch Chain`}
  </button>
)
}

const renderWithDrawButton=()=>{
  return ( withdrawLoader ?  
  <div className="bg-[#7bf179] p-[12px] w-[100%] flex flex-row justify-center rounded-[12px]">
  <LoadingSpinner/>
  </div> 
  :
   <button
    className={Number(withdrawAmount)===0 || Number(withdrawAmount) > userDepositbalance? `insufficientDepositBtn` : `connectWalletButton`}
    disabled={Number(withdrawAmount)===0 || Number(withdrawAmount) > userDepositbalance}
    onClick={async ()=>{
      setWithdrawLoader(true);
      withdrawUserAmount(withdrawAmount)
    }}
    >
   {Number(withdrawAmount)===0 ? `Enter Withdraw Amount` : Number(withdrawAmount) > userDepositbalance ? `Insufficient Deposit` : `Withdraw Amount`}
    </button>
    )}
 

  const RenderButtonTextDepositTab=()=>{
      return  depositTab ? renderDepositButton() : renderWithDrawButton()
  }



  return (
    <div className="orderComponent">
      <div className="tabContainer">
        <div className="MarketTab">
          <button className={!activeTab ? "activeLong" : "inActiveBtn"} onClick={()=>setActiveTab(0)}>Market</button>
          {/* <button className={activeTab ? "activeLong" : "inActiveBtn"} onClick={()=>setActiveTab(1)}>{depositTab ? "Deposit" :"Withdraw"}</button> */}
          <div className="dropdownWrapper">
        <button
          className={activeTab ? "activeLong" : "inActiveBtn"}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          More
        </button>

        {showDropdown && (
          <div className="dropdownMenu">
            <div onClick={() => handleSelect("Deposit")}>Deposit</div>
            <div onClick={() => handleSelect("Withdraw")}>Withdraw</div>
          </div>
        )}
      </div>
        </div>
      </div>
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
          <input
            type="text"
            value={collateralAmount}
            onChange={(e) => {
              setCollateralAmount(e.target.value)
              usePerpStore.getState().setCollateralAmount(e.target.value);
            }}
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
              <div className="loadingDiv">
                <LoadingSpinner/>
              </div>
             
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
        <div className="tabContainer" style={{
          marginBottom:0
        }}>
        <div className="MarketTab" >
          <button className={depositTab ? "activeLong" : "inActiveBtn"} onClick={()=>setDepositTab(true)}>Deposit</button>
          <button className={!depositTab ? "activeLong" : "inActiveBtn"} onClick={()=>setDepositTab(false)}>Withdraw</button>
        </div>
      </div>
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
            value={!depositTab ? withdrawAmount :collateralAmount}
            onChange={(e) => {
              if(!depositTab){
                setWithDrawAmount(e.target.value)
              }else{
                setCollateralAmount(e.target.value)
              }             
            }}
            className="orderInput"
            placeholder="0"
          />
          { depositTab && isConnected && <div className="selectorComponent">
          <ChainSelector/>
          <TokenSelector/>
          </div>}
          <button className="maxButton" onClick={()=>{
            if(!depositTab){
              handleMaxWithdraw()
            }else{
              handleMaxPosition()
            }
          
          }}>
            MAX
          </button>
        </div>

       {depositTab && <div className="valueContainer">
          <span className="estimatedText">Estd Value : </span>
          <div className="valueText" >
            <Image className="tokenLogo" height={25} width={25} src={USDC_TOKEN} alt=""/>
            {estimatedPrice.toFixed(4)}
          </div>
        </div>}

        
        {address !== undefined ? (
          <>
            {!isPositionLoading ? (
              RenderButtonTextDepositTab()
            ) : (
              <div className="loadingDiv">
                <LoadingSpinner/>
              </div>
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

