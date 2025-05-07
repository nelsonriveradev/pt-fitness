"use client";

import type React from "react";

import type { UserOnboardingData } from "../page";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PersonalInfoStepProps {
  userData: UserOnboardingData;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function PersonalInfoStep({
  userData,
  onChange,
  errors,
}: PersonalInfoStepProps) {
  const [phone, setPhone] = useState(userData.phone);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    onChange("phone", value);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Información Personal</CardTitle>
        <CardDescription>
          Por favor, proporciona tu información básica de contacto. Esto nos
          ayuda a personalizar tu experiencia.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="Juan"
              value={userData.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              Apellido <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Pérez"
              value={userData.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Dirección <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            placeholder="123 Calle Fitness, Ciudad, Estado, Código Postal"
            value={userData.address}
            onChange={(e) => onChange("address", e.target.value)}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Número de Teléfono <span className="text-red-500">*</span>
          </Label>
          <Input
            type="tel"
            id="phone"
            placeholder="5551234567"
            value={phone}
            onChange={handlePhoneChange}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
      </CardContent>
    </>
  );
}
