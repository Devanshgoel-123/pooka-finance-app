/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import "./styles.scss";
import axios from "axios";
import { useSocketConnection } from "@/hooks/useSockerConnection";
import { PositionCard, PositionParams } from "./PositionCard";
import Image from "next/image";
import { ClosePositionParams, DepositParams, WithdrawPositionParams } from "@/store/types/types";
import { RxCross1 } from "react-icons/rx";
import { DepositCard } from "./DepositCard";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletStore } from "@/store/walletStore";
import { AgentChatProps } from "@/store/types/types";
import { Message } from "@/store/types/types";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { ClosePositionCard } from "./ClosePositionCard";
import { WithdrawAmountCard } from "./WithdrawAmount";
import { WithdrawParameters } from "viem/zksync";
import { POOKA_LOGO } from "@/utils/constants";

export const AgentChat: React.FC<AgentChatProps> = () => {
  const router = useRouter();

  const { address, isConnected } = useAccount();

  const { disconnect } = useDisconnect();

  const { depositParams, positionParams, element, withdrawParams, closePositionParams, generalQuery } = useSocketConnection();
  const [sendEnable, setSend] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content:
        "Hello! I'm your trading assistant. I can help you with market analysis, trading strategies, and answer questions about your portfolio. How can I assist you today?",
      timestamp: new Date(),
      action: "response",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!sendEnable) {
      setInputMessage("");
      return;
    }
    const tempMessage = inputMessage.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: tempMessage,
      timestamp: new Date(),
      action: "query",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);
    setSend(false);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL_AXIOS}/message`, {
        text: tempMessage,
        agentId: "Sigma"
      });
    } catch (err) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: "Sorry We are facing some issues here. Can you please try again later?",
        timestamp: new Date(),
        action: "response",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error sending message:", err);
    } finally {
      setIsTyping(false);
      setSend(true);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderAgentResponse = (message: Message) => {
    if (message.action === "trade" && message.params !== undefined) {
      return (
        <div className="messageContent">
          <PositionCard params={message.params as PositionParams} isLoading={false} />
        </div>
      );
    } else if (message.action === "deposit" && message.params !== undefined) {
      return (
        <div className="messageContent">
          <DepositCard params={message.params as DepositParams} isLoading={false} />
        </div>
      );
    }else if(message.action === "close" && message.params !== undefined ){
      return (
        <div className="messageContent">
          <ClosePositionCard params={message.params as ClosePositionParams} isLoading={false} />
        </div>
      )
    } else if(message.action === "withdraw" && message.params !== undefined ){
      return (
        <div className="messageContent">
          <WithdrawAmountCard params={message.params as WithdrawPositionParams} isLoading={false} />
        </div>
      )
    }else {
      return (
        <div className="messageContent">
          <div className="messageText">{message.content}</div>
        </div>
      );
    }
  };

  const renderUserQuery = (message: Message) => {
    return (
      <div className="messageContent">
        <div className="messageText">{message.content}</div>
      </div>
    );
  };

  useEffect(() => {
    if (
      element === "trade" &&
      positionParams.current.collateral !== undefined &&
      positionParams.current.positionType !== undefined &&
      positionParams.current.perpName !== undefined
    ) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: "",
        timestamp: new Date(),
        action: element,
        params: positionParams.current,
      };
      setMessages((prev) => [...prev, newMessage]);
    } else if (
      element === "deposit" &&
      depositParams.current.payToken !== undefined &&
      depositParams.current.collateral !== undefined &&
      depositParams.current.chainName !== undefined
    ) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: "",
        timestamp: new Date(),
        action: element,
        params: depositParams.current,
      };
      setMessages((prev) => [...prev, newMessage]);
    } else if (
      element === "withdraw" &&
      withdrawParams.current.withdrawAmount !== undefined
    ){
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: "",
        timestamp: new Date(),
        action: element,
        params: withdrawParams.current,
      };
      setMessages((prev) => [...prev, newMessage]);
    }else if(
      element === "close" &&
      closePositionParams.current.perpName !== undefined
    ){
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: "",
        timestamp: new Date(),
        action: element,
        params: closePositionParams.current,
      };
      setMessages((prev) => [...prev, newMessage]);
    }else if(
      element === "response" &&
     (generalQuery.current !== undefined || generalQuery.current != "")
    ){
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: generalQuery.current.message || "Facing some issues please try again later",
        timestamp: new Date(),
        action:"response",
        params: generalQuery.current,
      };
      setMessages((prev) => [...prev, newMessage]);
    }
    setIsTyping(false);
    setSend(true);
  }, [element, depositParams, positionParams, closePositionParams, withdrawParams, generalQuery]);
  const navItems = ["Home","Dashboard"];
  return (
    <div className="agentChatWrapper">
      <div className="chatHeader">
        <div className="headerInfo">
          <div
            className="crossIcon"
            onClick={() => {
              router.push("/");
            }}
          >
            <RxCross1 />
          </div>
          <div className="agentAvatar">
            <Image
              className="avatarIcon"
              src={POOKA_LOGO}
              height={45}
              width={45}
              alt=""
            />
          </div>
          <div className="agentDetails">
            <span className="agentName">Pooka Agentic</span>
            <span
              className={`agentStatus ${isConnected ? "online" : "offline"}`}
            >
              <div className="statusDot"></div>
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div className="navbar-nav">
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-link`}
              onClick={() => {
                router.push(item==="Home" ? "/":"/Trade")
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <ConnectButton.Custom>
          {({ openConnectModal, account, authenticationStatus, mounted }) => {
            const ready = mounted && authenticationStatus !== "loading";
            return (
              <button
                className={`${
                  address !== undefined
                    ? "connectedWallet"
                    : "connectWalletButtonAgent"
                }`}
                onClick={() => {
                  if (account?.address) {
                    useWalletStore.getState().setUserWalletAddress(undefined);
                    disconnect();
                  } else {
                    useWalletStore
                      .getState()
                      .setUserWalletAddress(account?.address as string);
                    openConnectModal();
                  }
                }}
                disabled={!ready}
              >
                {account?.address
                  ? `${address?.slice(0, 5)}...${address?.slice(-5)}`
                  : "Connect Wallet"}
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>

      <div className="chatMessages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            {message.type === "agent"
              ? renderAgentResponse(message)
              : renderUserQuery(message)}
          </div>
        ))}

        {isTyping && (
          <div className="message agent">
            <div className="messageAvatar">
              <div className="avatarIcon">
                <Image src={POOKA_LOGO} width={32} height={32} alt="" className=""/>
              </div>
            </div>
            <div className="messageContent" style={{
              width:"100px",
              overflow:"hidden"
            }}>
              <div className="typingIndicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chatInput">
        <div className="inputContainer">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about trading..."
            className="messageInput"
            disabled={!isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !sendEnable}
            className="sendButton"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 11L12 6L17 11M12 18V7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
