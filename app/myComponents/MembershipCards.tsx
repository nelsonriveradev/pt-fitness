import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface MembershipData {
  title: string;
  titleDescription: string;
  price: string | number;
  isPopular: boolean;
  features?: string[];
}

export default function MembershipCards({
  title,
  titleDescription,
  price,
  isPopular,
  features,
}: MembershipData) {
  return (
    <Card
      className={`flex flex-col ${
        isPopular ? "border-2 border-zinc-700" : ""
      } min-w-[300px] max-w-[500px]`}
    >
      <CardHeader className={`${isPopular ? "bg-zinc-700 text-white" : ""}`}>
        {isPopular ? (
          <h2 className="text-white text-xl font-bold">Mejor Oferta</h2>
        ) : null}
        <CardTitle>{title}</CardTitle>
        <CardDescription className={`${isPopular ? "text-zinc-100" : ""}`}>
          {titleDescription}
        </CardDescription>
        <div className="mt-4 text-4xl font-bold">
          ${price}
          <span
            className={`text-sm font-normal ${
              isPopular ? "text-zinc-100" : ""
            }`}
          >
            /month
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2 text-sm">
          {features?.length === 0 ? (
            features!.map((feat) => (
              <li key={feat} className="flex items-center">
                ✓ {feat}
              </li>
            ))
          ) : (
            <p>No features</p>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <button className="w-full bg-zinc-700 rounded-md px-2 py-1 text-white">
          Select Plan
        </button>
      </CardFooter>
    </Card>
  );
}
