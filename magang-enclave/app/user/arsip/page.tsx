"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArsipUserPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/arsip/surat-masuk");
  }, [router]);

  return null;
}
