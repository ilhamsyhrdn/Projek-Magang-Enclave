"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipApproverPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if on base path without subpath
    if (typeof window !== 'undefined' && window.location.pathname === '/approver/arsip') {
      router.replace("/approver/arsip/surat-masuk");
    }
  }, [router]);

  return null;
}






