
"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
// Helper to get unread count
async function fetchUnreadCount(userId: string): Promise<number> {
  if (!userId) return 0;
  const { count, error } = await supabaseBrowser
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .eq("read", false);
  return error ? 0 : count || 0;
}
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseBrowser.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
      if (data?.user?.id) {
        const count = await fetchUnreadCount(data.user.id);
        setUnreadCount(count);
      }
    }
    loadUser();
  }, []);

  // Listen for new messages in real-time to update unread count
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabaseBrowser
      .channel('public:messages-navbar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, async (payload) => {
        // Re-fetch unread count on any message change
        const count = await fetchUnreadCount(user.id);
        setUnreadCount(count);
      })
      .subscribe();
    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [user?.id]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  const links = [
    { href: "/dashboard/user/discovery", label: "Discovery" },
    { href: "/matches", label: "Matches" },
    { href: "/chats", label: "Chats" },
    { href: "/premium", label: user?.user_metadata?.isPremium ? "Premium 👑" : "Upgrade" },
  ];

  const renderLinks = (isMobile = false) =>
    links.map((link) => {
      const isActive = pathname.startsWith(link.href);
      return (
        <div key={link.href} className="relative">
          <Link
            href={link.href}
            className={`hover:text-pink-600 ${isActive ? "text-pink-600 font-semibold" : ""}`}
          >
            {link.label}
          </Link>
          {isActive && (
            <motion.div
              layoutId="underline"
              className="absolute left-0 -bottom-1 h-[2px] w-full bg-pink-600"
            />
          )}
        </div>
      );
    });

  const AuthLinks = (
    <>
      {renderLinks()}
      <Link href="/chats" className="relative flex items-center gap-1 hover:text-pink-600">
        <span role="img" aria-label="chat">💬</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs px-1 rounded-full min-w-[1.2em] text-center">
            {unreadCount}
          </span>
        )}
      </Link>
      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileDropdown((prev) => !prev)}
          className="flex items-center gap-2"
        >
          {user?.user_metadata?.avatarUrl ? (
            <img
              src={user.user_metadata.avatarUrl}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <UserCircle className="w-8 h-8 text-gray-600" />
          )}
          <span>{user?.user_metadata?.fullName || "Profile"}</span>
        </button>
        <AnimatePresence>
          {profileDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 bg-white shadow-lg rounded-md mt-2 w-48 z-50"
            >
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
              <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
              <Link href="/safety" className="block px-4 py-2 hover:bg-gray-100">Safety</Link>
              <button
                onClick={async () => {
                  await supabaseBrowser.auth.signOut();
                  router.push("/");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  const GuestLinks = (
    <>
      <Link href="/dashboard/user/discovery" className="hover:text-pink-600">Discovery</Link>
      <Link href="/about" className="hover:text-pink-600">About</Link>
      <Link href="/premium" className="hover:text-yellow-600">Premium</Link>
      <Link href="/login" className="hover:text-pink-600">Login</Link>
      <Link
        href="/signup"
        className="bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-700"
      >
        Sign Up
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-3 flex justify-between items-center z-50">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-pink-600">Betweener</Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {user ? AuthLinks : GuestLinks}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setMobileMenu((prev) => !prev)}>
          {mobileMenu ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-14 left-0 w-full bg-white shadow-lg flex flex-col gap-4 p-4 md:hidden z-40"
          >
            {user ? renderLinks(true) : GuestLinks}
            <button
              onClick={() => setMobileMenu(false)}
              className="mt-2 text-sm text-gray-500"
            >
              Close Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
