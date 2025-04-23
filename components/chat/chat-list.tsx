"use client"

import { useState, useEffect } from "react"
import { mockChatRooms, mockCompanies, mockUsers } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "./chat-window"
import type { ChatRoom } from "@/lib/types"

export function ChatList() {
  const { user } = useAuth()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    // Filter chat rooms based on user role
    let filteredRooms: ChatRoom[] = []
    if (user.role === "student") {
      filteredRooms = mockChatRooms.filter((room) => room.studentIds.includes(user.id))
    } else if (user.role === "company") {
      const userCompany = mockCompanies.find((company) => company.users.some((u) => u.id === user.id))
      if (userCompany) {
        filteredRooms = mockChatRooms.filter((room) => room.companyId === userCompany.id)
      }
    }

    setChatRooms(filteredRooms)
    if (filteredRooms.length > 0 && !selectedChatRoom) {
      setSelectedChatRoom(filteredRooms[0].id)
    }
  }, [user, selectedChatRoom])

  if (!user) return null

  // Get chat room name based on user role
  const getChatRoomName = (chatRoom: ChatRoom) => {
    if (user.role === "student") {
      const company = mockCompanies.find((c) => c.id === chatRoom.companyId)
      return company ? company.name : "Неизвестна компания"
    } else {
      const studentIds = chatRoom.studentIds
      if (studentIds.length === 1) {
        const student = mockUsers.find((u) => u.id === studentIds[0])
        return student ? student.name : "Неизвестен ученик"
      } else {
        return `Група (${studentIds.length} ученици)`
      }
    }
  }

  // Get initials for avatar
  const getChatRoomInitials = (chatRoom: ChatRoom) => {
    const name = getChatRoomName(chatRoom)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
      <div className="md:col-span-1 border rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Чат стаи</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">Нямате активни чат стаи</div>
          ) : (
            <div className="divide-y">
              {chatRooms.map((chatRoom) => (
                <Button
                  key={chatRoom.id}
                  variant="ghost"
                  className={`w-full justify-start px-4 py-3 h-auto ${
                    selectedChatRoom === chatRoom.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedChatRoom(chatRoom.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getChatRoomInitials(chatRoom)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-medium">{getChatRoomName(chatRoom)}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(chatRoom.updatedAt).toLocaleDateString("bg-BG")}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="md:col-span-3">
        {selectedChatRoom ? (
          <ChatWindow chatRoomId={selectedChatRoom} />
        ) : (
          <div className="flex items-center justify-center h-full border rounded-lg">
            <div className="text-center text-muted-foreground">
              <p>Изберете чат стая или започнете нов разговор</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
