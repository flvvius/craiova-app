"use client";

import { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useTheme } from "next-themes";
import { MapPin } from "lucide-react";

import { dayStyle } from "../../../../../styles/dayMapStyle";
import { nightStyle } from "../../../../../styles/nightMapStyle";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

declare global {
  interface Window {
    google: {
      maps: {
        MapMouseEvent: {
          prototype: {
            latLng: {
              lat(): number;
              lng(): number;
            };
          };
        };
        Map: new (mapDiv: Element, opts?: Record<string, unknown>) => unknown;
        Marker: new (opts?: Record<string, unknown>) => unknown;
        Animation: {
          DROP: number;
        };
      };
    };
  }
}

interface MapSectionProps {
  lat: number | null;
  lng: number | null;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  clearLocationError: () => void;
  locationError?: string;
  isLoaded: boolean;
}

export default function MapSection({
  lat,
  lng,
  setLat,
  setLng,
  clearLocationError,
  locationError,
  isLoaded,
}: MapSectionProps) {
  const { theme, systemTheme } = useTheme();

  function handleMapClick(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
    clearLocationError();
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";
  const mapStyle = isDarkMode ? nightStyle : dayStyle;

  return (
    <Card className="border-gray-200 shadow-sm dark:border-gray-800 lg:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="h-5 w-5 text-amber-500" />
          Selectează locația
        </CardTitle>
        <CardDescription>
          Faceți clic pe hartă pentru a marca locația exactă
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative h-[400px] w-full overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: 44.316, lng: 23.796 }}
            zoom={13}
            onClick={handleMapClick}
            options={{
              styles: mapStyle,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {lat && lng && (
              <Marker
                position={{ lat, lng }}
                animation={window.google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>

          {locationError && (
            <div className="absolute bottom-4 left-0 right-0 mx-auto w-max rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {locationError}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {lat && lng ? (
            <span className="font-medium text-amber-600 dark:text-amber-400">
              Locație selectată ✓
            </span>
          ) : (
            "Nicio locație selectată"
          )}
        </div>

        {lat && lng && (
          <div className="text-xs text-gray-500">
            Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
