"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/arsip-admin/suratMasuk");
  }, [router]);

  return null;
}
