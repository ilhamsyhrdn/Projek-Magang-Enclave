"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DaftarSuratAdkPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if on base path without subpath
    if (typeof window !== 'undefined' && window.location.pathname === '/adk/daftar-surat') {
      router.replace("/adk/daftar-surat/surat-masuk");
    }
  }, [router]);

  return null;
}





