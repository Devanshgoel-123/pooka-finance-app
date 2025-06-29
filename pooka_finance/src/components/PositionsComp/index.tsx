"use client";
import { useState } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useShallow } from "zustand/react/shallow";
import { useFetchUserPosition } from "@/hooks/useFetchUserPosition";
import "./styles.scss";
import { DepositData, PositionData } from "@/store/types/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PositionRow } from "./PositionRow";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { LoadingText } from "@/common/LoadingText";
import { useFetchUserDeposits } from "@/hooks/useFetchUserDeposit";
import { DepositRow } from "./DepositRow";
export const PositionsComponent = () => {
  const [activeTab, setActiveTab] = useState<"Positions" | "Funding History">(
    "Positions"
  );
  const { error, isError, isLoading, userPositions } = useFetchUserPosition();
  const { address } = useWalletStore(
    useShallow((state) => ({
      address: state.userWalletAddress,
    }))
  );

  const tabs = [
    { key: "Positions", label: "Positions" },
    // { key: "Orders", label: "Orders" },
    { key: "Funding History", label: "Funding History" },
  ] as const;


  const {
    userDeposits,
    isFetching
  }=useFetchUserDeposits();

  const renderPositionRow = (position: PositionData, index: number) => {
    return <PositionRow position={position} index={index} key={index} />;
  };

  const renderPositionsContent = () => {
    if (isLoading) {
      return (
        <div className="loadingState">
          <div className="loadingSpinner" />
          <span className="loadingText">Loading positions...</span>
        </div>
      );
    }

    if (isError || error) {
      return (
        <div className="errorState">
          <span className="errorText">Failed to load positions</span>
        </div>
      );
    }

    if (userPositions.length === 0) {
      return (
        <div className="emptyState">
          <span className="emptyStateText">No open positions</span>
          <span className="emptyStateSubtext">
            Your trading positions will appear here
          </span>
        </div>
      );
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
          <div className="headerCell">Current Price</div>
          <div className="headerCell">Status</div>
        </div>
        <div className="positionsBody">
          {userPositions.map((position: PositionData, index: number) =>
            renderPositionRow(position, index)
          )}
        </div>
      </div>
    );
  };

  const renderDepositHistoryContent = () => {
    if (isFetching) {
      return (
        <div className="loadingState">
          <LoadingSpinner />
          <LoadingText text="Loading Your Deposit History" size={20} />
        </div>
      );
    }

    if (userDeposits===undefined) {
      return (
        <div className="errorState">
          <span className="errorText">Failed to load your Deposit History</span>
        </div>
      );
    }

    if (userDeposits.length === 0) {
      return (
        <div className="emptyState">
          <span className="emptyStateText">No deposit History</span>
          <span className="emptyStateSubtext">
            You have made no Deposits as of now
          </span>
        </div>
      );
    }

    return (
      <div className="positionsTable">
        <div className="depositHeader">
          <div className="headerCellDeposit">Size</div>
          <div className="headerCellDeposit">Chain</div>
          <div className="headerCellDeposit">Token</div>
          <div className="headerCellDeposit">Traxn Hash</div>
          <div className="headerCellDeposit">Time</div>
          
        </div>
        <div className="positionsBody">
          {
            userDeposits.map((item:DepositData)=>{
              return <DepositRow key={item.hash} userDeposit={item}/>
            }) 
          }
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!address) {
      return (
        <div className="emptyState">
          <ConnectButton.Custom>
            {({ openConnectModal, account, authenticationStatus, mounted }) => {
              const ready = mounted && authenticationStatus !== "loading";
              return (
                <button
                  className={
                    account?.address ? "connectedWallet" : "connectWalletButton"
                  }
                  onClick={() => {
                    useWalletStore
                      .getState()
                      .setUserWalletAddress(account?.address as string);
                    openConnectModal();
                  }}
                  disabled={!ready || address !== undefined}
                >
                  {account?.address
                    ? account.displayName
                    : activeTab === "Positions"
                    ? "Connect Wallet To View Position"
                    : "Connect Wallet to View Deposit History"}
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>
      );
    }

    switch (activeTab) {
      case "Positions":
        return renderPositionsContent();
      case "Funding History":
        return renderDepositHistoryContent();
      default:
        return null;
    }
  };

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
  );
};
