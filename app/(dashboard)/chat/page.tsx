"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockChatRooms, mockMessages, mockUsers, mockCompanies } from "@/lib/mock-data"
import { ChatWindow } from "@/components/chat/chat-window"
import { ChatList } from "@/components/chat/chat-list"
import type { ChatRoom, Message, User, Company } from "@/lib/types"

export default function ChatPage() {
  const { user } = useAuth()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [chatPartner, setChatPartner] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)

  useEffect(() => {
    if (!user) return

    // Filter chat rooms based on user role
    let filteredChatRooms: ChatRoom[] = []
    if (user.role === "student") {
      filteredChatRooms = mockChatRooms.filter((room) => room.studentIds.includes(user.id))
    } else if (user.role === "company") {
      const userCompany = mockCompanies.find((company) => company.users.some((u) => u.id === user.id))
      if (userCompany) {
        filteredChatRooms = mockChatRooms.filter((room) => room.companyId === userCompany.id)
      }
    } else {
      // Admin sees all chat rooms
      filteredChatRooms = mockChatRooms
    }

    setChatRooms(filteredChatRooms)

    // Select the first chat room by default if available
    if (filteredChatRooms.length > 0 && !selectedChatId) {
      setSelectedChatId(filteredChatRooms[0].id)
    }
  }, [user, selectedChatId])

  useEffect(() => {
    if (!selectedChatId) return

    // Get messages for the selected chat room
    const chatMessages = mockMessages.filter((message) => message.chatRoomId === selectedChatId)
    setMessages(chatMessages)

    // Get chat partner details
    const selectedRoom = chatRooms.find((room) => room.id === selectedChatId)
    if (selectedRoom) {
      if (user?.role === "student") {
        // For students, the partner is the company
        const chatCompany = mockCompanies.find((company) => company.id === selectedRoom.companyId)
        if (chatCompany) {
          const companyUser = mockUsers.find((u) => chatCompany.users.some((cu) => cu.id === u.id))
          setChatPartner(companyUser || null)
          setCompany(chatCompany)
        }
      } else if (user?.role === "company") {
        // For companies, the partner is the student
        const studentId = selectedRoom.studentIds[0]
        const student = mockUsers.find((u) => u.id === studentId)
        setChatPartner(student || null)
        setCompany(null)
      }
    }
  }, [selectedChatId, chatRooms, user])

  const handleSendMessage = (content: string) => {
    if (!selectedChatId || !user) return

    // In a real app, this would send the message to the server
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      chatRoomId: selectedChatId,
      senderId: user.id,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Update the messages state
    setMessages((prev) => [...prev, newMessage])
  }

  if (!user) return null

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="w-80 border-r">
        <ChatList
          chatRooms={chatRooms}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          currentUser={user}
        />
      </div>
      <div className="flex-1">
        {selectedChatId ? (
          <ChatWindow
            messages={messages}
            currentUser={user}
            chatPartner={chatPartner}
            company={company}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Изберете чат, за да започнете разговор</p>
          </div>
        )}
      </div>
    </div>
  )
}
