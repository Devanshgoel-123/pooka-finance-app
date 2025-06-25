"use client"
import { useState } from "react"
import { useWalletStore } from "@/store/walletStore"
import { useShallow } from "zustand/react/shallow"
import { useFetchUserPosition } from "@/hooks/useFetchUserPosition"
import { DollarSign, Target} from "lucide-react"
import "./styles.scss";
import { PositionData } from "@/store/types/types"

// uint256 sizeUSD;        // Position size in USD (6 decimals)
//         uint256 collateralUSDC; // Collateral in USDC (6 decimals)
//         uint256 entryPrice;     // Entry price (8 decimals from oracle)
//         uint256 leverage;       // Leverage multiplier
//         bool isLong;           // Position direction
//         bool isOpen;           // Position status
//         uint256 openTime;      // Opening timestamp
//         uint256 lastFeeTime; 

export const PositionsComponent = () => {
  const [activeTab, setActiveTab] = useState<"Positions" | "Orders" | "Funding History">("Positions");
  const { data, error, isError, isLoading } = useFetchUserPosition()
  const { address } = useWalletStore(
    useShallow((state) => ({
      address: state.userWalletAddress,
    })),
  )

  const tabs = [
    { key: "Positions", label: "Positions" },
    // { key: "Orders", label: "Orders" },
    { key: "Funding History", label: "Funding History" },
  ] as const

  const formatPrice = (price: bigint, decimals = 8): string => {
    if (Number(price) === 0) return "0.00"
    const divisor = BigInt(10 ** decimals)
    const wholePart = price / divisor
    const fractionalPart = price % divisor
    return `${wholePart.toString()}.${fractionalPart.toString().padStart(decimals, "0").slice(0, 2)}`
  }

  // const formatPnL = (pnl: bigint): string => {
  //   if (Number(pnl) === 0) return "0.00"
  //   const formatted = formatPrice(pnl,15)
  //   return Number(pnl) > 0 ? `+${formatted}` : formatted
  // }

  // const getPnLColor = (pnl: bigint): string => {
  //   if (Number(pnl.toString()) > 0) return "#7bf179"
  //   if (Number(pnl) < 0) return "#ff6b6b"
  //   return "#888888"
  // }

  const renderPositionRow = (position: PositionData, index: number) => {
    console.log("The position is", position)
   return  <div key={index} className="positionRow">
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
        <div className="cellValue">{new Date(Number(position.openTime)*1000).toLocaleString().split(",")[0]}</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">{new Date(Number(position.lastFeeTime)*1000).toLocaleString().split(",")[0]}</div>
      </div>

      {/* <div className="positionCell">
        <div className="cellValue">${formatPrice(position.currentPrice)}</div>
      </div> */}

    

      {/* <div className="positionCell">
        <div className="cellValue">
          {Number(position.liquidationPrice) > 0 ? `$${formatPrice(position.liquidationPrice)}` : "N/A"}
        </div>
      </div> */}

      {/* <div className="positionCell pnlCell">
        <div className="cellValue pnlValue" style={{ color: getPnLColor(position.unrealizedPnL) }}>
          ${formatPnL(position.unrealizedPnL)}
        </div>
      </div> */}

      {/* <div className="positionCell pnlCell">
        <div className="cellValue pnlValue" style={{ color: getPnLColor(position.netPnL) }}>
          ${formatPnL(position.netPnL)}
        </div>
      </div> */}

      <div className="positionCell riskCell">
        {position.isOpen ? (
          <div className="noRisk">
            Open
          </div>
        ) : 
          <span className="liquidationWarning">Closed</span>
      }
      </div>
    </div>
  }

  const renderPositionsContent = () => {
    if (isLoading) {
      return (
        <div className="loadingState">
          <div className="loadingSpinner" />
          <span className="loadingText">Loading positions...</span>
        </div>
      )
    }

    if (isError || error) {
      return (
        <div className="errorState">
          <span className="errorText">Failed to load positions</span>
        </div>
      )
    }
    console.log(data, Array.isArray(data));
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <div className="emptyState">
          <DollarSign size={32} className="emptyIcon" />
          <span className="emptyStateText">No open positions</span>
          <span className="emptyStateSubtext">Your trading positions will appear here</span>
        </div>
      )
    }    

    const positions = Array.isArray(data) ? data : [data]
    const formattedPositions: PositionData[] = positions.map((item: unknown) => {
      const typedItem = item as [bigint, bigint, bigint, bigint, boolean, boolean, bigint, bigint];
      return {
        size: typedItem[0],
        collateral: typedItem[1],
        entryPrice: typedItem[2],
        leverage: typedItem[3],
        isLong: typedItem[4],
        isOpen: typedItem[5],
        openTime: typedItem[6],
        lastFeeTime: typedItem[7],
      };
    });

    const openPositions: PositionData[] = (formattedPositions as PositionData[]).filter((item)=>item.collateral > 0)

    if (openPositions.length === 0) {
      return (
        <div className="emptyState">
          <DollarSign size={32} className="emptyIcon" />
          <span className="emptyStateText">No open positions</span>
          <span className="emptyStateSubtext">Your trading positions will appear here</span>
        </div>
      )
    }

    return (
      <div className="positionsTable">
        <div className="positionsHeader">
          <div className="headerCell">Type</div>
          <div className="headerCell">Size</div>
          <div className="headerCell">Collateral</div>
          <div className="headerCell">Entry Price</div>
          <div className="headerCell">Leverage</div>
          <div className="headerCell">Open Time</div>
          <div className="headerCell">Last Fee Time</div>
          <div className="headerCell">Status</div>
        </div>
        <div className="positionsBody">
          {openPositions.map((position: PositionData, index: number) => renderPositionRow(position, index))}
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    if (!address) {
      return (
        <div className="emptyState">
          <span className="emptyStateText">Connect wallet to view {activeTab.toLowerCase()}</span>
        </div>
      )
    }

    switch (activeTab) {
      case "Positions":
        return renderPositionsContent()
      case "Orders":
        return (
          <div className="emptyState">
            <Target size={48} className="emptyIcon" />
            <span className="emptyStateText">No open orders</span>
            <span className="emptyStateSubtext">Your pending orders will appear here</span>
          </div>
        )
      case "Funding History":
        return (
          <div className="emptyState">
            <DollarSign size={48} className="emptyIcon" />
            <span className="emptyStateText">No funding history</span>
            <span className="emptyStateSubtext">Your funding payments will appear here</span>
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="positionsComponent">
      <div className="tabsContainer">
        <div className="tabsList">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tabButton ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tabContent">{renderTabContent()}</div>
    </div>
  )
}