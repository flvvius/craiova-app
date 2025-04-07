"use client";

import { useRouter } from "next/navigation";
import { usePlaceForm } from "./PlaceFormProvider";
import { Alert, AlertDescription } from "~/components/ui/alert";
import PlaceFormSection from "./PlaceFormSection";
import MapSection from "./MapSection";
import ImageUploadSection from "./ImageUploadSection";
import FormActions from "./FormActions";

export default function PlaceForm() {
  const router = useRouter();
  const {
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
  } = usePlaceForm();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Numele locației este obligatoriu";
    }

    if (!description.trim()) {
      errors.description = "Descrierea este obligatorie";
    }

    if (lat == null || lng == null) {
      errors.location = "Vă rugăm să selectați o locație pe hartă";
    }

    if (!mainPhotoUrl) {
      errors.mainPhoto = "Vă rugăm să încărcați o fotografie principală";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          lat,
          lng,
          mainPhotoUrl,
          gallery,
          category,
        }),
      });

      if (!res.ok) throw new Error("Failed to save place.");

      await res.json();
      router.push("/map");
    } catch (err) {
      console.error(err);
      setFormErrors({
        submit:
          "A apărut o eroare la salvarea locației. Vă rugăm să încercați din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <MapSection
          lat={lat}
          lng={lng}
          setLat={setLat}
          setLng={setLng}
          clearLocationError={clearLocationError}
          locationError={formErrors.location}
          isLoaded={true}
        />

        <div className="space-y-6 lg:col-span-3">
          <PlaceFormSection
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            clearNameError={clearNameError}
            clearDescriptionError={clearDescriptionError}
            nameError={formErrors.name}
            descriptionError={formErrors.description}
          />

          <ImageUploadSection
            mainPhotoUrl={mainPhotoUrl}
            setMainPhotoUrl={setMainPhotoUrl}
            gallery={gallery}
            setGallery={setGallery}
            mainPhotoError={formErrors.mainPhoto}
            clearMainPhotoError={clearMainPhotoError}
            setIsMainPhotoUploading={setIsMainPhotoUploading}
            setIsGalleryUploading={setIsGalleryUploading}
          />

          <FormActions
            isSubmitting={isSubmitting}
            isUploading={isUploading}
            submitError={formErrors.submit}
          />
        </div>
      </div>
    </form>
  );
}
