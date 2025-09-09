import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useDiscovery } from "@/components/discovery/DiscoveryContext";
import { supabaseBrowser } from "@/lib/supabaseClient";
// import { supabase } from "@/lib/supabase";
import DiscoveryCard from "@/app/dashboard/user/discovery/DiscoveryCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const VIEW_MODES = ["card", "list", "grid"] as const;

type Profile = {
  id: string;
  full_name: string;
  age: number;
  avatar_url?: string;
  bio: string;
  region: string;
  tribe: string;
  religion: string;
};

type DiscoveryFeedProps = {
  onLike?: (profile: Profile) => void;
  onPass?: (profile: Profile) => void;
  onProfileClick?: (profile: Profile) => void;
};


type ViewMode = typeof VIEW_MODES[number];


export default function DiscoveryFeed({ onLike, onPass, onProfileClick }: DiscoveryFeedProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const { filters } = useDiscovery();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [matchModal, setMatchModal] = useState<{ open: boolean; name: string; avatarUrl?: string }>({ open: false, name: "", avatarUrl: undefined });

  // Fetch current user ID on mount
  useEffect(() => {
    async function getUserId() {
      const { data, error } = await supabaseBrowser.auth.getUser();
      console.log("[DiscoveryFeed] getUserId result:", { data, error });
      if (data?.user?.id) {
        setCurrentUserId(data.user.id);
        console.log("[DiscoveryFeed] Current user ID:", data.user.id);
      } else {
        console.log("[DiscoveryFeed] No user ID found", { data, error });
      }
    }
    getUserId();
  }, []);

  useEffect(() => {
    async function fetchProfiles() {
      if (!currentUserId) {
        console.log("[DiscoveryFeed] Waiting for currentUserId...");
        return;
      }
      setLoading(true);
      let query = supabaseBrowser
        .from("profiles")
        .select("id, full_name, age, avatar_url, bio, region, tribe, religion")
        .neq("id", currentUserId);

      // Restore filters
      if (filters.ageRange) {
        query = query.gte("age", filters.ageRange[0]).lte("age", filters.ageRange[1]);
      }
      if (filters.region) {
        query = query.eq("region", filters.region);
      }
      if (filters.tribe) {
        query = query.eq("tribe", filters.tribe);
      }
      if (filters.religion) {
        query = query.eq("religion", filters.religion);
      }

      console.log("[DiscoveryFeed] Query filters:", filters);
      const { data, error } = await query;
      if (error) {
        console.log("[DiscoveryFeed] Query error:", error);
        setProfiles([]);
        setLoading(false);
        return;
      }
      console.log("[DiscoveryFeed] Profiles fetched:", data);
      setProfiles(data || []);
      setLoading(false);
    }
    fetchProfiles();
  }, [filters, currentUserId]);

  const nextView = () => {
    setViewMode((prev) => {
      const idx = VIEW_MODES.indexOf(prev);
      return VIEW_MODES[(idx + 1) % VIEW_MODES.length];
    });
  };

  const handleLike = async (profile: Profile) => {
    if (!currentUserId) return;
    if (onLike) onLike(profile);
    // Insert Like action in Supabase
    const { error } = await supabaseBrowser.from("matches").insert({
      user_id: currentUserId,
      target_id: profile.id,
      action: "like"
    });
    if (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: "error" });
      return;
    }
    // Check for mutual match
    const { data: mutual, error: mutualError } = await supabaseBrowser
      .from("matches")
      .select("id")
      .eq("user_id", profile.id)
      .eq("target_id", currentUserId)
      .eq("action", "like")
      .maybeSingle();
    if (mutualError) {
      setSnackbar({ open: true, message: `You liked ${profile.full_name}!`, severity: "success" });
    } else if (mutual) {
  setMatchModal({ open: true, name: profile.full_name, avatarUrl: profile.avatar_url });
    } else {
      setSnackbar({ open: true, message: `You liked ${profile.full_name}!`, severity: "success" });
    }
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  };

  const handlePass = async (profile: Profile) => {
    if (!currentUserId) return;
    if (onPass) onPass(profile);
    // Insert Pass action in Supabase
    const { error } = await supabaseBrowser.from("matches").insert({
      user_id: currentUserId,
      target_id: profile.id,
      action: "pass"
    });
    if (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: "error" });
    } else {
      setSnackbar({ open: true, message: `You passed on ${profile.full_name}.`, severity: "info" });
      setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
    }
  };
  const handleProfileClick = (profile: Profile) => {
    if (onProfileClick) onProfileClick(profile);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Discovery Feed</h2>
        <button
          className="bg-gray-200 px-4 py-2 rounded text-sm font-medium"
          onClick={nextView}
          title="Toggle view"
        >
          {viewMode === "card" && "Card View"}
          {viewMode === "list" && "List View"}
          {viewMode === "grid" && "Grid View"}
        </button>
      </div>
  {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No profiles found.</div>
      ) : viewMode === "card" ? (
        <div className="flex flex-col items-center gap-6">
          {profiles.slice(0, 1).map((profile) => (
            <DiscoveryCard
              key={profile.id}
              name={profile.full_name}
              age={profile.age}
              avatarUrl={profile.avatar_url}
              bio={profile.bio}
              region={profile.region}
              tribe={profile.tribe}
              religion={profile.religion}
              onLike={() => handleLike(profile)}
              onPass={() => handlePass(profile)}
              enableSwipe={true}
            />
          ))}
          <div className="text-xs text-gray-400 mt-2">Swipe right = "Mehwia?", left = "Next"</div>
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-xl shadow p-4 flex items-center gap-4 cursor-pointer"
              onClick={() => handleProfileClick(profile)}
            >
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
              )}
              <div>
                <div className="font-bold">{profile.full_name}, {profile.age}</div>
                <div className="text-gray-500 text-xs">{profile.region} • {profile.tribe} • {profile.religion}</div>
                <div className="text-gray-700 text-sm">{profile.bio}</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold"
                  onClick={e => { e.stopPropagation(); handlePass(profile); }}
                >Pass</button>
                <button
                  className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold"
                  onClick={e => { e.stopPropagation(); handleLike(profile); }}
                >Like</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer"
              onClick={() => handleProfileClick(profile)}
            >
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-20 h-20 rounded-full object-cover mb-2" />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
              )}
              <div className="font-bold">{profile.full_name}, {profile.age}</div>
              <div className="text-gray-500 text-xs">{profile.region} • {profile.tribe} • {profile.religion}</div>
              <div className="text-gray-700 text-sm mb-2">{profile.bio}</div>
              <div className="flex gap-2">
                <button
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold"
                  onClick={e => { e.stopPropagation(); handlePass(profile); }}
                >Pass</button>
                <button
                  className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold"
                  onClick={e => { e.stopPropagation(); handleLike(profile); }}
                >Like</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
        {/* Mutual Match Modal */}
        <Dialog open={matchModal.open} onOpenChange={open => setMatchModal(m => ({ ...m, open }))}>
          <DialogContent className="flex flex-col items-center justify-center gap-4">
            <DialogHeader>
              <DialogTitle>It's a Match! 🎉</DialogTitle>
              <DialogDescription>
                You and <span className="font-bold">{matchModal.name}</span> liked each other!
              </DialogDescription>
            </DialogHeader>
            {matchModal.avatarUrl && (
              <img src={matchModal.avatarUrl} alt={matchModal.name} className="w-24 h-24 rounded-full object-cover border-4 border-pink-400 shadow-lg" />
            )}
            <div className="text-center text-pink-600 font-semibold">Start a chat and say hello!</div>
            <DialogFooter>
              <DialogClose asChild>
                <button className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-700 transition">Close</button>
              </DialogClose>
              {/* Future: Add a button to start a chat */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}

