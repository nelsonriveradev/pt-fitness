"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Dumbbell,
  Edit,
  Mail,
  Phone,
  Trash2,
  User,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dummyData } from "@/app/DATA/dummyData";

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  // Fetch client data based on ID
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchClient = () => {
      setLoading(true);
      try {
        const foundClient = dummyData.find((client) => client.id === params.id);
        if (foundClient) {
          setClient(foundClient);
          setNotes(foundClient.notes || "");
        } else {
          // Handle client not found
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClient();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading client profile...</h2>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-medium">Client not found</h2>
          <p className="text-sm text-muted-foreground">
            The requested client profile does not exist
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to dashboard</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Client Profile</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
          <Button variant="destructive" size="sm" className="gap-1">
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          {/* Client Info Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/placeholder.svg?height=64&width=64`}
                    alt={client.name}
                  />
                  <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <CardDescription>
                    <Badge
                      variant={
                        client.membershipType === "Premium"
                          ? "default"
                          : client.membershipType === "Standard"
                          ? "secondary"
                          : "outline"
                      }
                      className="mt-1"
                    >
                      {client.membershipType} Membership
                    </Badge>
                    <Badge
                      variant={
                        client.status === "Active"
                          ? "default"
                          : client.status === "Inactive"
                          ? "destructive"
                          : "outline"
                      }
                      className={`ml-2 mt-1 ${
                        client.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : client.status === "Inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {client.status}
                    </Badge>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Born {formatDate(client.birthdate)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div>Joined {formatDate(client.joinDate)}</div>
                      <div className="text-xs text-muted-foreground">
                        Renewal on {formatDate(client.membershipRenewal)}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-medium">Fitness Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {client.fitnessGoals.map((goal: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-medium">Progress</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Attendance</span>
                        <span>{client.progress.attendance}%</span>
                      </div>
                      <Progress
                        value={client.progress.attendance}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Goal Completion</span>
                        <span>{client.progress.goalCompletion}%</span>
                      </div>
                      <Progress
                        value={client.progress.goalCompletion}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Consistency</span>
                        <span>{client.progress.consistency}%</span>
                      </div>
                      <Progress
                        value={client.progress.consistency}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-medium">Personal Trainer</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(client.personalTrainer)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{client.personalTrainer}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-medium">Payment Method</h3>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.paymentMethod}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Send Message</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add notes about this client..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Notes</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <div className="space-y-6">
            <Tabs defaultValue="attendance" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
              </TabsList>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Attendance History
                    </CardTitle>
                    <CardDescription>
                      Recent gym visits and class attendance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Check-in Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Classes Attended</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {client.attendanceHistory.map(
                            (record: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{record.date}</TableCell>
                                <TableCell>{record.checkIn}</TableCell>
                                <TableCell>{record.duration}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {record.classes.map(
                                      (className: string, idx: number) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="bg-muted"
                                        >
                                          {className}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing last {client.attendanceHistory.length} visits
                    </div>
                    <Button variant="outline" size="sm">
                      View All History
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Attendance Statistics
                    </CardTitle>
                    <CardDescription>
                      Attendance patterns and analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                        <Clock className="mb-2 h-8 w-8 text-primary" />
                        <div className="text-2xl font-bold">4.2</div>
                        <p className="text-xs text-muted-foreground">
                          Avg. visits per week
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                        <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">
                          Attendance rate
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                        <Dumbbell className="mb-2 h-8 w-8 text-primary" />
                        <div className="text-2xl font-bold">1h 30m</div>
                        <p className="text-xs text-muted-foreground">
                          Avg. session length
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment History</CardTitle>
                    <CardDescription>
                      Recent payments and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment Method</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {client.paymentHistory.map(
                            (payment: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    {payment.status === "Paid" ? (
                                      <>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-green-600">
                                          {payment.status}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-red-600">
                                          {payment.status}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{payment.method}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing last {client.paymentHistory.length} payments
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View All Payments
                      </Button>
                      <Button size="sm">Process Payment</Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Billing Information
                    </CardTitle>
                    <CardDescription>
                      Membership and payment details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          Membership Details
                        </h3>
                        <div className="rounded-lg border p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium">
                              {client.membershipType} Plan
                            </span>
                            <Badge
                              variant={
                                client.membershipType === "Premium"
                                  ? "default"
                                  : client.membershipType === "Standard"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {client.membershipType}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Billing Cycle: Monthly</div>
                            <div>
                              Next Renewal:{" "}
                              {formatDate(client.membershipRenewal)}
                            </div>
                            <div>
                              Monthly Fee:{" "}
                              {client.membershipType === "Premium"
                                ? "$89.00"
                                : client.membershipType === "Standard"
                                ? "$49.00"
                                : "$29.00"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Payment Method</h3>
                        <div className="rounded-lg border p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="font-medium">
                              Primary Payment Method
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>{client.paymentMethod}</div>
                            <div>Billing Address: {client.address}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Change Membership Plan
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Classes Tab */}
              <TabsContent value="classes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Classes</CardTitle>
                    <CardDescription>
                      Classes the client is registered for
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Class</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Instructor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {client.upcomingClasses.map(
                            (classItem: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {classItem.name}
                                </TableCell>
                                <TableCell>{classItem.date}</TableCell>
                                <TableCell>{classItem.time}</TableCell>
                                <TableCell>{classItem.instructor}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Register for More Classes
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Class Recommendations
                    </CardTitle>
                    <CardDescription>
                      Suggested classes based on client's goals and history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">
                          Advanced Strength Training
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                          Perfect for your muscle gain goals. This class focuses
                          on progressive overload techniques.
                        </p>
                        <div className="mt-auto flex items-center justify-between text-sm">
                          <span>Tuesdays & Thursdays, 7:00 AM</span>
                          <Button variant="outline" size="sm">
                            Register
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">HIIT Cardio</h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                          Supports your cardio improvement goal with
                          high-intensity interval training.
                        </p>
                        <div className="mt-auto flex items-center justify-between text-sm">
                          <span>Mondays & Wednesdays, 6:30 AM</span>
                          <Button variant="outline" size="sm">
                            Register
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
