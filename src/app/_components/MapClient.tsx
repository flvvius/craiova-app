"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { dayStyle } from "../../styles/dayMapStyle";
import { nightStyle } from "../../styles/nightMapStyle";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";

export interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  mainPhoto: string;
  description: string | null;
  gallery: string[] | null;
}

interface MapClientProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  places: Place[];
  onPlaceClick?: (place: Place) => void;
}

export function MapClient({
  center,
  zoom,
  places,
  onPlaceClick,
}: MapClientProps) {
  const router = useRouter();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    center ?? { lat: 44.316, lng: 23.796 }
  );
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      const craiovaBounds = {
        north: 44.36,
        south: 44.24,
        east: 23.9,
        west: 23.7,
      };
      const newBounds = new window.google.maps.LatLngBounds(
        { lat: craiovaBounds.south, lng: craiovaBounds.west },
        { lat: craiovaBounds.north, lng: craiovaBounds.east }
      );
      setBounds(newBounds);
    }
  }, [isLoaded]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMarkerClick = useCallback(
    (place: Place) => {
      if (onPlaceClick) {
        onPlaceClick(place);
      } else {
        if (!selectedPlace || selectedPlace.id !== place.id) {
          setSelectedPlace(place);
        } else {
          router.push(`/place/${place.id}`);
        }
      }
    },
    [onPlaceClick, router, selectedPlace]
  );

  const handleOnLoad = useCallback(
    (autoC: google.maps.places.Autocomplete) => {
      setAutocomplete(autoC);
    },
    []
  );

  const handlePlaceChanged = useCallback(() => {
    if (!autocomplete) return;
    const placeResult = autocomplete.getPlace();
    if (!placeResult.geometry || !placeResult.geometry.location) return;
    setMapCenter({
      lat: placeResult.geometry.location.lat(),
      lng: placeResult.geometry.location.lng(),
    });
  }, [autocomplete]);

  const defaultZoom = zoom ?? 13;
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || !mounted) return <div>Loading Map...</div>;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";
  const mapStyle = isDarkMode ? nightStyle : dayStyle;

  return (
    <>
      <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2">
        <Autocomplete
          onLoad={handleOnLoad}
          onPlaceChanged={handlePlaceChanged}
          options={{
            componentRestrictions: { country: "ro" },
            bounds: bounds ?? undefined,
            strictBounds: true,
          }}
        >
          <input
            type="text"
            placeholder="Search places..."
            className="rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none"
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={defaultZoom}
        options={{ styles: mapStyle, disableDefaultUI: false }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => handleMarkerClick(place)}
          />
        ))}
      </GoogleMap>

      {selectedPlace && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setSelectedPlace(null);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedPlace.name}</DialogTitle>
              <DialogDescription>
                {selectedPlace.mainPhoto ? (
                  <img
                    src={selectedPlace.mainPhoto}
                    alt={selectedPlace.name}
                    className="mt-2 w-full rounded-md object-cover"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setSelectedPlace(null)}
                className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/place/${selectedPlace.id}`)}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-400"
              >
                View Details
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
