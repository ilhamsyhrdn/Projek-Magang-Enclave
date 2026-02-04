"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipUserPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if on base path without subpath
    if (typeof window !== 'undefined' && window.location.pathname === '/user/arsip') {
      router.replace("/user/arsip/surat-masuk");
    }
  }, [router]);

  return null;
}
