"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DaftarSuratPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if on base path without subpath
    if (typeof window !== 'undefined' && window.location.pathname === '/admin/daftar-surat') {
      router.replace("/admin/daftar-surat/surat-masuk");
    }
  }, [router]);

  return null;
}