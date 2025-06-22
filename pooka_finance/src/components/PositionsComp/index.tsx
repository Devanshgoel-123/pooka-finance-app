"use client"
import { useState } from "react"
import { useWalletStore } from "@/store/walletStore"
import { useShallow } from "zustand/react/shallow"
import { useFetchUserPosition } from "@/hooks/useFetchUserPosition"
import { DollarSign, Target} from "lucide-react"
import "./styles.scss";

interface PositionData {
  canBeLiquidated: boolean
  collateral: bigint
  currentPrice: bigint
  entryPrice: bigint
  isLong: boolean
  isOpen: boolean
  leverage: bigint
  liquidationPrice: bigint
  netPnL: bigint
  size: bigint
  unrealizedPnL: bigint
}

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
    { key: "Orders", label: "Orders" },
    { key: "Funding History", label: "Funding History" },
  ] as const

  const formatPrice = (price: bigint, decimals = 8): string => {
    if (Number(price) === 0) return "0.00"
    const divisor = BigInt(10 ** decimals)
    const wholePart = price / divisor
    const fractionalPart = price % divisor
    return `${wholePart.toString()}.${fractionalPart.toString().padStart(decimals, "0").slice(0, 2)}`
  }

  const formatPnL = (pnl: bigint): string => {
    if (Number(pnl) === 0) return "0.00"
    const formatted = formatPrice(pnl,15)
    return Number(pnl) > 0 ? `+${formatted}` : formatted
  }

  const getPnLColor = (pnl: bigint): string => {
    if (Number(pnl.toString()) > 0) return "#7bf179"
    if (Number(pnl) < 0) return "#ff6b6b"
    return "#888888"
  }

  const renderPositionRow = (position: PositionData, index: number) => {
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
        <div className="cellValue">${(Number(position.size)/10**10).toFixed(3)}</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">{position.leverage.toString()}x</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">${formatPrice(position.entryPrice)}</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">${formatPrice(position.currentPrice)}</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">{Number(formatPrice(position.collateral))/10**10}</div>
      </div>

      <div className="positionCell">
        <div className="cellValue">
          {Number(position.liquidationPrice) > 0 ? `$${formatPrice(position.liquidationPrice)}` : "N/A"}
        </div>
      </div>

      <div className="positionCell pnlCell">
        <div className="cellValue pnlValue" style={{ color: getPnLColor(position.unrealizedPnL) }}>
          ${formatPnL(position.unrealizedPnL)}
        </div>
      </div>

      <div className="positionCell pnlCell">
        <div className="cellValue pnlValue" style={{ color: getPnLColor(position.netPnL) }}>
          ${formatPnL(position.netPnL)}
        </div>
      </div>

      <div className="positionCell riskCell">
        {position.isOpen ? (
          <div className="noRisk">
            Open
          </div>
        ) : position.canBeLiquidated ? (
          <span className="liquidationWarning">-</span>
        )
        :
        (
          <span className="noRisk">-</span>
        )
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
    const openPositions: PositionData[] = (positions as PositionData[]).filter((pos: PositionData) => pos.isOpen)

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
          <div className="headerCell">Position</div>
          <div className="headerCell">Size</div>
          <div className="headerCell">Leverage</div>
          <div className="headerCell">Entry</div>
          <div className="headerCell">Current</div>
          <div className="headerCell">Collateral</div>
          <div className="headerCell">Liq. Price</div>
          <div className="headerCell">Unrealized PnL</div>
          <div className="headerCell">Net PnL</div>
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