"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipAdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if on base path without subpath
    if (typeof window !== 'undefined' && window.location.pathname === '/admin/arsip') {
      router.replace("/admin/arsip/surat-masuk");
    }
  }, [router]);

  return null;
}
