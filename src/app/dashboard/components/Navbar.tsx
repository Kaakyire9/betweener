
"use client";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import UserAvatar from './UserAvatar';

// Optionally, you can use a user hook if you have one
// import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Optionally, you can use a user hook if you have one
  // const { user, loading } = useCurrentUser();

  const handleSignOut = async () => {
    setLoading(true);
    await supabaseBrowser.auth.signOut();
    setLoading(false);
    router.push("/login");
  };
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="font-bold text-xl text-blue-600">Betweener</div>
      <div className="flex gap-6">
        <a href="/dashboard/discovery" className="text-blue-500">Discovery</a>
        <a href="/dashboard/messages" className="text-blue-500">Messages</a>
        <a href="/dashboard/profile" className="text-blue-500">Profile</a>
      </div>
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <span className="relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full"></span>
          <button className="p-2 rounded-full bg-blue-100">
            {/* Icon placeholder */}
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6z" /></svg>
          </button>
        </span>
  <UserAvatar size={40} />
      </div>
    </nav>
  );
}
