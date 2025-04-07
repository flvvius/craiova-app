"use client";

import { Info, Tag } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const categories = [
  "restaurant",
  "cafe",
  "bar",
  "park",
  "museum",
  "shopping",
  "entertainment",
  "other",
] as const;
export type Category = (typeof categories)[number];

export const categoryIcons: Record<string, React.ReactNode> = {
  restaurant: <span className="text-amber-500">🍽️</span>,
  cafe: <span className="text-amber-500">☕</span>,
  bar: <span className="text-amber-500">🍸</span>,
  park: <span className="text-amber-500">🌳</span>,
  museum: <span className="text-amber-500">🏛️</span>,
  shopping: <span className="text-amber-500">🛍️</span>,
  entertainment: <span className="text-amber-500">🎭</span>,
  other: <span className="text-amber-500">📍</span>,
};

interface PlaceFormSectionProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: Category;
  setCategory: (category: Category) => void;
  clearNameError: () => void;
  clearDescriptionError: () => void;
  nameError?: string;
  descriptionError?: string;
}

export default function PlaceFormSection({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory,
  clearNameError,
  clearDescriptionError,
  nameError,
  descriptionError,
}: PlaceFormSectionProps) {
  return (
    <Card className="border-gray-200 shadow-sm dark:border-gray-800 lg:col-span-3">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-5 w-5 text-amber-500" />
          Informații despre locație
        </CardTitle>
        <CardDescription>
          Completați detaliile pentru a ajuta vizitatorii să descopere acest loc
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              Nume
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearNameError();
              }}
              placeholder="Introduceți numele locației"
              className={`border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700 ${
                nameError ? "border-red-500 dark:border-red-500" : ""
              }`}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-gray-700 dark:text-gray-300"
            >
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-500" />
                Categorie
              </div>
            </Label>
            <Select
              value={category}
              onValueChange={(value: Category) => setCategory(value)}
            >
              <SelectTrigger className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700">
                <SelectValue placeholder="Selectați o categorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {categoryIcons[cat]}
                      <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-gray-700 dark:text-gray-300"
            >
              Descriere
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearDescriptionError();
              }}
              placeholder="Descrieți acest loc"
              className={`min-h-32 border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700 ${
                descriptionError ? "border-red-500 dark:border-red-500" : ""
              }`}
            />
            {descriptionError && (
              <p className="text-sm text-red-500">{descriptionError}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
