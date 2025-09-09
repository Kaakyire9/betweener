"use client";
import { useUserProfile } from "../user/components/useUserProfile";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { supabaseBrowser } from "@/lib/supabaseClient";
import CropImageDialog from "@/components/CropImageDialog";

type Profile = {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  bio: string;
  region: string;
  tribe: string;
  religion: string;
  min_age_interest?: number;
  max_age_interest?: number;
  avatar_url?: string;
  email?: string;
  status?: string;
};

export default function ProfileSection() {
  const { profile, loading, error } = useUserProfile() as { profile: Profile | null, loading: boolean, error: string | null };

  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // Prepare initial form values from profile
  function getInitialValues(profile: any) {
    return {
      fullName: profile.full_name || "",
      age: profile.age || "",
      gender: profile.gender || "",
      bio: profile.bio || "",
      region: profile.region || "",
      tribe: profile.tribe || "",
      religion: profile.religion || "",
      minAgeInterest: profile.min_age_interest || "18",
      maxAgeInterest: profile.max_age_interest || "35",
      avatarUrl: profile.avatar_url || "",
      // Add other fields as needed
    };
  }

  function handleEditClick() {
    setFormState(getInitialValues(profile));
    setModalOpen(true);
  }

  // Handle file input for profile picture
  async function handleFormChange(e: React.ChangeEvent<any>) {
    const { name, value, type, files } = e.target;
    if (name === "profilePic" && files && files[0]) {
      const file = files[0];
      // Show cropping dialog with selected image
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageToCrop(ev.target?.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      setFormState((prev: any) => ({ ...prev, [name]: value }));
    }
  }

  // Handle cropped image from dialog
  async function handleCroppedImage(croppedDataUrl: string) {
    // Convert dataURL to File
    function dataURLtoFile(dataurl: string, filename: string) {
      const arr = dataurl.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], filename, { type: mime });
    }
    const file = dataURLtoFile(croppedDataUrl, "profile.jpg");
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile?.id || "user"}-${Date.now()}.${fileExt}`;
  const { error } = await supabaseBrowser.storage.from("profiles").upload(fileName, file, { upsert: true });
    if (error) {
      setFormErrors((prev) => ({ ...prev, avatarUrl: "Image upload failed: " + error.message }));
      setCropDialogOpen(false);
      setImageToCrop(null);
      return;
    }
  const publicUrl = supabaseBrowser.storage.from("profiles").getPublicUrl(fileName).data.publicUrl;
    setFormState((prev: any) => ({ ...prev, avatarUrl: publicUrl }));
    setFormErrors((prev) => ({ ...prev, avatarUrl: "" }));
    setCropDialogOpen(false);
    setImageToCrop(null);
  }

  // Remove profile picture
  async function handleRemoveAvatar() {
    setFormState((prev: any) => ({ ...prev, avatarUrl: "" }));
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormErrors({});
    // Basic validation (add more as needed)
    if (!formState.fullName || !formState.age || !formState.gender) {
      setFormErrors({ fullName: !formState.fullName ? "Full name required" : "", age: !formState.age ? "Age required" : "", gender: !formState.gender ? "Gender required" : "" });
      setFormLoading(false);
      return;
    }
    // Update profile in Supabase
  const { error } = await supabaseBrowser.from("profiles").update({
      full_name: formState.fullName,
      age: Number(formState.age),
      gender: formState.gender,
      bio: formState.bio,
      region: formState.region,
      tribe: formState.tribe,
      religion: formState.religion,
      min_age_interest: Number(formState.minAgeInterest),
      max_age_interest: Number(formState.maxAgeInterest),
      avatar_url: formState.avatarUrl,
      updated_at: new Date().toISOString(),
    }).eq("id", profile?.id);
    if (error) {
      setFormErrors({ general: error.message });
      setFormLoading(false);
      return;
    }
    setFormLoading(false);
    setModalOpen(false);
    // Optionally, refresh profile data here
  }

  // (removed duplicate handleFormChange)

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
        <div className="animate-pulse w-24 h-24 rounded-full bg-blue-100 mb-4" />
        <div className="h-6 w-32 bg-blue-100 rounded mb-2 animate-pulse" />
        <div className="h-4 w-24 bg-blue-100 rounded mb-2 animate-pulse" />
        <div className="h-4 w-16 bg-pink-100 rounded mb-2 animate-pulse" />
        <div className="h-4 w-40 bg-blue-100 rounded mb-2 animate-pulse" />
        <div className="h-10 w-24 bg-blue-100 rounded animate-pulse" />
      </section>
    );
  }
  if (error || !profile) {
    return (
      <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
        <div className="text-red-500">{error || "Profile not found."}</div>
      </section>
    );
  }
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
      <div className="w-24 h-24 rounded-full border-4 border-pink-400 shadow-lg bg-gradient-to-br from-blue-200 to-pink-200 overflow-hidden flex items-center justify-center mb-4">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-blue-600">{profile.full_name ? profile.full_name[0] : "?"}</span>
        )}
      </div>
      <div className="text-xl font-bold text-blue-700 mb-1">{profile.full_name || "No Name"}</div>
      <div className="text-sm text-gray-500 mb-2">{profile.email}</div>
      <div className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold mb-2">{profile.status || "Member"}</div>
      <div className="text-center text-gray-700 mb-2">{profile.bio || "No bio yet."}</div>
      <button
        type="button"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-center"
        onClick={handleEditClick}
      >
        Edit Profile
      </button>
      {modalOpen && (
        <>
          <EditProfileModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            initialValues={formState}
            onSubmit={handleFormSubmit}
            loading={formLoading}
            errors={formErrors}
            onChange={handleFormChange}
            onRemove={handleRemoveAvatar}
          />
          <CropImageDialog
            open={cropDialogOpen}
            image={imageToCrop}
            onClose={() => { setCropDialogOpen(false); setImageToCrop(null); }}
            onCropComplete={handleCroppedImage}
          />
        </>
      )}
    </section>
  );
}
