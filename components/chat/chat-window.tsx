"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { mockMessages } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Message as MessageType } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface ChatMessageProps {
  message: MessageType
  isCurrentUser: boolean
}

function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{message.senderId.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className={`rounded-lg px-4 py-2 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <div className="text-sm">{message.content}</div>
          <div className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {formatTime(new Date(message.createdAt))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChatWindowProps {
  chatRoomId: string
}

export function ChatWindow({ chatRoomId }: ChatWindowProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load messages from mock data
    const roomMessages = mockMessages.filter((m) => m.chatRoomId === chatRoomId)
    setMessages(roomMessages)
  }, [chatRoomId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!user || !newMessage.trim()) return

    // Create a new message
    const message: MessageType = {
      id: `temp-${Date.now()}`,
      chatRoomId,
      senderId: user.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to local state
    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user) return null

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} isCurrentUser={message.senderId === user.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напиши съобщение..."
            className="min-h-[60px] flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="self-end">
            <Send className="h-4 w-4" />
            <span className="sr-only">Изпрати</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
