"use client";
import { SignIn, useUser } from "@clerk/nextjs";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dumbbell, ArrowRight, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccederPage() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  useEffect(() => {
    console.log(
      "AccederPage useEffect: isLoaded:",
      isLoaded,
      "isSignedIn:",
      isSignedIn,
      "user?.id:",
      user?.id
    );
    if (isLoaded && isSignedIn && user?.id) {
      console.log(`Attempting to redirect to /miembro/${user.id}`);
      router.push(`/miembro/${user.id}`);
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded || (isSignedIn && user?.id)) {
    // This condition is to show loading while effect runs
    console.log(
      "AccederPage: Showing loading screen. isLoaded:",
      isLoaded,
      "isSignedIn:",
      isSignedIn
    );
    return <p>Cargando...</p>;
  }
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Dumbbell className="h-6 w-6" />
            <span>FitFlex Gym</span> {/* Keep brand name */}
          </Link>
          <div className=" w-fit flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex mx-auto">
        <div className="container flex flex-col items-center justify-center py-12 gap-y-4">
          <div className="text-3xl font-semibold">Accede a PT Fitness Club</div>
          <div className="">
            <SignIn routing="hash" />
          </div>
        </div>
      </main>
    </div>
  );
}
