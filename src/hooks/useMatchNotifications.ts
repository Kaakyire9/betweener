"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export function useMatchNotifications(currentUserId: string | undefined) {
  const [match, setMatch] = useState<null | { id: string; senderId: string; receiverId: string }>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    // Listen for new accepted matches where current user is the sender or receiver
    const channel = supabaseBrowser
      .channel("match_notifications")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Match",
          filter: `status=eq.ACCEPTED` // Only accepted matches
        },
        (payload) => {
          const newMatch = payload.new;
          if (
            (newMatch.senderId === currentUserId || newMatch.receiverId === currentUserId) &&
            payload.old.status !== "ACCEPTED"
          ) {
            setMatch({
              id: newMatch.id,
              senderId: newMatch.senderId,
              receiverId: newMatch.receiverId,
            });
            setOpen(true);
          }
        }
      )
      .subscribe();
    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [currentUserId]);

  return { match, open, setOpen };
}
