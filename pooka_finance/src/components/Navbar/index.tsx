"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./styles.scss"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWalletStore } from "@/store/walletStore";
import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation";
import { POOKA_LOGO } from "@/utils/constants"
import Image from "next/image"

export const Navbar=() => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const {address, isConnected}=useAccount();
  const { disconnect } = useDisconnect();
  const navItems = [ "Home", "Dashboard", "Agent"];
  const router=useRouter();
  useEffect(() => {
    useWalletStore.getState().setUserWalletAddress(
      isConnected ? address : undefined
    );
  }, [address, isConnected]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="logo">
          <div className="logoIcon">
            <Image src={POOKA_LOGO} className="logoPlaceholder" height={45} width={45} alt="logo"/>
          </div>
            <span className="logo-text">PookaFinance</span>
          </div>
        </div>
        <div className="navbar-nav">
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-link ${activeNav === item ? "active" : ""}`}
              onClick={() => {
                setActiveNav(item)
                router.push(item==="Home" ? "/":item)
              }}
            >
              {item}
            </button>
          ))}
        </div>


        <div className="navbar-actions">
          <div className="navbar-actions">       
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
            className={isConnected ? "connectedWallet" : "connectWalletButton"}
            onClick={()=>{
              if(account?.address){
                useWalletStore.getState().setUserWalletAddress(undefined)
                disconnect()
              }else{
                useWalletStore.getState().setUserWalletAddress(account?.address as string)
                openConnectModal();
              }
            }}
            disabled={!ready}
          >
            {account?.address ? account.displayName : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectButton.Custom>
            </div>
        </div>
      </div>
    </nav>
  )
}

