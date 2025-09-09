
import React from "react";

type Profile = {
  id: string;
  name: string;
  age: number;
  avatarUrl?: string;
  bio: string;
  region: string;
  tribe: string;
  religion: string;
  interests?: string[];
};

type ProfilePreviewModalProps = {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
};

export default function ProfilePreviewModal({ open, onClose, profile }: ProfilePreviewModalProps) {
  if (!open || !profile) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-pop-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close profile preview"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gray-200 mb-4 overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">👤</div>
            )}
          </div>
          <div className="font-bold text-2xl mb-1">{profile.name}, {profile.age}</div>
          <div className="text-gray-500 text-sm mb-2">{profile.region} • {profile.tribe} • {profile.religion}</div>
          <div className="text-center text-gray-700 mb-4">{profile.bio}</div>
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.interests.map((interest) => (
                <span key={interest} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
