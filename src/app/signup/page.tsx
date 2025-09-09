
"use client";
import AuthForm from "@/components/AuthForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard/user/discovery");
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (user) return null;

  return (
    <main className="flex items-center justify-center min-h-screen">
      <AuthForm initialMode="signup" />
    </main>
  );
}
