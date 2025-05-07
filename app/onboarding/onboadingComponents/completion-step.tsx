"use client";

import type { UserOnboardingData } from "../page";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompletionStepProps {
  userData: UserOnboardingData;
  onComplete: () => void;
}

export default function CompletionStep({
  userData,
  onComplete,
}: CompletionStepProps) {
  // Mapear los IDs de objetivos a etiquetas legibles
  const goalLabels: Record<string, string> = {
    "weight-loss": "Pérdida de Peso",
    "muscle-gain": "Ganancia Muscular",
    strength: "Entrenamiento de Fuerza",
    endurance: "Resistencia",
    flexibility: "Flexibilidad",
    cardio: "Salud Cardiovascular",
    toning: "Tonificación Corporal",
    "general-fitness": "Acondicionamiento General",
    "sports-performance": "Rendimiento Deportivo",
    "stress-reduction": "Reducción del Estrés",
  };

  // Obtener etiqueta legible para un objetivo
  const getGoalLabel = (goalId: string) => {
    return goalLabels[goalId] || goalId;
  };

  return (
    <>
      <CardHeader>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Onboarding Completo!</CardTitle>
          <CardDescription>
            Gracias por proporcionar tu información. Tu perfil ha sido
            configurado exitosamente.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">Tu Información</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">
                  {userData.firstName} {userData.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{userData.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-medium">{userData.address}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">Tus Objetivos de Fitness</h3>
          <div className="flex flex-wrap gap-2">
            {userData.fitnessGoals.map((goal, index) => (
              <Badge key={index} variant="secondary">
                {getGoalLabel(goal)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4 text-center">
          <p className="text-sm">
            Puedes actualizar tu información y objetivos en cualquier momento
            desde la configuración de tu perfil.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onComplete} className="w-full">
          Ir al Panel de Control
        </Button>
      </CardFooter>
    </>
  );
}
