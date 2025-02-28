"use client";

import { useCallback } from "react";
import { Map, Place } from "./Map";
import { useRouter } from "next/navigation";

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
