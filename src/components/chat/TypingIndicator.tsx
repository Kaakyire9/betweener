import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

interface TypingIndicatorProps {
  chatId: string;
  otherUserId: string;
}

type TypingStatus = {
  chat_id: string;
  user_id: string;
  is_typing: boolean;
};

export default function TypingIndicator({ chatId, otherUserId }: TypingIndicatorProps) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const channel = supabaseBrowser
      .channel('public:typing_status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'typing_status' }, payload => {
        const status = payload.new as TypingStatus;
        if (status && status.chat_id === chatId && status.user_id === otherUserId) {
          setIsTyping(!!status.is_typing);
        }
      })
      .subscribe();
    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [chatId, otherUserId]);

  if (!isTyping) return null;
  return <div className="text-xs text-gray-400 px-4 pb-2">Typing…</div>;
}
