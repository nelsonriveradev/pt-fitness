"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { StripeProduct } from "./membresias/page";
import { MembershipTierDialog } from "../myComponents/membership-tier-creation";
import MembershipCards from "../myComponents/MembershipCards";
import { MembershipTierCard } from "../myComponents/AdminMembershipTier";

import {
  Dumbbell,
  BarChart3,
  Users,
  CreditCard,
  Calendar,
  Settings,
  Home,
  LogOut,
  PlusCircle,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye, // Added Eye icon
  Pencil, // Added Pencil icon
  Trash2, // Added Trash2 icon
  Menu,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Import Button

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientData, mockClients } from "../DATA/clients"; // Assuming this path is correct
import { Input } from "@/components/ui/input"; // Import Input

export default function AdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTier, setCurrentTier] = useState<any>(null);
  const [membershipTiers, setMembershipTiers] = useState<StripeProduct[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [users, setUsers] = useState<ClientData[]>([]);

  useEffect(() => {
    const fetchMemberships = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/stripe/products");
        if (!res.ok) {
          const errorText = await res.text();
          console.error(
            `Admin Page: Error fetching products. Status: ${res.status} Body: ${errorText}`
          );
        }
        const data = await res.json();
        console.log("AdminPage: Fetched data:", data);
        if (data && data.products) {
          setProducts(
            data.products.map((product: StripeProduct) => ({
              ...product,
              // Ensure image property exists
            }))
          );
          console.log("AdminPage: Products set in state:", data.products);
        } else {
          console.warn(
            "AdminPage: No 'products' array found in the response data or data is null/undefined."
          );
          setProducts([]); // Set to empty array if no products found
        }
      } catch (err) {
        console.error(
          "AdminPage Error: Error fetching products from Stripe:",
          err
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const handleAddTier = () => {
    setCurrentTier(null);
    setIsDialogOpen(true);
  };

  const handleEditTierClick = (tierId: string) => {
    const tierToEdit = products.find((p) => p.id === tierId);
    if (tierToEdit) {
      setCurrentTier(tierToEdit);
      setIsDialogOpen(true);
      console.log("Editing tier:", tierId);
    } else {
      console.error("Tier not found for editing:", tierId);
    }
  };

  const handleDeleteTierClick = (tierId: string) => {
    // Implement your deletion logic
    // This might involve an API call to Stripe and then updating the state
    console.log("Attempting to delete tier:", tierId);
    // Example: Optimistically remove from UI or refetch after deletion
    // setProducts(prevProducts => prevProducts.filter(p => p.id !== tierId));
    alert(`Placeholder: Delete tier ${tierId}`);
  };
  // Handle saving a new or edited tier
  const handleSaveTier = (tierData: any) => {
    if (currentTier) {
      // Edit existing tier
      setMembershipTiers(
        membershipTiers.map((tier) =>
          tier.id === currentTier.id ? { ...tier, ...tierData } : tier
        )
      );
    } else {
      // Add new tier
      const newTier = {
        ...tierData,
        id: `tier-${Date.now()}`,
        active: true,
        memberCount: 0,
        revenue: 0,
      };
      setMembershipTiers([...membershipTiers, newTier]);
    }
    setIsDialogOpen(false);
  };
  //handle membershipDialog

  //fetch user from Db
  useEffect(() => {
    async function getAllUsers() {
      try {
        const allUsers = await fetch("/api/user/getAll");
        const data = await allUsers.json();
        setUsers(data);
      } catch (error) {}
    }
    getAllUsers();
  }, []);
  // Filter clients based on search term and filters
  const filteredClients = users.filter((client) => {
    const matchesSearch =
      client.firstName!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Activo" && client.isMemberActive) ||
      (statusFilter === "Inactivo" && !client.isMemberActive);
    const clientMembershipTypeLower = (
      client.membershipType || ""
    ).toLowerCase();
    const matchesMembership =
      membershipFilter === "all" ||
      (membershipFilter === "Básica" &&
        clientMembershipTypeLower === "basic") ||
      (membershipFilter === "Estandar" &&
        clientMembershipTypeLower === "standard") ||
      (membershipFilter === "Premium" &&
        clientMembershipTypeLower === "premium");

    return matchesSearch && matchesStatus && matchesMembership;
  });

  // Format date helper
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "-";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("es-ES", {
      // Use Spanish locale
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="">
      {/* Main content */}
      <div className="flex flex-col">
        {/* Top Navigation */}

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold tracking-tight">
                Panel de Control
              </h1>
              <div className="flex items-center gap-2">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Nuevo Cliente
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Clientes Totales
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockClients.length}</div>{" "}
                  {/* Use actual length */}
                  <p className="text-xs text-muted-foreground">
                    {/* +12% desde el mes pasado */} {/* Dynamic data needed */}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Membresías Activas
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockClients.filter((c) => c.status === "Activo").length}{" "}
                    {/* Calculate active */}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {/* +5% desde el mes pasado */} {/* Dynamic data needed */}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos Mensuales
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,450</div>{" "}
                  {/* Placeholder */}
                  <p className="text-xs text-muted-foreground">
                    +18% desde el mes pasado {/* Placeholder */}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Asistencia a Clases
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>{" "}
                  {/* Placeholder */}
                  <p className="text-xs text-muted-foreground">
                    +2% desde el mes pasado {/* Placeholder */}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="clients">Clientes</TabsTrigger>
                <TabsTrigger value="memberships">Membresías</TabsTrigger>
                <TabsTrigger value="classes">Clases</TabsTrigger>
              </TabsList>

              {/* Clients Tab Content */}
              <TabsContent value="clients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Clientes</CardTitle>
                    <CardDescription>
                      Ver y gestionar todos los miembros del gimnasio. Usa los
                      filtros para acotar resultados.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Buscar clientes..."
                          className="w-full rounded-lg bg-background pl-8" // Use Input component
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                        <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                        >
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              Todos los Estados
                            </SelectItem>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                            <SelectItem value="Pendiente">
                              Pendiente
                            </SelectItem>{" "}
                            {/* Assuming 'Pending' exists */}
                          </SelectContent>
                        </Select>
                        <Select
                          value={membershipFilter}
                          onValueChange={setMembershipFilter}
                        >
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Membresía" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              Todas las Membresías
                            </SelectItem>
                            <SelectItem value="Básica">Básica</SelectItem>{" "}
                            {/* Assuming 'Básica' exists */}
                            <SelectItem value="Estandar">Estándar</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="ml-auto flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Más Filtros
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Exportar
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Clients Table */}
                    <div className="overflow-x-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow key={`name`}>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Email
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                              Teléfono
                            </TableHead>
                            <TableHead>Membresía</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="hidden lg:table-cell">
                              Fecha Ingreso
                            </TableHead>
                            <TableHead className="hidden xl:table-cell">
                              Última Visita
                            </TableHead>
                            <TableHead className="text-right">
                              Acciones
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClients.length === 0 ? (
                            <TableRow key={`error`}>
                              <TableCell
                                colSpan={8}
                                className="h-24 text-center"
                              >
                                No se encontraron clientes.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredClients.map((client) => (
                              <TableRow key={client.id}>
                                <TableCell className="font-medium">
                                  {`${client.firstName} ${client.lastName}`}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {client.email}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {client.phone}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      client.membershipType === "Premium"
                                        ? "default"
                                        : client.membershipType === "Estandar"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {client.membershipType}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      client.status === "Activo"
                                        ? "default"
                                        : client.status === "Inactivo"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className={`whitespace-nowrap ${
                                      client.status === "Activo"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : client.status === "Inactivo"
                                        ? "bg-red-100 text-red-800 border border-red-200"
                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    }`}
                                  >
                                    {client.isMemberActive
                                      ? "Activo"
                                      : "Inactivo"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {formatDate(client.joinDate)}
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                  {formatDate(client.lastVisit)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Acciones
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Acciones
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem asChild>
                                        <Link
                                          href={`/admin/clientes/${client.id}`}
                                          className="flex items-center cursor-pointer"
                                        >
                                          <Eye className="mr-2 h-4 w-4" />
                                          Ver Detalles
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="flex items-center cursor-pointer">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar Cliente
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="flex items-center text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar Cliente
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Mostrando <strong>{filteredClients.length}</strong> de{" "}
                      <strong>{mockClients.length}</strong> clientes
                    </div>
                    {/* Add Pagination component here later */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm">
                        Siguiente
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Memberships Tab Content */}
              <TabsContent value="memberships">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="">
                        <CardTitle>Gestión de Membresías</CardTitle>
                        <CardDescription>
                          Ver y gestionar todos los planes de membresía y
                          suscripciones.
                        </CardDescription>
                      </div>
                      <div className="">
                        <Button onClick={handleAddTier}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add New Tier
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-evenly items-center">
                      {products.map(
                        (
                          productTier // Renamed 'tiers' to 'productTier' for clarity
                        ) => (
                          <MembershipTierCard
                            key={productTier.id} // Use productTier.id as key
                            tier={productTier} // Pass the whole product object
                            onEdit={handleEditTierClick} // Pass the edit handler
                            onDelete={handleDeleteTierClick} // Pass the delete handler
                            // memberCount and revenue are optional; pass them if you have this data per product
                            // For example, if your API returns it:
                            // memberCount={productTier.memberCount || 0}
                            // revenue={productTier.revenue || 0}
                          />
                        )
                      )}
                    </div>

                    {products.length}
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                      <p className="text-muted-foreground">
                        El contenido de gestión de membresías aparecerá aquí.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Classes Tab Content */}
              <TabsContent value="classes">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Horario de Clases</CardTitle>
                    <CardDescription>
                      Ver y gestionar todas las clases de fitness y horarios.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                      <p className="text-muted-foreground">
                        El contenido de gestión de horarios de clases aparecerá
                        aquí.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <MembershipTierDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            tier={currentTier}
            onSave={handleSaveTier}
          />
        </main>
      </div>
    </div>
  );
}
