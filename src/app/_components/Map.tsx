"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { dayStyle } from "../../styles/dayMapStyle";
import { nightStyle } from "../../styles/nightMapStyle";
import { useRouter } from "next/navigation";

export interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  mainPhoto: string | null;
  description: string | null;
  gallery: string[] | null;
}

interface MapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  places: Place[];
  onPlaceClick?: (place: Place) => void;
}

export function Map({ center, zoom, places, onPlaceClick }: MapProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    center ?? { lat: 44.316, lng: 23.796 },
  );
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);

  let craiovaBounds;
  let newBounds: google.maps.LatLngBounds;

  useEffect(() => {
    craiovaBounds = {
      north: 44.36,
      south: 44.24,
      east: 23.9,
      west: 23.7,
    };
    newBounds = new window.google.maps.LatLngBounds(
      { lat: craiovaBounds.south, lng: craiovaBounds.west },
      { lat: craiovaBounds.north, lng: craiovaBounds.east },
    );
    setBounds(newBounds);
  }, []);

  const handleOnLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const newCenter = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setMapCenter(newCenter);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultZoom = zoom ?? 13;

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const mapStyle = isDarkMode ? nightStyle : [];

  function handleMarkerClick(placeId: string) {
    const router = useRouter();
    router.push(`/place/${placeId}`);
  }

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
        options={{
          styles: mapStyle,
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => {
              if (onPlaceClick) {
                onPlaceClick(place);
              }
            }}
          />
        ))}
      </GoogleMap>
    </>
  );
}
