"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DaftarSuratPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/daftar-surat-admin/suratMasuk");
  }, [router]);

  return null;
}