"use client";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export function useAuthSync() {
  useEffect(() => {
    const sync = async (accessToken?: string | null) => {
      if (!accessToken) return;
      await fetch("/api/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    };

    // initial check
    supabaseBrowser.auth.getSession().then(({ data }) => {
      sync(data?.session?.access_token ?? null);
    });

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((event, session) => {
      const token = session?.access_token ?? null;
      sync(token);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
}
