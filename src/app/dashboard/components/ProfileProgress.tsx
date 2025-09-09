"use client";
import { useUserProfile } from "../user/components/useUserProfile";

const REQUIRED_FIELDS = [
  "full_name",
  "age",
  "gender",
  "bio",
  "region",
  "tribe",
  "religion",
  "interests",
  "avatar_url"
];

export default function ProfileProgress() {
  const { profile, loading, error } = useUserProfile();

  let percent = 0;
  if (profile) {
    let filled = 0;
    for (const field of REQUIRED_FIELDS) {
      if (Array.isArray(profile[field])) {
        if (profile[field].length > 0) filled++;
      } else if (profile[field]) {
        filled++;
      }
    }
    percent = Math.round((filled / REQUIRED_FIELDS.length) * 100);
  }

  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
      <div className="w-full mb-2 text-blue-700 font-semibold">Profile Completion</div>
      <div className="w-full bg-blue-100 rounded-full h-4 mb-2">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all"
          style={{ width: `${loading ? 0 : percent}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-500">
        {loading
          ? "Checking profile..."
          : percent === 100
          ? "Your profile is complete!"
          : `Profile is ${percent}% complete. Complete your profile to get better matches!`}
      </div>
      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
    </section>
  );
}
