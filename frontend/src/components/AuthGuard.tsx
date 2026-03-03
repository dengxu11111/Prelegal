"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenStore } from "@/lib/apiClient";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      router.replace("/login/");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
