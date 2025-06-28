"use client"

import type React from "react"
import { useState } from "react"
import "./styles.scss"
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { useClosePosition } from "@/hooks/useClosePosition"
import Image from "next/image";
import { getPerpImage } from "@/utils/helperFunction";
import { ClosePositionParams } from "@/store/types/types";

interface Props{
  params:ClosePositionParams;
  isLoading:boolean;
}

export const ClosePositionCard= ({params}:Props) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const {
    closeUserPosition,
    isConfirming,
    success
  }=useClosePosition();

  

  const handleClosePosition = async () => {
    if(params.perpName === undefined) return;
   await closeUserPosition(params.perpName)
  }


  if(params.perpName === undefined) return;
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
          onClick={handleClosePosition}
          disabled={params.perpName === undefined || isConfirming}
        >
          {isConfirming && !success ? (
            <>
              <LoadingSpinner/>
            </>
          ) : (
           "Close Position"
          )}
        </button>
      </div>
    </div>
  )
}
