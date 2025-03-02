"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MapPin, Search, Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

import { dayStyle } from "../../styles/dayMapStyle";
import { nightStyle } from "../../styles/nightMapStyle";

export interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  mainPhoto: string | null;
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
    center ?? { lat: 44.316, lng: 23.796 },
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
        { lat: craiovaBounds.north, lng: craiovaBounds.east },
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
    [onPlaceClick, router, selectedPlace],
  );

  const handleOnLoad = useCallback((autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  }, []);

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
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";
  const mapStyle = isDarkMode ? nightStyle : null;

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card className="p-6">
          <CardContent className="space-y-2 text-center">
            <MapPin className="mx-auto h-12 w-12 text-destructive" />
            <h3 className="text-lg font-medium">Map Loading Error</h3>
            <p className="text-sm text-muted-foreground">
              There was a problem loading Google Maps. Please check your
              connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoaded || !mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="space-y-2 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-background/80 p-2 shadow-md backdrop-blur-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Autocomplete
          onLoad={handleOnLoad}
          onPlaceChanged={handlePlaceChanged}
          options={{
            componentRestrictions: { country: "ro" },
            bounds: bounds ?? undefined,
            strictBounds: true,
          }}
        >
          <Input
            type="text"
            placeholder="Search places in Craiova..."
            className="min-w-[200px]"
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={defaultZoom}
        options={{
          styles: mapStyle,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => handleMarkerClick(place)}
            animation={window.google.maps.Animation.DROP}
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {selectedPlace.name}
              </DialogTitle>
            </DialogHeader>
            {selectedPlace.mainPhoto ? (
              <div className="aspect-video overflow-hidden rounded-md">
                <img
                  src={selectedPlace.mainPhoto}
                  alt={selectedPlace.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ) : (
              <Skeleton className="aspect-video w-full rounded-md" />
            )}
            {selectedPlace.description && (
              <DialogDescription className="mt-2 max-h-32 overflow-y-auto">
                {selectedPlace.description}
              </DialogDescription>
            )}
            <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button variant="outline" onClick={() => setSelectedPlace(null)}>
                Close
              </Button>
              <Button onClick={() => router.push(`/place/${selectedPlace.id}`)}>
                View Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
