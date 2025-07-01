import { useFetchTokenPriceInUsd } from "@/hooks/useFetchPriceInUsd"
import { PositionData } from "@/store/types/types"
import { FALLBACK_VALUES, USDC_TOKEN } from "@/utils/constants"
import Image from "next/image"
import { useEffect, useState } from "react"
import "./styles.scss"
import { useClosePosition } from "@/hooks/useClosePosition"
import { useUnifiedPriceFeeds } from "@/hooks/useUnifiedPriceFeeds"

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
    const [tokenPrice, setTokenPrice]=useState<number>(position.perpName.toLowerCase().includes("eth") ? FALLBACK_VALUES.ETH.price : FALLBACK_VALUES.BTC.price);
    const {
      ethPrice,
      btcPrice
    }=useUnifiedPriceFeeds();

    const {
        tokenPriceInUsd,
    }=useFetchTokenPriceInUsd({
        token:position.perpName,
    })


    const {
      closeUserPosition,
      isConfirming,
      success
    }=useClosePosition();

    useEffect(()=>{

        const fetchPnl=()=>{
          let tokenPrice:number;
          if(position.perpName.toLowerCase().includes("eth")){
            tokenPrice=ethPrice
            console.log("The token price is", tokenPrice, ethPrice)
            setTokenPrice(ethPrice)
          }else if(position.perpName.toLowerCase().includes("btc")){
            tokenPrice=btcPrice
            setTokenPrice(btcPrice)
          }else{
            tokenPrice=0;
          }
          
          console.log("The token price is", position.perpName, tokenPrice)
          const formattedEntryPrice: number = Number(position.entryPrice) / 10**8;
          const formattedPositionInUSDC: number = Number(position.size) / 10**6;
          const formattedPositionInPerpToken: number = formattedPositionInUSDC / formattedEntryPrice;
          const currentPnl: number = tokenPrice ? position.isLong ? (tokenPrice - formattedEntryPrice) * formattedPositionInPerpToken : (formattedEntryPrice-tokenPrice) * formattedPositionInPerpToken : 0;
          setPnl(currentPnl)
          return currentPnl;
        }
        fetchPnl()
    },[tokenPriceInUsd, position.perpName, ethPrice, btcPrice, position.entryPrice, position.size])

  
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
            <span>{pnl >= 0 ? `+`:``}  {pnl.toFixed(4)}</span>
            </div>
      </div>

      <div className="positionCell">
        <div className="cellValue">{tokenPrice ? `$${(tokenPrice.toFixed(3))}` : "$0.000"}</div>
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