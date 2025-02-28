"use client";

import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";

export default function NewPlacePage() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainPhotoUrl, setMainPhotoUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const router = useRouter();

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
        }),
      });
      if (!res.ok) throw new Error("Failed to save place.");
      await res.json();
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving the place.");
    }
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="mb-4 text-2xl font-bold">Add a New Place</h1>

      <div className="mb-4 h-96 w-full">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        >
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: 44.316, lng: 23.796 }} // Craiova coords, for example
            zoom={13}
            onClick={handleMapClick}
          >
            {lat && lng && <Marker position={{ lat, lng }} />}
          </GoogleMap>
        </LoadScript>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-3">
        <label className="flex flex-col">
          Name:
          <input
            type="text"
            className="border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col">
          Description:
          <textarea
            className="border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col">
          Main photo:
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setMainPhotoUrl(res[0]?.ufsUrl ?? "");
              console.log(mainPhotoUrl);
            }}
          />
        </label>

        <label className="flex flex-col">
          Gallery (optional):
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setGallery(res.map((file) => file.ufsUrl));
              console.log(gallery);
            }}
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded bg-blue-500 p-2 text-white"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
