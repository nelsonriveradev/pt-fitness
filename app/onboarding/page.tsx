"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell } from "lucide-react";

import PersonalInfoStep from "./onboadingComponents/personal-info-step";
import FitnessGoalsStep from "./onboadingComponents/fitness-goals-step";
import CompletionStep from "./onboadingComponents/completion-step";

// Define the user data structure
export type UserOnboardingData = {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  fitnessGoals: string[];
  isOnboardingComplete: boolean;
  isMemberActive: boolean;
};

// Initial empty user data
const initialUserData: UserOnboardingData = {
  firstName: "",
  lastName: "",
  address: "",
  phone: "",
  fitnessGoals: [],
  isOnboardingComplete: false,
  isMemberActive: false,
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserOnboardingData>(initialUserData);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false); // Specific for form submission

  // Total number of steps in the onboarding process
  const totalSteps = 3;

  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  // Handle form field changes
  const handleChange = (field: string, value: string | string[]) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate the current step
  const validateStep = (): boolean => {
    let isValid = true;

    if (currentStep === 1) {
      if (!userData.firstName.trim()) {
        toast.error("First name is required");
        isValid = false;
      }
      if (!userData.lastName.trim()) {
        toast.error("Last name is required");
        isValid = false;
      }
      if (!userData.address.trim()) {
        toast.error("Address is required");
        isValid = false;
      }
      if (!userData.phone.trim()) {
        toast.error("Phone number is required");
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (userData.fitnessGoals.length === 0) {
        toast.error("Please select at least one fitness goal");
        isValid = false;
      }
    }

    return isValid;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }
    if (!isLoaded || !user) {
      toast.error("Usuario no encontrado. Por favor intentar de nuevo.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      setUserData((prev) => ({
        ...prev,
        isOnboardingComplete: true,
        isMemberActive: false,
      }));
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user?.id, // Pass the clerkId
          onboardingData: userData, // Pass the collected onboarding data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en guardar data");
      }

      // const result = await response.json(); // Optional: use result if needed
      // console.log("Onboarding save result:", result);

      toast.success("Onboarding exitosamente completado!");

      // Update local state and proceed to completion step

      setCurrentStep(3); // Move to the completion/summary step
    } catch (error: any) {
      console.error("Error saving onboarding data:", error);
      toast.error(
        error.message || "Un error ocurrio mientras se guardaba la data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle completion - redirect to dashboard
  const handleCompletion = () => {
    router.push(`/miembro/${user?.id}`);
  };

  if (isLoading && currentStep === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-medium">Cargando...</h2>
          <p className="text-sm text-muted-foreground">
            Por favor espera mientras preparamos tu experiencia de incorporación
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-4 ">
      <Toaster />
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <Dumbbell className="h-8 w-8" />
            <span>PT Fitness Club</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-sm font-medium">
              {Math.round(progressPercentage)}% Completado
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step content */}
        <Card className="mb-8">
          {currentStep === 1 && (
            <PersonalInfoStep
              userData={userData}
              onChange={handleChange}
              errors={{}} // Pass an empty object or appropriate error messages
            />
          )}

          {currentStep === 2 && (
            <FitnessGoalsStep userData={userData} onChange={handleChange} />
          )}

          {currentStep === 3 && (
            <CompletionStep userData={userData} onComplete={handleCompletion} />
          )}

          {currentStep < 3 && (
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                regresar
              </Button>

              {currentStep < 2 ? (
                <Button onClick={handleNext}>
                  próximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Completar"}
                  {!isLoading && <CheckCircle2 className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
