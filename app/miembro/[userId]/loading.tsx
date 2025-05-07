export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="text-center">
        <h2 className="text-lg font-medium">Loading your dashboard...</h2>
        <p className="text-sm text-muted-foreground">Please wait</p>
      </div>
    </div>
  );
}
