"use client";
import React, { useState } from "react";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ChatPage() {
  const { user, loading } = useCurrentUser();
  const [selectedChat, setSelectedChat] = useState<{
    userId: string;
    name: string;
    avatarUrl?: string;
  } | null>(null);

  if (loading) {
    return <div className="flex items-center justify-center h-[80vh] text-gray-400 text-lg">Loading chats...</div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center h-[80vh] text-gray-400 text-lg">Please log in to view your chats.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[80vh] gap-4 p-4">
      {/* Chat List */}
      <div className="md:w-1/3 w-full">
        <ChatList
          currentUserId={user.id}
          onSelectChat={(userId, name, avatarUrl) => setSelectedChat({ userId, name, avatarUrl })}
        />
      </div>
      {/* Chat Window */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow
            currentUserId={user.id}
            otherUserId={selectedChat.userId}
            otherUserName={selectedChat.name}
            otherUserAvatar={selectedChat.avatarUrl}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
