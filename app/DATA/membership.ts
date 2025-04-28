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
