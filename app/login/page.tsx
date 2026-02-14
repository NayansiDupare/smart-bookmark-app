"use client";

import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";

export default function Login() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: "http://localhost:3000/auth/callback",
  },
});

  };

  return (
    <div className="bg-background min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* LOGIN CARD */}
      <div className="flex items-center justify-center pt-40">
        <div className="card w-[420px] text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">
            Smart Bookmark
          </h1>

          <p className="text-primary">
            Organize your digital world beautifully.
          </p>

          <button
            onClick={login}
            className="btn-primary w-full"
          >
            Continue with Google
          </button>
        </div>
      </div>

    </div>
  );
}
