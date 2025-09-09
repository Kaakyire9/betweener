import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

// ChatListItem type
export type ChatListItem = {
  userId: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
};

type ChatListProps = {
  currentUserId: string;
  onSelectChat: (userId: string, name: string, avatarUrl?: string) => void;
};

export default function ChatList({ currentUserId, onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      // Find all users who have a mutual match with current user
      const { data: matches, error } = await supabaseBrowser
        .from("matches")
        .select("user_id, target_id")
        .or(`and(user_id.eq.${currentUserId},action.eq.like),and(target_id.eq.${currentUserId},action.eq.like)`);
      if (error || !matches) {
        setChats([]);
        setLoading(false);
        return;
      }
      // Get unique user IDs of mutual matches
      const userIds = new Set<string>();
      matches.forEach((m: any) => {
        if (m.user_id !== currentUserId) userIds.add(m.user_id);
        if (m.target_id !== currentUserId) userIds.add(m.target_id);
      });
      userIds.delete(currentUserId);
      // Fetch profile info for each user
      const idsArr = Array.from(userIds);
      if (idsArr.length === 0) {
        setChats([]);
        setLoading(false);
        return;
      }
      const { data: profiles } = await supabaseBrowser
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", idsArr);
      // Fetch last message for each chat
      const chatItems: ChatListItem[] = await Promise.all(
        (profiles || []).map(async (profile: any) => {
          // Last message
          const { data: lastMsg } = await supabaseBrowser
            .from("messages")
            .select("content, created_at")
            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUserId})`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          // Unread count
          const { count: unreadCount } = await supabaseBrowser
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("sender_id", profile.id)
            .eq("receiver_id", currentUserId)
            .eq("read", false);
          return {
            userId: profile.id,
            name: profile.full_name,
            avatarUrl: profile.avatar_url,
            lastMessage: lastMsg?.content || undefined,
            lastMessageTime: lastMsg?.created_at || undefined,
            unreadCount: unreadCount || 0,
          };
        })
      );
      // Sort by last message time desc
      chatItems.sort((a, b) => (b.lastMessageTime || "") > (a.lastMessageTime || "") ? 1 : -1);
      setChats(chatItems);
      setLoading(false);
    }
    fetchChats();
  }, [currentUserId]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow divide-y">
      <div className="p-4 font-bold text-lg text-blue-700">Chats</div>
      {loading ? (
        <div className="p-4 text-gray-400 text-center">Loading...</div>
      ) : chats.length === 0 ? (
        <div className="p-4 text-gray-400 text-center">No chats yet.</div>
      ) : (
        chats.map(chat => (
          <button
            key={chat.userId}
            className="w-full flex items-center gap-3 p-4 hover:bg-blue-50 transition text-left"
            onClick={() => onSelectChat(chat.userId, chat.name, chat.avatarUrl)}
          >
            {chat.avatarUrl ? (
              <img src={chat.avatarUrl} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-blue-800">{chat.name}</div>
              <div className="text-xs text-gray-500 truncate max-w-[180px]">{chat.lastMessage || "Say hello!"}</div>
            </div>
            {chat.unreadCount && chat.unreadCount > 0 && (
              <span className="ml-2 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {chat.unreadCount}
              </span>
            )}
            {chat.lastMessageTime && (
              <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </button>
        ))
      )}
    </div>
  );
}
