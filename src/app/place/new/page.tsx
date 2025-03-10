"use client";

import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";
import { useTheme } from "next-themes";

import { dayStyle } from "../../../styles/dayMapStyle";
import { nightStyle } from "../../../styles/nightMapStyle";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const categories = [
  "restaurant",
  "cafe",
  "bar",
  "park",
  "museum",
  "shopping",
  "entertainment",
  "other",
] as const;

export default function NewPlacePage() {
  const { theme, systemTheme } = useTheme();

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("restaurant");
  const [description, setDescription] = useState("");
  const [mainPhotoUrl, setMainPhotoUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMainPhotoUploading, setIsMainPhotoUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const router = useRouter();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  if (loadError) {
    return (
      <Alert variant="destructive" className="mx-auto mt-8 max-w-md">
        <AlertDescription>
          Error loading maps. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Map...</p>
      </div>
    );
  }

  function handleMapClick(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lat == null || lng == null) {
      alert("Please click on the map to pick a location.");
      return;
    }
    if (mainPhotoUrl == "") {
      alert("Please upload a main photo.");
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
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving the place.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";
  const mapStyle = isDarkMode ? nightStyle : [];

  const isUploading = isMainPhotoUploading || isGalleryUploading;

  return (
    <main className="container mx-auto max-w-4xl overflow-scroll py-6">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Place</CardTitle>
          <CardDescription>
            Click on the map to select a location and fill out the details below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-96 w-full overflow-hidden rounded-md border">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={{ lat: 44.316, lng: 23.796 }}
              zoom={13}
              onClick={handleMapClick}
              options={{
                styles: mapStyle,
              }}
            >
              {lat && lng && <Marker position={{ lat, lng }} />}
            </GoogleMap>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter place name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value: (typeof categories)[number]) =>
                  setCategory(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe this place"
                className="min-h-32"
              />
            </div>

            <div className="space-y-2">
              <Label>Main Photo</Label>
              {mainPhotoUrl && (
                <div className="relative mb-4 mt-2 h-40 w-full overflow-hidden rounded-md">
                  <Image
                    src={mainPhotoUrl}
                    alt="Main preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="mt-1">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.ufsUrl) {
                      setMainPhotoUrl(res[0].ufsUrl);
                    }
                    setIsMainPhotoUploading(false);
                  }}
                  onUploadBegin={() => {
                    setIsMainPhotoUploading(true);
                  }}
                  className="ut-button:bg-primary ut-button:hover:bg-primary/90"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gallery (optional)</Label>
              {gallery.length > 0 && (
                <div className="mb-4 mt-2 grid grid-cols-3 gap-2">
                  {gallery.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-24 w-full overflow-hidden rounded-md"
                    >
                      <Image
                        src={url}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-1">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const urls = res
                      .map((file) => file.ufsUrl)
                      .filter((url): url is string => !!url);
                    setGallery(urls);
                    setIsGalleryUploading(false);
                  }}
                  onUploadBegin={() => {
                    setIsGalleryUploading(true);
                  }}
                  className="ut-button:bg-primary ut-button:hover:bg-primary/90"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Submit Place"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
