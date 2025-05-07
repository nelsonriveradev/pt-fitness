import type { Metadata } from "next";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
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
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Import Button

import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <Dumbbell className="h-6 w-6" />
              <span className="font-bold">FitFlex Admin</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" className="flex items-center">
                  <Home className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Ver Sitio Web</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Menu />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ajustes</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <div className="">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white md:flex md:flex-col">
              <div className="flex h-16 items-center  px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-xl"
                >
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
                      href="/admin/clientes"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Users className="h-5 w-5" />
                      <span>Clientes</span>
                    </Link>
                    <Link
                      href="/admin/membresias"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Membresias</span>
                    </Link>
                    <Link
                      href="/admin/clases"
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
            <div className="flex flex-1 flex-col md:pl-64 py-4 px-2 ">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
