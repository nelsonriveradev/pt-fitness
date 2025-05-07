import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function ClassesAdminPage() {
  return (
    <div className="">
      <h1 className="mx-auto text-center text-5xl font-bold">Clases</h1>

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
    </div>
  );
}
