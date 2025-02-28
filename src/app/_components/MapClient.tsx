"use client";

import { useCallback } from "react";
import { Map, Place } from "./Map";
import { useRouter } from "next/navigation";
import { useJsApiLoader } from "@react-google-maps/api";

interface MapClientProps {
  places: Place[];
}

export function MapClient({ places }: MapClientProps) {
  const router = useRouter();

  const handlePlaceClick = useCallback((place: Place) => {
    console.log("Clicked place:", place.name);
    // e.g. open modal, or:
    router.push(`/place/${place.id}`);
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="h-full w-full">
      <Map
        center={{ lat: 44.316, lng: 23.796 }}
        zoom={13}
        places={places}
        onPlaceClick={handlePlaceClick}
      />
    </div>
  );
}
