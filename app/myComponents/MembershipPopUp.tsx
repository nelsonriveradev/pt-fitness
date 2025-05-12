"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserByClerkId } from "@/lib/actions/fetchUserByClerkId";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

import {
  CheckCircle2,
  CreditCard,
  Calendar,
  ArrowRight,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Membership plan data
const membershipPlans = [
  {
    id: "basic",
    name: "Básico",
    price: 29,
    description: "Perfecto para principiantes",
    features: [
      "Acceso a equipos de gimnasio",
      "Acceso a vestuarios",
      "Horario estándar de gimnasio",
      "Evaluación física",
    ],
    color: "border-muted bg-muted/50",
    recommended: false,
    paymentURL: "https://buy.stripe.com/test_5kAcON6Jk8tpcUg6oq",
  },
  {
    id: "standard",
    name: "Estándar",
    price: 49,
    description: "Mejor opción para la mayoría",
    features: [
      "Todas las características del Básico",
      "Clases grupales de fitness",
      "Horario extendido de gimnasio",
      "1 sesión de entrenamiento personal/mes",
      "Consulta nutricional",
    ],
    color: "border-primary bg-primary/5",
    recommended: true,
    paymentURL: "https://buy.stripe.com/test_dR64ih0kWdNJ9I4289",
  },
  {
    id: "premium",
    name: "Premium",
    price: 89,
    description: "Para entusiastas serios del fitness",
    features: [
      "Todas las características del Estándar",
      "Entrenamiento personal ilimitado",
      "Acceso al gimnasio 24/7",
      "Acceso gratuito al bar de batidos",
      "Casillero premium con servicio de toallas",
      "Eventos exclusivos para miembros",
    ],
    color: "border-amber-500/30 bg-amber-50 dark:bg-amber-950/20",
    recommended: false,
    paymentURL: "https://buy.stripe.com/test_14k4ihaZA10X6vS3cc",
  },
];

export function MembershipPopup({ clerkId }: { clerkId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [step, setStep] = useState<"select" | "payment" | "confirmation">(
    "select"
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserActive, setIsUserActive] = useState<boolean>();
  interface LoggedUser {
    clerkId: string;
    stripeCustomerId: string;
    isMemberActive: boolean;
  }

  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setStep("select");
        setIsProcessing(false);
      }, 300);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleBackToSelection = () => {
    setStep("select");
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep("confirmation");
    }, 2000);
  };

  const selectedPlanDetails = membershipPlans.find(
    (plan) => plan.id === selectedPlan
  );

  //check user is active
  useEffect(() => {
    async function getUser() {
      if (!clerkId) {
        console.error("Clerk ID is missing");
        return;
      }

      try {
        const userData = await fetchUserByClerkId(clerkId);
        if (userData) {
          setIsUserActive(userData.isMemberActive);
          setLoggedUser(userData);
        } else {
          console.error("No user data returned");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    getUser();
  }, [clerkId]);

  const handleCheckout = async ({
    plan,
    userId,
    customerId,
  }: {
    plan: string;
    userId: string;
    customerId: string;
  }) => {
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, userId, customerId }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
      const statusParam = searchParams.get("status");
      if (statusParam === "success") {
        await fetch("/api/stripe/check-session-completed");
      } else {
        alert("Error");
      }
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <CreditCard className="h-4 w-4" />
          <span>
            {isUserActive ? "Actualizar Membresía" : "Seleccionar Membresía"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl">
                  Elige Tu Membresía
                </DialogTitle>
                <DialogDescription>
                  Selecciona el plan que mejor se adapte a tus objetivos y
                  presupuesto.
                </DialogDescription>
              </DialogHeader>

              <Tabs
                defaultValue={selectedPlan}
                onValueChange={handleSelectPlan}
                className="w-full"
              >
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="standard">Estándar</TabsTrigger>
                    <TabsTrigger value="premium">Premium</TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-6 pb-6">
                  {membershipPlans.map((plan) => (
                    <TabsContent key={plan.id} value={plan.id} className="mt-0">
                      <Card className={`${plan.color} border-2`}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-xl">
                                {plan.name}
                              </CardTitle>
                              <CardDescription>
                                {plan.description}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold">
                                ${plan.price}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                por mes
                              </div>
                            </div>
                          </div>
                          {plan.recommended && (
                            <Badge className="absolute -top-2 -right-2 bg-primary">
                              Recomendado
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <h4 className="font-medium mb-2">Incluye:</h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            onClick={() =>
                              loggedUser &&
                              handleCheckout({
                                plan: plan.id,
                                userId: loggedUser.clerkId,
                                customerId: loggedUser.stripeCustomerId,
                              })
                            }
                            variant={
                              plan.id === "standard" ? "default" : "outline"
                            }
                          >
                            Seleccionar Plan {plan.id}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </motion.div>
          )}

          {step === "confirmation" && selectedPlanDetails && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="p-6 text-center"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
                <DialogTitle className="text-2xl">
                  ¡Membresía Activada!
                </DialogTitle>
                <DialogDescription className="text-center max-w-md mx-auto">
                  Tu membresía {selectedPlanDetails.name} ha sido activada con
                  éxito. Ahora tienes acceso a todas las características y
                  beneficios de tu plan.
                </DialogDescription>

                <div className="rounded-lg border p-4 bg-muted/30 w-full mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        Plan {selectedPlanDetails.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Membresía Activa
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"
                    >
                      Activa
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 w-full mt-4">
                  <h4 className="font-medium text-left">Próximos pasos:</h4>
                  <ul className="space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        Explora las instalaciones y equipos del gimnasio
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Reserva tu primera clase de fitness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Agenda una sesión con un entrenador personal</span>
                    </li>
                  </ul>
                </div>

                <DialogClose asChild>
                  <Button className="w-full mt-4" size="lg">
                    Comienza Tu Viaje Fitness
                  </Button>
                </DialogClose>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
