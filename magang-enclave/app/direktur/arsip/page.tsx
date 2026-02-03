"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipApproverPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/direktur/arsip/surat-masuk");
  }, [router]);

  return null;
}





