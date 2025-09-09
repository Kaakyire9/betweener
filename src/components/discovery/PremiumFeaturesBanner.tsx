
import React from "react";

const FEATURES = [
  { icon: "🚀", label: "Boost your profile" },
  { icon: "👀", label: "See who liked you" },
  { icon: "💬", label: "Unlimited likes & messages" },
  { icon: "✨", label: "Stand out with a premium badge" },
];

export default function PremiumFeaturesBanner() {
  // In a real app, check if user is premium and hide/replace banner if so
  const isPremium = false;
  if (isPremium) return null;
  return (
    <div className="bg-gradient-to-r from-yellow-200 via-pink-100 to-fuchsia-100 border-l-4 border-yellow-400 text-pink-900 p-4 mb-6 rounded-xl shadow flex flex-col sm:flex-row items-center justify-between animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <span className="font-bold text-lg flex items-center gap-2">
          <span className="text-yellow-500 text-2xl">★</span> Unlock Premium Features
        </span>
        <div className="flex flex-wrap gap-3 text-sm">
          {FEATURES.map(f => (
            <span key={f.label} className="flex items-center gap-1 bg-white/70 px-2 py-1 rounded-full border border-yellow-200">
              <span>{f.icon}</span> {f.label}
            </span>
          ))}
        </div>
      </div>
      <button
        className="mt-4 sm:mt-0 bg-yellow-400 hover:bg-yellow-500 text-pink-900 font-bold px-6 py-2 rounded-full shadow transition"
        onClick={() => alert('Upgrade flow coming soon!')}
      >
        Upgrade to Premium
      </button>
    </div>
  );
}
