import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminMembershipPage() {
  return (
    <div>
      <h1 className="mx-auto text-center text-5xl font-bold">Membresias</h1>
      <div className="">
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
      </div>
    </div>
  );
}
