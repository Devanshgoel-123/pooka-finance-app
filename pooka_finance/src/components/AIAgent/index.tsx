"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import "./styles.scss"

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
  const [isTyping, setIsTyping] = useState(false)
  //const [isChatMinimized, setIsChatMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setIsTyping(true)

    // Call the parent's onSendMessage function
    onSendMessage?.(inputMessage.trim())

    // Simulate agent typing (you'll replace this with your backend call)
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

  // const handleClearChat = () => {
  //   setMessages([
  //     {
  //       id: "1",
  //       type: "agent",
  //       content: "Chat cleared. How can I help you?",
  //       timestamp: new Date(),
  //     },
  //   ])
  //   onClearChat?.()
  // }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="agentChat">
      <div className="chatHeader">
        <div className="headerInfo">
          <div className="agentAvatar">🤖</div>
          <div className="agentDetails">
            <span className="agentName">Trading Assistant</span>
            <span className={`agentStatus ${isConnected ? "online" : "offline"}`}>
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        {/* <div className="headerActions">
          <button className="actionBtn" onClick={handleClearChat} title="Clear Chat">
            🗑️
          </button>
          <button
            className="actionBtn"
            onClick={() => setIsChatMinimized(!isChatMinimized)}
            title={isChatMinimized ? "Expand" : "Minimize"}
          >
            {isChatMinimized ? "⬆️" : "⬇️"}
          </button>
        </div> */}
      </div>

      {
        <>
          <div className="chatMessages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="messageContent">
                  <div className="messageText">{message.content}</div>
                  <div className="messageTime">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message agent">
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
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !isConnected}
                className="sendButton"
              >
                📤
              </button>
            </div>
            <div className="inputFooter">
              <span className="inputHint">Press Enter to send • Shift+Enter for new line</span>
            </div>
          </div>
        </>
      }
    </div>
  )
}


