"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipAdkPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if on base path without subpath
    if (typeof window !== 'undefined' && window.location.pathname === '/adk/arsip') {
      router.replace("/adk/arsip/surat-masuk");
    }
  }, [router]);

  return null;
}






