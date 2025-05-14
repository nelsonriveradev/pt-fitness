import { MembershipData } from "../myComponents/MembershipCards";
export const dummyMembership: MembershipData[] = [
  {
    title: "Básico",
    titleDescription: "Perfecto para comenzar",
    price: 40,
    isPopular: false,
    features: [
      "Acceso a todo el equipo del gimnasio",
      "Lockers",
      "Orientación basica",
    ],
  },
  {
    title: "Estandar",
    titleDescription: "Mejor valor para todos",
    price: 50,
    isPopular: true,
    features: [
      "Todo en básico",
      "Entrenador Personal",
      "Plan de nutrición",
      "Hasta 8 sessiones por mes",
    ],
  },
  {
    title: "Premium",
    titleDescription: "Recomendado para entusiastas",
    price: 70,
    isPopular: false,
    features: [
      "Todo en Estandar",
      "Batida gratis",
      "Hasta 12 sessiones por mes",
      "Acesso a eventos exclusivos",
    ],
  },
];

//type

export interface MembershipDataType {
  id: string; // Unique identifier for the membership record itself
  userId: string; // Identifier for the user this membership belongs to (e.g., Clerk User ID)
  stripeSubscriptionId?: string; // Stripe Subscription ID, if applicable
  stripeCustomerId?: string; // Stripe Customer ID, if applicable
  planId: string; // Identifier for the specific plan (e.g., "plan_basic", "plan_premium")
  planName: "Basic" | "Standard" | "Premium" | string; // User-friendly plan name
  status: "active" | "inactive" | "cancelled";
  startDate: Date;
  endDate?: Date | null; // For fixed-term memberships or if cancelled
  renewalDate?: Date | null; // Next billing date for active subscriptions
  price: number; // Price paid for this period
  currency: string; // e.g., "USD", "EUR"
  billingInterval: "month" | "year" | "one-time" | string; // Billing frequency
  features?: string[]; // List of features included in this membership
  cancellationReason?: string; // Reason if cancelled
  cancelledAt?: Date | null; // Date when the cancellation was processed or will take effect
  createdAt: Date;
  updatedAt: Date;
}
