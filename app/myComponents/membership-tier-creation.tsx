"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MembershipTierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier?: any;
  onSave: (tierData: any) => void;
}

export function MembershipTierDialog({
  open,
  onOpenChange,
  tier,
  onSave,
}: MembershipTierDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    billingPeriod: "monthly",
    description: "",
    benefits: [""],
    color: "border-muted",
    recommended: false,
  });

  // Reset form when dialog opens/closes or tier changes
  useEffect(() => {
    if (open && tier) {
      const benefitsArray = tier.metadata?.benefits
        ? tier.metadata.benefits
            .split(",")
            .map((b: string) => b.trim())
            .filter((b: string) => b)
        : [""]; // Default to one empty string if no benefits

      setFormData({
        name: tier.name,
        price: tier.price,
        billingPeriod: tier.billingPeriod,
        description: tier.description,
        benefits: benefitsArray.length > 0 ? benefitsArray : [""],
        color: tier.color,
        recommended: tier.recommended,
      });
    } else if (open) {
      setFormData({
        name: "",
        price: "",
        billingPeriod: "monthly",
        description: "",
        benefits: [""],
        color: "border-muted",
        recommended: false,
      });
    }
  }, [open, tier]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, recommended: checked }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
  };

  const handleAddBenefit = () => {
    setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
  };

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = [...formData.benefits];
    newBenefits.splice(index, 1);
    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty benefits
    const filteredBenefits = formData.benefits.filter(
      (benefit) => benefit.trim() !== ""
    );

    // Prepare data for onSave. This structure might need adjustment
    // based on how AdminPage's handleSaveTier expects to process it
    // to update/create a StripeProduct (especially metadata and prices array).
    const saveData = {
      name: formData.name,
      description: formData.description,
      // For Stripe, price and interval would typically go into a prices array
      // and benefits, color, recommended into metadata.
      // This is a simplified structure for the dialog's onSave.
      // AdminPage's handleSaveTier will need to map this to StripeProduct structure.
      price: formData.price, // Will be parsed to float by AdminPage if needed
      interval: formData.billingPeriod,
      metadata: {
        benefits: filteredBenefits.join(","), // Join benefits back into a string for metadata
        color: formData.color,
        recommended: formData.recommended.toString(), // Store as string "true" or "false"
      },
      // If creating a new Stripe Product, you'd also need to construct the prices array.
      // If updating, you might send priceId and productID.
    };
    onSave(saveData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tier ? `Edit ${tier.name} Tier` : "Create New Membership Tier"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tier Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Basic, Premium, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Billing Period</Label>
            <RadioGroup
              value={formData.billingPeriod}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, billingPeriod: value }))
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer">
                  Monthly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quarterly" id="quarterly" />
                <Label htmlFor="quarterly" className="cursor-pointer">
                  Quarterly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly" className="cursor-pointer">
                  Yearly
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of this membership tier"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Benefits</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBenefit}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Benefit
              </Button>
            </div>
            <div className="space-y-3">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBenefit(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Appearance</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color Theme</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, color: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="border-muted">Default</SelectItem>
                    <SelectItem value="border-primary">Primary</SelectItem>
                    <SelectItem value="border-amber-500">Gold</SelectItem>
                    <SelectItem value="border-green-500">Green</SelectItem>
                    <SelectItem value="border-purple-500">Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="recommended"
                  checked={formData.recommended}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="recommended" className="cursor-pointer">
                  Mark as Recommended
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {tier ? "Update Tier" : "Create Tier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
