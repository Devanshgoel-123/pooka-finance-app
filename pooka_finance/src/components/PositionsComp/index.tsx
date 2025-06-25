"use client"
import { useState } from "react"
import { useWalletStore } from "@/store/walletStore"
import { useShallow } from "zustand/react/shallow"
import { useFetchUserPosition } from "@/hooks/useFetchUserPosition"
import { DollarSign, Target} from "lucide-react"
import "./styles.scss";
import { PositionData } from "@/store/types/types"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { PositionRow } from "./PositionRow"
export const PositionsComponent = () => {
  const [activeTab, setActiveTab] = useState<"Positions" | "Orders" | "Funding History">("Positions");
  const { ETH, BTC, error, isError, isLoading } = useFetchUserPosition()
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
    return <PositionRow position={position} index={index} />
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
    
    if (!BTC || (Array.isArray(BTC) && BTC.length === 0)) {
      return (
        <div className="emptyState">
          <DollarSign size={32} className="emptyIcon" />
          <span className="emptyStateText">No open positions</span>
          <span className="emptyStateSubtext">Your trading positions will appear here</span>
        </div>
      )
    }    

    const eth_positions = Array.isArray(ETH) ? [ETH] : [[ETH]];
    const btc_position = Array.isArray(BTC) ? [BTC] : [[BTC]];

    console.log(eth_positions, btc_position);
    const formattedEthPositions: PositionData[] = eth_positions.map((item: unknown) => {
      const typedItem = item as [bigint, bigint, bigint, bigint, boolean, boolean, bigint, bigint];
      return {
        perpName:"ETH/USD",
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

    const formattedBtcPositions:PositionData[] = btc_position.map((item: unknown) => {
      const typedItem = item as [bigint, bigint, bigint, bigint, boolean, boolean, bigint, bigint];
      return {
        perpName:"BTC/USD",
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
   
    const openPositionsEth: PositionData[] = (formattedEthPositions as PositionData[]).filter((item)=>item.collateral > 0)
    const openPositionBtc: PositionData[] = (formattedBtcPositions as PositionData[]).filter((item)=>item.collateral > 0)
    
    const openPositions:PositionData[]=[...openPositionBtc, ...openPositionsEth];
    console.log("The open positions finally are", openPositions)
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
          <div className="headerCell">PNL</div>
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
          <ConnectButton.Custom>
      {({
        openConnectModal,
        account,
        authenticationStatus,
        mounted
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        return (
          <button
            className={account?.address ? "connectedWallet" : "connectWalletButton"}
            onClick={()=>{
                useWalletStore.getState().setUserWalletAddress(account?.address as string)
                openConnectModal();
            }}
            disabled={!ready || address!==undefined}
          >
            {account?.address ? account.displayName : "Connect Wallet To View Position"}
          </button>
        );
      }}
    </ConnectButton.Custom>    
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