export interface ClientData {
  id: string | number;
  name: string;
  email: string;
  phone: string | number;
  membershipType: "Básico" | "Estandar" | "Premium";
  status: "Activo" | "Inactivo" | "Pendiente";
  joinDate: Date | string;
  lastVisit: Date | string;
}

export const mockClients: ClientData[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    membershipType: "Premium",
    status: "Activo",
    joinDate: "2023-01-15",
    lastVisit: "2023-04-28",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    membershipType: "Estandar",
    status: "Activo",
    joinDate: "2023-02-10",
    lastVisit: "2023-04-27",
  },
];
