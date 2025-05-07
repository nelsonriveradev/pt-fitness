"use client";
import { SignIn, useUser } from "@clerk/nextjs";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dumbbell, ArrowRight, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export default function AccederPage() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { userId } = useParams();

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
            <SignIn forceRedirectUrl={`/miembro/${userId}`} routing="hash" />
          </div>
        </div>
      </main>
    </div>
  );
}
