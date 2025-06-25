import { useFetchTokenPriceInUsd } from "@/hooks/useFetchPriceInUsd"
import { PositionData } from "@/store/types/types"
import { USDC_TOKEN } from "@/utils/constants"
import Image from "next/image"
import { useEffect, useState } from "react"
import "./styles.scss"
import { useClosePosition } from "@/hooks/useClosePosition"

interface Props{
    position:PositionData,
    index:number
}

export const formatPrice = (price: bigint, decimals = 8): string => {
    if (Number(price) === 0) return "0.00"
    const divisor = BigInt(10 ** decimals)
    const wholePart = price / divisor
    const fractionalPart = price % divisor
    return `${wholePart.toString()}.${fractionalPart.toString().padStart(decimals, "0").slice(0, 2)}`
  }


export const PositionRow=({
    position,
    index
}:Props)=>{

    const [pnl,setPnl]=useState<number>(0.00);
    const {
        tokenPriceInUsd
    }=useFetchTokenPriceInUsd({
        token:position.perpName
    })


    const {
      closeUserPosition,
      isConfirming,
      success
    }=useClosePosition();
    useEffect(()=>{
        const fetchPnl=()=>{
            if (!tokenPriceInUsd) return 0;
        
            const formattedEntryPrice: number = Number(position.entryPrice) / 10**8;
        
            const formattedPositionInUSDC: number = Number(position.size) / 10**6;

            const formattedPositionInPerpToken: number = formattedPositionInUSDC / formattedEntryPrice;
        
            
            const currentPnl: number = (tokenPriceInUsd - formattedEntryPrice) * formattedPositionInPerpToken;
            setPnl(currentPnl)
            return currentPnl;
        }
        fetchPnl()
    },[tokenPriceInUsd, position.perpName])

  
    return (
        <div key={index} className="positionRow">
      <div className="positionCell directionCell">
        <div className="directionContainer">
          <div className={`directionBadge ${position.isLong ? "long" : "short"}`}>
            {position.isLong ? (
              <>
                LONG
              </>
            ) : (
              <>
                SHORT
              </>
            )}
          </div>
        </div>
      </div>

      <div className="positionCell">
        <div className="cellValue">${(Number(position.size)/10**6).toFixed(3)}</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">${(Number(position.collateral)/10**6).toFixed(3)}</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">${formatPrice(position.entryPrice)}</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">{position.leverage.toString()}x</div>
      </div>

      <div className="positionCell">
        <div className={"cellValue"} style={{
            color:pnl >= 0 ? `#7bf179`:`#ff6b6b`
        }}>
            <Image height={22} width={22} src={USDC_TOKEN} alt=""/>
            <span>{pnl >= 0 ? `+`:`-`}  {pnl.toFixed(4)}</span>
            </div>
      </div>

      <div className="positionCell">
        <div className="cellValue">{tokenPriceInUsd ? `$${(tokenPriceInUsd.toFixed(3))}` : "$0.000"}</div>
      </div>


      <div className="positionCell riskCell">
        {position.isOpen ? (
          <div className="openPositionsTab">
          {/* <div className="noRisk">
            Open 
          </div> */}
          <button
          className="closePosition"
           onClick={()=>{
            closeUserPosition(position.perpName)
          }}
          disabled={isConfirming || success}
          >
          Close Position
        </button>
          </div>
          
        ) : 
          <span className="liquidationWarning">Closed</span>
      }
      </div>
    </div>
    )
}