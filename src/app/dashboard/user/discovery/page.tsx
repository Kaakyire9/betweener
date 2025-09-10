"use client";


import { DiscoveryProvider } from "@/components/discovery/DiscoveryContext";
// Removed extra Navbar import

import DiscoveryFeed from "@/components/discovery/DiscoveryFeed";
import DiscoveryFilters from "@/components/discovery/DiscoveryFilters";
import ProfilePreviewModal from "@/components/discovery/ProfilePreviewModal";
import MatchNotification from "@/components/discovery/MatchNotification";
import SafetyBanner from "@/components/discovery/SafetyBanner";
import OnboardingReminder from "@/components/discovery/OnboardingReminder";
import PremiumFeaturesBanner from "@/components/discovery/PremiumFeaturesBanner";

import React, { useState } from "react";

export default function DiscoveryPage() {
  // State for profile preview modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // State for match notification
  const [matchOpen, setMatchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({ id: "1", name: "Ama", avatarUrl: "" });
  const [matchedUser, setMatchedUser] = useState<any>({ id: "2", name: "Kwame", avatarUrl: "" });


  // Handler for profile card click
  const handleProfileClick = (profile: any) => {
    setSelectedProfile(profile);
    setProfileModalOpen(true);
  };


  // Handler for Like action (single like)
  const handleLike = (profile: any) => {
    // No-op here; DiscoveryFeed handles snackbar
  };

  // Handler for mutual match
  const handleMutualMatch = (profile: any) => {
    setMatchedUser(profile);
    setMatchOpen(true);
  };

  // Handler for Pass action
  const handlePass = (profile: any) => {
    // Optionally show animation or feedback
  };

  return (
    <DiscoveryProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-fuchsia-50 to-pink-100">
        {/* 5. Safety & Reporting */}
        <SafetyBanner />
        {/* 7. Onboarding Reminders */}
        <OnboardingReminder />
        {/* 2. Filters & Preferences */}
        <DiscoveryFilters />
        {/* 8. Premium Features */}
        <PremiumFeaturesBanner />
        {/* 1. User Cards/Feed, 3. Profile Preview, 4. Match & Messaging */}
        <DiscoveryFeed
          onProfileClick={handleProfileClick}
          onLike={handleLike}
          onPass={handlePass}
          onMutualMatch={handleMutualMatch}
        />
        {/* 3. Profile Preview Modal */}
        <ProfilePreviewModal
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          profile={selectedProfile}
        />
        {/* 4. Match Notification */}
        <MatchNotification
          open={matchOpen}
          onClose={() => setMatchOpen(false)}
          currentUser={currentUser}
          matchedUser={matchedUser}
          onStartChat={() => alert("Start chat!")}
        />
        {/* 6. Real-Time Updates handled in DiscoveryFeed/MatchNotification */}
      </div>
    </DiscoveryProvider>
  );
}
