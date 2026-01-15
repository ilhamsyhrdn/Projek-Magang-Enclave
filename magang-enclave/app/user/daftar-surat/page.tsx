"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DaftarSuratPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/daftar-surat/surat-masuk");
  }, [router]);

  return null;
}