
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { User, Lock, Mail, Phone, Sparkles, Eye, EyeOff, Loader2, Facebook, Apple, ShieldCheck } from "lucide-react";

export default function AuthForm({ initialMode }: { initialMode?: "signup" | "login" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading: userLoading } = useCurrentUser();

  useEffect(() => {
    if (!userLoading && user) {
      router.replace("/dashboard/user/discovery");
    }
  }, [user, userLoading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)
    try {
      if (isSignUp) {
        if (password !== repeatPassword) {
          setMessage("Passwords do not match.")
          setLoading(false)
          return
        }
        if (email) {
          const { error } = await supabaseBrowser.auth.signUp({ email, password })
          if (error) setMessage(error.message)
          else {
            setMessage("Check your email to confirm sign up! Once confirmed, you can log in.");
            // Do NOT redirect automatically
          }
        } else if (phone) {
          const { error } = await supabaseBrowser.auth.signUp({ phone, password })
          if (error) setMessage(error.message)
          else {
            setMessage("Check your phone for a confirmation code!");
            // Do NOT redirect automatically
          }
        }
      } else {
        if (email) {
          const { error, data } = await supabaseBrowser.auth.signInWithPassword({ email, password })
          if (error) setMessage(error.message)
          else {
            setMessage("Logged in successfully!");
            // Check if user has completed onboarding (profile exists)
            const userId = data?.user?.id;
            if (userId) {
              const { data: profile, error: profileError } = await supabaseBrowser.from("profiles").select("id").eq("id", userId).single();
              if (profileError || !profile) {
                setTimeout(() => router.push("/onboarding"), 1000);
              } else {
                setTimeout(() => router.push("/dashboard/user/discovery"), 1000);
              }
            } else {
              setTimeout(() => router.push("/onboarding"), 1000);
            }
          }
        } else if (phone) {
          const { error, data } = await supabaseBrowser.auth.signInWithPassword({ phone, password })
          if (error) setMessage(error.message)
          else {
            setMessage("Logged in successfully!");
            const userId = data?.user?.id;
            if (userId) {
              const { data: profile, error: profileError } = await supabaseBrowser.from("profiles").select("id").eq("id", userId).single();
              if (profileError || !profile) {
                setTimeout(() => router.push("/onboarding"), 1000);
              } else {
                setTimeout(() => router.push("/dashboard/user/discovery"), 1000);
              }
            } else {
              setTimeout(() => router.push("/onboarding"), 1000);
            }
          }
        }
      }
    } catch (err) {
      setMessage("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }

  }

  // Social login handler
  const handleProviderLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true)
    setMessage("")
    try {
  const { error } = await supabaseBrowser.auth.signInWithOAuth({ provider })
      if (error) setMessage(error.message)
    } catch (err) {
      setMessage("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) {
    return null;
  }
  if (user) {
    // Optionally, show a spinner or nothing since useEffect will redirect
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400 animate-gradient-x">
      {/* Animated accent shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl px-8 py-10 flex flex-col items-center animate-fade-in">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-2 drop-shadow flex items-center gap-2 animate-slide-down">
            <ShieldCheck className="w-7 h-7 text-pink-400 animate-bounce" />
            {isSignUp ? "Sign Up" : "Login"}
          </h2>
          <p className="text-blue-600 mb-6 text-center animate-fade-in">
            {isSignUp ? "Create your Betweener account to get started!" : "Welcome back! Log in to continue your journey."}
          </p>
          <form onSubmit={handleAuth} className="flex flex-col gap-4 w-full animate-fade-in">
            <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none w-full text-blue-700 placeholder:text-blue-300"
                autoComplete="email"
                required
              />
            </div>
            <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
              <Phone className="w-5 h-5 text-blue-400" />
              <input
                type="tel"
                placeholder="Phone (e.g. +1234567890)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent outline-none w-full text-blue-700 placeholder:text-blue-300"
                autoComplete="tel"
              />
            </div>
            <div className="relative flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
              <Lock className="w-5 h-5 text-blue-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-blue-700 placeholder:text-blue-300 pr-10"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isSignUp && (
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 animate-pop-in">
                <Lock className="w-5 h-5 text-blue-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat Password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="bg-transparent outline-none w-full text-blue-700 placeholder:text-blue-300"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-60 animate-pop-in"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 animate-bounce" />}
              {isSignUp ? "Sign Up" : "Login"}
            </button>
            <div className="flex flex-col gap-2 mt-2 animate-fade-in">
              <button
                type="button"
                onClick={() => handleProviderLogin('google')}
                className="bg-white border border-gray-300 text-gray-700 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-50 transition"
                disabled={loading}
              >
                <img src="/google.svg" alt="Google" className="w-5 h-5" /> Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleProviderLogin('facebook')}
                className="bg-white border border-gray-300 text-gray-700 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-50 transition"
                disabled={loading}
              >
                <Facebook className="w-5 h-5 text-blue-600" /> Continue with Facebook
              </button>
              <button
                type="button"
                onClick={() => handleProviderLogin('apple')}
                className="bg-white border border-gray-300 text-gray-700 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-50 transition"
                disabled={loading}
              >
                <Apple className="w-5 h-5 text-black" /> Continue with Apple
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-blue-700 animate-fade-in">
            {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pink-500 underline font-semibold hover:text-blue-600 transition"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
          {message && (
            <div
              className={`mt-4 text-sm px-3 py-2 rounded transition-all duration-200 animate-pop-in ${
                message.toLowerCase().includes("success") || message.toLowerCase().includes("logged in") || message.toLowerCase().includes("confirm")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
