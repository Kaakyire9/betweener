"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSignUp = async () => {
    setStatus("Signing up...");
    const { data, error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      // you can include user_metadata if you want
      options: { data: { full_name: "", role: "user" } },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    // If a session is returned (email+password auto sign-in), we still sync in useAuthSync.
    setStatus("Check your email to confirm (if using email confirm).");
  };

  return (
    <div className="space-y-2">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignUp}>Sign up</button>
      {status && <p>{status}</p>}
    </div>
  );
}
