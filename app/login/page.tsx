"use client";

import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { FcGoogle } from "react-icons/fc";

export default function Login() {

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
  <div className="bg-background min-h-screen flex flex-col">

    <Navbar />

    <div className="flex flex-1 items-center justify-center">

      <div className="card w-full max-w-[520px] min-h-[320px] p-12 text-center space-y-8 flex flex-col justify-center">

        <h1 className="text-3xl font-bold text-foreground">
          Smart Bookmark
        </h1>

        <p className="text-primary">
          Organize your digital world beautifully.
        </p>

        <button
          onClick={login}
          className="flex items-center justify-center gap-3 bg-white text-gray-800 px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] transition-all font-medium w-full"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

      </div>

    </div>

  </div>
);
}
