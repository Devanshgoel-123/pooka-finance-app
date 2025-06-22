"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import "./styles.scss"
import axios from "axios"

interface Message {
  id: string
  type: "user" | "agent"
  content: string
  timestamp: Date
}

interface AgentChatProps {
  onSendMessage?: (message: string) => void
  onClearChat?: () => void
  isConnected?: boolean
}

export const AgentChat: React.FC<AgentChatProps> = ({ onSendMessage, isConnected = true }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content:
        "Hello! I'm your trading assistant. I can help you with market analysis, trading strategies, and answer questions about your portfolio. How can I assist you today?",
      timestamp: new Date(),
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
    if (!inputMessage.trim()) return

    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/message`, {
      text: "I want to open a long position on ETH perp with usdc as collateral 1000, with a 10x leverage on avax chain",
      agentId: "Sigma",
    })

    console.log(response)
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setIsTyping(true)

    onSendMessage?.(inputMessage.trim())

    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: "I received your message. This is where your backend response will appear.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  return (
    <div className="agentChatWrapper">
      <div className="chatHeader">
        <div className="headerInfo">
          <div className="agentAvatar">
            <div className="avatarIcon">🤖</div>
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
            {message.type === "agent" && (
              <div className="messageAvatar">
                <div className="avatarIcon">🤖</div>
              </div>
            )}
            <div className="messageContent">
              <div className="messageText">{message.content}</div>
            </div>
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
        <div ref={messagesEndRef} />
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
          <button onClick={handleSendMessage} disabled={!inputMessage.trim() || !isConnected} className="sendButton">
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



