"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Category } from "./PlaceFormSection";

interface PlaceFormContextType {
  // Form values
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: Category;
  setCategory: (category: Category) => void;
  lat: number | null;
  setLat: (lat: number) => void;
  lng: number | null;
  setLng: (lng: number) => void;
  mainPhotoUrl: string;
  setMainPhotoUrl: (url: string) => void;
  gallery: string[];
  setGallery: (urls: string[]) => void;

  // Loading states
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isMainPhotoUploading: boolean;
  setIsMainPhotoUploading: (isUploading: boolean) => void;
  isGalleryUploading: boolean;
  setIsGalleryUploading: (isUploading: boolean) => void;

  // Errors
  formErrors: Record<string, string>;
  setFormErrors: (errors: Record<string, string>) => void;
  clearLocationError: () => void;
  clearNameError: () => void;
  clearDescriptionError: () => void;
  clearMainPhotoError: () => void;

  // Computed
  isUploading: boolean;
}

const PlaceFormContext = createContext<PlaceFormContextType | undefined>(
  undefined,
);

export function PlaceFormProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("restaurant");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [mainPhotoUrl, setMainPhotoUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMainPhotoUploading, setIsMainPhotoUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isUploading = isMainPhotoUploading || isGalleryUploading;

  const clearLocationError = () =>
    setFormErrors((prev) => ({ ...prev, location: "" }));
  const clearNameError = () => setFormErrors((prev) => ({ ...prev, name: "" }));
  const clearDescriptionError = () =>
    setFormErrors((prev) => ({ ...prev, description: "" }));
  const clearMainPhotoError = () =>
    setFormErrors((prev) => ({ ...prev, mainPhoto: "" }));

  const value = {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    lat,
    setLat,
    lng,
    setLng,
    mainPhotoUrl,
    setMainPhotoUrl,
    gallery,
    setGallery,

    isSubmitting,
    setIsSubmitting,
    isMainPhotoUploading,
    setIsMainPhotoUploading,
    isGalleryUploading,
    setIsGalleryUploading,

    formErrors,
    setFormErrors,
    clearLocationError,
    clearNameError,
    clearDescriptionError,
    clearMainPhotoError,

    isUploading,
  };

  return (
    <PlaceFormContext.Provider value={value}>
      {children}
    </PlaceFormContext.Provider>
  );
}

export function usePlaceForm() {
  const context = useContext(PlaceFormContext);
  if (context === undefined) {
    throw new Error("usePlaceForm must be used within a PlaceFormProvider");
  }
  return context;
}
