'use client';
import { useApp } from "@/hooks/use-app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user.onboardingCompleted) {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  }, [user, router]);

  return null; // or a loading spinner
}
