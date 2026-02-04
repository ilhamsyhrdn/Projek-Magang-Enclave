"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipApproverPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if on base path without subpath
    if (typeof window !== 'undefined' && window.location.pathname === '/direktur/arsip') {
      router.replace("/direktur/arsip/surat-masuk");
    }
  }, [router]);

  return null;
}





