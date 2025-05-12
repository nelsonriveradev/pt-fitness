"use client";
import Congrats from "@/app/myComponents/Congrats";
import type React from "react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { connectToDatabase } from "@/lib/mongodb/mongo";
import { useParams, useSearchParams } from "next/navigation"; // useSearchParams
// import Confetti from "react-confetti"; // Confetti is now in Congrats.tsx
import {
  Activity,
  Calendar,
  CreditCard,
  Dumbbell,
  Edit,
  Home,
  LogOut,
  Menu,
  Settings,
  Trophy,
  User,
  X,
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
// ... other imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MembershipPopup } from "@/app/myComponents/MembershipPopUp";
import { fetchUserByClerkId } from "@/lib/actions/fetchUserByClerkId"; // Import your fetch function
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DBUser {
  // Define an interface for your user data from MongoDB
  clerkId: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  membershipType?: string;
  joinDate?: string; // Consider storing as Date object
  avatarUrl?: string; // If you store custom avatar
  isMemberActive?: boolean;
  showCongratsForNewSubscription?: boolean;
  stripeCustomerId?: string;
  membershipRenewalDate?: Date;
  // Add other fields from your MongoDB user document
  stats?: {
    workoutsCompleted: number;
    currentStreak: number;
    longestStreak: number;
  };
  gymVisits?: Array<{
    date: string;
    checkInTime: string;
    checkOutTime: string;
    duration: string;
  }>;
  paymentHistory?: Array<{
    date: string;
    amount: string;
    status: string;
    method: string;
    invoice: string;
  }>;
  nextPaymentDate?: string; // Consider storing as Date
}

export default function UserDashboard() {
  const searchParamsHook = useSearchParams(); // Renamed to avoid conflict
  const { isLoaded, user } = useUser(); // Clerk user
  const params = useParams(); // For dynamic route [userid] which is clerkId

  const [dbUser, setDbUser] = useState<DBUser | null>(null); // To store user data from your DB
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  useEffect(() => {
    const clerkIdFromParams = params.userId as string;
    console.log(`Fetching user: ${clerkIdFromParams} ....`);

    const fetchAndProcessUser = async () => {
      if (clerkIdFromParams && isLoaded && user) {
        // Ensure Clerk user is also loaded
        setLoading(true);
        try {
          const fetchedUserFromDB = await fetchUserByClerkId(clerkIdFromParams);
          if (fetchedUserFromDB) {
            setDbUser(fetchedUserFromDB);
            setProfileData({
              name: fetchedUserFromDB.name || user.username || "",
              email:
                fetchedUserFromDB.email ||
                user.primaryEmailAddress?.emailAddress ||
                "",
              phone: fetchedUserFromDB.phone || "",
              address: fetchedUserFromDB.address || "",
            });

            if (fetchedUserFromDB.showCongratsForNewSubscription) {
              setShowCongratsModal(true);
              // Optionally trigger confetti if redirected from payment success
              if (
                searchParamsHook.get("status") === "success" ||
                searchParamsHook.get("subscription_success") === "true"
              ) {
                setTriggerConfetti(true);
                await fetch("api/stripe/checkout-session-completed");
                const response = await fetch("/api/user/mark-congrats", {
                  // Corrected API path
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ clerkId: clerkIdFromParams }),
                });
                if (!response.ok) {
                  const errorData = await response.json();
                  console.error(
                    "UserDashboard: Failed to mark congrats as shown via API:",
                    errorData.error || response.statusText
                  );
                } else {
                  console.log(
                    `UserDashboard: Successfully marked congrats shown for ${clerkIdFromParams} via API.`
                  );
                  // Optimistically update local state if API call was successful
                  // This is already handled in handleCongratsModalClose, but you might want it here too
                  // if the modal isn't immediately closed.
                  // For now, let's rely on handleCongratsModalClose for the UI update.
                }
              }
            }
          } else {
            console.warn("User not found in DB for ID:", clerkIdFromParams);
            // Fallback for profile data if DB user not found but Clerk user exists
            setProfileData({
              name: user.username || "",
              email: user.primaryEmailAddress?.emailAddress || "",
              phone: "",
              address: "",
            });
          }
        } catch (error) {
          console.error("Error fetching user from DB:", error);
        } finally {
          setLoading(false);
        }
      } else if (!clerkIdFromParams && isLoaded) {
        // Handle case where clerkId is not in params but Clerk is loaded (e.g. direct navigation attempt without ID)
        setLoading(false);
        console.error("User ID (Clerk ID) is missing from URL parameters.");
        // Optionally redirect or show an error message
      }
    };

    fetchAndProcessUser();
  }, [params.userId, isLoaded, user, searchParamsHook]);

  const handleCongratsModalClose = async () => {
    setShowCongratsModal(false);
    setTriggerConfetti(false); // Stop confetti
    if (dbUser && dbUser.clerkId) {
      try {
        // Optimistically update local state
        setDbUser((prev) =>
          prev ? { ...prev, showCongratsForNewSubscription: false } : null
        );
      } catch (error) {
        console.error("Error marking congrats as shown:", error);
      }
    }
  };

  // Handle changes in the profile edit form
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submission of the profile edit form
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser?.clerkId) {
      console.error("Cannot update profile, user ID missing.");
      // Add user feedback, e.g., toast notification
      return;
    }
    console.log("Updating profile with:", profileData);
    // TODO: Implement API call to update user profile in MongoDB
    // Example:
    // try {
    //   const response = await fetch(`/api/user/${dbUser.clerkId}`, { // Assuming a PUT/PATCH endpoint
    //     method: 'PUT', // or 'PATCH'
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(profileData),
    //   });
    //   if (!response.ok) throw new Error('Failed to update profile');
    //   const updatedUser = await response.json();
    //   setDbUser(updatedUser); // Update local dbUser state
    //   // Add success feedback
    // } catch (error) {
    //   console.error("Error updating profile:", error);
    //   // Add error feedback
    // }
    setIsEditingProfile(false);
  };

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "PT";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date to be more readable
  const formatDate = (dateInput?: Date | string) => {
    if (!dateInput) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateInput).toLocaleDateString(undefined, options);
  };

  if (loading || !isLoaded) {
    // Show loading if Clerk user OR DB user is loading
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-medium">Cargando tu panel...</h2>
          <p className="text-sm text-muted-foreground">Por favor espera</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // If Clerk user is not available after loading (e.g., not logged in)
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-medium">Acceso Denegado</h2>
          <p className="text-sm text-muted-foreground">
            Debes iniciar sesión para ver esta página.
          </p>
          <Button asChild className="mt-4">
            <Link href="/acceder">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  // If Clerk user is loaded, but dbUser (from your database) is not found after trying to fetch
  // This check should come after the loading state and Clerk user check
  if (!dbUser && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-medium">Usuario no encontrado</h2>
          <p className="text-sm text-muted-foreground">
            No pudimos encontrar los detalles de tu perfil. Por favor, contacta
            a soporte.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Congrats
        isOpen={showCongratsModal}
        showConfettiEffect={triggerConfetti}
        onModalClose={handleCongratsModalClose}
      />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* ... existing header ... */}
        {/* Make sure to use user (Clerk) and dbUser (your DB) appropriately */}
        {/* Example for Avatar in DropdownMenu: */}

        <div className="">
          <UserButton />
        </div>
      </header>

      <div className="container py-6 px-4 md:px-6 mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              ¡Bienvenido de nuevo, {dbUser?.name || user.username}!
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Miembro {dbUser?.membershipType || "N/A"} | Unido el{" "}
              {formatDate(dbUser?.joinDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link className="flex items-center" href="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
            </Button>
            {/* Ensure clerkId is passed to MembershipPopup */}
            <MembershipPopup clerkId={user.id} />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6 md:col-span-1">
            {/* User Profile Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl">
                    Mi Perfil
                  </CardTitle>
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
                      src={
                        user?.imageUrl ||
                        dbUser?.avatarUrl ||
                        "/placeholder.svg"
                      }
                      alt={`${dbUser?.name || user.username}'s profile`}
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(dbUser?.name! || user.username!)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium leading-none">
                      {dbUser?.name || user.username}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {dbUser?.email || user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                  {dbUser?.membershipType && (
                    <Badge
                      variant={
                        dbUser.membershipType.toLowerCase() === "premium"
                          ? "default"
                          : dbUser.membershipType.toLowerCase() === "standard"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      Miembro {dbUser.membershipType}
                    </Badge>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="break-words">
                      {dbUser?.phone || "No disponible"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Home className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />
                    <span className="break-words">
                      {dbUser?.address || "No disponible"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="break-words">
                      Próximo pago: {formatDate(dbUser?.nextPaymentDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="break-words">
                      Renovación: {formatDate(dbUser?.membershipRenewalDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            {/* ... (Ensure dbUser.stats is used here) ... */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Estadísticas de Entrenamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Entrenamientos Totales
                      </p>
                      <p className="text-2xl font-bold">
                        {dbUser?.stats?.workoutsCompleted || 0}
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
                        {dbUser?.stats?.currentStreak || 0} días
                      </p>
                    </div>
                  </div>
                </div>
                {dbUser?.stats && dbUser.stats.longestStreak > 0 && (
                  <div className="rounded-lg border p-3">
                    <p className="mb-2 text-sm font-medium">
                      Progreso de Racha
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          (dbUser.stats.currentStreak /
                            dbUser.stats.longestStreak) *
                          100
                        }
                        className="h-2 flex-1"
                      />
                      <span className="text-xs text-muted-foreground">
                        {dbUser.stats.currentStreak}/
                        {dbUser.stats.longestStreak}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Tu racha más larga fue de {dbUser.stats.longestStreak}{" "}
                      días.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 md:col-span-2">
            <Tabs defaultValue="visits" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visits">Visitas</TabsTrigger>
                <TabsTrigger value="payments">Pagos</TabsTrigger>
              </TabsList>

              {/* Gym Visits Tab */}
              <TabsContent value="visits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Historial de Visitas
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Tus visitas recientes al gimnasio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full overflow-x-auto rounded-md border">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Entrada</TableHead>
                            <TableHead>Salida</TableHead>
                            <TableHead>Duración</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dbUser?.gymVisits && dbUser.gymVisits.length > 0 ? (
                            dbUser.gymVisits.map((visit, index) => (
                              <TableRow key={index}>
                                <TableCell className="whitespace-nowrap">
                                  {formatDate(visit.date)}
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
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No hay visitas registradas.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  {dbUser?.gymVisits && dbUser.gymVisits.length > 0 && (
                    <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-muted-foreground sm:text-sm">
                        Mostrando las últimas {dbUser.gymVisits.length} visitas
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Historial Completo
                      </Button>
                    </CardFooter>
                  )}
                </Card>
                {/* ... (Visit Patterns Card - ensure data comes from dbUser if applicable) ... */}
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Historial de Pagos
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Tu historial de pagos de suscripción
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full overflow-x-auto rounded-md border">
                      <Table className="min-w-[700px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Método</TableHead>
                            <TableHead>Factura</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dbUser?.paymentHistory &&
                          dbUser.paymentHistory.length > 0 ? (
                            dbUser.paymentHistory.map((payment, index) => (
                              <TableRow key={index}>
                                <TableCell className="whitespace-nowrap">
                                  {formatDate(payment.date)}
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
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center">
                                No hay pagos registrados.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs sm:text-sm">
                      Próximo pago: {formatDate(dbUser?.nextPaymentDate)}
                    </div>
                    <Button variant="outline" size="sm">
                      Actualizar Método
                    </Button>
                  </CardFooter>
                </Card>
                {/* ... (Membership Card - ensure data comes from dbUser) ... */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Membresía
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Tu plan de membresía actual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-medium">
                            Membresía {dbUser?.membershipType || "N/A"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Se renueva el{" "}
                            {formatDate(dbUser?.membershipRenewalDate)}
                          </p>
                        </div>
                        {dbUser?.membershipType && (
                          <Badge
                            variant={
                              dbUser.membershipType.toLowerCase() === "premium"
                                ? "default"
                                : dbUser.membershipType.toLowerCase() ===
                                  "standard"
                                ? "secondary"
                                : "outline"
                            }
                            className="mt-1 sm:mt-0"
                          >
                            {dbUser.membershipType}
                          </Badge>
                        )}
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium">Tarifa Mensual</p>
                          <p className="text-lg font-bold">
                            {/* This should ideally come from dbUser or a plan lookup */}
                            {dbUser?.membershipType?.toLowerCase() === "premium"
                              ? "$89.00"
                              : dbUser?.membershipType?.toLowerCase() ===
                                "standard"
                              ? "$49.00"
                              : dbUser?.membershipType?.toLowerCase() ===
                                "basic"
                              ? "$29.00"
                              : "N/A"}
                          </p>
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
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => {
                        /* Logic to open MembershipPopup */
                      }}
                    >
                      Cambiar Plan de Membresía
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Sheet open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <SheetContent
          side="right"
          className="w-full max-w-md p-6 overflow-y-auto"
        >
          <SheetHeader className="mb-4 flex flex-row items-center justify-between">
            <SheetTitle className="text-xl font-bold">Editar Perfil</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* ... form inputs ... */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre Completo
              </Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full"
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
