"use client";

import type React from "react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  Calendar,
  CreditCard,
  Dumbbell,
  Edit,
  Home,
  LogOut,
  Menu, // Import Menu icon for mobile nav
  Settings,
  Trophy,
  User,
  X, // Import X icon for closing mobile nav
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, // Import Sheet for mobile navigation drawer
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input"; // Import Input for the modal
import { Label } from "@/components/ui/label"; // Import Label for the modal

// ... (mockUsers data remains the same) ...
const mockUsers = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    address: "123 Fitness Street, Gym City, GC 12345",
    membershipType: "Premium",
    joinDate: "2023-01-10",
    avatar: "/placeholder.svg?height=128&width=128",
    stats: {
      workoutsCompleted: 87,
      currentStreak: 4,
      longestStreak: 14,
    },
    gymVisits: [
      {
        date: "2023-04-30",
        checkInTime: "07:15 AM",
        checkOutTime: "08:45 AM",
        duration: "1h 30m",
      },
      {
        date: "2023-04-29",
        checkInTime: "06:45 AM",
        checkOutTime: "08:30 AM",
        duration: "1h 45m",
      },
      {
        date: "2023-04-28",
        checkInTime: "07:30 AM",
        checkOutTime: "08:45 AM",
        duration: "1h 15m",
      },
      {
        date: "2023-04-27",
        checkInTime: "Día de descanso", // Translated
        checkOutTime: "-",
        duration: "-",
      },
      {
        date: "2023-04-26",
        checkInTime: "07:00 AM",
        checkOutTime: "08:30 AM",
        duration: "1h 30m",
      },
      {
        date: "2023-04-25",
        checkInTime: "06:30 AM",
        checkOutTime: "08:00 AM",
        duration: "1h 30m",
      },
      {
        date: "2023-04-24",
        checkInTime: "07:15 AM",
        checkOutTime: "08:30 AM",
        duration: "1h 15m",
      },
    ],
    paymentHistory: [
      {
        date: "2023-04-10",
        amount: "$89.00",
        status: "Pagado", // Translated
        method: "Tarjeta de Crédito terminada en 4242", // Translated
        invoice: "#INV-2304",
      },
      {
        date: "2023-03-10",
        amount: "$89.00",
        status: "Pagado", // Translated
        method: "Tarjeta de Crédito terminada en 4242", // Translated
        invoice: "#INV-2303",
      },
      {
        date: "2023-02-10",
        amount: "$89.00",
        status: "Pagado", // Translated
        method: "Tarjeta de Crédito terminada en 4242", // Translated
        invoice: "#INV-2302",
      },
      {
        date: "2023-01-10",
        amount: "$89.00",
        status: "Pagado", // Translated
        method: "Tarjeta de Crédito terminada en 4242", // Translated
        invoice: "#INV-2301",
      },
    ],
    nextPaymentDate: "2023-05-10",
    membershipRenewal: "2024-01-10",
  },
  {
    id: "user2",
    name: "Samantha Lee",
    email: "samantha.lee@example.com",
    phone: "(555) 234-5678",
    address: "456 Workout Ave, Fitness Town, FT 67890",
    membershipType: "Standard",
    joinDate: "2023-02-15",
    avatar: "/placeholder.svg?height=128&width=128",
    stats: {
      workoutsCompleted: 45,
      currentStreak: 2,
      longestStreak: 8,
    },
    gymVisits: [
      {
        date: "2023-04-30",
        checkInTime: "05:30 PM",
        checkOutTime: "06:45 PM",
        duration: "1h 15m",
      },
      {
        date: "2023-04-29",
        checkInTime: "Día de descanso", // Translated
        checkOutTime: "-",
        duration: "-",
      },
      {
        date: "2023-04-28",
        checkInTime: "05:15 PM",
        checkOutTime: "06:30 PM",
        duration: "1h 15m",
      },
      {
        date: "2023-04-27",
        checkInTime: "05:30 PM",
        checkOutTime: "06:45 PM",
        duration: "1h 15m",
      },
      {
        date: "2023-04-26",
        checkInTime: "Día de descanso", // Translated
        checkOutTime: "-",
        duration: "-",
      },
      {
        date: "2023-04-25",
        checkInTime: "05:00 PM",
        checkOutTime: "06:15 PM",
        duration: "1h 15m",
      },
    ],
    paymentHistory: [
      {
        date: "2023-04-15",
        amount: "$49.00",
        status: "Pagado", // Translated
        method: "Transferencia Bancaria", // Translated
        invoice: "#INV-2304",
      },
      {
        date: "2023-03-15",
        amount: "$49.00",
        status: "Pagado", // Translated
        method: "Transferencia Bancaria", // Translated
        invoice: "#INV-2303",
      },
      {
        date: "2023-02-15",
        amount: "$49.00",
        status: "Pagado", // Translated
        method: "Transferencia Bancaria", // Translated
        invoice: "#INV-2302",
      },
    ],
    nextPaymentDate: "2023-05-15",
    membershipRenewal: "2023-08-15",
  },
];

export default function UserDashboard() {
  const { isLoaded, user } = useUser();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // State for mobile nav
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ... (useEffect, handleProfileChange, handleProfileSubmit remain the same) ...
  // Fetch user data based on ID
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchUser = () => {
      setLoading(true);
      try {
        // Find user based on userId from params
        const foundUser = mockUsers.find((u) => u.id === params.userId);
        if (foundUser) {
          // Initialize profile editing form data
          setProfileData({
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone,
            address: foundUser.address,
          });
        } else {
          // Handle user not found (optional: redirect or show message)
          console.warn("User not found for ID:", params.userId);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.userId) {
      fetchUser();
    }
  }, [params.userId]);

  // Handle changes in the profile edit form
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submission of the profile edit form
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to update the user profile
    console.log("Updating profile with:", profileData);
    // Update local user state optimistically

    setIsEditingProfile(false); // Close the modal
  };

  // ... (Loading and User Not Found states remain the same) ...
  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-medium">Cargando tu panel...</h2>{" "}
          {/* Translated */}
          <p className="text-sm text-muted-foreground">Por favor espera</p>{" "}
          {/* Translated */}
        </div>
      </div>
    );
  }

  // User not found state
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-medium">Usuario no encontrado</h2>{" "}
          {/* Translated */}
          <p className="text-sm text-muted-foreground">
            El perfil de usuario solicitado no existe
          </p>{" "}
          {/* Translated */}
          <Button className="mt-4">
            <Link href="/">Volver al Inicio</Link> {/* Translated */}
          </Button>
        </div>
      </div>
    );
  }

  // ... (getInitials and formatDate remain the same) ...
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date to be more readable (using locale-aware formatting)
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // Consider specifying locale e.g., 'es-ES' for Spanish formatting
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Mobile Nav Trigger */}
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span> {/* Translated */}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <SheetHeader className="mb-4 flex flex-row items-center justify-between">
                <SheetTitle className="flex items-center gap-2 font-bold text-xl">
                  <Dumbbell className="h-6 w-6" />
                  <span>FitFlex Gym</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4">
                <Link
                  href="#"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileNavOpen(false)} // Close nav on click
                >
                  Panel
                </Link>
                <Link
                  href="#"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Clases
                </Link>
                <Link
                  href="#"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Entrenadores
                </Link>
                <Link
                  href="#"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Soporte
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo */}
          <div className="hidden items-center gap-2 font-bold text-xl md:flex">
            <Dumbbell className="h-6 w-6" />
            <span>FitFlex Gym</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Panel
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Clases
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Entrenadores
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Soporte
            </Link>
          </nav>

          {/* Right side icons/menu */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
            >
              {" "}
              {/* Hide settings on mobile header, can be in dropdown */}
              <Settings className="h-5 w-5" />
              <span className="sr-only">Configuración</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    {" "}
                    {/* Ensure avatar size is consistent */}
                    <AvatarImage
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={user.primaryEmailAddress?.emailAddress}
                    />
                    <AvatarFallback>
                      {getInitials(user.primaryEmailAddress?.emailAddress!)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {" "}
                {/* Give dropdown a width */}
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditingProfile(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Editar Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden">
                  {" "}
                  {/* Show settings only in mobile dropdown */}
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Facturación</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Use px-4 for padding on mobile, md:px-6 for larger screens */}
      <div className="container py-6 px-4 md:px-6">
        {/* User Welcome Section - Stack vertically on mobile */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              {" "}
              {/* Adjust heading size */}
              ¡Bienvenido de nuevo, {user.username}!
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              {" "}
              {/* Adjust text size */}
              Miembro {} | Unido el {}
            </p>
          </div>
          {/* Keep Back to Home button accessible */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              {" "}
              {/* Use smaller button on mobile */}
              <Link className="flex items-center" href="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Grid - Collapse to single column on mobile */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Sidebar - Spans full width on mobile */}
          <div className="space-y-6 md:col-span-1">
            {/* User Profile Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl">
                    Mi Perfil
                  </CardTitle>{" "}
                  {/* Adjust title size */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar Perfil</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex flex-col items-center space-y-3 pb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={`user image profile`}
                    />
                    <AvatarFallback className="text-lg">{"US"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium leading-none">
                      {user.username}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {user.primaryEmailAddress?.emailAddress!}
                    </p>
                  </div>
                  {/* Feth from Mongo */}
                  {/* <Badge
                    variant={
                      user.membershipType === "Premium"
                        ? "default"
                        : user.membershipType === "Standard"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    Miembro {user.membershipType}
                  </Badge> */}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {" "}
                  {/* Add slightly more space */}
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />{" "}
                    {/* FETCH FROM MONGO */}
                    {/* <span className="break-words">{user.phone}</span>{" "} */}
                    {/* Allow text wrapping */}
                  </div>
                  <div className="flex items-start gap-2">
                    <Home className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />{" "}
                    {/* Align icon better */}
                    {/* FETCH ADDRESS FROM MONGO */}
                    <span className="break-words">{}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="break-words">Próximo pago: {""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="break-words">
                      {/* FETCH DATE FROM MONGO OR STRIPE */}
                      Renovación: {""}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Estadísticas de Entrenamiento
                </CardTitle>{" "}
                {/* Adjust title size */}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stack stats vertically on small screens */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Entrenamientos Totales
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Racha Actual</p>
                      <p className="text-2xl font-bold">
                        {/* fETCH DAY STREAKS  */}
                        {} días
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="rounded-lg border p-3">
                  <p className="mb-2 text-sm font-medium">Progreso de Racha</p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        (user.stats.currentStreak / user.stats.longestStreak) *
                        100
                      }
                      className="h-2 flex-1" // Allow progress bar to grow
                    />
                    <span className="text-xs text-muted-foreground">
                      {user.stats.currentStreak}/{user.stats.longestStreak}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Tu racha más larga fue de {user.stats.longestStreak} días
                  </p>
                </div> */}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Spans full width on mobile */}
          <div className="space-y-6 md:col-span-2">
            {/* Tabs for different sections */}
            <Tabs defaultValue="visits" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visits">Visitas</TabsTrigger>{" "}
                {/* Shorten label for mobile */}
                <TabsTrigger value="payments">Pagos</TabsTrigger>
              </TabsList>

              {/* Gym Visits Tab */}
              <TabsContent value="visits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Historial de Visitas
                    </CardTitle>{" "}
                    {/* Adjust title size */}
                    <CardDescription className="text-sm">
                      Tus visitas recientes al gimnasio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Make table horizontally scrollable on small screens */}
                    <div className="w-full overflow-x-auto rounded-md border">
                      <Table className="min-w-[600px]">
                        {" "}
                        {/* Set min-width for scroll */}
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Entrada</TableHead> {/* Shorten label */}
                            <TableHead>Salida</TableHead> {/* Shorten label */}
                            <TableHead>Duración</TableHead>
                          </TableRow>
                        </TableHeader>
                        {/* FETCH DATA ATTENDENCE FROM MONGO */}
                        <TableBody>
                          {/* {user.gymVisits.map((visit: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="whitespace-nowrap">
                                {visit.date}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {visit.checkInTime}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {visit.checkOutTime}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {visit.duration}
                              </TableCell>
                            </TableRow>
                          ))} */}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {/* fETCH FROM ATTENDENCE ON MONGO DB */}
                    {/* <div className="text-xs text-muted-foreground sm:text-sm">
                      Mostrando las últimas {user.gymVisits.length} visitas
                    </div> */}
                    <Button variant="outline" size="sm">
                      Ver Historial Completo
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Patrones de Visita
                    </CardTitle>{" "}
                    {/* Adjust title size */}
                    <CardDescription className="text-sm">
                      Tus patrones de asistencia al gimnasio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Stack pattern cards vertically on mobile */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Días Más Activos</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            {" "}
                            {/* Add gap */}
                            <span className="text-sm">Lunes</span>
                            <Progress
                              value={90}
                              className="h-2 w-24 sm:w-32"
                            />{" "}
                            {/* Adjust width */}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm">Miércoles</span>
                            <Progress value={85} className="h-2 w-24 sm:w-32" />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm">Viernes</span>
                            <Progress value={80} className="h-2 w-24 sm:w-32" />
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Tiempo Promedio</h3>{" "}
                        {/* Shorten title */}
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xl font-bold md:text-2xl">
                              1h 25m
                            </p>{" "}
                            {/* Adjust size */}
                            <p className="text-xs text-muted-foreground">
                              Duración promedio
                            </p>{" "}
                            {/* Shorten description */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Historial de Pagos
                    </CardTitle>{" "}
                    {/* Adjust title size */}
                    <CardDescription className="text-sm">
                      Tu historial de pagos de suscripción
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Make table horizontally scrollable on small screens */}
                    <div className="w-full overflow-x-auto rounded-md border">
                      <Table className="min-w-[700px]">
                        {" "}
                        {/* Set min-width for scroll */}
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Método</TableHead> {/* Shorten label */}
                            <TableHead>Factura</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* FETCH DATA FROM PAYMENTS BY USER ID IN MONGODB */}

                          {/* {user.paymentHistory.map(
                            (payment: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="whitespace-nowrap">
                                  {payment.date}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {payment.amount}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      payment.status === "Pagado"
                                        ? "outline"
                                        : "destructive"
                                    }
                                    className={`whitespace-nowrap text-xs ${
                                      // Smaller text, no wrap
                                      payment.status === "Pagado"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {payment.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {payment.method}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 whitespace-nowrap"
                                  >
                                    {payment.invoice}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          )} */}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs sm:text-sm">
                      Próximo pago: {/* ADD DATE PAYMENT */}
                    </div>
                    <Button variant="outline" size="sm">
                      Actualizar Método {/* Shorten button text */}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Membresía
                    </CardTitle>{" "}
                    {/* Adjust title size */}
                    <CardDescription className="text-sm">
                      Tu plan de membresía actual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                        {" "}
                        {/* Stack on mobile */}
                        <div>
                          <h3 className="font-medium">Membresía {}</h3>
                          <p className="text-sm text-muted-foreground">
                            Se renueva el {}
                          </p>
                        </div>
                        {/* <Badge
                          variant={
                            user.membershipType === "Premium"
                              ? "default"
                              : user.membershipType === "Standard"
                              ? "secondary"
                              : "outline"
                          }
                          className="mt-1 sm:mt-0" // Add margin top on mobile
                        > */}
                        {}
                        {/* </Badge> */}
                      </div>
                      <Separator className="my-4" />
                      {/* Stack details vertically on mobile */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium">Tarifa Mensual</p>
                          {/* <p className="text-lg font-bold">
                            {user.membershipType === "Premium"
                              ? "$89.00"
                              : user.membershipType === "Standard"
                              ? "$49.00"
                              : "$29.00"}
                          </p> */}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Ciclo de Facturación
                          </p>
                          <p className="text-lg font-bold">Mensual</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" size="sm">
                      {" "}
                      {/* Smaller button */}
                      Cambiar Plan de Membresía
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal - Use Sheet for better mobile experience */}
      <Sheet open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <SheetContent
          side="right"
          className="w-full max-w-md p-6 overflow-y-auto"
        >
          {" "}
          {/* Allow scroll */}
          <SheetHeader className="mb-4 flex flex-row items-center justify-between">
            <SheetTitle className="text-xl font-bold">Editar Perfil</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre Completo
              </Label>
              <Input // Use Shadcn Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full" // Ensure full width
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Dirección
              </Label>
              <Input
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                className="w-full"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
