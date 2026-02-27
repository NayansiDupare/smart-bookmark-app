"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  const checkUser = async () => {
    const response = await supabase.auth.getUser();
    const data = response.data;

    if (!data.user) {
      window.location.href = "/";
    } else {
      setUser(data.user);
    }
  };

  checkUser();
}, []);

  

  return (
    <div className="min-h-screen bg-brand-bg">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-brand-dark">
          Smart Bookmark
        </h1>

        {user && (
          <div className="flex items-center gap-4">
            <img
              src={user.user_metadata.avatar_url}
              className="w-9 h-9 rounded-full"
            />
            
          </div>
        )}
      </nav>

      <div className="p-10">{children}</div>
    </div>
  );
}
