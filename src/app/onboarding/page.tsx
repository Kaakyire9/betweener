"use client";
import { useState, useRef, useEffect } from "react"

import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stepper from "@/components/Stepper";
import {
  User,
  Info,
  Users,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  Heart
} from "lucide-react";

const REGIONS = ["Greater Accra", "Ashanti", "Volta", "Central"];
const TRIBES = ["Akan", "Ewe", "Ga-Adangbe", "Mole-Dagbani"];
const RELIGIONS = ["Christian", "Muslim", "Traditionalist", "Other"];
const INTERESTS = ["Afrobeats", "Football", "Jollof", "Church", "Kumawood Movies"];

export default function Onboarding() {
  // Helper to redirect to /check-email without referencing router in useEffect deps
  function redirectToCheckEmail() {
    if (typeof window !== "undefined") {
      window.location.replace("/check-email");
    }
  }

  // Animated gradient background and accent shapes
  // Glassmorphism card, large welcome, avatar preview, modern fields, micro-interactions
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    bio: "",
    region: "",
    tribe: "",
    religion: "",
    interests: [] as string[],
    profilePic: null as File | null,
    minAgeInterest: "18",
    maxAgeInterest: "35",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      if (file) {
        if (!file.type.startsWith("image/")) {
          setErrors((err) => ({ ...err, profilePic: "File must be an image." }));
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          setErrors((err) => ({ ...err, profilePic: "Image must be less than 2MB." }));
          return;
        }
        setPreview(URL.createObjectURL(file));
        setCropDialogOpen(true);
        setErrors((err) => ({ ...err, profilePic: "" }));
      } else {
        setPreview(null);
        setForm((f) => ({ ...f, profilePic: null }));
      }
    } else if (name === "interests") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((f) => ({
        ...f,
        interests: checked
          ? [...f.interests, value]
          : f.interests.filter((i) => i !== value),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Pre-fill form if user already has a profile and check email confirmation
  useEffect(() => {
    const fetchProfile = async () => {
  const userRes = await supabaseBrowser.auth.getUser();
      const user = userRes.data?.user;
      if (!user) return;
      // Check email confirmation
      if (!user.email_confirmed_at && !user.confirmed_at) {
        redirectToCheckEmail();
        return;
      }
  const { data } = await supabaseBrowser.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setForm(f => ({
          ...f,
          fullName: data.full_name || "",
          age: data.age ? String(data.age) : "",
          gender: data.gender || "",
          bio: data.bio || "",
          region: data.region || "",
          tribe: data.tribe || "",
          religion: data.religion || "",
          interests: data.interests || [],
          minAgeInterest: data.min_age_interest ? String(data.min_age_interest) : "18",
          maxAgeInterest: data.max_age_interest ? String(data.max_age_interest) : "35",
        }));
        if (data.avatar_url) setCroppedImage(data.avatar_url);
      }
    };
    fetchProfile();
  }, []);

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.age || Number(form.age) < 18) newErrors.age = "You must be at least 18.";
    if (!form.gender) newErrors.gender = "Gender is required.";
    if (!form.bio.trim()) newErrors.bio = "Bio is required.";
    if (!form.region) newErrors.region = "Region is required.";
    if (!form.tribe) newErrors.tribe = "Tribe is required.";
    if (!form.religion) newErrors.religion = "Religion is required.";
    if (form.interests.length === 0) newErrors.interests = "Select at least one interest.";
    if (!croppedImage) newErrors.profilePic = "Profile picture is required.";
    const minAge = Number(form.minAgeInterest);
    const maxAge = Number(form.maxAgeInterest);
    if (!form.minAgeInterest || minAge < 18 || minAge > 99) newErrors.minAgeInterest = "Min age must be between 18 and 99.";
    if (!form.maxAgeInterest || maxAge < 18 || maxAge > 99) newErrors.maxAgeInterest = "Max age must be between 18 and 99.";
    if (minAge > maxAge) newErrors.maxAgeInterest = "Max age must be greater than or equal to min age.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cropper handlers
  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Utility to crop image using canvas (for react-easy-crop)
  async function getCroppedImg(imageSrc: string, crop: any): Promise<string> {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSrc;
    });
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return canvas.toDataURL("image/jpeg");
  }

  const showCroppedImage = async () => {
    if (!preview || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(preview, croppedAreaPixels);
    setCroppedImage(cropped as string);
    setForm((f) => ({ ...f, profilePic: dataURLtoFile(cropped as string, "profile.jpg") }));
    setCropDialogOpen(false);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    setLoading(true);
    setUploadProgress(null);
    let imageUrl = null;

    try {
      // 1. Upload cropped profile picture using Supabase Storage API
      if (form.profilePic) {
        const fileExt = form.profilePic.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const { data, error } = await supabaseBrowser.storage.from("profiles").upload(fileName, form.profilePic, {
          cacheControl: '3600',
          upsert: true,
        });
        if (error) throw new Error("Image upload failed: " + error.message);
  imageUrl = supabaseBrowser.storage.from("profiles").getPublicUrl(fileName).data.publicUrl;
      }

      // 2. Get current user
  const { data: { user }, error: userError } = await supabaseBrowser.auth.getUser();
      if (userError || !user) throw new Error("User not found");


      // 3. Ensure User record exists in User table
      const { data: existingUser, error: userLookupError } = await supabaseBrowser
        .from("User")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        const now = new Date().toISOString();
  const { error: userInsertError } = await supabaseBrowser.from("User").insert({
          id: user.id,
          email: user.email,
          name: user.email ? user.email.split("@")[0] : "",
          createdAt: now,
          updatedAt: now,
          isVerified: false,
          isPremium: false,
          isActive: true,
          lastActive: now,
          password: null,
        });
        if (userInsertError) throw new Error("User creation failed: " + userInsertError.message);
      }

      // 4. Insert profile data
      const now = new Date().toISOString();
  const { error: insertError } = await supabaseBrowser.from("profiles").upsert({
        id: user.id,
        user_id: user.id,
        full_name: form.fullName,
        age: Number(form.age),
        gender: form.gender.toUpperCase(),
        bio: form.bio,
        region: form.region,
        tribe: form.tribe,
        religion: form.religion.toUpperCase(),
        avatar_url: imageUrl,
        min_age_interest: Number(form.minAgeInterest),
        max_age_interest: Number(form.maxAgeInterest),
        updated_at: now,
      });
      if (insertError) throw new Error("Profile save failed: " + insertError.message);

      setMessage("Profile saved! Redirecting...");
      setTimeout(() => window.location.assign("/dashboard/user/discovery"), 1200);
    } catch (err: any) {
      setMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  // Stepper steps
  const steps = [
  "profiles",
    "Details",
    "Photo",
    "Finish"
  ];
  // Step logic: 0 = Profile, 1 = Details, 2 = Photo, 3 = Finish
  let currentStep = 0;
  if (croppedImage) currentStep = 2;
  else if (form.fullName && form.age && form.gender && form.region && form.tribe && form.religion && form.bio && form.interests.length > 0) currentStep = 1;
  if (message && message.toLowerCase().includes("saved")) currentStep = 3;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400 animate-gradient-x">
      {/* Animated accent shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl px-8 py-10 md:py-14 flex flex-col items-center animate-fade-in">
          <Stepper steps={steps} current={currentStep} />
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow flex items-center gap-2 animate-slide-down">
            <Sparkles className="w-8 h-8 text-pink-400 animate-bounce" /> Welcome to Betweener!
          </h1>
          <p className="text-lg text-blue-600 mb-6 text-center animate-fade-in">Let's create your profile and get you started on your journey to real connections.</p>
          {/* Avatar preview */}
          <div className="flex flex-col items-center mb-6 animate-fade-in">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 shadow-lg flex items-center justify-center overflow-hidden border-4 border-white animate-pop-in">
              {croppedImage ? (
                <img src={croppedImage} alt="Cropped Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-white/70 animate-pulse" />
              )}
            </div>
            <label htmlFor="profilePic" className="mt-3 text-blue-700 font-medium cursor-pointer hover:underline flex items-center gap-1 animate-fade-in">
              <User className="w-5 h-5 text-blue-400" />
              {croppedImage ? "Change Photo" : "Upload Photo"}
            </label>
            <input
              ref={fileInputRef}
              id="profilePic"
              name="profilePic"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              aria-invalid={!!errors.profilePic}
            />
            {errors.profilePic && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.profilePic}</div>}
          </div>
          <form className="w-full flex flex-col gap-4 animate-fade-in" onSubmit={handleSubmit} noValidate aria-label="Onboarding form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="font-medium text-blue-700 flex items-center gap-1"><User className="w-4 h-4 text-blue-400" />Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.fullName ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                  required
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.fullName}</div>}
              </div>
              <div>
                <label htmlFor="age" className="font-medium text-blue-700 flex items-center gap-1"><Info className="w-4 h-4 text-blue-400" />Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}
                  className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.age ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                  min={18}
                  required
                  aria-invalid={!!errors.age}
                />
                {errors.age && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.age}</div>}
              </div>
              <div>
                <label htmlFor="gender" className="font-medium text-blue-700 flex items-center gap-1"><Users className="w-4 h-4 text-blue-400" />Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.gender ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                  required
                  aria-invalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.gender}</div>}
              </div>
              <div>
                <label htmlFor="region" className="font-medium text-blue-700 flex items-center gap-1"><MapPin className="w-4 h-4 text-blue-400" />Region</label>
                <select
                  id="region"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.region ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                  required
                  aria-invalid={!!errors.region}
                >
                  <option value="">Select Region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.region && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.region}</div>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="bio" className="font-medium text-blue-700 flex items-center gap-1"><Info className="w-4 h-4 text-blue-400" />Short Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Short Bio"
                  value={form.bio}
                  onChange={handleChange}
                  className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.bio ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                  rows={3}
                  required
                  aria-invalid={!!errors.bio}
                />
                {errors.bio && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.bio}</div>}
              </div>
              <div>
                <label htmlFor="tribe" className="font-medium text-blue-700 flex items-center gap-1"><Users className="w-4 h-4 text-blue-400" />Tribe</label>
                <select
                  id="tribe"
                  name="tribe"
                  value={form.tribe}
                  onChange={handleChange}
                  className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.tribe ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                  required
                  aria-invalid={!!errors.tribe}
                >
                  <option value="">Select Tribe</option>
                  {TRIBES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.tribe && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.tribe}</div>}
              </div>
              <div>
                <label htmlFor="religion" className="font-medium text-blue-700 flex items-center gap-1"><Heart className="w-4 h-4 text-pink-400" />Religion</label>
                <select
                  id="religion"
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                  className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.religion ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                  required
                  aria-invalid={!!errors.religion}
                >
                  <option value="">Select Religion</option>
                  {RELIGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.religion && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.religion}</div>}
              </div>
            </div>
            <fieldset className="mb-2">
              <legend className="mb-1 font-medium text-blue-700 flex items-center gap-1"><Sparkles className="w-4 h-4 text-pink-400" />Interests</legend>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <label key={interest} className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition animate-pop-in">
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      checked={form.interests.includes(interest)}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    <span className="text-blue-700 text-sm">{interest}</span>
                  </label>
                ))}
              </div>
              {errors.interests && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.interests}</div>}
            </fieldset>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex flex-col w-full">
                <label htmlFor="minAgeInterest" className="font-medium text-blue-700 flex items-center gap-1"><Info className="w-4 h-4 text-blue-400" />Preferred Age Range</label>
                <div className="flex gap-2 items-center">
                  <input
                    id="minAgeInterest"
                    name="minAgeInterest"
                    type="number"
                    min={18}
                    max={99}
                    value={form.minAgeInterest}
                    onChange={handleChange}
                    className={`border-2 px-4 py-2 rounded-lg w-24 focus:ring-2 focus:ring-blue-400 transition ${errors.minAgeInterest ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                    required
                    aria-invalid={!!errors.minAgeInterest}
                  />
                  <span>to</span>
                  <input
                    id="maxAgeInterest"
                    name="maxAgeInterest"
                    type="number"
                    min={18}
                    max={99}
                    value={form.maxAgeInterest}
                    onChange={handleChange}
                    className={`border-2 px-4 py-2 rounded-lg w-24 focus:ring-2 focus:ring-blue-400 transition ${errors.maxAgeInterest ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                    required
                    aria-invalid={!!errors.maxAgeInterest}
                  />
                </div>
                {errors.minAgeInterest && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.minAgeInterest}</div>}
                {errors.maxAgeInterest && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.maxAgeInterest}</div>}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-60 animate-pop-in"
              disabled={loading}
              aria-busy={loading}
            >
              {loading && <CircularProgress size={20} color="inherit" className="mr-2 animate-spin" />}
              <Sparkles className="w-5 h-5 text-white animate-bounce" /> Create Profile
            </button>
            {uploadProgress !== null && (
              <div className="mt-2 w-full animate-fade-in">
                <LinearProgress variant="determinate" value={uploadProgress} />
                <div className="text-xs text-gray-500 text-center mt-1">Uploading: {uploadProgress}%</div>
              </div>
            )}
          </form>
          {message && <div className="mt-4 text-center text-base text-blue-700 font-semibold animate-fade-in" role="status">{message}</div>}
        </div>
        <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Crop Profile Picture</DialogTitle>
          <DialogContent>
            <div style={{ position: "relative", width: "100%", height: 300, background: "#222" }}>
              {preview && (
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="round"
                  showGrid={false}
                />
              )}
            </div>
            <div className="mt-4">
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(_, value) => setZoom(value as number)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCropDialogOpen(false)} color="secondary">Cancel</Button>
            <Button onClick={showCroppedImage} color="primary" variant="contained">Crop</Button>

          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

