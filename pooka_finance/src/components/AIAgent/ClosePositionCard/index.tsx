"use client"

import type React from "react"
import { useState } from "react"
import "./styles.scss"
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useClosePosition } from "@/hooks/useClosePosition"
import Image from "next/image";
import { getPerpImage } from "@/utils/helperFunction";
import { ClosePositionParams } from "@/store/types/types";
import { useChainId, useSwitchChain } from "wagmi";
import { avalancheFuji } from "viem/chains";
import { useEffect } from "react";

interface Props{
  params:ClosePositionParams;
  isLoading:boolean;
}

export const ClosePositionCard= ({params}:Props) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [forceDisable, setForceDisable]=useState<boolean>(false);
  const {switchChain}=useSwitchChain();
  const chainId=useChainId();
  const {
    closeUserPosition,
    isConfirming,
    success,
    isPending
  }=useClosePosition();

  useEffect(()=>{
    if(success){
      setForceDisable(true)
    }
  },[success])

  

  const handleClosePosition = async () => {
    if(params.perpName === undefined) return;
   await closeUserPosition(params.perpName)
  }

  const handleSwitchChain=()=>{
      switchChain({
        chainId:avalancheFuji.id
      })
  }

  if(params.perpName === undefined) return;

  const isLoading = isPending || isConfirming
  return (
    <div
      className={`ClosePositionCard ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cardHeader">
        <div className="depositTitle">Close Position</div>
      </div>

          <div className="parameter mainParameter">
            <div className="paramLabel">Selected Perp</div>
            <div className="paramValue">
                <Image src={getPerpImage(params.perpName)} height={25} width={25} className="perpIcon" alt="perpImg"/>
                <span className="perpName">{params.perpName}</span>
            </div>
          </div>

      <div className="cardFooter">
        <button
          className={`closeBtn ${isConfirming ? "loading" : ""}`}
          onClick={chainId === avalancheFuji.id ? handleClosePosition : handleSwitchChain}
          disabled={forceDisable || params.perpName === undefined || (isConfirming || isPending)}
        >
          {(isLoading) && !success ? (
            <>
              <LoadingSpinner/>
            </>
          ) : (
           chainId !== avalancheFuji.id ? "Switch Chain" : "Close Position"
          )}
        </button>
      </div>
    </div>
  )
}
