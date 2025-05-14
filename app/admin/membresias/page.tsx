"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MembershipTierDialog } from "@/app/myComponents/membership-tier-creation";
import { PlusCircle } from "lucide-react";
import { StripePrice } from "@/app/myComponents/AdminMembershipTier";
export type StripeProduct = {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: StripePrice[];
  image?: string[];
};
export default function AdminMembershipPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTier, setCurrentTier] = useState<any>(null);
  const [membershipTiers, setMembershipTiers] = useState<StripeProduct[]>([]);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await fetch("/api/stripe/products");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Error fetching products from Stripe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  if (loading) return <p>Cargando Membresias...</p>;
  const handleAddTier = () => {
    setCurrentTier(null);
    setIsDialogOpen(true);
  };

  // Handle saving a new or edited tier
  const handleSaveTier = (tierData: any) => {
    if (currentTier) {
      // Edit existing tier
      setMembershipTiers(
        membershipTiers.map((tier) =>
          tier.id === currentTier.id ? { ...tier, ...tierData } : tier
        )
      );
    } else {
      // Add new tier
      const newTier = {
        ...tierData,
        id: `tier-${Date.now()}`,
        active: true,
        memberCount: 0,
        revenue: 0,
      };
      setMembershipTiers([...membershipTiers, newTier]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div>
      <h1 className="mx-auto text-center text-5xl font-bold">Membresias</h1>
      <div className="">
        <Card>
          <CardHeader>
            <div className="">
              <CardTitle>Membership Management</CardTitle>
              <CardDescription>
                View and manage all membership plans and subscriptions.
              </CardDescription>
            </div>
            <div className="">
              <Button onClick={handleAddTier}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Tier
              </Button>
            </div>
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
      <MembershipTierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tier={currentTier}
        onSave={handleSaveTier}
      />
    </div>
  );
}
