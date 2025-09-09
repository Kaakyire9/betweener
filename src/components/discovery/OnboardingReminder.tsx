
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Placeholder: In a real app, get this from user context or props
const isProfileIncomplete = true;

export default function OnboardingReminder() {
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  if (!visible || !isProfileIncomplete) return null;
  return (
    <div className="bg-pink-100 border-l-4 border-pink-400 text-pink-800 p-4 mb-4 rounded flex items-center justify-between animate-fade-in">
      <div>
        <span className="font-bold">Complete your profile!</span>
        <span className="ml-2">Finish onboarding to get better matches and unlock all features.</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="bg-pink-500 text-white px-4 py-1 rounded shadow hover:bg-pink-600 transition"
          onClick={() => router.push("/onboarding")}
        >
          Complete Profile
        </button>
        <button
          className="ml-2 text-pink-700 hover:text-pink-900 text-lg font-bold px-2"
          onClick={() => setVisible(false)}
          aria-label="Dismiss onboarding reminder"
        >
          ×
        </button>
      </div>
    </div>
  );
}
