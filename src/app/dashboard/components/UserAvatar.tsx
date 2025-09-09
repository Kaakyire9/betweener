'use client';
import { useEffect, useState } from "react";

export default function UserAvatar({ size = 40 }: { size?: number }) {
  // Replace with real user data fetching logic
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>("User");

  useEffect(() => {
    // TODO: Fetch user profile from Supabase or context
    setAvatarUrl(null); // fallback to initials if no avatar
    setName("Alex");
  }, []);

  return (
    <div className="flex items-center gap-2 cursor-pointer group">
      <div
        className="rounded-full border-2 border-pink-400 shadow-lg bg-gradient-to-br from-blue-200 to-pink-200 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg font-bold text-blue-600">{name[0]}</span>
        )}
      </div>
      <span className="hidden md:inline font-medium text-blue-700 group-hover:underline">{name}</span>
    </div>
  );
}
