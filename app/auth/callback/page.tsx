"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
        router.push("/login");
        return;
      }

      if (data.session) {
        router.push("/dashboard"); // change if needed
      } else {
        router.push("/login");
      }
    };

    handleLogin();
  }, [router]);

  return <p>Signing you in...</p>;
}
