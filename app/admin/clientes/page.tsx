"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"; // Added icons
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockClients } from "../../DATA/clients"; // Assuming this path is correct

export default function ClientAdminPage() {
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

  // Format date helper (optional, but good practice)
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "-";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(undefined, {
      // Use locale-aware formatting
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    // Add padding for overall page layout
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
        Tus Clientes
      </h1>

      {/* Add Filters and Search Bar here later if needed */}
      {/* ... */}

      {/* Make the container scrollable on small screens */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              {/* Hide Email on smaller screens */}
              <TableHead className="hidden md:table-cell">Email</TableHead>
              {/* Hide Phone on smaller screens */}
              <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
              <TableHead>Membresía</TableHead>
              <TableHead>Estado</TableHead>
              {/* Hide Join Date on smaller screens */}
              <TableHead className="hidden lg:table-cell">
                Fecha Ingreso
              </TableHead>
              {/* Hide Last Visit on smaller screens */}
              <TableHead className="hidden xl:table-cell">
                Última Visita
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No se encontraron clientes.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  {/* Hide Email on smaller screens */}
                  <TableCell className="hidden md:table-cell">
                    {client.email}
                  </TableCell>
                  {/* Hide Phone on smaller screens */}
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
                          ? "bg-green-100 text-green-800 border-green-200"
                          : client.status === "Inactivo"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }`}
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  {/* Hide Join Date on smaller screens */}
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(client.joinDate)}
                  </TableCell>
                  {/* Hide Last Visit on smaller screens */}
                  <TableCell className="hidden xl:table-cell">
                    {formatDate(client.lastVisit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {/* Use a Button for better styling and accessibility */}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          {/* Ensure Link is the direct child for asChild */}
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
    </div>
  );
}
