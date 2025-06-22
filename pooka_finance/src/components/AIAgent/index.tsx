/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import "./styles.scss"
import axios from "axios"
import { useSocketConnection } from "@/hooks/useSockerConnection"
import { PositionCard, PositionParams } from "./PositionCard"
import Image from "next/image"
import { DepositParams } from "@/store/types/types"
import { DepositCard } from "./DepositCard"

interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  action:"query" | "response" | "trade" | "deposit";
  params?: DepositParams | PositionParams;
}

interface AgentChatProps {
  onSendMessage?: (message: string) => void
  onClearChat?: () => void
  isConnected?: boolean
}

export const AgentChat: React.FC<AgentChatProps> = ({ onSendMessage, isConnected = true }) => {
  
  const {
    depositParams,
    positionParams,
    element
  }=useSocketConnection();
  const [sendEnable, setSend]=useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content:
        "Hello! I'm your trading assistant. I can help you with market analysis, trading strategies, and answer questions about your portfolio. How can I assist you today?",
      timestamp: new Date(),
      action:"response"
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if(!sendEnable){
      setInputMessage("")
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
      action:"query"
    }
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);
    setSend(false);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/message`, {
        text: "I want to deposit 100 usdc on ethereum chain",
        agentId: "Sigma",
      });
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsTyping(false);
      setSend(true);
      setInputMessage("");
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey ) {
      e.preventDefault();
      handleSendMessage()
    }
  }
 
  const renderAgentResponse=(message:Message)=>{
    if(message.action==="trade" && message.params!==undefined){
      return (<div className="messageContent">
         <PositionCard params={message.params} isLoading={false}/>
      </div>)
    }else if(message.action==="deposit" && message.params!==undefined){
      return <div className="messageContent">
       <DepositCard params={message.params} isLoading={false}/>
      </div>
    }else{
      return <div className="messageContent">
      <div className="messageText">{message.content}</div>
    </div>;
    }
  }

  const renderUserQuery=(message:Message)=>{
    return <div className="messageContent">
    <div className="messageText">{message.content}</div>
  </div>
  }


  useEffect(()=>{

    if(element==="trade" && positionParams.current.payToken!==undefined && positionParams.current.positionType!==undefined){
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: "",
        timestamp: new Date(),
        action:element,
        params:positionParams.current
      }
      setMessages((prev)=>[...prev, newMessage])
    }else if(element==="deposit" && depositParams.current.payToken!==undefined && depositParams.current.collateral!==undefined){
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: "",
        timestamp: new Date(),
        action:element,
        params:depositParams.current
      }
      setMessages((prev)=>[...prev, newMessage])
    }
    setIsTyping(false)
    setSend(true)
  },[element, depositParams, positionParams])


  return (
    <div className="agentChatWrapper">
      <div className="chatHeader">
        <div className="headerInfo">
          <div className="agentAvatar">
            <Image className="avatarIcon" src={"/assets/logo.svg"} height={45} width={45} alt=""/>
          </div>
          <div className="agentDetails">
            <span className="agentName">Pooka Agentic</span>
            <span className={`agentStatus ${isConnected ? "online" : "offline"}`}>
              <div className="statusDot"></div>
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="chatMessages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            {
              message.type==="agent" ? renderAgentResponse(message) : renderUserQuery(message)
            }
          </div>
        ))}

        {isTyping && (
          <div className="message agent">
            <div className="messageAvatar">
              <div className="avatarIcon">🤖</div>
            </div>
            <div className="messageContent">
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
          <button onClick={handleSendMessage} disabled={!inputMessage.trim() || !sendEnable} className="sendButton">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  )
}



