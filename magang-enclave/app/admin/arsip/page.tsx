"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/arsip/surat-masuk");
  }, [router]);

  return null;
}
