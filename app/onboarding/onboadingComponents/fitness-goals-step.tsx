// filepath: c:\Users\Laptop 1\Documents\Programing\pt-fitness\app\onboarding\onboadingComponents\fitness-goals-step.tsx
"use client";

import type { UserOnboardingData } from "../page";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Example import
import { Label } from "@/components/ui/label"; // Example import

// Define the props for FitnessGoalsStep
interface FitnessGoalsStepProps {
  userData: UserOnboardingData;
  onChange: (field: string, value: string[]) => void; // Fitness goals will be an array of strings
  // errors: Record<string, string>; // If you want to display errors specific to this step
}

// Define your available fitness goals
const ALL_FITNESS_GOALS = [
  { id: "weight-loss", label: "Pérdida de Peso" },
  { id: "muscle-gain", label: "Ganancia Muscular" },
  { id: "strength", label: "Entrenamiento de Fuerza" },
  { id: "endurance", label: "Resistencia" },
  { id: "flexibility", label: "Flexibilidad" },
  { id: "cardio", label: "Salud Cardiovascular" },
  { id: "toning", label: "Tonificación Corporal" },
  { id: "general-fitness", label: "Fitness General" },
  { id: "sports-performance", label: "Rendimiento Deportivo" },
  { id: "stress-reduction", label: "Reducción de Estrés" },
];

export default function FitnessGoalsStep({
  userData,
  onChange,
}: FitnessGoalsStepProps) {
  const handleGoalChange = (goalId: string) => {
    const currentGoals = userData.fitnessGoals || [];
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((g) => g !== goalId)
      : [...currentGoals, goalId];
    onChange("fitnessGoals", newGoals);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Objetivos de Fitness</CardTitle>
        <CardDescription>
          Selecciona tus principales objetivos de fitness. Esto nos ayudará a
          recomendarte planes y clases.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ALL_FITNESS_GOALS.map((goal) => (
            <div key={goal.id} className="flex items-center space-x-2">
              <Checkbox
                id={`goal-${goal.id}`}
                checked={userData.fitnessGoals.includes(goal.id)}
                onCheckedChange={() => handleGoalChange(goal.id)}
              />
              <Label
                htmlFor={`goal-${goal.id}`}
                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {goal.label}
              </Label>
            </div>
          ))}
        </div>
        {/* If you were passing an errors prop:
        {errors.fitnessGoals && (
          <p className="text-xs text-red-500">{errors.fitnessGoals}</p>
        )}
        */}
      </CardContent>
    </>
  );
}
