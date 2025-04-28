"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { ClientData, mockClients } from "../DATA/clients";
export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");

  // Filter clients based on search term and filters
  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesMembership =
      membershipFilter === "all" || client.membershipType === membershipFilter;

    return matchesSearch && matchesStatus && matchesMembership;
  });
  return (
    <div className="">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-background md:flex md:flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Dumbbell className="h-6 w-6" />
            <span>FitFlex Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Dashboard
            </h2>
            <div className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Resumen</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-5 w-5" />
                <span>Clientes</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <CreditCard className="h-5 w-5" />
                <span>Membresias</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Calendar className="h-5 w-5" />
                <span>Clases</span>
              </Link>
            </div>
          </div>
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Ajustes
            </h2>
            <div className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-5 w-5" />
                <span>General</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-5 w-5" />
                <span>Ver página Web</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar session</span>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold">FitFlex Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="flex items-center gap-x-1 text-white bg-zinc-700 rounded-md px-2 py-1">
              <span className="sr-only md:not-sr-only md:inline-block">
                View Website
              </span>
              <Home className="h-4 w-4 md:mr-2 md:h-4 md:w-4" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-8 w-8 rounded-full">
                  <span className="font-semibold">JD</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-x-1 text-white bg-zinc-700 rounded-md px-2 py-1">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Client
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Clients
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Memberships
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">189</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Revenue
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,450</div>
                  <p className="text-xs text-muted-foreground">
                    +18% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Class Attendance
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">
                    +2% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="memberships">Memberships</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
              </TabsList>

              {/* Clients Tab Content */}
              <TabsContent value="clients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>
                      View and manage all gym members. Use filters to narrow
                      down results.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="flex w-full items-center space-x-2 md:w-1/3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <input
                          placeholder="Search clients..."
                          className="flex-1"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                        <div className="flex items-center gap-2">
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Todo los Status
                              </SelectItem>
                              <SelectItem value="Active">Activo</SelectItem>
                              <SelectItem value="Inactive">Inactivo</SelectItem>
                              <SelectItem value="Pending">Pendiente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={membershipFilter}
                            onValueChange={setMembershipFilter}
                          >
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <SelectValue placeholder="Membership" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Todas las Membresias
                              </SelectItem>
                              <SelectItem value="Basic">Básica</SelectItem>
                              <SelectItem value="Standard">Estandar</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <button className="flex items-center  rounded-sm p-2">
                            <Filter className="mr-2 h-4 w-4" />
                            More Filters
                          </button>
                          <button className="flex items-center  rounded-sm p-2">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Clients Table */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Membership</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClients.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                className="h-24 text-center"
                              >
                                No clients found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredClients.map((client) => (
                              <TableRow key={client.id}>
                                <TableCell className="font-medium">
                                  {client.name}
                                </TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.phone}</TableCell>
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
                                    className={
                                      client.status === "Activo"
                                        ? "bg-green-100 text-green-800"
                                        : client.status === "Inactivo"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }
                                  >
                                    {client.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {typeof client.joinDate === "string"
                                    ? client.joinDate
                                    : client.joinDate.toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {typeof client.lastVisit === "string"
                                    ? client.lastVisit
                                    : client.lastVisit.toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button>
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <Link
                                          href={`admin/clientes/${client.id}`}
                                        >
                                          View Details
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Edit Client
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">
                                        Delete Client
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
                  <CardFooter className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing <strong>{filteredClients.length}</strong> of{" "}
                      <strong>{mockClients.length}</strong> clients
                    </div>
                    <div className="flex items-center gap-2">
                      <button disabled>Previous</button>
                      <button>Next</button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Memberships Tab Content */}
              <TabsContent value="memberships">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Management</CardTitle>
                    <CardDescription>
                      View and manage all membership plans and subscriptions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-40 items-center justify-center">
                      <p className="text-muted-foreground">
                        Membership management content will appear here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Classes Tab Content */}
              <TabsContent value="classes">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Schedule Management</CardTitle>
                    <CardDescription>
                      View and manage all fitness classes and schedules.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-40 items-center justify-center">
                      <p className="text-muted-foreground">
                        Class schedule management content will appear here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
