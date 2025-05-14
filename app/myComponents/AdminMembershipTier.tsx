"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, Users, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
// Local definition for clarity if not imported:
export interface StripePrice {
  id: string;
  unit_amount: number | null;
  currency: string;
  interval?: string;
  nickname: string | null;
}

export interface StripeProduct {
  // Renamed from tier to StripeProduct for clarity in this context
  id: string;
  name: string;
  description: string | null;
  images?: string[];
  prices: StripePrice[];
  active?: boolean;
  metadata?: { [key: string]: string };
}
// End local definition

export interface MembershipTierCardProps {
  tier: StripeProduct; // This will now be the StripeProduct object
  memberCount?: number; // Optional: if you fetch this data separately
  revenue?: number; // Optional: if you fetch this data separately
  onEdit: (tierId: string) => void;
  onDelete: (tierId: string) => void;
  // onDuplicate, onViewMembers can be added if needed
}

export function MembershipTierCard({
  tier,
  onEdit,
  memberCount = 0,
  revenue = 0,
  onDelete,
}: MembershipTierCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleDeleteConfirm = () => {
    setShowDeleteDialog(false);
    onDelete(tier.id);
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete(tier.id);
  };
  const handleEditClick = () => {
    onEdit(tier.id);
  };

  // Derive display values from the tier (StripeProduct)
  const displayPrice = (tier.prices[0]?.unit_amount ?? 0) / 100;
  const currencySymbol =
    tier.prices[0]?.currency === "usd"
      ? "$"
      : tier.prices[0]?.currency?.toUpperCase() || "$";
  const billingInterval = tier.prices[0]?.interval
    ? `/${tier.prices[0].interval}`
    : "";

  const benefitsString = tier.metadata?.benefits || "";
  const benefits = benefitsString
    .split(",")
    .map((b) => b.trim())
    .filter((b) => b); // Assuming CSV benefits in metadata

  const isRecommended = tier.metadata?.recommended === "true";
  const cardBorderColor = tier.metadata?.color
    ? `border-${tier.metadata.color}-500`
    : "border-gray-300"; // Example: border-blue-500

  return (
    <Card className={`border-2 ${cardBorderColor} relative overflow-hidden`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{tier.name}</CardTitle>
          <div className="text-2xl font-bold">${displayPrice.toFixed(2)}</div>
        </div>
        <CardDescription>{tier.description}</CardDescription>
        {tier.description && (
          <Badge className="absolute top-0 right-0 rounded-bl-md rounded-tr-md">
            Recommended
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Benefits</h3>
          <ul className="space-y-1 text-sm">
            {benefits.slice(0, 4).map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
            {benefits.length > 4 && (
              <li className="text-sm text-muted-foreground">
                +{benefits.length - 4} more benefits
              </li>
            )}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-md border p-2">
            <Users className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-lg font-bold">{memberCount}</span>
            <span className="text-xs text-muted-foreground">Members</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md border p-2">
            <DollarSign className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-lg font-bold">
              ${revenue.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Monthly Revenue
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => handleEditClick()}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(tier.id)}>
              Edit Tier
            </DropdownMenuItem>
            <DropdownMenuItem>View Members</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Tier
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {tier.name} membership tier. This
              action cannot be undone.
              {memberCount > 0 && (
                <span className="block mt-2 font-medium text-red-600">
                  Warning: {memberCount} members are currently using this tier.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
